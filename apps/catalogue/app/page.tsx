import React from 'react';
import { ArrowRight, Terminal, Sparkles, Shield, Cpu, Layers, CheckCircle2 } from 'lucide-react';
import { CopyButton, Button } from '@tech-inject/ui';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-500/15 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Tech Inject Design Library v1.0 Live</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-none max-w-4xl mx-auto">
          Production-grade components crafted for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-indigo-400">
            modern React apps.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Discover, inspect, and install customizable React + TypeScript components directly into your codebase.
          Powered by a fast CLI installer, AI coding agent prompts, and secure administrator-granted licensing.
        </p>

        {/* Quick CLI command */}
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 shadow-2xl">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <code className="text-xs sm:text-sm font-mono text-slate-200">
              npx tech-inject add modern-button
            </code>
            <CopyButton textToCopy="npx tech-inject add modern-button" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a href="/components">
            <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Component Catalogue
            </Button>
          </a>
          <a href="/get-started">
            <Button variant="outline" size="lg">
              Getting Started & CLI Guide
            </Button>
          </a>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Designed for Developers, Built for Scale
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Every component is fully typed, accessible, and structured for frictionless integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Instant CLI Installation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Install components directly into your project with safe path traversal protection and zero silent overwrites.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">AI-Agent Optimized</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Each component includes an optimized AI agent prompt with clear specifications, dependencies, and integration steps.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Secure License Control</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Premium components are guarded by server-side SHA-256 hashed licenses manually issued and revoked by administrators.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
