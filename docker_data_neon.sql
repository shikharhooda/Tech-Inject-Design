--
-- PostgreSQL database dump
--


-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: components; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.components VALUES ('cmulj4bc3000shjpomkdjq4hd', 'Data Table Filter', 'data-table-filter', 'Advanced data filter bar with chip tag removal, condition selection, and dropdown query controls.', 'Overlays', '1.0.0', 'PREMIUM', 'PUBLISHED', '[{"name": "activeFilters", "type": "Array<{ key: string; value: string }>", "required": true, "description": "Current applied filter tags"}, {"name": "onRemoveFilter", "type": "(key: string) => void", "required": true, "description": "Callback to remove filter chip"}, {"name": "onClearAll", "type": "() => void", "required": false, "description": "Clear all active filters"}]', 'import { DataTableFilter } from ''@/components/data-table-filter'';

export default function Demo() {
  return (
    <DataTableFilter
      activeFilters={[{ key: ''Status'', value: ''Published'' }]}
      onRemoveFilter={(k) => console.log(''Remove'', k)}
    />
  );
}', '["lucide-react@^0.453.0"]', '{}', NULL, 'Create the premium "data-table-filter" component for React + TypeScript.
Requirements:
- Removable pill filter tags
- Clear all trigger
- Lucide Filter and X icons', 'npx tech-inject add data-table-filter', '2026-09-28 17:36:23.907', '2026-09-28 17:36:23.907', '2026-09-28 17:36:23.906');
INSERT INTO public.components VALUES ('cmulj4bci000uhjpof3w32dq2', 'Pricing Toggle', 'pricing-toggle', 'Billed monthly vs annual discount switcher toggle control. (Draft state)', 'Buttons', '1.0.0', 'FREE', 'DRAFT', '[{"name": "isAnnual", "type": "boolean", "required": true, "description": "Toggle state"}, {"name": "onChange", "type": "(annual: boolean) => void", "required": true, "description": "State change handler"}]', 'import { PricingToggle } from ''@/components/pricing-toggle'';

export default function Demo() {
  return <PricingToggle isAnnual={true} onChange={(v) => console.log(v)} />;
}', '[]', '{}', NULL, 'Create the "pricing-toggle" switch component for React + TypeScript.', 'npx tech-inject add pricing-toggle', '2026-09-28 17:36:23.922', '2026-09-28 17:36:23.922', NULL);
INSERT INTO public.components VALUES ('cmulj4b9n000ghjpobmbhuqe7', 'Modern Button', 'modern-button', 'Versatile button component with multiple variants, micro-interactions, icon slots, and async loading spinners.', 'Buttons', '1.0.0', 'FREE', 'PUBLISHED', '[{"name": "variant", "type": "''primary'' | ''secondary'' | ''outline'' | ''ghost'' | ''danger''", "default": "''primary''", "required": false, "description": "Visual style variant"}, {"name": "size", "type": "''sm'' | ''md'' | ''lg''", "default": "''md''", "required": false, "description": "Sizing scale"}, {"name": "isLoading", "type": "boolean", "default": "false", "required": false, "description": "Displays spinner and disables interactions"}, {"name": "leftIcon", "type": "React.ReactNode", "required": false, "description": "Icon rendered before label"}, {"name": "rightIcon", "type": "React.ReactNode", "required": false, "description": "Icon rendered after label"}]', 'import { Button } from ''@/components/modern-button'';
import { ArrowRight, Sparkles } from ''lucide-react'';

export default function Demo() {
  return (
    <div className="flex gap-3">
      <Button variant="primary" leftIcon={<Sparkles className="w-4 h-4" />}>
        Generate
      </Button>
      <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
        Explore
      </Button>
    </div>
  );
}', '["lucide-react@^0.453.0"]', '{"sizes": ["sm", "md", "lg"], "defaultVariant": "primary"}', NULL, 'You are generating the "modern-button" component for a React + TypeScript project using Tailwind CSS.
Files to create:
- components/modern-button.tsx
Dependencies:
- lucide-react (for Loader2 spinner)
Styling guidelines:
- Indigo-600 background for primary variant
- Slate-800 for secondary, Slate-900 border for outline
- Rounded-lg, active:scale-[0.98] micro-interaction
- Full keyboard focus-visible ring styles
Verification:
- Verify that isLoading displays a rotating spinner and sets disabled attribute.', 'npx tech-inject add modern-button', '2026-09-28 17:36:23.819', '2026-09-28 17:36:23.819', '2026-09-28 17:36:23.818');
INSERT INTO public.components VALUES ('cmulj4ba3000ihjpo5k6yjh2b', 'Glass Card', 'glass-card', 'Frosted translucent surface with sub-pixel borders, ambient hover glow, and backdrop filter blur.', 'Cards', '1.0.0', 'FREE', 'PUBLISHED', '[{"name": "children", "type": "React.ReactNode", "required": true, "description": "Card body content"}, {"name": "glow", "type": "boolean", "default": "true", "required": false, "description": "Enable subtle hover glow"}, {"name": "className", "type": "string", "required": false, "description": "Additional CSS classes"}]', 'import { GlassCard } from ''@/components/glass-card'';

export default function Demo() {
  return (
    <GlassCard glow>
      <h4 className="font-semibold text-white">Translucent Glass</h4>
      <p className="text-xs text-slate-300 mt-1">Refined modern surface with 24px backdrop blur.</p>
    </GlassCard>
  );
}', '[]', '{"blur": "24px"}', NULL, 'Create the "glass-card" component for React + TypeScript with Tailwind CSS.
Requirements:
- Semi-transparent background with backdrop-blur-xl
- Sub-pixel border using border-white/10
- Ambient glow on hover
- Proper responsive container sizing', 'npx tech-inject add glass-card', '2026-09-28 17:36:23.835', '2026-09-28 17:36:23.835', '2026-09-28 17:36:23.834');
INSERT INTO public.components VALUES ('cmulj4bae000khjpots3n1jzt', 'Animated Badge', 'animated-badge', 'Dynamic status badge featuring an animated radar ping dot and semantically color-coded status indicator tones.', 'Feedback', '1.0.0', 'FREE', 'PUBLISHED', '[{"name": "status", "type": "''online'' | ''busy'' | ''offline'' | ''warning''", "default": "''online''", "required": false, "description": "Radar status dot mode"}, {"name": "label", "type": "string", "required": true, "description": "Text label for the badge"}]', 'import { AnimatedBadge } from ''@/components/animated-badge'';

export default function Demo() {
  return <AnimatedBadge status="online" label="All Systems Normal" />;
}', '[]', '{"statuses": ["online", "busy", "warning"]}', NULL, 'Create the "animated-badge" component for React + TypeScript.
Requirements:
- Ping animation using Tailwind animate-ping
- Emerald for online, Amber for warning, Rose for busy/offline
- High contrast readable text', 'npx tech-inject add animated-badge', '2026-09-28 17:36:23.846', '2026-09-28 17:36:23.846', '2026-09-28 17:36:23.845');
INSERT INTO public.components VALUES ('cmulj4bas000mhjpobowjijwi', 'Notification Toast', 'notification-toast', 'Transient alert notification card with status icons, action buttons, and dismiss controls.', 'Feedback', '1.0.0', 'FREE', 'PUBLISHED', '[{"name": "title", "type": "string", "required": true, "description": "Title header of toast"}, {"name": "description", "type": "string", "required": false, "description": "Detailed notification body"}, {"name": "onClose", "type": "() => void", "required": false, "description": "Dismiss callback"}]', 'import { NotificationToast } from ''@/components/notification-toast'';

export default function Demo() {
  return (
    <NotificationToast
      title="Deployment Complete"
      description="Next.js app live on edge nodes."
      onClose={() => console.log(''Closed'')}
    />
  );
}', '["lucide-react@^0.453.0"]', '{}', NULL, 'Create the NotificationToast component in React + TypeScript with Tailwind.
Requirements:
- Lucide check/close icons
- Smooth entrance animation
- Accessible close button', 'npx tech-inject add notification-toast', '2026-09-28 17:36:23.861', '2026-09-28 17:36:23.861', '2026-09-28 17:36:23.859');
INSERT INTO public.components VALUES ('cmulj4bb9000ohjpov8y6ktnx', 'Stat Metric Card', 'stat-metric-card', 'Executive KPI metric summary card featuring sparklines, trending pills, and period-over-period delta ratios.', 'Metrics', '1.0.0', 'PREMIUM', 'PUBLISHED', '[{"name": "title", "type": "string", "required": true, "description": "Metric title"}, {"name": "value", "type": "string | number", "required": true, "description": "Primary numeric value"}, {"name": "change", "type": "string", "required": true, "description": "Delta percentage e.g. +14.2%"}, {"name": "sparklineData", "type": "number[]", "required": false, "description": "Array of relative values 0-100"}]', 'import { StatMetricCard } from ''@/components/stat-metric-card'';

export default function Demo() {
  return (
    <StatMetricCard
      title="Monthly Active Users"
      value="248,190"
      change="+18.4%"
      sparklineData={[20, 35, 45, 60, 50, 75, 90]}
    />
  );
}', '["lucide-react@^0.453.0"]', '{"value": "1,842,910", "change": "+28.4%"}', NULL, 'Create the premium "stat-metric-card" component for React + TypeScript with Tailwind CSS.
Requirements:
- Executive dark theme with trend badges
- Micro-sparkline bar rendering
- Formatted metrics with delta comparison indicators', 'npx tech-inject add stat-metric-card', '2026-09-28 17:36:23.877', '2026-09-28 17:36:23.877', '2026-09-28 17:36:23.875');
INSERT INTO public.components VALUES ('cmulj4bbo000qhjpomvflczoi', 'Command Palette', 'command-palette', 'Accessible Spotlight-inspired command palette modal with quick fuzzy search and keyboard shortcut bindings.', 'Navigation', '1.0.0', 'PREMIUM', 'PUBLISHED', '[{"name": "isOpen", "type": "boolean", "required": true, "description": "Modal visibility state"}, {"name": "onClose", "type": "() => void", "required": true, "description": "Close handler"}, {"name": "items", "type": "Array<{ id: string; label: string; shortcut?: string; onSelect: () => void }>", "required": true, "description": "List of command actions"}]', 'import { CommandPalette } from ''@/components/command-palette'';

export default function Demo() {
  return (
    <CommandPalette
      isOpen={true}
      onClose={() => console.log(''Close'')}
      items={[
        { id: ''1'', label: ''Deploy to Production'', shortcut: ''⌘D'', onSelect: () => {} },
        { id: ''2'', label: ''Run Component Linter'', shortcut: ''⌘L'', onSelect: () => {} },
      ]}
    />
  );
}', '["lucide-react@^0.453.0"]', '{}', NULL, 'Create the premium "command-palette" component for React + TypeScript.
Requirements:
- Keyboard navigation (ArrowUp, ArrowDown, Enter, Escape)
- Search filter input with instant feedback
- Keybinding badges (KBD elements)
- Accessible dialog semantics', 'npx tech-inject add command-palette', '2026-09-28 17:36:23.892', '2026-09-28 17:36:23.892', '2026-09-28 17:36:23.891');


--
-- Data for Name: component_versions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.component_versions VALUES ('cmulj4b9n000hhjpoht9bkokl', 'cmulj4b9n000ghjpobmbhuqe7', '1.0.0', 'import React from ''react'';
import { Loader2 } from ''lucide-react'';

export interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ''primary'' | ''secondary'' | ''outline'' | ''ghost'' | ''danger'';
  size?: ''sm'' | ''md'' | ''lg'';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  (
    {
      children,
      className = '''',
      variant = ''primary'',
      size = ''md'',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const base = ''inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]'';

    const variants = {
      primary: ''bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm shadow-indigo-500/20'',
      secondary: ''bg-slate-800 text-slate-100 hover:bg-slate-700 focus:ring-slate-600 border border-slate-700'',
      outline: ''border border-slate-700 text-slate-300 hover:bg-slate-800/60 hover:text-white focus:ring-slate-500'',
      ghost: ''text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 focus:ring-slate-500'',
      danger: ''bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm shadow-rose-500/20'',
    };

    const sizes = {
      sm: ''px-2.5 py-1.5 text-xs gap-1.5'',
      md: ''px-4 py-2 text-sm gap-2'',
      lg: ''px-5 py-2.5 text-base gap-2.5'',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!isLoading && leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

ModernButton.displayName = ''ModernButton'';
', '{"sizes": ["sm", "md", "lg"], "defaultVariant": "primary"}', '["lucide-react@^0.453.0"]', '{"installCommand": "npx tech-inject add modern-button"}', 'You are generating the "modern-button" component for a React + TypeScript project using Tailwind CSS.
Files to create:
- components/modern-button.tsx
Dependencies:
- lucide-react (for Loader2 spinner)
Styling guidelines:
- Indigo-600 background for primary variant
- Slate-800 for secondary, Slate-900 border for outline
- Rounded-lg, active:scale-[0.98] micro-interaction
- Full keyboard focus-visible ring styles
Verification:
- Verify that isLoading displays a rotating spinner and sets disabled attribute.', '2026-09-28 17:36:23.819');
INSERT INTO public.component_versions VALUES ('cmulj4ba3000jhjpoj3e1jheu', 'cmulj4ba3000ihjpo5k6yjh2b', '1.0.0', 'import React from ''react'';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, glow = true, className = '''', ...props }) => {
  return (
    <div
      className={`relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
        glow ? ''hover:border-indigo-500/30 hover:bg-white/10 hover:shadow-indigo-500/10'' : ''''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
', '{"blur": "24px"}', '[]', '{"installCommand": "npx tech-inject add glass-card"}', 'Create the "glass-card" component for React + TypeScript with Tailwind CSS.
Requirements:
- Semi-transparent background with backdrop-blur-xl
- Sub-pixel border using border-white/10
- Ambient glow on hover
- Proper responsive container sizing', '2026-09-28 17:36:23.835');
INSERT INTO public.component_versions VALUES ('cmulj4bae000lhjpoppd8hykc', 'cmulj4bae000khjpots3n1jzt', '1.0.0', 'import React from ''react'';

export interface AnimatedBadgeProps {
  status?: ''online'' | ''busy'' | ''offline'' | ''warning'';
  label: string;
  className?: string;
}

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  status = ''online'',
  label,
  className = '''',
}) => {
  const configs = {
    online: {
      bg: ''bg-emerald-500/10 text-emerald-400 border-emerald-500/20'',
      dot: ''bg-emerald-500'',
      ping: ''bg-emerald-400'',
    },
    warning: {
      bg: ''bg-amber-500/10 text-amber-400 border-amber-500/20'',
      dot: ''bg-amber-500'',
      ping: ''bg-amber-400'',
    },
    busy: {
      bg: ''bg-rose-500/10 text-rose-400 border-rose-500/20'',
      dot: ''bg-rose-500'',
      ping: ''bg-rose-400'',
    },
    offline: {
      bg: ''bg-slate-800 text-slate-400 border-slate-700'',
      dot: ''bg-slate-500'',
      ping: ''bg-slate-400'',
    },
  };

  const current = configs[status];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${current.bg} ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.ping}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`}></span>
      </span>
      {label}
    </span>
  );
};
', '{"statuses": ["online", "busy", "warning"]}', '[]', '{"installCommand": "npx tech-inject add animated-badge"}', 'Create the "animated-badge" component for React + TypeScript.
Requirements:
- Ping animation using Tailwind animate-ping
- Emerald for online, Amber for warning, Rose for busy/offline
- High contrast readable text', '2026-09-28 17:36:23.846');
INSERT INTO public.component_versions VALUES ('cmulj4bat000nhjpoh1uc980c', 'cmulj4bas000mhjpobowjijwi', '1.0.0', 'import React from ''react'';
import { CheckCircle2, X } from ''lucide-react'';

export interface NotificationToastProps {
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  title,
  description,
  onClose,
  className = '''',
}) => {
  return (
    <div className={`flex items-center justify-between gap-3 w-full max-w-sm rounded-xl border border-emerald-500/30 bg-slate-900/90 p-3.5 backdrop-blur shadow-2xl ${className}`}>
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-white">{title}</p>
          {description && <p className="text-[11px] text-slate-400">{description}</p>}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
', '{}', '["lucide-react@^0.453.0"]', '{"installCommand": "npx tech-inject add notification-toast"}', 'Create the NotificationToast component in React + TypeScript with Tailwind.
Requirements:
- Lucide check/close icons
- Smooth entrance animation
- Accessible close button', '2026-09-28 17:36:23.861');
INSERT INTO public.component_versions VALUES ('cmulj4bb9000phjpoiwskibzu', 'cmulj4bb9000ohjpov8y6ktnx', '1.0.0', 'import React from ''react'';
import { TrendingUp, TrendingDown } from ''lucide-react'';

export interface StatMetricCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive?: boolean;
  comparisonPeriod?: string;
  sparklineData?: number[];
  className?: string;
}

export const StatMetricCard: React.FC<StatMetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  comparisonPeriod = ''vs. last month'',
  sparklineData = [35, 45, 30, 60, 50, 75, 65, 80, 70, 90, 85, 100],
  className = '''',
}) => {
  return (
    <div className={`w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur shadow-xl ${className}`}>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium">{title}</span>
        <span
          className={`flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md border ${
            isPositive
              ? ''text-emerald-400 bg-emerald-500/10 border-emerald-500/20''
              : ''text-rose-400 bg-rose-500/10 border-rose-500/20''
          }`}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
        <span className="text-xs text-slate-500">{comparisonPeriod}</span>
      </div>
      <div className="mt-4 flex items-end gap-1.5 h-10 w-full pt-2">
        {sparklineData.map((val, i) => (
          <div
            key={i}
            style={{ height: `${val}%` }}
            className="flex-1 rounded-t bg-indigo-500/40 hover:bg-indigo-400 transition-colors"
          />
        ))}
      </div>
    </div>
  );
};
', '{"value": "1,842,910", "change": "+28.4%"}', '["lucide-react@^0.453.0"]', '{"installCommand": "npx tech-inject add stat-metric-card"}', 'Create the premium "stat-metric-card" component for React + TypeScript with Tailwind CSS.
Requirements:
- Executive dark theme with trend badges
- Micro-sparkline bar rendering
- Formatted metrics with delta comparison indicators', '2026-09-28 17:36:23.877');
INSERT INTO public.component_versions VALUES ('cmulj4bbo000rhjpozezir15l', 'cmulj4bbo000qhjpomvflczoi', '1.0.0', 'import React, { useState, useEffect } from ''react'';
import { Search, Command, X } from ''lucide-react'';

export interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, items }) => {
  const [query, setQuery] = useState('''');

  if (!isOpen) return null;

  const filtered = items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden z-10">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-sm text-slate-200 outline-none w-full placeholder-slate-500"
            autoFocus
          />
          <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            ESC
          </kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2 space-y-1 text-xs">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.onSelect();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-indigo-300 text-left transition-colors"
            >
              <div className="flex items-center gap-2">
                <Command className="w-3.5 h-3.5 text-slate-500" />
                <span>{item.label}</span>
              </div>
              {item.shortcut && (
                <span className="font-mono text-[10px] text-slate-500">{item.shortcut}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
', '{}', '["lucide-react@^0.453.0"]', '{"installCommand": "npx tech-inject add command-palette"}', 'Create the premium "command-palette" component for React + TypeScript.
Requirements:
- Keyboard navigation (ArrowUp, ArrowDown, Enter, Escape)
- Search filter input with instant feedback
- Keybinding badges (KBD elements)
- Accessible dialog semantics', '2026-09-28 17:36:23.892');
INSERT INTO public.component_versions VALUES ('cmulj4bc3000thjpo5d3famyi', 'cmulj4bc3000shjpomkdjq4hd', '1.0.0', 'import React from ''react'';
import { Filter, X } from ''lucide-react'';

export interface FilterTag {
  key: string;
  value: string;
}

export interface DataTableFilterProps {
  activeFilters: FilterTag[];
  onRemoveFilter: (key: string) => void;
  onClearAll?: () => void;
  className?: string;
}

export const DataTableFilter: React.FC<DataTableFilterProps> = ({
  activeFilters,
  onRemoveFilter,
  onClearAll,
  className = '''',
}) => {
  return (
    <div className={`w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2 font-medium text-slate-200">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span>Active Filters</span>
        </div>
        {onClearAll && (
          <button onClick={onClearAll} className="text-indigo-400 hover:underline text-[11px]">
            Clear all
          </button>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {activeFilters.map((f, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30"
          >
            <span>{f.key}: {f.value}</span>
            <button onClick={() => onRemoveFilter(f.key)} className="hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
', '{}', '["lucide-react@^0.453.0"]', '{"installCommand": "npx tech-inject add data-table-filter"}', 'Create the premium "data-table-filter" component for React + TypeScript.
Requirements:
- Removable pill filter tags
- Clear all trigger
- Lucide Filter and X icons', '2026-09-28 17:36:23.907');
INSERT INTO public.component_versions VALUES ('cmulj4bci000vhjpo8f6qzj52', 'cmulj4bci000uhjpof3w32dq2', '1.0.0', 'import React from ''react'';

export interface PricingToggleProps {
  isAnnual: boolean;
  onChange: (annual: boolean) => void;
}

export const PricingToggle: React.FC<PricingToggleProps> = ({ isAnnual, onChange }) => {
  return (
    <div className="flex items-center justify-center gap-3 p-4">
      <span className="text-xs font-medium text-slate-300">Monthly</span>
      <div
        onClick={() => onChange(!isAnnual)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
          isAnnual ? ''bg-indigo-600'' : ''bg-slate-700''
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
            isAnnual ? ''translate-x-5'' : ''translate-x-0''
          }`}
        />
      </div>
      <span className="text-xs font-medium text-white flex items-center gap-1.5">
        Annual
        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 text-[10px] text-emerald-400">
          Save 20%
        </span>
      </span>
    </div>
  );
};
', '{}', '[]', '{"installCommand": "npx tech-inject add pricing-toggle"}', 'Create the "pricing-toggle" switch component for React + TypeScript.', '2026-09-28 17:36:23.922');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES ('cmulj4b97000bhjpoqr9zljwy', 'admin@example.com', '$2a$10$yUeW4zMH1EvZgodcZczZOuenpXWYh/TUFFIaivHe70Fmx5eEWWIfK', 'ADMIN', true, '2026-09-28 17:36:23.803', '2026-09-28 17:36:23.803');
INSERT INTO public.users VALUES ('cmulj4b9c000chjposhcn21k7', 'free@example.com', '$2a$10$IqOGGn6xJLOni8auaYnUs.O1VWxk5V6ZmQ5X2H4Ht37WYws6SKc6u', 'CUSTOMER', false, '2026-09-28 17:36:23.808', '2026-09-28 17:36:23.808');
INSERT INTO public.users VALUES ('cmulj4b9e000dhjpo6hg50tx0', 'premium@example.com', '$2a$10$IqOGGn6xJLOni8auaYnUs.O1VWxk5V6ZmQ5X2H4Ht37WYws6SKc6u', 'CUSTOMER', true, '2026-09-28 17:36:23.811', '2026-09-28 17:36:23.811');


--
-- Data for Name: licenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.licenses VALUES ('cmulj4b9h000fhjpocva6goah', 'cmulj4b9e000dhjpo6hg50tx0', 'acc62d4523ec617e6f37d961dfe3267c2a6234fa89681181cbb7bd905bed6623', 'ACTIVE', '2026-09-28 17:36:23.813', NULL, NULL);


--
-- PostgreSQL database dump complete
--


