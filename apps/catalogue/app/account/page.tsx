'use client';

import React, { useState, useEffect } from 'react';
import { Key, Shield, User as UserIcon, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { UserDto } from '@tech-inject/types';
import { Button, Input, Card, StatusBadge, Badge } from '@tech-inject/ui';
import { CatalogueApi } from '@/lib/api';

export default function AccountPage() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [licenseKey, setLicenseKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    const res = await CatalogueApi.getMe();
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    } else {
      window.location.href = '/login';
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleVerifyLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setMessage(null);

    const res = await CatalogueApi.verifyLicense(licenseKey);
    setIsVerifying(false);

    if (res.success) {
      setMessage({
        type: 'success',
        text: res.data?.message || 'License key verified successfully! Premium access is now active.',
      });
      setLicenseKey('');
      loadUser();
    } else {
      setMessage({
        type: 'error',
        text: res.error || 'Failed to verify license key',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
        <p className="text-xs">Loading account profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Account & Licenses</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your developer access tier, profile, and verify premium license keys.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <UserIcon className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <StatusBadge status={user.role} size="sm" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Account Status</span>
                <span className="text-emerald-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Tier</span>
                <span className={user.premiumAccess ? 'text-amber-300 font-semibold' : 'text-slate-300'}>
                  {user.premiumAccess ? 'Premium Access' : 'Free Tier'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={async () => {
                await CatalogueApi.logout();
                window.location.href = '/login';
              }}
            >
              Sign Out
            </Button>
          </div>
        </Card>

        {/* License Verification Card */}
        <Card className="md:col-span-2 border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center gap-2 text-amber-400 mb-2 font-medium text-xs">
            <Key className="w-4 h-4" />
            <span>License Activation Protocol</span>
          </div>

          <h3 className="text-lg font-bold text-white mb-1">
            {user.premiumAccess ? 'Active Premium License' : 'Activate Premium License'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            {user.premiumAccess
              ? 'Your account currently has active premium access. You can view, copy, install, and generate AI prompts for all premium components.'
              : 'Enter a valid license key granted to you by an administrator to unlock restricted components and source files.'}
          </p>

          {message && (
            <div
              className={`p-3.5 rounded-xl mb-6 flex items-start gap-2.5 text-xs border ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleVerifyLicense} className="space-y-4">
            <Input
              label="License Key"
              placeholder="TI-PRO-XXXX-XXXX-XXXX-XXXX"
              required
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              helperText="Format: TI-PRO-XXXX-XXXX-XXXX-XXXX (Case-insensitive)"
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isVerifying}
              leftIcon={<Key className="w-4 h-4" />}
            >
              Verify & Activate License
            </Button>
          </form>

          <div className="mt-8 rounded-xl bg-slate-950 border border-slate-800 p-4 text-xs text-slate-400 space-y-2">
            <p className="font-semibold text-slate-200">How do licenses work?</p>
            <p className="leading-relaxed">
              License keys are generated by administrators and hashed using server-side HMAC-SHA256 before storage.
              Once verified against your account, premium permissions are checked server-side on every request to ensure tamper-proof authorization.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
