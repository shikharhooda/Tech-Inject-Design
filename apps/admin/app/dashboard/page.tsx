'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  CheckCircle2,
  FileEdit,
  Sparkles,
  Users,
  Plus,
  ArrowRight,
  Shield,
  Loader2,
} from 'lucide-react';
import { Button, Card } from '@tech-inject/ui';
import { AdminApi } from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    totalComponents: number;
    publishedComponents: number;
    draftComponents: number;
    premiumComponents: number;
    totalCustomers: number;
    activeLicenses: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminApi.getStats()
      .then((res) => {
        if (res.success && res.data) {
          setStats(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Components',
      value: stats?.totalComponents ?? 0,
      icon: <Box className="w-5 h-5 text-indigo-400" />,
      color: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Published (Live)',
      value: stats?.publishedComponents ?? 0,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      color: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Draft Components',
      value: stats?.draftComponents ?? 0,
      icon: <FileEdit className="w-5 h-5 text-amber-400" />,
      color: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Premium Tier Items',
      value: stats?.premiumComponents ?? 0,
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
      color: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Registered Customers',
      value: stats?.totalCustomers ?? 0,
      icon: <Users className="w-5 h-5 text-slate-400" />,
      color: 'bg-slate-800 border-slate-700',
    },
    {
      title: 'Active Licenses',
      value: stats?.activeLicenses ?? 0,
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      color: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">System Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry and management controls for components, versions, and customer access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a href="/components/new">
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Create / Upload Component
            </Button>
          </a>
          <a href="/customers">
            <Button variant="outline" size="sm" leftIcon={<Users className="w-4 h-4" />}>
              Manage Customers
            </Button>
          </a>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="p-5 border-slate-800 bg-slate-900/60 backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{stat.title}</span>
              <div className={`p-2 rounded-xl border ${stat.color}`}>{stat.icon}</div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {stat.value}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick workflow explanation */}
      <Card className="border-slate-800 bg-slate-900/40 p-6">
        <h3 className="text-base font-semibold text-white mb-2">Publishing & Licensing Workflow</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Components transition through a strict pipeline: <strong>Draft</strong> → <strong>Validation</strong> → <strong>Admin Preview</strong> → <strong>Published</strong>.
          Once published, components appear instantly in the public catalogue without needing a frontend redeploy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-semibold text-indigo-400">Component Publishing</span>
            <p className="text-slate-400">
              Only components with Status <code className="text-emerald-400">PUBLISHED</code> appear publicly. Drafts remain hidden and reject direct detail requests.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-semibold text-amber-400">Customer Premium Grants</span>
            <p className="text-slate-400">
              Generate hashed license keys in Customer Management. Revoking premium access immediately terminates access to protected endpoints.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
