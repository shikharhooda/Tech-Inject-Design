'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { ComponentSummaryDto, UserDto } from '@tech-inject/types';
import { ComponentCard, Button, Badge } from '@tech-inject/ui';
import { CatalogueApi } from '@/lib/api';

const CATEGORIES = ['All', 'Buttons', 'Cards', 'Metrics', 'Navigation', 'Feedback', 'Overlays'];

export default function ComponentsCataloguePage() {
  const [components, setComponents] = useState<ComponentSummaryDto[]>([]);
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [accessFilter, setAccessFilter] = useState<'ALL' | 'FREE' | 'PREMIUM'>('ALL');

  useEffect(() => {
    CatalogueApi.getMe().then((res) => {
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      }
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    CatalogueApi.getComponents({
      search: search || undefined,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      access: accessFilter !== 'ALL' ? accessFilter : undefined,
    })
      .then((res) => {
        if (res.success && res.data) {
          setComponents(res.data);
        } else {
          setError(res.error || 'Failed to load components');
        }
      })
      .catch((err) => {
        setError(err.message || 'Network error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [search, selectedCategory, accessFilter]);

  const isPremiumUser = user?.premiumAccess === true || user?.role === 'ADMIN';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-900">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-1 text-xs font-semibold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Component Registry</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Component Catalogue</h1>
          <p className="mt-1 text-sm text-slate-400">
            Browse through reusable React + TypeScript building blocks.
          </p>
        </div>

        {/* Access filter toggles */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl self-start md:self-auto">
          <button
            type="button"
            onClick={() => setAccessFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              accessFilter === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setAccessFilter('FREE')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              accessFilter === 'FREE'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Free Only
          </button>
          <button
            type="button"
            onClick={() => setAccessFilter('PREMIUM')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              accessFilter === 'PREMIUM'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Premium Only
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search components by name, description, slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Categories scrollable list */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedCategory === category
                  ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Component Grid */}
      <div className="mt-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
            <p className="text-xs font-medium">Fetching catalogue from API...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-rose-500/20 bg-rose-500/5 rounded-2xl p-6">
            <AlertCircle className="w-8 h-8 text-rose-400 mb-2" />
            <p className="text-sm font-semibold text-rose-300">{error}</p>
            <p className="text-xs text-slate-400 mt-1">Make sure the API server is running on port 3001.</p>
          </div>
        ) : components.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl">
            <p className="text-sm font-semibold text-slate-300">No components found</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search terms or active category filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setAccessFilter('ALL');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((comp) => (
              <ComponentCard
                key={comp.id}
                component={comp}
                isPremiumUser={isPremiumUser}
                onClick={() => {
                  window.location.href = `/components/${comp.slug}`;
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
