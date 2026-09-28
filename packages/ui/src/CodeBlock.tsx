'use client';

import React from 'react';
import { CopyButton } from './CopyButton';

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showCopy?: boolean;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'tsx',
  filename,
  showCopy = true,
  className = '',
}) => {
  return (
    <div className={`relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs ${className}`}>
      {(filename || showCopy) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            {filename && <span className="ml-2 text-slate-300 font-sans text-xs">{filename}</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-sans">{language}</span>
            {showCopy && <CopyButton textToCopy={code} />}
          </div>
        </div>
      )}
      <div className="p-4 overflow-x-auto text-slate-300 leading-relaxed max-h-[500px]">
        <pre className="whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
