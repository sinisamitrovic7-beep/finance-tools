import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';
import { AffiliateSection } from '../components/AffiliateSection';
import { CalculatorWorkspace } from '../components/CalculatorWorkspace';
import { FaqAccordion } from '../components/FaqAccordion';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { CALCULATOR_MAP } from '../data/calculatorsMeta';
import { CATEGORY_MAP } from '../data/categories';
import { buildSeoLandingContent } from '../data/seoContentBuilder';
import { SEO_PAGE_MAP } from '../data/seoLandingPages';
import { Link } from '../lib/router';

export function SeoLandingPageView({ slug }: { slug: string }) {
  const page = SEO_PAGE_MAP[slug];
  if (!page) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Calculator Scenario Not Found
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Browse our directory of all 100 financial calculators and presets.
        </p>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Browse All 100 Tools
        </Link>
      </div>
    );
  }

  const calc = CALCULATOR_MAP[page.calculatorId];
  const category = CATEGORY_MAP[page.category];
  const content = useMemo(() => buildSeoLandingContent(page), [page]);
  const relatedPages = page.relatedSlugs.map((s) => SEO_PAGE_MAP[s]).filter(Boolean);
  const relatedArticles = BLOG_ARTICLES.filter(
    (a) => a.category === page.category || a.relatedCalculatorId === page.calculatorId
  ).slice(0, 2);

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
        <Link
          href={`/calculators/${calc.slug}`}
          className="hover:text-slate-900 dark:hover:text-slate-200"
        >
          {calc.shortName}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-slate-100 font-medium">{page.title}</span>
      </nav>

      {/* Hero Header */}
      <div className="max-w-4xl space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-emerald-700 dark:text-emerald-400 capitalize">
            {category.name}
          </span>
          <span aria-hidden="true">·</span>
          <span>Pre-configured {calc.name}</span>
          <span aria-hidden="true">·</span>
          <span>{content.wordCount} word guide</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
          {page.h1}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {page.metaDescription}
        </p>
      </div>

      {/* Interactive Calculator pre-populated with exact SEO preset */}
      <CalculatorWorkspace calculatorId={page.calculatorId} initialPreset={page.presetInputs} />

      <AdSlot variant="in-content" />

      {/* Main Long-Form SEO Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <article className="lg:col-span-8 space-y-8">
          {/* Scenario Benchmark Summary Card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Baseline Snapshot: {page.title}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              {content.summaryRows.map((row) => (
                <div key={row.label} className="border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">{row.label}</div>
                  <div className="mt-1 font-mono text-base font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 500–1000 Word Tailored Financial Guidance */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 space-y-8">
            {content.sections.map((section, idx) => (
              <section key={section.heading} className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-[15px] leading-[1.7] text-slate-700 dark:text-slate-300"
                  >
                    {p}
                  </p>
                ))}

                {/* Insert Benchmark Milestone Table after Section 1 */}
                {idx === 0 && (
                  <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                          {content.milestoneTableHeaders.map((h, hIdx) => (
                            <th
                              key={h}
                              className={`px-3.5 py-2.5 font-medium whitespace-nowrap ${
                                hIdx === 0 ? 'text-left' : 'text-right'
                              }`}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {content.milestoneTableRows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`px-3.5 py-2.5 whitespace-nowrap ${
                                  cIdx === 0
                                    ? 'font-medium text-slate-900 dark:text-slate-100 text-left'
                                    : 'font-mono tabular-nums text-slate-700 dark:text-slate-300 text-right'
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Scenario FAQ Section (matches FAQPage JSON-LD) */}
          <FaqAccordion items={page.faqs} title={`${page.title} — Frequently Asked Questions`} />

          {/* Affiliate Partners */}
          <AffiliateSection group={calc.affiliateGroup} />
        </article>

        {/* Sidebar: Ad + Internal Linking Cluster */}
        <aside className="no-print lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <AdSlot variant="sidebar" />

          {/* Internal Links: Related Long-Tail Tools */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Related Calculator Scenarios
            </h3>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {relatedPages.map((rel) => (
                <li key={rel.slug} className="py-2.5 first:pt-0 last:pb-0">
                  <Link
                    href={`/tools/${rel.slug}`}
                    className="flex items-center justify-between gap-2 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400"
                  >
                    <span>{rel.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Internal Links: Parent Hub & Guides */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Related Guides & Hubs
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href={`/calculators/${calc.slug}`}
                  className="text-emerald-700 dark:text-emerald-400 font-medium hover:underline"
                >
                  Open Full {calc.name} →
                </Link>
              </li>
              <li>
                <Link
                  href={`/${category.slug}`}
                  className="text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400"
                >
                  {category.name} Category Hub →
                </Link>
              </li>
              {relatedArticles.map((art) => (
                <li key={art.slug}>
                  <Link
                    href={`/blog/${art.slug}`}
                    className="text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400"
                  >
                    Guide: {art.title} →
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
