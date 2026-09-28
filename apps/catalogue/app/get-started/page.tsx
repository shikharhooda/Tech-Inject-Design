import React from 'react';
import { Terminal, Cpu, Shield, Key, CheckCircle2 } from 'lucide-react';
import { CodeBlock, CopyButton } from '@tech-inject/ui';

export default function GetStartedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Getting Started</h1>
        <p className="text-sm text-slate-400">
          Learn how to install, configure, and consume components from Tech Inject Design Library.
        </p>
      </div>

      <div className="space-y-12">
        {/* Section 1: CLI Installer */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Terminal className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-white">1. Installing via CLI</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Tech Inject CLI allows you to download and scaffold component files directly into your React/Next.js project.
          </p>

          <CodeBlock
            code="npx tech-inject add modern-button"
            language="bash"
            filename="Terminal"
          />

          <div className="mt-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs space-y-2 text-slate-400">
            <p className="font-semibold text-slate-200">CLI Flags and Options:</p>
            <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-slate-300">
              <li><code className="text-indigo-400">--path &lt;dir&gt;</code>: Target subdirectory relative to project root (default: <code className="text-slate-400">components</code>)</li>
              <li><code className="text-indigo-400">--overwrite</code>: Permit replacing an existing file instead of aborting</li>
              <li><code className="text-indigo-400">--license &lt;key&gt;</code>: Pass active license key for premium components</li>
              <li><code className="text-indigo-400">--token &lt;jwt&gt;</code>: Pass customer auth token for authenticated requests</li>
              <li><code className="text-indigo-400">--api &lt;url&gt;</code>: Target a remote API instance (default: <code className="text-slate-400">http://localhost:3001</code>)</li>
            </ul>
          </div>
        </section>

        {/* Section 2: AI Coding Agent Workflow */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Cpu className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-white">2. AI Coding Agent Workflow</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every component in the library comes with an AI agent prompt. You can copy this prompt into Cursor, Claude Code, or Antigravity to have the agent write the component, configure Tailwind styles, and generate verification tests.
          </p>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2">
            <p className="font-medium text-white">To use with an AI agent:</p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
              <li>Navigate to any published component page in the catalogue.</li>
              <li>Select the <strong className="text-slate-200">AI Prompt</strong> tab.</li>
              <li>Click <strong className="text-slate-200">Copy AI Prompt</strong>.</li>
              <li>Paste directly into your AI coding assistant prompt window.</li>
            </ol>
          </div>
        </section>

        {/* Section 3: Premium Access & Licenses */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Key className="w-5 h-5" />
            <h2 className="text-lg font-semibold text-white">3. Premium Access & License Keys</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tech Inject does not use automated payments or subscriptions. Premium access is granted directly by system administrators.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="font-semibold text-indigo-300 block mb-1">Step 1: Admin Issuance</span>
              <p className="text-slate-400">An administrator grants premium access to your customer account, generating a unique license key formatted as <code className="text-slate-200 font-mono">TI-PRO-XXXX-XXXX-XXXX-XXXX</code>.</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <span className="font-semibold text-emerald-300 block mb-1">Step 2: Verification</span>
              <p className="text-slate-400">Sign in to your account and enter the license key on the <a href="/account" className="text-indigo-400 hover:underline">Account Page</a>. Once verified, premium components are unlocked immediately.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
