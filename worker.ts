import { buildRobotsTxt, buildSitemapXml } from './src/lib/sitemap';

interface WorkerEnv {
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
  SITE_URL?: string;
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);
    const baseUrl = env.SITE_URL || url.origin || 'https://finance-tools.sinisa-mitrovic7.workers.dev';

    // Special route for /sitemap.xml BEFORE serving HTML pages
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

    // Special route for /robots.txt BEFORE serving HTML pages
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

    // Serve static assets or SPA HTML fallback
    if (env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
      const indexUrl = new URL('/index.html', url.origin);
      return env.ASSETS.fetch(new Request(indexUrl.toString(), request));
    }

    return new Response('Not Found', { status: 404 });
  },
};
