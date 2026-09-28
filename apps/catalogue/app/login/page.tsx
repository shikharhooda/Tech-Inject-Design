'use client';

import React, { useState } from 'react';
import { Layers, Key, Shield, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button, Input, Card } from '@tech-inject/ui';
import { CatalogueApi } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await CatalogueApi.login({ email, password });
    setIsLoading(false);

    if (res.success && res.data?.user) {
      window.location.href = '/components';
    } else {
      setError(res.error || 'Invalid email or password');
    }
  };

  const setTestAccount = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 mb-4">
            <Layers className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Sign In to Tech Inject</h2>
          <p className="mt-1 text-xs text-slate-400">
            Access your developer license, components, and account status.
          </p>
        </div>

        <Card className="border-slate-800 bg-slate-900/90 shadow-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Test Accounts Quick Select */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-2">Pre-seeded Test Accounts:</p>
            <div className="space-y-1.5 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setTestAccount('admin@example.com', 'Admin123!')}
                className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between text-slate-300 hover:text-white"
              >
                <span>admin@example.com (Admin)</span>
                <span className="text-indigo-400">Admin123!</span>
              </button>
              <button
                type="button"
                onClick={() => setTestAccount('premium@example.com', 'Customer123!')}
                className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between text-slate-300 hover:text-white"
              >
                <span>premium@example.com (Premium)</span>
                <span className="text-amber-400">Customer123!</span>
              </button>
              <button
                type="button"
                onClick={() => setTestAccount('free@example.com', 'Customer123!')}
                className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800/80 flex items-center justify-between text-slate-300 hover:text-white"
              >
                <span>free@example.com (Free)</span>
                <span className="text-slate-400">Customer123!</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
