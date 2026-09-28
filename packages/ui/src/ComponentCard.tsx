import React from 'react';
import { Lock, ArrowUpRight, Sparkles, Terminal } from 'lucide-react';
import { ComponentSummaryDto } from '@tech-inject/types';
import { StatusBadge } from './StatusBadge';
import { Badge } from './Badge';

export interface ComponentCardProps {
  component: ComponentSummaryDto;
  onClick?: () => void;
  href?: string;
  isPremiumUser?: boolean;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({
  component,
  onClick,
  isPremiumUser = false,
}) => {
  const isPremium = component.access === 'PREMIUM';
  const isLocked = isPremium && !isPremiumUser;

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-xl cursor-pointer ${
        isPremium ? 'border-amber-500/20 hover:border-amber-500/40' : ''
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <StatusBadge status={component.access} size="sm" />
            <Badge variant="neutral" size="sm">
              {component.category}
            </Badge>
            <span className="text-[11px] font-mono text-slate-500">v{component.version}</span>
          </div>

          {isLocked ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <Lock className="w-3 h-3" />
              Locked
            </span>
          ) : isPremium ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <Sparkles className="w-3 h-3" />
              Unlocked
            </span>
          ) : null}
        </div>

        {/* Title & Description */}
        <h4 className="text-base font-semibold text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between">
          <span>{component.name}</span>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </h4>
        <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {component.description}
        </p>
      </div>

      {/* Footer info & install snippet */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 truncate max-w-[200px]">
          <Terminal className="w-3 h-3 shrink-0 text-slate-500" />
          <span className="truncate">npx tech-inject add {component.slug}</span>
        </div>
        <span className="text-[10px] text-slate-500 shrink-0">Details →</span>
      </div>
    </div>
  );
};
