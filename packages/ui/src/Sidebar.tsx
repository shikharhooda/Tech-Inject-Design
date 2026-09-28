import React from 'react';

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  active?: boolean;
}

export interface SidebarProps {
  title?: string;
  items: SidebarItem[];
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ title, items, className = '' }) => {
  return (
    <aside className={`w-64 shrink-0 border-r border-slate-800 bg-slate-950 p-4 min-h-[calc(100vh-4rem)] ${className}`}>
      {title && (
        <h5 className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
          {title}
        </h5>
      )}
      <nav className="space-y-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
              item.active
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                {item.badge}
              </span>
            )}
          </a>
        ))}
      </nav>
    </aside>
  );
};
