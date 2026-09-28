import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const verifyLicenseSchema = z.object({
  licenseKey: z
    .string()
    .trim()
    .regex(/^TI-PRO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/, 'Invalid license key format. Expected TI-PRO-XXXX-XXXX-XXXX-XXXX'),
});

export type VerifyLicenseInput = z.infer<typeof verifyLicenseSchema>;

export const componentPropSchema = z.object({
  name: z.string().min(1, 'Prop name is required'),
  type: z.string().min(1, 'Prop type is required'),
  default: z.string().optional(),
  required: z.boolean().default(false),
  description: z.string().min(1, 'Description is required'),
});

export const componentBundleSchema = z.object({
  name: z.string().min(2, 'Component name must be at least 2 characters').max(100),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens only (e.g. modern-button)'),
  description: z.string().min(5, 'Description must be at least 5 characters').max(1000),
  category: z.string().min(2, 'Category is required'),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be semantic versioning (e.g. 1.0.0)'),
  access: z.enum(['FREE', 'PREMIUM']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'UNPUBLISHED']).default('DRAFT'),
  source: z.string().min(10, 'Source code must be provided'),
  props: z.array(componentPropSchema).default([]),
  dependencies: z.array(z.string()).default([]),
  previewData: z.record(z.unknown()).default({}),
  usage: z.string().min(5, 'Usage example is required'),
  agentPrompt: z.string().min(10, 'AI agent prompt is required'),
  installCommand: z.string().optional(),
});

export type ComponentBundleInput = z.infer<typeof componentBundleSchema>;

export const componentUpdateSchema = componentBundleSchema.partial().extend({
  version: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
});

export type ComponentUpdateInput = z.infer<typeof componentUpdateSchema>;

export const grantPremiumSchema = z.object({
  expiresAt: z.string().datetime().nullable().optional(),
});

export type GrantPremiumInput = z.infer<typeof grantPremiumSchema>;
