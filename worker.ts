import { injectSeoIntoHtml } from './src/lib/seoInject';
import { buildRobotsTxt, buildSitemapXml } from './src/lib/sitemap';

interface WorkerEnv {
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
  SITE_URL?: string;
}

const STATIC_ASSET_EXTENSIONS = [
  '.js',
  '.mjs',
  '.css',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.avif',
  '.svg',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.json',
  '.map',
  '.webmanifest',
];

function isStaticAssetRequest(pathname: string): boolean {
  if (pathname.startsWith('/assets/') || pathname.startsWith('/src/assets/')) {
    return true;
  }
  const lower = pathname.toLowerCase();
  return STATIC_ASSET_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);
    const baseUrl = (
      env.SITE_URL ||
      url.origin ||
      'https://finance-tools.sinisa-mitrovic7.workers.dev'
    ).replace(/\/+$/, '');

    // 1. Dynamic XML Sitemap
    if (url.pathname === '/sitemap.xml') {
      const sitemap = buildSitemapXml(baseUrl);
      return new Response(sitemap, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // 2. Dynamic Robots.txt
    if (url.pathname === '/robots.txt') {
      const robots = buildRobotsTxt(baseUrl);
      return new Response(robots, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    if (!env.ASSETS) {
      return new Response('ASSETS binding is not configured.', { status: 500 });
    }

    // 3. Static assets (JS, CSS, images, fonts, etc.) pass straight through
    if (isStaticAssetRequest(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    // 4. HTML page requests: read dist/index.html and inject per-route SEO metadata
    const indexRequest = new Request(new URL('/index.html', url.origin).toString(), {
      method: 'GET',
    });
    const indexResponse = await env.ASSETS.fetch(indexRequest);
    if (!indexResponse.ok) {
      return indexResponse;
    }

    const templateHtml = await indexResponse.text();
    const modifiedHtml = injectSeoIntoHtml(templateHtml, url.pathname, baseUrl);

    return new Response(modifiedHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });
  },
};
