'use client';

import React, { useState } from 'react';
import { Shield, ArrowRight, AlertCircle, Layers } from 'lucide-react';
import { Button, Input, Card } from '@tech-inject/ui';
import { AdminApi } from '@/lib/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin123!');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await AdminApi.login({ email, password });
    setIsLoading(false);

    if (res.success && res.data?.user) {
      if (res.data.user.role !== 'ADMIN') {
        setError('Access denied: You do not have administrator permissions.');
        await AdminApi.logout();
        return;
      }
      window.location.href = '/dashboard';
    } else {
      setError(res.error || 'Invalid administrator credentials');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Administrator Portal</h1>
          <p className="mt-1 text-xs text-slate-400">
            Sign in with authorized system administrator credentials.
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
              label="Admin Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Admin Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Authenticate Admin Session
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 text-center">
            Default development credentials pre-filled from <code className="text-slate-400">.env</code>
          </div>
        </Card>
      </div>
    </div>
  );
}
