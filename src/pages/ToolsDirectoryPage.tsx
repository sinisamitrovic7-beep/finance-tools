import React, { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { CALCULATORS } from '../data/calculatorsMeta';
import { SEO_LANDING_PAGES } from '../data/seoLandingPages';
import { getHeadlineSummaryForPreset } from '../lib/calculators';
import { Link } from '../lib/router';
import type { CalculatorId } from '../types/finance';

export function ToolsDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCalc, setSelectedCalc] = useState<CalculatorId | 'all'>('all');

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return SEO_LANDING_PAGES.filter((p) => {
      const matchesCalc = selectedCalc === 'all' || p.calculatorId === selectedCalc;
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.keyword.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCalc && matchesQuery;
    });
  }, [searchTerm, selectedCalc]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          Complete SEO Tool Directory
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
          All {SEO_LANDING_PAGES.length} Specialized Financial Calculators
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Every scenario page launches with pre-filled assumptions, live interactive charts, benchmark tables, FAQs, and printable reports.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-200/70 dark:bg-slate-900 p-1">
          <button
            type="button"
            onClick={() => setSelectedCalc('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedCalc === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All ({SEO_LANDING_PAGES.length})
          </button>
          {CALCULATORS.map((c) => {
            const count = SEO_LANDING_PAGES.filter((p) => p.calculatorId === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCalc(c.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedCalc === c.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {c.shortName} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter 100 scenarios..."
            aria-label="Filter 100 financial calculator scenarios"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-emerald-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Directory Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-2">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            No matching scenarios found.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedCalc('all');
            }}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 underline"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((page, index) => {
            const summary = getHeadlineSummaryForPreset(page.calculatorId, page.presetInputs);
            return (
              <Link
                key={page.slug}
                href={`/tools/${page.slug}`}
                className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-emerald-600/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="capitalize">{page.category}</span>
                    <span className="font-mono tabular-nums">#{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h2 className="mt-1.5 text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 leading-snug">
                    {page.title}
                  </h2>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {page.metaDescription}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 mr-1.5">
                      {summary.primaryLabel}:
                    </span>
                    <span className="font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                      {summary.primaryValue}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
