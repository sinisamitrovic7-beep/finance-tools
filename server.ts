import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BLOG_ARTICLES } from './src/data/blogArticles.ts';
import { CALCULATORS } from './src/data/calculatorsMeta.ts';
import { CATEGORIES } from './src/data/categories.ts';
import { SEO_LANDING_PAGES } from './src/data/seoLandingPages.ts';
import { resolveRouteSeo } from './src/lib/seo.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getBaseUrl(req: express.Request): string {
  if (process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL') {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
  return `${proto}://${host}`;
}

function injectSeoIntoHtml(html: string, reqPath: string, baseUrl: string): string {
  const seo = resolveRouteSeo(reqPath, baseUrl);
  const canonicalUrl = `${baseUrl}${seo.canonicalPath}`;
  const safeTitle = escapeAttr(seo.title);
  const safeDesc = escapeAttr(seo.description);

  let out = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${safeDesc}" />`
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${safeTitle}" />`
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${safeDesc}" />`
    )
    .replace(
      /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:type" content="${seo.ogType}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${safeTitle}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${safeDesc}" />`
    );

  const headExtras = [
    `<link rel="canonical" href="${escapeAttr(canonicalUrl)}" />`,
    `<meta property="og:url" content="${escapeAttr(canonicalUrl)}" />`,
    ...seo.schemas.map(
      (schema) =>
        `<script type="application/ld+json" data-ft-schema="true">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`
    ),
  ].join('\n    ');

  return out.replace('<!--SSR_HEAD_PLACEHOLDER-->', headExtras);
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT || 3000);
  const isProd = process.env.NODE_ENV === 'production';

  // Robots.txt
  app.get('/robots.txt', (req, res) => {
    const baseUrl = getBaseUrl(req);
    res.type('text/plain').send(
      [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${baseUrl}/sitemap.xml`,
      ].join('\n')
    );
  });

  // Dynamic XML Sitemap covering core pages, categories, calculators, blog articles, and all 100 SEO landing pages
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = getBaseUrl(req);
    const today = new Date().toISOString().split('T')[0];

    const urls: { loc: string; priority: string; changefreq: string }[] = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
      { loc: `${baseUrl}/tools`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${baseUrl}/blog`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/partners`, priority: '0.7', changefreq: 'monthly' },
      ...CATEGORIES.map((c) => ({
        loc: `${baseUrl}/${c.slug}`,
        priority: '0.9',
        changefreq: 'weekly',
      })),
      ...CALCULATORS.map((c) => ({
        loc: `${baseUrl}/calculators/${c.slug}`,
        priority: '0.95',
        changefreq: 'weekly',
      })),
      ...BLOG_ARTICLES.map((a) => ({
        loc: `${baseUrl}/blog/${a.slug}`,
        priority: '0.8',
        changefreq: 'monthly',
      })),
      ...SEO_LANDING_PAGES.map((p) => ({
        loc: `${baseUrl}/tools/${p.slug}`,
        priority: '0.85',
        changefreq: 'monthly',
      })),
    ];

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls.map(
        (u) =>
          `  <url><loc>${escapeAttr(u.loc)}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
      ),
      '</urlset>',
    ].join('\n');

    res.type('application/xml').send(xml);
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const templatePath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const reqPath = req.originalUrl.split('?')[0] || '/';
        const finalHtml = injectSeoIntoHtml(template, reqPath, getBaseUrl(req));
        res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath, { index: false }));

    app.use('*', (req, res) => {
      const templatePath = path.join(distPath, 'index.html');
      const template = fs.readFileSync(templatePath, 'utf-8');
      const reqPath = req.originalUrl.split('?')[0] || '/';
      const finalHtml = injectSeoIntoHtml(template, reqPath, getBaseUrl(req));
      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Finance.Tools server running on http://0.0.0.0:${port}`);
  });
}

startServer();
