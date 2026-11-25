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

export function buildSitemapXml(baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const today = new Date().toISOString().slice(0, 10);

  const urls: { loc: string; priority: string; changefreq: string }[] = [
    {
      loc: `${cleanBase}/`,
      priority: '1.0',
      changefreq: 'weekly',
    },
    {
      loc: `${cleanBase}/tools`,
      priority: '0.9',
      changefreq: 'weekly',
    },
    {
      loc: `${cleanBase}/blog`,
      priority: '0.8',
      changefreq: 'weekly',
    },
    {
      loc: `${cleanBase}/partners`,
      priority: '0.7',
      changefreq: 'monthly',
    },

    ...CATEGORIES.map((category) => ({
      loc: `${cleanBase}/${category.slug}`,
      priority: '0.9',
      changefreq: 'weekly',
    })),

    ...CALCULATORS.map((calculator) => ({
      loc: `${cleanBase}/calculators/${calculator.slug}`,
      priority: '0.95',
      changefreq: 'weekly',
    })),

    ...BLOG_ARTICLES.map((article) => ({
      loc: `${cleanBase}/blog/${article.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
    })),

    ...SEO_LANDING_PAGES.map((page) => ({
      loc: `${cleanBase}/tools/${page.slug}`,
      priority: '0.85',
      changefreq: 'monthly',
    })),
  ];

  const uniqueUrls = Array.from(
    new Map(urls.map((url) => [url.loc, url])).values()
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...uniqueUrls.map(
      (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    ),
    '</urlset>',
  ].join('\n');
}

export function buildRobotsTxt(baseUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');

  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${cleanBase}/sitemap.xml`,
  ].join('\n');
}
