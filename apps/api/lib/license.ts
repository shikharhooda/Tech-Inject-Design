import crypto from 'node:crypto';

const LICENSE_SECRET =
  process.env.LICENSE_SECRET ||
  'tech-inject-super-secret-license-key-for-development-hash-secret-32char';

/**
 * Generate a cryptographically secure random license key in format:
 * TI-PRO-XXXX-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // alphanumeric excluding ambiguous chars (0, O, 1, I)
  const segments: string[] = [];

  for (let s = 0; s < 4; s++) {
    const bytes = crypto.randomBytes(4);
    let segment = '';
    for (let i = 0; i < 4; i++) {
      segment += chars[bytes[i] % chars.length];
    }
    segments.push(segment);
  }

  return `TI-PRO-${segments.join('-')}`;
}

/**
 * Hash a license key using HMAC-SHA256 with the server-side LICENSE_SECRET.
 * Never stores the raw license key in the database.
 */
export function hashLicenseKey(licenseKey: string): string {
  const normalized = licenseKey.trim().toUpperCase();
  return crypto.createHmac('sha256', LICENSE_SECRET).update(normalized).digest('hex');
}
