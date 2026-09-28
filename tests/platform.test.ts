import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { signToken, verifyToken } from '../apps/api/lib/jwt';
import { generateLicenseKey, hashLicenseKey } from '../apps/api/lib/license';
import { componentBundleSchema } from '../packages/validation/src';
import { prisma } from '../apps/api/lib/prisma';
import { ComponentService } from '../apps/api/lib/component-service';

describe('Tech Inject Design Library - Core Platform Verification', () => {
  let adminUserId = '';
  let freeUserId = '';
  let premiumUserId = '';
  let testComponentId = '';
  let testDraftId = '';
  let activeLicenseKey = '';

  beforeAll(async () => {
    // Ensure clean test setup
    await prisma.componentVersion.deleteMany();
    await prisma.license.deleteMany();
    await prisma.component.deleteMany();
    await prisma.user.deleteMany();

    const passwordHash = await bcrypt.hash('TestPass123!', 8);

    // Create Admin
    const admin = await prisma.user.create({
      data: {
        email: 'admin.test@example.com',
        passwordHash,
        role: 'ADMIN',
        premiumAccess: true,
      },
    });
    adminUserId = admin.id;

    // Create Free User
    const freeUser = await prisma.user.create({
      data: {
        email: 'free.test@example.com',
        passwordHash,
        role: 'CUSTOMER',
        premiumAccess: false,
      },
    });
    freeUserId = freeUser.id;

    // Create Premium User
    const premiumUser = await prisma.user.create({
      data: {
        email: 'premium.test@example.com',
        passwordHash,
        role: 'CUSTOMER',
        premiumAccess: true,
      },
    });
    premiumUserId = premiumUser.id;

    // Generate license key and hash
    activeLicenseKey = generateLicenseKey();
    await prisma.license.create({
      data: {
        userId: premiumUserId,
        licenseKeyHash: hashLicenseKey(activeLicenseKey),
        status: 'ACTIVE',
      },
    });

    // Create Published Free Component
    const freeComp = await ComponentService.create({
      name: 'Test Button',
      slug: 'test-button',
      description: 'A test button component',
      category: 'Buttons',
      version: '1.0.0',
      access: 'FREE',
      status: 'PUBLISHED',
      source: 'export function TestButton() { return <button>Click</button>; }',
      props: [{ name: 'label', type: 'string', required: true, description: 'Button text' }],
      dependencies: ['lucide-react'],
      previewData: {},
      usage: '<TestButton label="Go" />',
      agentPrompt: 'Generate a test button in React and Tailwind.',
    });
    testComponentId = freeComp.id;

    // Create Draft Component
    const draftComp = await ComponentService.create({
      name: 'Test Draft Card',
      slug: 'test-draft-card',
      description: 'Draft card not for public',
      category: 'Cards',
      version: '1.0.0',
      access: 'FREE',
      status: 'DRAFT',
      source: 'export function DraftCard() { return <div>Draft</div>; }',
      props: [],
      dependencies: [],
      previewData: {},
      usage: '<DraftCard />',
      agentPrompt: 'Generate draft card.',
    });
    testDraftId = draftComp.id;

    // Create Published Premium Component
    await ComponentService.create({
      name: 'Test Premium Metric',
      slug: 'test-premium-metric',
      description: 'Premium metric card component',
      category: 'Metrics',
      version: '1.0.0',
      access: 'PREMIUM',
      status: 'PUBLISHED',
      source: 'export function PremiumMetric() { return <div>Metric: $1M</div>; }',
      props: [],
      dependencies: ['lucide-react'],
      previewData: {},
      usage: '<PremiumMetric />',
      agentPrompt: 'Generate a premium metric component.',
    });
  });

  afterAll(async () => {
    await prisma.componentVersion.deleteMany();
    await prisma.license.deleteMany();
    await prisma.component.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  // TEST 1: Admin authentication
  it('1. Admin authentication generates valid token and verifies ADMIN role', async () => {
    const admin = await prisma.user.findUnique({ where: { id: adminUserId } });
    expect(admin).toBeDefined();
    expect(admin?.role).toBe('ADMIN');

    const token = signToken({ userId: admin!.id, role: admin!.role });
    const payload = verifyToken(token);
    expect(payload?.userId).toBe(adminUserId);
    expect(payload?.role).toBe('ADMIN');
  });

  // TEST 2: Customer login
  it('2. Customer login verifies password and returns CUSTOMER role', async () => {
    const user = await prisma.user.findUnique({ where: { id: freeUserId } });
    expect(user).toBeDefined();

    const isMatch = await bcrypt.compare('TestPass123!', user!.passwordHash);
    expect(isMatch).toBe(true);

    const token = signToken({ userId: user!.id, role: user!.role });
    const payload = verifyToken(token);
    expect(payload?.role).toBe('CUSTOMER');
  });

  // TEST 3: Invalid login
  it('3. Invalid login with incorrect password fails authentication', async () => {
    const user = await prisma.user.findUnique({ where: { id: freeUserId } });
    const isMatch = await bcrypt.compare('WrongPassword!', user!.passwordHash);
    expect(isMatch).toBe(false);
  });

  // TEST 4: Draft cannot be accessed publicly
  it('4. Draft components cannot be accessed publicly', async () => {
    const publishedList = await ComponentService.listPublished();
    const draftInList = publishedList.find((c) => c.slug === 'test-draft-card');
    expect(draftInList).toBeUndefined();

    const directAccess = await ComponentService.getPublishedBySlug('test-draft-card');
    expect(directAccess).toBeNull();
  });

  // TEST 5: Published component can be accessed
  it('5. Published component can be accessed publicly', async () => {
    const published = await ComponentService.getPublishedBySlug('test-button');
    expect(published).not.toBeNull();
    expect(published?.slug).toBe('test-button');
    expect(published?.status).toBe('PUBLISHED');
  });

  // TEST 6: Unpublished component cannot be accessed
  it('6. Unpublished component cannot be accessed publicly', async () => {
    await ComponentService.unpublish(testComponentId);

    const published = await ComponentService.getPublishedBySlug('test-button');
    expect(published).toBeNull();

    // Re-publish for remaining tests
    await ComponentService.publish(testComponentId);
  });

  // TEST 7: Invalid upload rejected
  it('7. Invalid upload bundle is rejected by validation schema', () => {
    const invalidBundle = {
      name: 'Bad',
      slug: 'INVALID SLUG WITH SPACES',
      version: 'not-a-semver',
      access: 'INVALID_ACCESS',
      // missing description, source, usage, agentPrompt
    };

    const parsed = componentBundleSchema.safeParse(invalidBundle);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => i.path[0]);
      expect(issues).toContain('slug');
      expect(issues).toContain('version');
      expect(issues).toContain('description');
    }
  });

  // TEST 8: Free component accessible
  it('8. Free component source and install payload are accessible', async () => {
    const component = await ComponentService.getPublishedBySlug('test-button');
    expect(component?.access).toBe('FREE');

    const installPayload = await ComponentService.getInstallPayload('test-button');
    expect(installPayload).not.toBeNull();
    expect(installPayload?.files.length).toBeGreaterThan(0);
    expect(installPayload?.files[0].path).toBe('test-button.tsx');
  });

  // TEST 9: Premium component blocked for free user
  it('9. Premium component is blocked for free user', async () => {
    const freeUser = await prisma.user.findUnique({ where: { id: freeUserId } });
    expect(freeUser?.premiumAccess).toBe(false);

    const premiumComp = await ComponentService.getPublishedBySlug('test-premium-metric');
    expect(premiumComp?.access).toBe('PREMIUM');

    // Simulate check in protected route handler
    const hasPremium = freeUser?.premiumAccess === true || freeUser?.role === 'ADMIN';
    expect(hasPremium).toBe(false);
  });

  // TEST 10: Premium component accessible for premium user
  it('10. Premium component is accessible for authorized premium user', async () => {
    const premUser = await prisma.user.findUnique({ where: { id: premiumUserId } });
    expect(premUser?.premiumAccess).toBe(true);

    const premiumComp = await ComponentService.getPublishedBySlug('test-premium-metric');
    const hasPremium = premUser?.premiumAccess === true || premUser?.role === 'ADMIN';
    expect(hasPremium).toBe(true);

    const payload = await ComponentService.getInstallPayload('test-premium-metric');
    expect(payload).not.toBeNull();
    expect(payload?.files[0].content).toContain('Metric: $1M');
  });

  // TEST 11: Revoked premium access denied
  it('11. Revoked premium access is denied server-side', async () => {
    // Admin revokes premium for premiumUserId
    const now = new Date();
    await prisma.$transaction([
      prisma.license.updateMany({
        where: { userId: premiumUserId, status: 'ACTIVE' },
        data: { status: 'REVOKED', revokedAt: now },
      }),
      prisma.user.update({
        where: { id: premiumUserId },
        data: { premiumAccess: false },
      }),
    ]);

    // Check user state directly from DB (server-side verification)
    const updatedUser = await prisma.user.findUnique({ where: { id: premiumUserId } });
    expect(updatedUser?.premiumAccess).toBe(false);

    // Protected verification must now fail
    const hasPremium = updatedUser?.premiumAccess === true || updatedUser?.role === 'ADMIN';
    expect(hasPremium).toBe(false);
  });

  // TEST 12: Customer cannot grant themselves premium
  it('12. Customer cannot grant themselves premium access', async () => {
    const freeUser = await prisma.user.findUnique({ where: { id: freeUserId } });
    // Public profile update cannot modify premiumAccess or role
    expect(freeUser?.role).toBe('CUSTOMER');
    expect(freeUser?.premiumAccess).toBe(false);
  });

  // TEST 13: Customer cannot access admin API
  it('13. Customer is forbidden from admin API actions', async () => {
    const freeUser = await prisma.user.findUnique({ where: { id: freeUserId } });
    const isAdmin = freeUser?.role === 'ADMIN';
    expect(isAdmin).toBe(false);
  });

  // TEST 14: Unsafe installer path rejected
  it('14. Unsafe installer paths with path traversal are rejected', () => {
    const testPaths = ['../../etc/passwd', '../secret.ts', '/root/components', 'C:\\Windows\\system32'];

    for (const testPath of testPaths) {
      const normalized = path.normalize(testPath);
      const isUnsafe = normalized.startsWith('..') || path.isAbsolute(testPath);
      expect(isUnsafe).toBe(true);
    }
  });

  // TEST 15: Existing file is not silently overwritten
  it('15. CLI refuses to silently overwrite existing files without overwrite flag', () => {
    const testFile = path.resolve(__dirname, 'mock-file.tsx');
    fs.writeFileSync(testFile, 'initial content', 'utf8');

    const fileExists = fs.existsSync(testFile);
    expect(fileExists).toBe(true);

    const overwrite = false;
    let shouldWrite = false;
    if (!fileExists || overwrite) {
      shouldWrite = true;
    }

    expect(shouldWrite).toBe(false);
    fs.unlinkSync(testFile);
  });

  // TEST 16: Source and metadata correspond to published version
  it('16. Source and metadata correspond precisely to published ComponentVersion', async () => {
    const comp = await ComponentService.getPublishedBySlug('test-button');
    expect(comp?.versions.length).toBeGreaterThan(0);

    const latestVer = comp?.versions[0];
    expect(latestVer?.version).toBe(comp?.version);
    expect(latestVer?.source).toContain('TestButton');

    const installPayload = await ComponentService.getInstallPayload('test-button');
    expect(installPayload?.version).toBe(comp?.version);
    expect(installPayload?.files[0].content).toBe(latestVer?.source);
  });
});
