export type Role = 'CUSTOMER' | 'ADMIN';
export type Access = 'FREE' | 'PREMIUM';
export type Status = 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED';
export type LicenseStatus = 'ACTIVE' | 'REVOKED';

export interface UserDto {
  id: string;
  email: string;
  role: Role;
  premiumAccess: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LicenseDto {
  id: string;
  userId: string;
  status: LicenseStatus;
  createdAt: string;
  expiresAt: string | null;
  revokedAt: string | null;
}

export interface ComponentProp {
  name: string;
  type: string;
  default?: string;
  required: boolean;
  description: string;
}

export interface ComponentSummaryDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  version: string;
  access: Access;
  status: Status;
  installCommand: string;
  publishedAt: string | null;
  updatedAt: string;
}

export interface ComponentDetailDto extends ComponentSummaryDto {
  props: ComponentProp[];
  usage: string;
  dependencies: string[];
  previewData?: Record<string, unknown>;
  source?: string;
  agentPrompt?: string;
  isLocked?: boolean;
}

export interface ComponentVersionDto {
  id: string;
  componentId: string;
  version: string;
  source: string;
  previewData: Record<string, unknown>;
  dependencies: string[];
  installData: Record<string, unknown>;
  agentPrompt: string;
  createdAt: string;
}

export interface ComponentBundleInput {
  name: string;
  slug: string;
  description: string;
  category: string;
  version: string;
  access: Access;
  status?: Status;
  source: string;
  props: ComponentProp[];
  dependencies: string[];
  previewData: Record<string, unknown>;
  usage: string;
  agentPrompt: string;
  installCommand?: string;
}

export type ComponentUpdateInput = Partial<ComponentBundleInput>;

export interface InstallPayload {
  slug: string;
  name: string;
  version: string;
  dependencies: string[];
  installCommand: string;
  files: Array<{
    path: string;
    content: string;
  }>;
}

export interface AuthTokenPayload {
  userId: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}
