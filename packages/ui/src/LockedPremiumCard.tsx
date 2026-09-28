import React from 'react';
import { Lock, ShieldAlert, Sparkles, Key } from 'lucide-react';
import { Button } from './Button';

export interface LockedPremiumCardProps {
  onLoginClick?: () => void;
  onVerifyLicenseClick?: () => void;
  isAuthenticated?: boolean;
}

export const LockedPremiumCard: React.FC<LockedPremiumCardProps> = ({
  onLoginClick,
  onVerifyLicenseClick,
  isAuthenticated = false,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-950 p-8 text-center backdrop-blur-md">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="relative mx-auto flex w-14 h-14 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mb-5 shadow-lg shadow-amber-500/10">
        <Lock className="w-7 h-7" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        Premium Component
      </div>

      <h3 className="text-xl font-bold text-white mb-2">
        Premium Access Required
      </h3>

      <p className="max-w-md mx-auto text-sm text-slate-300 leading-relaxed mb-6">
        This high-impact component, including interactive states, full source code, installation payload, and AI agent prompt, is reserved for licensed members.
      </p>

      <div className="max-w-md mx-auto bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-6 text-left text-xs text-slate-400 space-y-2">
        <div className="flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-200">Manual Grant Protocol:</strong> Premium access is granted manually by an administrator via a secure, hashed license key.
          </span>
        </div>
        <div className="flex items-start gap-2">
          <Key className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            If you have been issued a license key (e.g. <code className="text-indigo-300">TI-PRO-XXXX-...</code>), verify it in your account page to instantly unlock access.
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {!isAuthenticated ? (
          <>
            <Button variant="primary" onClick={onLoginClick} leftIcon={<Key className="w-4 h-4" />}>
              Sign In to Your Account
            </Button>
            <Button variant="outline" onClick={onVerifyLicenseClick}>
              Verify License Key
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={onVerifyLicenseClick} leftIcon={<Key className="w-4 h-4" />}>
            Activate / Verify License Key
          </Button>
        )}
      </div>
    </div>
  );
};
