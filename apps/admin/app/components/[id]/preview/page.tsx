'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Eye, Loader2, Send } from 'lucide-react';
import { PreviewPanel, LivePreviewRenderer, Button, StatusBadge, Badge } from '@tech-inject/ui';
import { AdminApi } from '@/lib/api';

export default function AdminComponentPreviewPage() {
  const params = useParams();
  const id = params?.id as string;

  const [component, setComponent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    AdminApi.getComponent(id).then((res) => {
      if (res.success && res.data) {
        setComponent(res.data);
      }
      setIsLoading(false);
    });
  }, [id]);

  const handlePublish = async () => {
    setIsPublishing(true);
    setMessage(null);
    const res = await AdminApi.publishComponent(id);
    setIsPublishing(false);
    if (res.success) {
      setMessage('Component successfully published to public catalogue!');
      const updated = await AdminApi.getComponent(id);
      if (updated.success) setComponent(updated.data);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!component) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-slate-400">Component not found.</p>
        <a href="/components" className="text-xs text-indigo-400 hover:underline mt-2 inline-block">
          Return to components
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <a
            href="/components"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Components</span>
          </a>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">{component.name}</h1>
            <StatusBadge status={component.status} size="sm" />
            <StatusBadge status={component.access} size="sm" />
          </div>
        </div>

        {component.status !== 'PUBLISHED' && (
          <Button
            size="sm"
            isLoading={isPublishing}
            onClick={handlePublish}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Publish Component
          </Button>
        )}
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      <PreviewPanel title={`Admin Live Preview: ${component.slug}`}>
        <LivePreviewRenderer slug={component.slug} previewData={component.previewData} />
      </PreviewPanel>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 text-xs text-slate-400">
        <h3 className="font-semibold text-white">Component Metadata & Version Control</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-[11px]">
          <div>
            <span className="text-slate-500 block">Slug</span>
            <span className="text-slate-200">{component.slug}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Version</span>
            <span className="text-slate-200">v{component.version}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Category</span>
            <span className="text-slate-200">{component.category}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Total Versions</span>
            <span className="text-slate-200">{component.versions?.length || 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
