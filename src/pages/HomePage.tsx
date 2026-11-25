import React, { useMemo, useState } from 'react';
import { ArrowRight, Calculator, Search } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';
import { AffiliateSection } from '../components/AffiliateSection';
import { FaqAccordion } from '../components/FaqAccordion';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { CALCULATORS } from '../data/calculatorsMeta';
import { CATEGORIES } from '../data/categories';
import { SEO_LANDING_PAGES } from '../data/seoLandingPages';
import { getHeadlineSummaryForPreset } from '../lib/calculators';
import { Link, useRouter } from '../lib/router';
import { HOME_FAQS } from '../lib/seo';
import type { AffiliateGroupKey } from '../types/finance';

const FEATURED_SEO_SLUGS = [
  'compound-interest-calculator-for-1000',
  'compound-interest-calculator-for-10-years',
  'fire-calculator-age-30',
  'fire-calculator-age-40',
  'retirement-calculator-with-inflation',
  'mortgage-calculator-with-extra-payments',
  'roi-calculator-for-real-estate',
  'loan-calculator-monthly-payment',
];

export function HomePage() {
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const [affiliateTab, setAffiliateTab] = useState<AffiliateGroupKey>('brokers');
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const calcHits = CALCULATORS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q)
    ).map((c) => ({
      title: c.name,
      subtitle: 'Core Calculator',
      href: `/calculators/${c.slug}`,
    }));

    const seoHits = SEO_LANDING_PAGES.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.keyword.toLowerCase().includes(q)
    )
      .slice(0, 6)
      .map((p) => ({
        title: p.title,
        subtitle: `Preset Scenario · ${p.category}`,
        href: `/tools/${p.slug}`,
      }));

    return [...calcHits, ...seoHits].slice(0, 8);
  }, [query]);

  const featuredSeoPages = useMemo(
    () =>
      FEATURED_SEO_SLUGS.map((slug) =>
        SEO_LANDING_PAGES.find((p) => p.slug === slug)
      ).filter(Boolean),
    []
  );

  return (
    <div className="space-y-16 pb-8">
      {/* Hero Section */}
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-400">
                  Interactive Financial Modeling Suite
                </p>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.1] text-balance max-w-2xl">
                  Clear financial math for every major wealth decision.
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  Project compound interest, pinpoint your FIRE crossover age, stress-test retirement inflation, and model extra mortgage payments—instantaneously in your browser.
                </p>
              </div>

              {/* Search Bar for Calculators & 100 Scenarios */}
              <div className="relative max-w-xl">
                <label htmlFor="hero-calc-search" className="sr-only">
                  Search calculators and financial scenarios
                </label>
                <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 focus-within:border-emerald-600 dark:focus-within:border-emerald-500 transition-colors">
                  <Search className="w-4 h-4 text-slate-400 mr-3 shrink-0" aria-hidden="true" />
                  <input
                    id="hero-calc-search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search calculators (e.g. FIRE age 30, extra mortgage, $1000)..."
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-2"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {query.trim().length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 z-30 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg overflow-hidden">
                    {searchResults.length > 0 ? (
                      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                        {searchResults.map((hit) => (
                          <li key={hit.href}>
                            <button
                              type="button"
                              onClick={() => {
                                setQuery('');
                                navigate(hit.href);
                              }}
                              className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              <div>
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {hit.title}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                  {hit.subtitle}
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">
                        No exact matches for "{query}".{' '}
                        <Link href="/tools" className="text-emerald-700 dark:text-emerald-400 font-medium underline">
                          Browse all 100 scenarios
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/calculators/compound-interest"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors whitespace-nowrap"
                >
                  <span>Open Compound Calculator</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  <span>Browse 100 Scenarios</span>
                </Link>
              </div>
            </div>

            {/* Right Editorial Hero Visual */}
            <div className="lg:col-span-5">
              <div className="h-full min-h-[260px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                {!heroImgFailed ? (
                  <img
                    src="/src/assets/images/hero_finance_editorial_1795619728955.jpg"
                    alt="Sunlit modern financial planning desk with printed charts"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-100 to-emerald-50 dark:from-slate-900 dark:to-emerald-950/30">
                    <Calculator className="w-10 h-10 text-emerald-700 dark:text-emerald-400 mb-3" />
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Finance.Tools Modeling Engine
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4-column benchmark strip below hero split */}
          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                6 Core Engines
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Compound, FIRE, Retirement, Mortgage, Loan & ROI
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                100 Scenarios
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Pre-configured long-tail tools with full breakdowns
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                Real-Time Charts
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Interactive SVG trajectories & CSV schedules
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                Share & Print
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Parameterized links and ad-free print reports
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Calculators */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Popular Financial Calculators
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Launch any core engine with instant interactive sliders, amortization tables, and visual curves.
            </p>
          </div>
          <Link
            href="/tools"
            className="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline whitespace-nowrap"
          >
            View all 100 calculator scenarios →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CALCULATORS.map((calc) => {
            const preview = getHeadlineSummaryForPreset(calc.id, calc.defaultInputs);
            return (
              <Link
                key={calc.id}
                href={`/calculators/${calc.slug}`}
                className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">
                    {calc.category}
                  </div>
                  <h3 className="mt-1.5 text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {calc.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {calc.tagline}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {preview.primaryLabel}
                    </div>
                    <div className="font-mono text-base font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                      {preview.primaryValue}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:translate-x-0.5 transition-transform">
                    Open <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Browse by Topic Category
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Dedicated planning hubs combining calculators, partner rate comparisons, and editorial guides.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
            >
              <div className="text-xs font-mono text-slate-400 dark:text-slate-500">
                0{idx + 1}. /{cat.slug}
              </div>
              <h3 className="mt-1.5 text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {cat.name}
              </h3>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {cat.headline}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* In-Content AdSense Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot variant="in-content" />
      </div>

      {/* Featured Long-Tail Scenarios */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              High-Intent Scenario Calculators
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Pre-configured tools with tailored benchmark data, strategy notes, and FAQs.
            </p>
          </div>
          <Link
            href="/tools"
            className="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline whitespace-nowrap"
          >
            Explore all 100 pages →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredSeoPages.map((page) => {
            if (!page) return null;
            const summary = getHeadlineSummaryForPreset(page.calculatorId, page.presetInputs);
            return (
              <Link
                key={page.slug}
                href={`/tools/${page.slug}`}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-emerald-600/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 capitalize">
                    {page.category}
                  </div>
                  <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                    {page.title}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{summary.primaryLabel}</span>
                  <span className="font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                    {summary.primaryValue}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Affiliate Comparison Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Compare Recommended Accounts & Rates
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Switch categories to evaluate investment brokers, high-yield savings, mortgages, and IRAs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-200/70 dark:bg-slate-900 p-1">
            {(
              [
                { id: 'brokers', label: 'Investment Brokers' },
                { id: 'savings', label: 'Savings Accounts' },
                { id: 'mortgages', label: 'Mortgage Providers' },
                { id: 'retirement', label: 'Retirement IRAs' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAffiliateTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  affiliateTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <AffiliateSection group={affiliateTab} />
      </section>

      {/* Latest Finance Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Latest Finance Guides
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Editorial deep dives explaining the formulas behind compounding, FIRE, retirement, and housing.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline whitespace-nowrap"
          >
            All research articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_ARTICLES.map((art) => (
            <Link
              key={art.slug}
              href={`/blog/${art.slug}`}
              className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-slate-400 dark:hover:border-slate-600 transition-colors flex flex-col"
            >
              <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-950 overflow-hidden">
                <img
                  src={art.imageUrl}
                  alt={art.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 capitalize">
                    <span>{art.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
                  By {art.authorName}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FaqAccordion items={HOME_FAQS} title="Platform Questions & Methodology" />
      </section>

      {/* Final Call-to-Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-slate-900 text-white p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-balance">
              Run your numbers before making your next financial commitment.
            </h2>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Model compound growth, compare mortgage payoff strategies, or calculate your exact FIRE target with instant printable reports.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/calculators/fire"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors whitespace-nowrap"
            >
              <span>Calculate FIRE Age</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/calculators/mortgage"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-slate-100 hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              <span>Mortgage Calculator</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
