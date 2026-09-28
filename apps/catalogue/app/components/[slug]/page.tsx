'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Terminal,
  Code2,
  Eye,
  FileCode,
  Layers,
  Sparkles,
  Lock,
  Loader2,
  Package,
  Cpu,
} from 'lucide-react';
import { ComponentDetailDto, UserDto } from '@tech-inject/types';
import {
  Tabs,
  StatusBadge,
  Badge,
  PreviewPanel,
  LivePreviewRenderer,
  CodeBlock,
  CopyButton,
  LockedPremiumCard,
  Button,
} from '@tech-inject/ui';
import { CatalogueApi } from '@/lib/api';

export default function ComponentDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [component, setComponent] = useState<ComponentDetailDto | null>(null);
  const [user, setUser] = useState<UserDto | null>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    CatalogueApi.getMe().then((res) => {
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      }
    });
  }, []);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);

    CatalogueApi.getComponent(slug)
      .then((res) => {
        if (res.success && res.data) {
          setComponent(res.data);
        } else {
          setError(res.error || 'Component not found');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch component');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-xs">Loading component specifications...</p>
      </div>
    );
  }

  if (error || !component) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Component Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'This component does not exist or has been unpublished.'}</p>
        <a href="/components">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Catalogue
          </Button>
        </a>
      </div>
    );
  }

  const isLocked = component.isLocked ?? (component.access === 'PREMIUM' && !user?.premiumAccess);

  const tabs = [
    { id: 'preview', label: 'Preview', icon: <Eye className="w-4 h-4" /> },
    { id: 'code', label: 'Code & Source', icon: <Code2 className="w-4 h-4" /> },
    { id: 'install', label: 'Installation', icon: <Terminal className="w-4 h-4" /> },
    { id: 'props', label: 'Props Specification', icon: <Layers className="w-4 h-4" /> },
    { id: 'prompt', label: 'AI Agent Prompt', icon: <Cpu className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <div className="mb-6">
        <a
          href="/components"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Component Catalogue</span>
        </a>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-8 border-b border-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <StatusBadge status={component.access} />
            <Badge variant="neutral">{component.category}</Badge>
            <span className="font-mono text-xs text-slate-500">v{component.version}</span>
            {component.publishedAt && (
              <span className="text-xs text-slate-500">
                Published {new Date(component.publishedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {component.name}
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
            {component.description}
          </p>
        </div>

        {/* Quick CLI copy banner */}
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <code className="text-xs font-mono text-slate-200">{component.installCommand}</code>
            <CopyButton textToCopy={component.installCommand} label="Copy" />
          </div>
        </div>
      </div>

      {/* Main Content & Tabs */}
      <div className="mt-8">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

        {/* Tab 1: Preview */}
        {activeTab === 'preview' && (
          <div>
            {isLocked ? (
              <LockedPremiumCard
                isAuthenticated={!!user}
                onLoginClick={() => (window.location.href = '/login')}
                onVerifyLicenseClick={() => (window.location.href = '/account')}
              />
            ) : (
              <div className="space-y-6">
                <PreviewPanel title={`${component.name} Interactive Sandbox`}>
                  <LivePreviewRenderer slug={component.slug} previewData={component.previewData} />
                </PreviewPanel>

                {component.usage && (
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-2">Usage Example</h3>
                    <CodeBlock code={component.usage} language="tsx" filename="Example.tsx" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Code & Source */}
        {activeTab === 'code' && (
          <div>
            {isLocked ? (
              <LockedPremiumCard
                isAuthenticated={!!user}
                onLoginClick={() => (window.location.href = '/login')}
                onVerifyLicenseClick={() => (window.location.href = '/account')}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Full Source Implementation</h3>
                  {component.source && <CopyButton textToCopy={component.source} label="Copy Code" />}
                </div>
                <CodeBlock
                  code={component.source || '// Source unavailable'}
                  language="tsx"
                  filename={`${component.slug}.tsx`}
                  showCopy={false}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Installation */}
        {activeTab === 'install' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-white">CLI Installation Command</h3>
              <p className="text-xs text-slate-400">
                Run this command in your React / Next.js project root:
              </p>
              <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-3">
                <code className="text-xs font-mono text-indigo-300">
                  {component.installCommand}
                </code>
                <CopyButton textToCopy={component.installCommand} label="Copy Install Command" />
              </div>
            </div>

            {component.dependencies && component.dependencies.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white">Required npm Dependencies</h3>
                <div className="flex flex-wrap gap-2">
                  {component.dependencies.map((dep, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
                    >
                      <Package className="w-3.5 h-3.5 text-slate-500" />
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Props Specification */}
        {activeTab === 'props' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">TypeScript Props Definition</h3>
            {component.props && component.props.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 border-b border-slate-800 font-mono text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Prop</th>
                      <th className="px-4 py-3 font-semibold">Type</th>
                      <th className="px-4 py-3 font-semibold">Default</th>
                      <th className="px-4 py-3 font-semibold">Required</th>
                      <th className="px-4 py-3 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {component.props.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="px-4 py-3 font-mono text-indigo-400 font-medium">{p.name}</td>
                        <td className="px-4 py-3 font-mono text-slate-300">{p.type}</td>
                        <td className="px-4 py-3 font-mono text-slate-500">{p.default || '-'}</td>
                        <td className="px-4 py-3">
                          {p.required ? (
                            <span className="text-rose-400 font-semibold">Yes</span>
                          ) : (
                            <span className="text-slate-500">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-300">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No custom props required for this component.</p>
            )}
          </div>
        )}

        {/* Tab 5: AI Agent Prompt */}
        {activeTab === 'prompt' && (
          <div>
            {isLocked ? (
              <LockedPremiumCard
                isAuthenticated={!!user}
                onLoginClick={() => (window.location.href = '/login')}
                onVerifyLicenseClick={() => (window.location.href = '/account')}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">AI Coding Agent Specification Prompt</h3>
                    <p className="text-xs text-slate-400">
                      Copy and paste this structured prompt into Claude Code, Cursor, or Antigravity:
                    </p>
                  </div>
                  {component.agentPrompt && (
                    <CopyButton textToCopy={component.agentPrompt} label="Copy AI Prompt" />
                  )}
                </div>
                <CodeBlock
                  code={component.agentPrompt || '// AI prompt unavailable'}
                  language="markdown"
                  filename="agent-prompt.md"
                  showCopy={false}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
