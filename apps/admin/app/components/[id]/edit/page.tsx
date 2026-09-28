'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
} from 'lucide-react';
import { Button, Input, Card } from '@tech-inject/ui';
import { AdminApi } from '@/lib/api';

export default function EditComponentPage() {
  const params = useParams();
  const id = params?.id as string;

  const [component, setComponent] = useState<any>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [version, setVersion] = useState('');
  const [access, setAccess] = useState<'FREE' | 'PREMIUM'>('FREE');
  const [source, setSource] = useState('');
  const [usage, setUsage] = useState('');
  const [agentPrompt, setAgentPrompt] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    AdminApi.getComponent(id).then((res) => {
      if (res.success && res.data) {
        const c = res.data;
        setComponent(c);
        setName(c.name);
        setSlug(c.slug);
        setDescription(c.description);
        setCategory(c.category);
        setVersion(c.version);
        setAccess(c.access);
        setUsage(c.usage);
        setAgentPrompt(c.agentPrompt);

        const latestVersion = c.versions?.[0];
        setSource(latestVersion?.source || '');
      }
      setIsLoading(false);
    });
  }, [id]);

  const handleSave = async (publish?: boolean) => {
    setIsSaving(true);
    setFeedback(null);

    const updatePayload: any = {
      name,
      slug,
      description,
      category,
      version,
      access,
      source,
      usage,
      agentPrompt,
    };

    if (publish) {
      updatePayload.status = 'PUBLISHED';
    }

    const res = await AdminApi.updateComponent(id, updatePayload);
    setIsSaving(false);

    if (res.success) {
      setFeedback({ type: 'success', message: 'Component changes successfully saved!' });
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to update component' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <a
            href="/components"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Components</span>
          </a>
          <h1 className="text-2xl font-bold tracking-tight text-white">Edit Component: {name}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            onClick={() => handleSave(false)}
          >
            Save Changes
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isSaving}
            leftIcon={<Send className="w-4 h-4" />}
            onClick={() => handleSave(true)}
          >
            Publish Update
          </Button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-start gap-2.5 text-xs border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <Card className="p-6 border-slate-800 bg-slate-900/60 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Component Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <Input
            label="Version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">Access Tier</label>
            <select
              value={access}
              onChange={(e) => setAccess(e.target.value as any)}
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="FREE">Free Tier</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1.5">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1.5">Source Code</label>
          <textarea
            rows={10}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full rounded-lg bg-slate-950 font-mono border border-slate-800 px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1.5">Usage Example</label>
          <textarea
            rows={3}
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
            className="w-full rounded-lg bg-slate-950 font-mono border border-slate-800 px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1.5">AI Agent Prompt</label>
          <textarea
            rows={4}
            value={agentPrompt}
            onChange={(e) => setAgentPrompt(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </Card>
    </div>
  );
}
