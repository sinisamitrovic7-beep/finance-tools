import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';
import { AffiliateSection } from '../components/AffiliateSection';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { CALCULATOR_MAP } from '../data/calculatorsMeta';
import { CATEGORIES, CATEGORY_MAP } from '../data/categories';
import { SEO_LANDING_PAGES } from '../data/seoLandingPages';
import { getHeadlineSummaryForPreset } from '../lib/calculators';
import { Link } from '../lib/router';
import type { CategorySlug } from '../types/finance';

export function CategoryPage({ slug }: { slug: CategorySlug }) {
  const category = CATEGORY_MAP[slug];
  if (!category) return null;

  const calcs = category.calculatorIds.map((id) => CALCULATOR_MAP[id]);
  const categorySeoPages = SEO_LANDING_PAGES.filter((p) => p.category === slug);
  const articles = category.featuredArticleSlugs
    .map((s) => BLOG_ARTICLES.find((a) => a.slug === s))
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-200">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-slate-100 font-medium">{category.shortName}</span>
      </nav>

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 max-w-4xl space-y-3">
        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          Topic Hub · /{category.slug}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
          {category.name}
        </h1>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Main Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-10">
          {/* Primary Calculators */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Primary {category.shortName} Calculators
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {calcs.map((calc) => {
                const summary = getHeadlineSummaryForPreset(calc.id, calc.defaultInputs);
                return (
                  <Link
                    key={calc.id}
                    href={`/calculators/${calc.slug}`}
                    className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-emerald-600/50 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                        {calc.name}
                      </h3>
                      <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                        {calc.tagline}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                        {summary.primaryValue}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
                        Launch <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            {category.editorialIntro}
          </p>

          <AdSlot variant="in-content" />

          {/* Category Specialized Scenarios */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Specialized {category.shortName} Tools ({categorySeoPages.length})
              </h2>
              <Link href="/tools" className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline">
                View all 100 tools
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categorySeoPages.map((page) => {
                const summary = getHeadlineSummaryForPreset(page.calculatorId, page.presetInputs);
                return (
                  <Link
                    key={page.slug}
                    href={`/tools/${page.slug}`}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:border-emerald-600/50 transition-colors flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {page.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {summary.primaryLabel}: <span className="font-mono tabular-nums">{summary.primaryValue}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Featured Guides */}
          {articles.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Recommended Reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {articles.map((art) => {
                  if (!art) return null;
                  return (
                    <Link
                      key={art.slug}
                      href={`/blog/${art.slug}`}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-slate-400 transition-colors"
                    >
                      <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-950">
                        <img
                          src={art.imageUrl}
                          alt={art.imageAlt}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {art.readTime} · {art.publishedAt}
                        </div>
                        <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                          {art.title}
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <AffiliateSection group={category.affiliateGroup} />
        </div>

        {/* Sidebar Rail */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <AdSlot variant="sidebar" />

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              All Categories
            </h3>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.slug} className="py-2 first:pt-0 last:pb-0">
                  <Link
                    href={`/${c.slug}`}
                    className={`flex items-center justify-between ${
                      c.slug === slug
                        ? 'font-semibold text-emerald-700 dark:text-emerald-400'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <span>{c.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
