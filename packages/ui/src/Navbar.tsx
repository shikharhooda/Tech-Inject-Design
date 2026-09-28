import React from 'react';
import { Layers, Terminal, Shield, LogOut, User as UserIcon, Lock } from 'lucide-react';
import { UserDto } from '@tech-inject/types';

export interface NavbarProps {
  user?: UserDto | null;
  onLogout?: () => void;
  brandTitle?: string;
  links?: Array<{ href: string; label: string; active?: boolean }>;
  rightSlot?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  brandTitle = 'Tech Inject',
  links = [],
  rightSlot,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-white text-base">
                {brandTitle}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400 font-semibold">
                Design Library
              </span>
            </div>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  link.active
                    ? 'text-white bg-slate-800/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right slot & Auth actions */}
        <div className="flex items-center gap-3">
          {rightSlot}

          {user ? (
            <div className="flex items-center gap-2">
              <a
                href="/account"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-xs text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="max-w-[120px] truncate">{user.email}</span>
                {user.premiumAccess && (
                  <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-semibold text-amber-300 border border-amber-500/30">
                    PRO
                  </span>
                )}
                {user.role === 'ADMIN' && (
                  <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.2 text-[9px] font-semibold text-indigo-300 border border-indigo-500/30">
                    ADMIN
                  </span>
                )}
              </a>

              {user.role === 'ADMIN' && (
                <a
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </a>
              )}

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <a
                href="/login"
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </a>
              <a
                href="/components"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-xs font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/30"
              >
                Explore Library
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
