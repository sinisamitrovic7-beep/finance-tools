import React, { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { CALCULATORS } from '../data/calculatorsMeta';
import { CATEGORIES } from '../data/categories';
import { Link, useRouter } from '../lib/router';
import { resolveRouteSeo } from '../lib/seo';
import { AdSlot } from './AdSlot';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { pathname } = useRouter();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('ft-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync .dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('ft-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('ft-theme', 'light');
    }
  }, [darkMode]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Sync document head metadata & JSON-LD schemas on client route transitions
  useEffect(() => {
    const origin = window.location.origin;
    const seo = resolveRouteSeo(pathname, origin);
    document.title = seo.title;

    const setMeta = (selector: string, attrName: string, attrVal: string, content: string) => {
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', seo.description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', seo.ogType);
    setMeta('meta[property="og:url"]', 'property', 'og:url', `${origin}${seo.canonicalPath}`);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${origin}${seo.canonicalPath}`;

    // Replace managed JSON-LD scripts
    document.head
      .querySelectorAll('script[data-ft-schema="true"]')
      .forEach((node) => node.remove());

    for (const schema of seo.schemas) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-ft-schema', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [pathname]);

  const navItems = [
    { label: 'Calculators', href: '/calculators/compound-interest' },
    { label: 'Categories', href: '/investing' },
    { label: 'Guides', href: '/blog' },
    { label: 'All Tools', href: '/tools' },
    { label: 'Partners', href: '/partners' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Top Bar: strict 3-zone contract */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line brand wordmark */}
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0"
          >
            Finance<span className="text-emerald-600 dark:text-emerald-400">.Tools</span>
          </Link>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === '/blog' && pathname.startsWith('/blog')) ||
                (item.href === '/tools' && pathname.startsWith('/tools')) ||
                (item.href === '/calculators/compound-interest' &&
                  pathname.startsWith('/calculators')) ||
                (item.href === '/investing' &&
                  CATEGORIES.some((c) => pathname === `/${c.slug}`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                    isActive
                      ? 'border-emerald-600 text-slate-900 dark:text-slate-100 dark:border-emerald-400'
                      : 'border-transparent hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Theme toggle + 1 primary CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setDarkMode((d) => !d)}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors shrink-0"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              href="/calculators/compound-interest"
              className="hidden sm:inline-flex items-center justify-center rounded-lg bg-emerald-700 dark:bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 dark:hover:bg-emerald-500 transition-colors whitespace-nowrap shrink-0"
            >
              Start Calculating
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <p className="px-3 py-1 text-xs font-medium text-slate-400">Categories</p>
              <div className="grid grid-cols-2 gap-1">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    className="rounded-lg px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                  >
                    {c.shortName}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Reserved Header AdSense Banner */}
      <div className="no-print border-b border-slate-200/70 dark:border-slate-800/70 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <AdSlot variant="header" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Reserved Footer AdSense Banner */}
      <div className="no-print max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <AdSlot variant="footer" />
      </div>

      {/* Editorial Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <Link
                href="/"
                className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100"
              >
                Finance<span className="text-emerald-600 dark:text-emerald-400">.Tools</span>
              </Link>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Precision calculators, inflation-adjusted projections, and transparent personal finance guides built for everyday wealth decisions.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-wide text-slate-900 dark:text-slate-100 mb-3">
                Core Calculators
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {CALCULATORS.map((calc) => (
                  <li key={calc.id}>
                    <Link
                      href={`/calculators/${calc.slug}`}
                      className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                    >
                      {calc.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-wide text-slate-900 dark:text-slate-100 mb-3">
                Topic Categories
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                {CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/${cat.slug}`}
                      className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-wide text-slate-900 dark:text-slate-100 mb-3">
                Resources & SEO Directory
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/tools" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                    All 100 Specialized Tools
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                    Personal Finance Guides
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                    Compare Financial Partners
                  </Link>
                </li>
                <li>
                  <a href="/sitemap.xml" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                    XML Sitemap
                  </a>
                </li>
                <li>
                  <a href="/robots.txt" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                    Robots.txt
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <p>© {new Date().getFullYear()} Finance.Tools. Educational projections only—not personalized tax or investment advice.</p>
            <p>Supports Print Reports · Shareable Calculation URLs · Light & Dark Themes</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
