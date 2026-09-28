'use client';

import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, Sun, Moon, RotateCcw } from 'lucide-react';

export interface PreviewPanelProps {
  children: React.ReactNode;
  title?: string;
  defaultViewport?: 'desktop' | 'tablet' | 'mobile';
  className?: string;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  children,
  title = 'Component Preview',
  defaultViewport = 'desktop',
  className = '',
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>(defaultViewport);
  const [isLightMode, setIsLightMode] = useState(false);
  const [key, setKey] = useState(0);

  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'max-w-[768px]',
    mobile: 'max-w-[375px]',
  };

  return (
    <div className={`flex flex-col rounded-xl border border-slate-800 bg-slate-950 overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs">
        <span className="font-medium text-slate-300">{title}</span>

        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            title="Desktop view"
            aria-label="Desktop view"
            className={`p-1.5 rounded ${
              viewport === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewport('tablet')}
            title="Tablet view"
            aria-label="Tablet view"
            className={`p-1.5 rounded ${
              viewport === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewport('mobile')}
            title="Mobile view"
            aria-label="Mobile view"
            className={`p-1.5 rounded ${
              viewport === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsLightMode(!isLightMode)}
            title="Toggle canvas theme"
            aria-label="Toggle canvas theme"
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
          >
            {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setKey((prev) => prev + 1)}
            title="Reset component state"
            aria-label="Reset component state"
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        className={`flex min-h-[300px] items-center justify-center p-8 transition-colors ${
          isLightMode ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
        }`}
      >
        <div key={key} className={`mx-auto transition-all duration-200 ${viewportWidths[viewport]}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
