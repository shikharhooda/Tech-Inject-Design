#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';

interface InstallPayload {
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

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const program = new Command();

program
  .name('tech-inject')
  .description('Tech Inject Design Library CLI component installer')
  .version('1.0.0');

program
  .command('add <slug>')
  .description('Add a reusable component from Tech Inject Design Library')
  .option('-a, --api <url>', 'API base URL', process.env.TECH_INJECT_API_URL || 'http://localhost:3001')
  .option('-t, --token <token>', 'Authentication JWT token')
  .option('-l, --license <licenseKey>', 'Customer License Key')
  .option('-p, --path <directory>', 'Target directory relative to project root', 'components')
  .option('-o, --overwrite', 'Overwrite existing files', false)
  .action(async (slug: string, options: { api: string; token?: string; license?: string; path: string; overwrite: boolean }) => {
    const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      console.error(pc.red(`\n✖ Invalid component slug '${slug}'. Expected lowercase alphanumeric and hyphens (e.g. modern-button)\n`));
      process.exit(1);
    }

    console.log(pc.cyan(`\nInstalling ${slug}...`));

    const baseUrl = options.api.replace(/\/+$/, '');
    const endpoint = `${baseUrl}/api/components/${slug}/install`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (options.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }
    if (options.license) {
      headers['x-license-key'] = options.license;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      });

      if (response.status === 404) {
        console.error(pc.red(`\n✖ Component '${slug}' not found or is currently unpublished.\n`));
        process.exit(1);
      }

      if (response.status === 401 || response.status === 403) {
        console.error(pc.yellow(`\n✖ Access Denied: Component '${slug}' requires premium access.`));
        console.error(pc.dim('  Please supply an active license key via --license or authentication token via --token.\n'));
        process.exit(1);
      }

      if (!response.ok) {
        const errorJson = (await response.json().catch(() => ({}))) as ApiResponse<unknown>;
        console.error(pc.red(`\n✖ API Error (${response.status}): ${errorJson.error || response.statusText}\n`));
        process.exit(1);
      }

      const json = (await response.json()) as ApiResponse<InstallPayload>;
      if (!json.success || !json.data) {
        console.error(pc.red(`\n✖ Failed to install component: ${json.error || 'Unknown error'}\n`));
        process.exit(1);
      }

      const payload = json.data;
      console.log(pc.green('✓ Access verified'));
      console.log(pc.green('✓ Downloaded component'));

      // Validate base target directory to prevent path traversal
      const targetDir = path.resolve(process.cwd(), options.path);
      const projectRoot = process.cwd();

      // Check for path traversal out of project root
      const relToRoot = path.relative(projectRoot, targetDir);
      if (relToRoot.startsWith('..') || path.isAbsolute(options.path)) {
        console.error(pc.red(`\n✖ Unsafe target directory path: '${options.path}'. Must be relative to project root.\n`));
        process.exit(1);
      }

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Process each file in the payload
      for (const file of payload.files) {
        // Sanitize file path
        const normalizedRelPath = path.normalize(file.path).replace(/^(\.\.(\/|\\|$))+/, '');
        const fullFilePath = path.resolve(targetDir, normalizedRelPath);

        // Security check: Must reside within target directory
        const relativeToTarget = path.relative(targetDir, fullFilePath);
        if (relativeToTarget.startsWith('..') || path.isAbsolute(normalizedRelPath)) {
          console.error(pc.red(`\n✖ Security error: Refusing unsafe destination path '${file.path}'\n`));
          process.exit(1);
        }

        // Overwrite protection
        if (fs.existsSync(fullFilePath) && !options.overwrite) {
          console.error(pc.red(`\n✖ File already exists: '${path.relative(projectRoot, fullFilePath)}'`));
          console.error(pc.yellow(`  Use --overwrite to replace existing files.\n`));
          process.exit(1);
        }

        // Ensure parent directory exists
        const fileDir = path.dirname(fullFilePath);
        if (!fs.existsSync(fileDir)) {
          fs.mkdirSync(fileDir, { recursive: true });
        }

        // Write file safely
        fs.writeFileSync(fullFilePath, file.content, 'utf8');
        console.log(pc.green(`✓ Created ${path.relative(projectRoot, fullFilePath)}`));
      }

      if (payload.dependencies && payload.dependencies.length > 0) {
        console.log(pc.cyan(`\nRequired dependencies:`));
        console.log(pc.dim(`  npm install ${payload.dependencies.join(' ')}\n`));
      } else {
        console.log('');
      }

      console.log(pc.green(`✨ Successfully installed ${payload.name} (v${payload.version})!\n`));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(pc.red(`\n✖ Network error connecting to API: ${message}\n`));
      process.exit(1);
    }
  });

program.parse(process.argv);
