import { resolveRouteSeo } from './seo';

export function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function injectSeoIntoHtml(
  html: string,
  reqPath: string,
  baseUrl: string
): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const seo = resolveRouteSeo(reqPath, cleanBase);
  const canonicalUrl = `${cleanBase}${seo.canonicalPath}`;
  const safeTitle = escapeHtmlAttr(seo.title);
  const safeDesc = escapeHtmlAttr(seo.description);

  let out = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?content="[^"]*"[\s\S]*?\/?>/i,
      `<meta name="description" content="${safeDesc}" />`
    )
    .replace(
      /<meta\s+property="og:title"[\s\S]*?content="[^"]*"[\s\S]*?\/?>/i,
      `<meta property="og:title" content="${safeTitle}" />`
    )
    .replace(
      /<meta\s+property="og:description"[\s\S]*?content="[^"]*"[\s\S]*?\/?>/i,
      `<meta property="og:description" content="${safeDesc}" />`
    )
    .replace(
      /<meta\s+property="og:type"[\s\S]*?content="[^"]*"[\s\S]*?\/?>/i,
      `<meta property="og:type" content="${seo.ogType}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"[\s\S]*?content="[^"]*"[\s\S]*?\/?>/i,
      `<meta name="twitter:title" content="${safeTitle}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"[\s\S]*?content="[^"]*"[\s\S]*?\/?>/i,
      `<meta name="twitter:description" content="${safeDesc}" />`
    );

  const extraTags: string[] = [
    `<link rel="canonical" href="${escapeHtmlAttr(canonicalUrl)}" />`,
    `<meta property="og:url" content="${escapeHtmlAttr(canonicalUrl)}" />`,
  ];

  if (seo.imageUrl) {
    const safeImage = escapeHtmlAttr(seo.imageUrl);
    extraTags.push(`<meta property="og:image" content="${safeImage}" />`);
    extraTags.push(`<meta name="twitter:image" content="${safeImage}" />`);
  }

  if (seo.authorName) {
    extraTags.push(
      `<meta property="article:author" content="${escapeHtmlAttr(seo.authorName)}" />`
    );
  }

  if (seo.section) {
    extraTags.push(
      `<meta property="article:section" content="${escapeHtmlAttr(seo.section)}" />`
    );
  }

  for (const schema of seo.schemas) {
    extraTags.push(
      `<script type="application/ld+json" data-ft-schema="true">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`
    );
  }

  const headExtras = extraTags.join('\n    ');

  if (out.includes('<!--SSR_HEAD_PLACEHOLDER-->')) {
    out = out.replace('<!--SSR_HEAD_PLACEHOLDER-->', headExtras);
  } else {
    out = out.replace(/<\/head>/i, `    ${headExtras}\n  </head>`);
  }

  return out;
}
