import React from 'react';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { AFFILIATE_GROUP_TITLES, AFFILIATE_PARTNERS } from '../data/affiliates';
import type { AffiliateGroupKey } from '../types/finance';

interface AffiliateSectionProps {
  group: AffiliateGroupKey;
  compact?: boolean;
}

export function AffiliateSection({ group, compact = false }: AffiliateSectionProps) {
  const meta = AFFILIATE_GROUP_TITLES[group];
  const partners = AFFILIATE_PARTNERS.filter((p) => p.group === group);

  return (
    <section
      aria-labelledby={`affiliate-${group}`}
      className="no-print rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Featured Financial Partners
          </p>
          <h2
            id={`affiliate-${group}`}
            className="mt-1 text-xl md:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
          >
            {meta.title}
          </h2>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{meta.subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <span>Vetted Partner Directory</span>
        </div>
      </div>

      <div className={`mt-6 grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="flex flex-col justify-between rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 p-5"
          >
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {partner.name}
                </h3>
                <span className="font-mono text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                  {partner.highlightMetricValue}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {partner.bestFor}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 py-3 border-y border-slate-200/80 dark:border-slate-800/80 text-xs">
                <div>
                  <div className="text-slate-500 dark:text-slate-400">{partner.highlightMetricLabel}</div>
                  <div className="mt-0.5 font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">
                    {partner.highlightMetricValue}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">{partner.secondaryMetricLabel}</div>
                  <div className="mt-0.5 font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100">
                    {partner.secondaryMetricValue}
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {partner.summary}
              </p>
            </div>

            <div className="mt-5 pt-3">
              <a
                href={partner.url}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(`disclosure-${partner.id}`);
                  if (el) {
                    el.textContent = `Simulated affiliate link for ${partner.name} — ready for partner tracking URL.`;
                  }
                }}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 dark:bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors whitespace-nowrap"
              >
                <span>{partner.ctaLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <p
                id={`disclosure-${partner.id}`}
                className="mt-2 text-[11px] text-slate-500 dark:text-slate-400"
              >
                {partner.disclosure}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">{meta.disclosure}</p>
    </section>
  );
}
