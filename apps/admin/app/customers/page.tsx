'use client';

import React, { useEffect, useState } from 'react';
import { Users, Search, Loader2, ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { StatusBadge, Badge, DataTable, Column, Button } from '@tech-inject/ui';
import { AdminApi } from '@/lib/api';

export default function AdminCustomersListPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    AdminApi.getCustomers().then((res) => {
      if (res.success && res.data) {
        setCustomers(res.data);
      }
      setIsLoading(false);
    });
  }, []);

  const filtered = customers.filter((c) =>
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<any>[] = [
    {
      header: 'Customer Email',
      cell: (item) => (
        <div>
          <span className="font-semibold text-white block">{item.email}</span>
          <span className="font-mono text-[10px] text-slate-500">ID: {item.id}</span>
        </div>
      ),
    },
    {
      header: 'Role',
      cell: (item) => <StatusBadge status={item.role} size="sm" />,
    },
    {
      header: 'Premium Access',
      cell: (item) => (
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${
            item.premiumAccess
              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {item.premiumAccess ? 'Granted' : 'Standard (Free)'}
        </span>
      ),
    },
    {
      header: 'Licenses Issued',
      cell: (item) => (
        <span className="font-mono text-xs text-slate-300">
          {item.licenses?.length ?? 0} license(s)
        </span>
      ),
    },
    {
      header: 'Registered',
      cell: (item) => (
        <span className="text-slate-400 text-xs">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Action',
      cell: (item) => (
        <a href={`/customers/${item.id}`}>
          <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Manage
          </Button>
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Customer Management</h1>
        <p className="text-xs text-slate-400 mt-1">
          Inspect customer accounts, verify licenses, and grant or revoke premium permissions.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search by customer email..."
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
          data={filtered}
          keyExtractor={(item) => item.id}
          emptyMessage="No customer accounts registered."
        />
      )}
    </div>
  );
}
