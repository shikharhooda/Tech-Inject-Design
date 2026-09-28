'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Upload,
  Cpu,
  Layers,
  Save,
  Send,
  Loader2,
} from 'lucide-react';
import { Button, Input, Card, Tabs, StatusBadge } from '@tech-inject/ui';
import { AdminApi } from '@/lib/api';
import { componentBundleSchema } from '@tech-inject/validation';

export default function NewComponentPage() {
  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form');

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Buttons');
  const [version, setVersion] = useState('1.0.0');
  const [access, setAccess] = useState<'FREE' | 'PREMIUM'>('FREE');
  const [source, setSource] = useState('');
  const [usage, setUsage] = useState('');
  const [dependencies, setDependencies] = useState('lucide-react');
  const [agentPrompt, setAgentPrompt] = useState('');

  // Raw JSON state
  const [rawJson, setRawJson] = useState(`{
  "name": "Custom Component",
  "slug": "custom-component",
  "description": "A reusable customized component.",
  "category": "Buttons",
  "version": "1.0.0",
  "access": "FREE",
  "source": "import React from 'react';\\n\\nexport function CustomComponent() {\\n  return <button className=\\"px-4 py-2 bg-indigo-600 text-white rounded-lg\\">Click Me</button>;\\n}",
  "props": [
    {
      "name": "onClick",
      "type": "() => void",
      "required": false,
      "description": "Callback when clicked"
    }
  ],
  "dependencies": ["lucide-react"],
  "previewData": {},
  "usage": "import { CustomComponent } from '@/components/custom-component';\\n\\nexport default function Demo() {\\n  return <CustomComponent />;\\n}",
  "agentPrompt": "Create a reusable React component named CustomComponent with TypeScript and Tailwind CSS."
}`);

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string; details?: any } | null>(null);

  const getBundleData = () => {
    if (activeTab === 'json') {
      try {
        return JSON.parse(rawJson);
      } catch (err: any) {
        throw new Error(`Invalid JSON format: ${err.message}`);
      }
    }

    return {
      name,
      slug,
      description,
      category,
      version,
      access,
      source,
      props: [
        {
          name: 'className',
          type: 'string',
          required: false,
          description: 'Custom Tailwind class names',
        },
      ],
      dependencies: dependencies
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean),
      previewData: {},
      usage,
      agentPrompt,
      installCommand: `npx tech-inject add ${slug}`,
    };
  };

  const handleValidate = () => {
    setFeedback(null);
    try {
      const bundle = getBundleData();
      const parsed = componentBundleSchema.safeParse(bundle);
      if (parsed.success) {
        setFeedback({ type: 'success', message: '✓ Component bundle passed all schema and validation checks.' });
      } else {
        const errorList = parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        setFeedback({ type: 'error', message: `Validation failed: ${errorList}` });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleSave = async (publish: boolean) => {
    setFeedback(null);
    try {
      const bundle = getBundleData();
      bundle.status = publish ? 'PUBLISHED' : 'DRAFT';

      const parsed = componentBundleSchema.safeParse(bundle);
      if (!parsed.success) {
        const errorList = parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        setFeedback({ type: 'error', message: `Validation failed: ${errorList}` });
        return;
      }

      setIsLoading(true);
      const res = await AdminApi.createComponent(bundle);
      setIsLoading(false);

      if (res.success) {
        window.location.href = '/components';
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to save component' });
      }
    } catch (err: any) {
      setIsLoading(false);
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <a
            href="/components"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Components</span>
          </a>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create New Component</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleValidate}>
            Validate Bundle
          </Button>
          <Button
            variant="secondary"
            size="sm"
            isLoading={isLoading}
            leftIcon={<Save className="w-4 h-4" />}
            onClick={() => handleSave(false)}
          >
            Save as Draft
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isLoading}
            leftIcon={<Send className="w-4 h-4" />}
            onClick={() => handleSave(true)}
          >
            Publish Now
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

      {/* Mode Switcher */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('form')}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'form' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'
          }`}
        >
          Form Editor
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('json')}
          className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'json' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'
          }`}
        >
          Constrained JSON Bundle Upload
        </button>
      </div>

      {activeTab === 'form' ? (
        <Card className="p-6 border-slate-800 bg-slate-900/60 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Component Name"
              placeholder="e.g. Modern Modal"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
              }}
              required
            />

            <Input
              label="Slug"
              placeholder="e.g. modern-modal"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Category"
              placeholder="Buttons, Cards, Modals..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />

            <Input
              label="Version (SemVer)"
              placeholder="1.0.0"
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
                <option value="PREMIUM">Premium (License Required)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief explanation of component capabilities and styling..."
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Source Code (React + TypeScript)
            </label>
            <textarea
              rows={8}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="import React from 'react'..."
              className="w-full rounded-lg bg-slate-950 font-mono border border-slate-800 px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">Usage Example</label>
            <textarea
              rows={3}
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              placeholder="import { ModernModal } from '@/components/modern-modal'..."
              className="w-full rounded-lg bg-slate-950 font-mono border border-slate-800 px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="npm Dependencies (comma-separated)"
              placeholder="lucide-react, clsx"
              value={dependencies}
              onChange={(e) => setDependencies(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">AI Agent Prompt</label>
            <textarea
              rows={4}
              value={agentPrompt}
              onChange={(e) => setAgentPrompt(e.target.value)}
              placeholder="Instructions for Claude, Cursor, or Antigravity agents on how to generate and verify this component..."
              className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </Card>
      ) : (
        <Card className="p-6 border-slate-800 bg-slate-900/60 space-y-4">
          <p className="text-xs text-slate-400">
            Paste a valid constrained component bundle JSON below. The backend validates schema, slug format, and required fields.
          </p>
          <textarea
            rows={18}
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            className="w-full rounded-xl bg-slate-950 font-mono border border-slate-800 p-4 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </Card>
      )}
    </div>
  );
}
