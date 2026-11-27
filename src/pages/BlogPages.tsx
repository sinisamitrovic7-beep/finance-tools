import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import { AdSlot } from '../components/AdSlot';
import { AffiliateSection } from '../components/AffiliateSection';
import { FaqAccordion } from '../components/FaqAccordion';
import { ARTICLE_MAP, BLOG_ARTICLES } from '../data/blogArticles';
import { CALCULATOR_MAP } from '../data/calculatorsMeta';
import { CATEGORY_MAP } from '../data/categories';
import { Link } from '../lib/router';
import { resolveRouteSeo } from '../lib/seo';

export function BlogIndexPage() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://finance.tools';
  const seo = resolveRouteSeo('/blog', origin);
  const canonicalUrl = `${origin}${seo.canonicalPath}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        {seo.schemas.map((schema, idx) => (
          <script key={idx} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          Finance.Tools Editorial Research
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
          Personal Finance Guides & Wealth Math
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Data-backed guides on compounding, achieving FIRE, sizing retirement portfolios, comparing rent vs. buy math, and evaluating investment ROI.
        </p>
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
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 capitalize">
                  <span>{art.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{art.publishedAt}</span>
                  <span aria-hidden="true">·</span>
                  <span>{art.readTime}</span>
                </div>
                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 leading-snug">
                  {art.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                <span>{art.authorName}</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                  Read guide <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function BlogArticlePage({ slug }: { slug: string }) {
  const article = ARTICLE_MAP[slug];
  if (!article) return <BlogIndexPage />;

  const calc = CALCULATOR_MAP[article.relatedCalculatorId];
  const category = CATEGORY_MAP[article.category];
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://finance.tools';
  const seo = resolveRouteSeo(`/blog/${article.slug}`, origin);
  const canonicalUrl = `${origin}/blog/${article.slug}`;
  const ogImageUrl = `${origin}${article.imageUrl}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Helmet>
        <title>{article.metaTitle}</title>
        <meta name="description" content={article.metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.metaTitle} />
        <meta property="og:description" content={article.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="article:author" content={article.authorName} />
        <meta property="article:section" content={category.name} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.metaTitle} />
        <meta name="twitter:description" content={article.metaDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        {seo.schemas.map((schema, idx) => (
          <script key={idx} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-200">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/blog" className="hover:text-slate-900 dark:hover:text-slate-200">
          Guides
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 dark:text-slate-100 font-medium">{article.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <article className="lg:col-span-8 space-y-8">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 capitalize">
              <Link href={`/${category.slug}`} className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
                {category.name}
              </Link>
              <span aria-hidden="true">·</span>
              <span>{article.publishedAt}</span>
              <span aria-hidden="true">·</span>
              <span>{article.readTime}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight text-balance">
              {article.title}
            </h1>

            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              Written by <span className="font-semibold text-slate-800 dark:text-slate-200">{article.authorName}</span> · {article.authorRole}
            </div>
          </header>

          <div className="aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
            <img
              src={article.imageUrl}
              alt={article.imageAlt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Key Takeaways */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Key Takeaways
            </h2>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
              {article.keyTakeaways.map((point) => (
                <li key={point} className="leading-relaxed">{point}</li>
              ))}
            </ul>
          </div>

          {/* Article Body Sections */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 space-y-8">
            {article.sections.map((section, idx) => (
              <React.Fragment key={section.heading}>
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((p, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-base leading-[1.75] text-slate-700 dark:text-slate-300"
                    >
                      {p}
                    </p>
                  ))}

                  {section.table && (
                    <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                            {section.table.headers.map((h) => (
                              <th key={h} className="px-4 py-2.5 font-medium whitespace-nowrap">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {section.table.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`px-4 py-2.5 whitespace-nowrap ${
                                    cIdx === 0
                                      ? 'font-medium text-slate-900 dark:text-slate-100'
                                      : 'font-mono tabular-nums text-slate-700 dark:text-slate-300'
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
                {idx === 0 && <AdSlot variant="in-content" />}
              </React.Fragment>
            ))}
          </div>

          {/* Inline Calculator Callout */}
          <div className="rounded-xl border border-emerald-600/30 bg-emerald-50/70 dark:bg-emerald-950/30 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Run Your Personal Numbers in Our {calc.name}
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {calc.tagline}
              </p>
            </div>
            <Link
              href={`/calculators/${calc.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 dark:bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Launch Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <FaqAccordion items={article.faqs} />
          <AffiliateSection group={calc.affiliateGroup} />
        </article>

        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <AdSlot variant="sidebar" />
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              More Finance Guides
            </h3>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {BLOG_ARTICLES.filter((a) => a.slug !== article.slug).map((other) => (
                <li key={other.slug} className="py-2.5 first:pt-0 last:pb-0">
                  <Link
                    href={`/blog/${other.slug}`}
                    className="text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium"
                  >
                    {other.title}
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
