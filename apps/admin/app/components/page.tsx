'use client';

import React, { useEffect, useState } from 'react';
import {
  Plus,
  Eye,
  FileEdit,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  AlertCircle,
} from 'lucide-react';
import { Button, StatusBadge, Badge, DataTable, Column } from '@tech-inject/ui';
import { AdminApi } from '@/lib/api';

export default function AdminComponentsListPage() {
  const [components, setComponents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadComponents = async () => {
    setIsLoading(true);
    const res = await AdminApi.getComponents();
    if (res.success && res.data) {
      setComponents(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadComponents();
  }, []);

  const handlePublish = async (id: string, name: string) => {
    setActionLoading(id);
    setFeedback(null);
    const res = await AdminApi.publishComponent(id);
    setActionLoading(null);

    if (res.success) {
      setFeedback({ type: 'success', message: `Component "${name}" successfully published!` });
      loadComponents();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to publish component' });
    }
  };

  const handleUnpublish = async (id: string, name: string) => {
    setActionLoading(id);
    setFeedback(null);
    const res = await AdminApi.unpublishComponent(id);
    setActionLoading(null);

    if (res.success) {
      setFeedback({ type: 'success', message: `Component "${name}" unpublished.` });
      loadComponents();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to unpublish component' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setActionLoading(id);
    setFeedback(null);
    const res = await AdminApi.deleteComponent(id);
    setActionLoading(null);

    if (res.success) {
      setFeedback({ type: 'success', message: `Component "${name}" deleted.` });
      loadComponents();
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to delete component' });
    }
  };

  const filteredComponents = components.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<any>[] = [
    {
      header: 'Component',
      cell: (item) => (
        <div>
          <span className="font-semibold text-white block">{item.name}</span>
          <span className="font-mono text-[11px] text-slate-500">{item.slug}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
    },
    {
      header: 'Version',
      cell: (item) => <span className="font-mono text-slate-400">v{item.version}</span>,
    },
    {
      header: 'Access',
      cell: (item) => <StatusBadge status={item.access} size="sm" />,
    },
    {
      header: 'Status',
      cell: (item) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      header: 'Updated',
      cell: (item) => (
        <span className="text-slate-400 text-[11px]">
          {new Date(item.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          <a href={`/components/${item.id}/edit`}>
            <button
              title="Edit component"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <FileEdit className="w-3.5 h-3.5" />
            </button>
          </a>

          <a href={`/components/${item.id}/preview`}>
            <button
              title="Preview component"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </a>

          {item.status === 'PUBLISHED' ? (
            <button
              onClick={() => handleUnpublish(item.id, item.name)}
              disabled={actionLoading === item.id}
              title="Unpublish component"
              className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => handlePublish(item.id, item.name)}
              disabled={actionLoading === item.id}
              title="Publish component"
              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
            >
              <CheckCircle className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => handleDelete(item.id, item.name)}
            disabled={actionLoading === item.id}
            title="Delete component"
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Component Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage, edit, validate, and publish components to the public registry.
          </p>
        </div>

        <a href="/components/new">
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            New Component
          </Button>
        </a>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl flex items-center gap-2 text-xs border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search components..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredComponents}
          keyExtractor={(item) => item.id}
          emptyMessage="No components found."
        />
      )}
    </div>
  );
}
