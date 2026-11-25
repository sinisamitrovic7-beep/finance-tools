import { BLOG_ARTICLES } from '../data/blogArticles.ts';
import { CALCULATORS } from '../data/calculatorsMeta.ts';
import { CATEGORIES } from '../data/categories.ts';
import { SEO_LANDING_PAGES } from '../data/seoLandingPages.ts';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export const CALCULATOR_ALIAS_PATHS: Record<string, string> = {
  '/compound-interest-calculator': 'compound-interest',
  '/fire-calculator': 'fire',
  '/retirement-calculator': 'retirement',
  '/mortgage-calculator': 'mortgage',
  '/loan-calculator': 'loan',
  '/roi-calculator': 'roi',
};

export function buildSitemapXml(baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  const urls: { loc: string; priority: string; changefreq: string }[] = [
    { loc: `${cleanBase}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${cleanBase}/tools`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${cleanBase}/blog`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${cleanBase}/partners`, priority: '0.7', changefreq: 'monthly' },
    ...Object.keys(CALCULATOR_ALIAS_PATHS).map((aliasPath) => ({
      loc: `${cleanBase}${aliasPath}`,
      priority: '0.95',
      changefreq: 'weekly',
    })),
    ...CATEGORIES.map((c) => ({
      loc: `${cleanBase}/${c.slug}`,
      priority: '0.9',
      changefreq: 'weekly',
    })),
    ...CALCULATORS.map((c) => ({
      loc: `${cleanBase}/calculators/${c.slug}`,
      priority: '0.95',
      changefreq: 'weekly',
    })),
    ...BLOG_ARTICLES.map((a) => ({
      loc: `${cleanBase}/blog/${a.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
    })),
    ...SEO_LANDING_PAGES.map((p) => ({
      loc: `${cleanBase}/tools/${p.slug}`,
      priority: '0.85',
      changefreq: 'monthly',
    })),
  ];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (u) =>
        `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    ),
    '</urlset>',
  ].join('\n');
}

export function buildRobotsTxt(baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${cleanBase}/sitemap.xml`].join('\n');
}
