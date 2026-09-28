# Tech Inject Design Library — Architectural & Technical Answers

This document provides detailed answers to the seven core assignment questions based on the real, implemented, and verified codebase in this monorepo.

---

### Question 1: Reference Analysis
*How did you analyze and adapt the reference visual design into a developer-focused component library rather than a generic business or CRM application?*

**Answer:**
1. **Developer First Aesthetics:** Rather than building a dashboard dominated by sales funnels, pipeline charts, and customer CRM leads, the Tech Inject visual system was built specifically for software engineers consuming reusable UI components. The visual theme uses a refined dark palette (`#020617` slate-950, `#0f172a` slate-900) paired with deep indigo accents (`#4f46e5`), monospace metadata pills, syntax-highlighted code blocks, and keyboard-shortcut badges (`<kbd>`).
2. **Context-Appropriate Layouts:** The public catalogue focuses on component discoverability: responsive multi-column component cards, fast category filtering (Buttons, Cards, Metrics, Navigation, Feedback, Overlays), access-tier filters (Free vs. Premium), and instant terminal installation snippets (`npx tech-inject add <slug>`).
3. **Component Inspector & Interactive Sandbox:** The detail view (`/components/[slug]`) replaces generic business forms with developer-centric tooling:
   - A multi-viewport interactive preview panel supporting Desktop, Tablet, and Mobile canvas sizing.
   - Live canvas dark/light theme switching.
   - Tabbed inspectors for full source code, npm dependencies, complete TypeScript prop definitions (types, defaults, required flags, descriptions), and specialized AI agent specification prompts.
   - Animated copy-to-clipboard interactions with 2-second visual feedback.
4. **No Placeholder Payment Flow:** All fake pricing tiers, Stripe checkout modals, and invoice widgets were removed. Premium access is represented accurately as an administrator-controlled entitlement verified through cryptographic license keys.

---

### Question 2: Architecture and Clean Code
*How did you structure the monorepo to maintain clean separation of concerns, high maintainability, and code suitability for engineers with 0–2 years of experience?*

**Answer:**
1. **Workspaces & Package Separation:**
   - `apps/catalogue`: Focused strictly on client-side and static page rendering for public developers.
   - `apps/admin`: Dedicated administrative management interface guarded by admin role checks.
   - `apps/api`: Pure backend Next.js Route Handlers with database access, JWT verification, and service methods.
   - `packages/types`: Clean TypeScript contracts shared across apps without circular dependencies.
   - `packages/validation`: Single source of truth for runtime validation schemas using Zod.
   - `packages/ui`: Modular, typed UI primitives and design tokens.
   - `cli`: Standalone Node.js CLI utility for consumers.
2. **Thin Route Handlers, Fat Services:**
   Route handlers in `apps/api/app/api/...` do not write complex raw SQL or multi-step ORM queries inline. Instead, they parse incoming HTTP requests, validate payloads against Zod schemas, delegate business logic to `ComponentService` in `apps/api/lib/component-service.ts`, and return standardized `ApiResponse<T>` objects via `jsonSuccess` and `jsonError`.
3. **KISS & YAGNI Approach:**
   We avoided overly complex microservices, event buses, message queues, and arbitrary plugin architectures. Everything uses standard Next.js App Router patterns, TypeScript strict mode, and idiomatic Prisma relations, making the codebase straightforward for any junior or mid-level developer to trace from URL route to database table in minutes.

---

### Question 3: Publishing Consistency
*How does the system ensure that preview data, source code, installation commands, and AI prompts always correspond to the exact published version of a component?*

**Answer:**
1. **Relational Versioning Model (`ComponentVersion`):**
   The database schema explicitly separates the parent `Component` record from historical snapshots in `ComponentVersion`. Every time a component is updated with new source code or a new version number, a dedicated `ComponentVersion` record is created containing:
   - `version` (e.g. `1.0.0`)
   - `source` (exact TypeScript/React source code)
   - `previewData` (the structured preview mock state)
   - `dependencies` (exact npm package requirements)
   - `installData` (the CLI installation configuration)
   - `agentPrompt` (the tailored AI agent instructions)
2. **Published State Independence:**
   Publication status (`status: DRAFT | PUBLISHED | UNPUBLISHED`) is completely separate from access tier (`access: FREE | PREMIUM`). A free component can be a draft, and a premium component can be published.
3. **Single Source of Truth on Resolution:**
   When `ComponentService.getPublishedBySlug(slug)` or `ComponentService.getInstallPayload(slug)` is called, the system queries the latest active version associated with the published component. The detail page, the preview panel, the source code viewer, the CLI payload generator, and the AI prompt endpoint all read from this identical version record. Unrelated, divergent hardcoded copies cannot exist.
4. **Instant Invalidation on Unpublishing:**
   When an administrator unpublishes a component via `POST /api/admin/components/:id/unpublish`, the status updates immediately. The public catalogue removes it from listings, direct slug lookups return 404, and CLI install requests fail immediately without requiring any frontend redeployment.

---

### Question 4: Security Architecture
*What concrete security controls protect the platform against authentication bypass, unauthorized premium access, malicious component uploads, and path traversal in the installer?*

**Answer:**
1. **Server-Side Authorization & Live Verification:**
   - Every protected API endpoint executes server-side guards (`requireAuth`, `requireAdmin`, `requirePremium`).
   - The platform never trusts client-side booleans or stale JWT claims. The user's `premiumAccess` status is verified directly against PostgreSQL on every protected request. If an admin revokes premium access, the customer's very next API request immediately receives a `403 Forbidden`.
2. **Cryptographic License Key Protection:**
   - License keys (`TI-PRO-XXXX-XXXX-XXXX-XXXX`) are generated using cryptographically strong pseudo-random bytes (`crypto.randomBytes`).
   - Raw license keys are **never stored** in the database. Only their HMAC-SHA256 hash (keyed by `LICENSE_SECRET`) is persisted.
   - The raw key is returned exactly once to the administrator upon issuance. Database compromises cannot expose valid plaintext license keys.
3. **Upload Bundle Restrictions & Preview Isolation:**
   - Component uploads must match the strict Zod `componentBundleSchema` (enforcing semver versions, alphanumeric-hyphen slugs, length limits, and structured prop objects).
   - Arbitrary server-side code execution (`eval()`, dynamic `Function()`, or VM executions) is strictly prohibited. The backend handles code strictly as text data.
   - Previews are rendered client-side using constrained declarative state mappings (`LivePreviewRenderer`), eliminating access to backend environment secrets, database credentials, and file systems.
4. **CLI Installer Path-Traversal Defense:**
   - The CLI normalizes destination paths and asserts that the target file resolves strictly within the current working directory (`!path.relative(projectRoot, targetDir).startsWith('..')`).
   - Rejects absolute paths (`/`, `C:\`, etc.) and directory escapes (`../`).
   - Prevents silent overwriting: If a target file exists, the installer halts and requires an explicit `--overwrite` flag.
   - Shell commands provided by components are never executed by the installer.

---

### Question 5: AI Coding Agent Ownership
*How is the AI agent prompt structured to enable autonomous coding agents to implement and verify components accurately?*

**Answer:**
1. **Exhaustive Component Context:**
   Every published component includes an AI prompt crafted for LLM coding environments (Claude Code, Cursor, Antigravity, Copilot).
2. **Standardized Prompt Structure:**
   Each prompt includes:
   - Target component name and exact file destination (e.g. `components/modern-button.tsx`).
   - Complete TypeScript interfaces with prop types, default values, and required flags.
   - Exact external dependencies to install (e.g. `lucide-react@^0.453.0`).
   - Design tokens and Tailwind CSS class recommendations (e.g. colors, transitions, focus rings, hover states).
   - Accessibility and keyboard navigation requirements (e.g. `focus-visible`, ARIA attributes, keydown handling).
   - Functional verification and test specifications (e.g. verifying that `isLoading` disables the button and displays a spinner).
3. **No Embedded Secrets:**
   AI prompts contain zero credentials, database strings, or license keys, ensuring safe copy-paste workflows across developer environments.

---

### Question 6: Production Ownership & Operations
*How is this monorepo prepared for production deployment and operational reliability?*

**Answer:**
1. **Independent App Deployability:**
   - `apps/catalogue` and `apps/admin` are standard Next.js applications ready to deploy to Vercel, Cloudflare Pages, or AWS Amplify.
   - `apps/api` can be deployed to Vercel (using Next.js route handlers) or as a containerized Node service on Cloud Run / ECS / Render.
2. **Decoupled Database Architecture:**
   - Docker Compose PostgreSQL is configured specifically for local development (`docker compose up -d`).
   - Production environments use a managed PostgreSQL cluster (e.g. Neon, Supabase, Cloud SQL, AWS RDS) by configuring `DATABASE_URL` in the environment.
3. **CORS & Cookie Cross-Origin Policies:**
   - `apps/api` configures CORS headers (`Access-Control-Allow-Origin`, `Access-Control-Allow-Credentials`, `Access-Control-Allow-Headers`) allowing decoupled frontends to communicate securely.
   - Both cookie-based authentication (`auth_token` with `SameSite: 'lax'`) and Bearer token headers (`Authorization: Bearer <token>`) are supported, ensuring reliable operation across mobile, web, and CLI environments.
4. **Automated Verification:**
   - A single root command (`npm test`) executes the full 16-point Vitest suite verifying auth, drafts, access controls, license verification, and CLI safety before production builds.

---

### Question 7: Premium Access Management
*Why was an administrator-controlled licensing system implemented instead of automated subscriptions or Stripe checkouts?*

**Answer:**
1. **Explicit Alignment with Assignment Scope:**
   The specification explicitly stated: *"Do NOT use real payments, Stripe, subscriptions, invoices, or fake checkout. Premium access is granted/revoked manually by the administrator."*
2. **Enterprise & Team Licensing Paradigm:**
   This model represents private design systems, internal enterprise UI libraries, and negotiated partner licensing where access is provisioned by system administrators rather than self-serve retail checkout.
3. **Clean, Auditable Entitlement Lifecycle:**
   - **Grant:** An administrator selects a customer, clicks "Grant Premium Access", generating a cryptographically secure key (`TI-PRO-XXXX-XXXX-XXXX-XXXX`).
   - **Distribution:** The raw key is shown once in a modal for the administrator to supply to the customer. The server only stores the SHA-256 HMAC hash.
   - **Activation:** The customer signs into their account, visits `/account`, and verifies the license key via `POST /api/auth/verify-license`. The server validates the hash, marks the user as premium, and immediately unlocks premium component source, preview, and CLI install payloads.
   - **Revocation:** If an administrator revokes access via `POST /api/admin/customers/:id/revoke-premium`, active licenses are marked `REVOKED` and the user's `premiumAccess` is cleared. Subsequent protected requests fail immediately with `403 Forbidden`.
