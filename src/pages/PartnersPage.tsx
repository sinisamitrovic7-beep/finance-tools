import React from 'react';
import { AffiliateSection } from '../components/AffiliateSection';
import { AdSlot } from '../components/AdSlot';

export function PartnersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          Financial Institution Directory
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
          Compare Investment Brokers, Savings, Mortgages & Retirement IRAs
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Evaluate fees, account minimums, APY benchmarks, and lending terms across our vetted partner categories before opening your next account.
        </p>
      </div>

      <AffiliateSection group="brokers" />
      <AdSlot variant="in-content" />
      <AffiliateSection group="savings" />
      <AffiliateSection group="mortgages" />
      <AffiliateSection group="retirement" />
    </div>
  );
}
