'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertTriangle,
  Command,
  Filter,
  Check,
  X,
  Bell,
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';

export interface LivePreviewRendererProps {
  slug: string;
  previewData?: Record<string, unknown>;
}

export const LivePreviewRenderer: React.FC<LivePreviewRendererProps> = ({ slug, previewData }) => {
  // Live render based on component slug
  switch (slug) {
    case 'modern-button': {
      return (
        <div className="flex flex-wrap items-center justify-center gap-4 p-4">
          <Button variant="primary" leftIcon={<Sparkles className="w-4 h-4" />}>
            Primary Action
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Explore
          </Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger">Delete</Button>
          <Button variant="primary" isLoading>
            Saving
          </Button>
        </div>
      );
    }

    case 'glass-card': {
      return (
        <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400 border border-indigo-500/20">
              Glass Morphism
            </span>
          </div>
          <h4 className="text-base font-semibold text-white">Glassmorphism Card</h4>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            Frosted translucent container with ambient dynamic lighting, sub-pixel borders, and subtle drop shadows.
          </p>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Backdrop Blur</span>
            <span className="font-mono text-indigo-300">blur(24px)</span>
          </div>
        </div>
      );
    }

    case 'animated-badge': {
      return (
        <div className="flex flex-wrap items-center justify-center gap-3 p-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Systems Operational
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400 border border-amber-500/20 shadow-sm shadow-amber-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Syncing Changes
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 border border-indigo-500/20 shadow-sm shadow-indigo-500/10">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v2.4.0 Live
          </span>
        </div>
      );
    }

    case 'stat-metric-card': {
      return (
        <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Total API Invocations</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" />
              +28.4%
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">1,842,910</span>
            <span className="text-xs text-slate-500">vs. last month</span>
          </div>
          {/* Simulated sparkline */}
          <div className="mt-4 flex items-end gap-1.5 h-10 w-full pt-2">
            {[35, 45, 30, 60, 50, 75, 65, 80, 70, 90, 85, 100].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="flex-1 rounded-t bg-indigo-500/40 hover:bg-indigo-400 transition-colors"
              />
            ))}
          </div>
        </div>
      );
    }

    case 'command-palette': {
      return (
        <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-800 bg-slate-950/60">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              readOnly
              value="Deploy to production"
              className="bg-transparent text-xs text-slate-200 outline-none w-full"
            />
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
              ESC
            </kbd>
          </div>
          <div className="p-2 space-y-1 text-xs">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-indigo-600/10 text-indigo-300 font-medium">
              <div className="flex items-center gap-2">
                <Command className="w-3.5 h-3.5 text-indigo-400" />
                <span>Deploy project to Production</span>
              </div>
              <span className="text-[10px] font-mono text-indigo-400">↵ Enter</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                <span>Run Component Linter</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'data-table-filter': {
      return (
        <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-medium text-slate-200">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>Filter Components</span>
            </div>
            <button className="text-indigo-400 hover:underline text-[11px]">Clear all</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30">
              Status: Published
              <X className="w-3 h-3 hover:text-white cursor-pointer" />
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs border border-amber-500/30">
              Access: Premium
              <X className="w-3 h-3 hover:text-white cursor-pointer" />
            </span>
            <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-slate-700 text-slate-400 text-xs hover:text-slate-200 hover:border-slate-600">
              + Add filter
            </button>
          </div>
        </div>
      );
    }

    case 'notification-toast': {
      return (
        <div className="flex items-center justify-between gap-3 w-full max-w-sm rounded-xl border border-emerald-500/30 bg-slate-900/90 p-3.5 backdrop-blur shadow-2xl">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">License Verified</p>
              <p className="text-[11px] text-slate-400">Premium access granted until 2027.</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      );
    }

    case 'pricing-toggle': {
      return (
        <div className="flex items-center justify-center gap-3 p-4">
          <span className="text-xs font-medium text-slate-300">Monthly</span>
          <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-indigo-600 transition-colors">
            <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform" />
          </div>
          <span className="text-xs font-medium text-white flex items-center gap-1.5">
            Annual
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 text-[10px] text-emerald-400">
              Save 20%
            </span>
          </span>
        </div>
      );
    }

    default: {
      return (
        <div className="text-center p-6 border border-dashed border-slate-800 rounded-xl">
          <p className="text-sm font-medium text-slate-300 mb-1">{slug}</p>
          <p className="text-xs text-slate-500">Live preview representation ready.</p>
          {previewData && Object.keys(previewData).length > 0 && (
            <pre className="mt-3 text-left font-mono text-[10px] text-slate-400 bg-slate-900 p-2.5 rounded-lg overflow-x-auto max-h-40">
              {JSON.stringify(previewData, null, 2)}
            </pre>
          )}
        </div>
      );
    }
  }
};
