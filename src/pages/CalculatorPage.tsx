import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';
import { AffiliateSection } from '../components/AffiliateSection';
import { CalculatorWorkspace } from '../components/CalculatorWorkspace';
import { FaqAccordion } from '../components/FaqAccordion';
import { CALCULATORS, CALCULATOR_MAP } from '../data/calculatorsMeta';
import { CATEGORY_MAP } from '../data/categories';
import { SEO_LANDING_PAGES } from '../data/seoLandingPages';
import { Link } from '../lib/router';
import type { CalculatorId } from '../types/finance';

export function CalculatorPage({ slug }: { slug: string }) {
  const calc =
    Object.values(CALCULATOR_MAP).find((c) => c.slug === slug) ??
    CALCULATOR_MAP['compound-interest'];
  const category = CATEGORY_MAP[calc.category];
  const scenarios = SEO_LANDING_PAGES.filter((p) => p.calculatorId === calc.id).slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="no-print text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-200">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={`/${category.slug}`} className="hover:text-slate-900 dark:hover:text-slate-200">
          {category.shortName}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-slate-100 font-medium">{calc.name}</span>
      </nav>

      {/* Calculator Switcher Bar */}
      <div className="no-print flex items-center gap-1.5 overflow-x-auto pb-1">
        {CALCULATORS.map((item) => (
          <Link
            key={item.id}
            href={`/calculators/${item.slug}`}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              item.id === calc.id
                ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {item.shortName}
          </Link>
        ))}
      </div>

      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
          {calc.name}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {calc.tagline}
        </p>
      </div>

      {/* Main Interactive Calculator */}
      <CalculatorWorkspace calculatorId={calc.id as CalculatorId} />

      <AdSlot variant="in-content" />

      {/* Two-Column Lower Content: Scenarios + Affiliate + Sidebar Ad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          {/* Pre-configured Scenario Links */}
          <section className="no-print rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="flex items-baseline justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Popular {calc.shortName} Scenarios
              </h2>
              <Link href="/tools" className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline">
                View all 100 scenarios
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scenarios.map((s) => (
                <Link
                  key={s.slug}
                  href={`/tools/${s.slug}`}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 hover:border-emerald-600/50 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center justify-between gap-2"
                >
                  <span className="truncate">{s.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>

          <FaqAccordion items={calc.faqs} title={`${calc.shortName} Questions & Answers`} />

          <AffiliateSection group={calc.affiliateGroup} />
        </div>

        <aside className="no-print lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <AdSlot variant="sidebar" />
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Explore Category Hub
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {category.description}
            </p>
            <Link
              href={`/${category.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              <span>Go to {category.name}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
