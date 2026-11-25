import { ARTICLE_MAP } from '../data/blogArticles';
import { CALCULATOR_MAP } from '../data/calculatorsMeta';
import { CATEGORY_MAP } from '../data/categories';
import { SEO_PAGE_MAP } from '../data/seoLandingPages';
import type { CategorySlug, FAQItem } from '../types/finance';

export interface RouteSeoMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  ogType: 'website' | 'article';
  schemas: Record<string, unknown>[];
}

export const HOME_FAQS: FAQItem[] = [
  {
    question: 'Are all calculators on Finance.Tools free to use?',
    answer:
      'Yes. Every interactive financial calculator, amortization schedule, chart projection, and print report on Finance.Tools is completely free with no account wall.',
  },
  {
    question: 'How accurate are the FIRE, mortgage, and compound interest formulas?',
    answer:
      'All models use institutional compounding, amortization, and real inflation-adjusted formulas. Calculations run instantaneously in your browser and update with every slider or input change.',
  },
  {
    question: 'Can I save or share my customized calculator projection?',
    answer:
      'Yes. Click the Share Results button inside any calculator to copy a unique URL encoding your exact numbers, or click Print Results for a clean ad-free report.',
  },
  {
    question: 'How does Finance.Tools make money?',
    answer:
      'Finance.Tools is supported by clearly labeled AdSense display placements and affiliate partnerships with vetted financial institutions when users choose to open an account.',
  },
];

function buildBreadcrumbSchema(baseUrl: string, crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: c.name,
      item: `${baseUrl}${c.path}`,
    })),
  };
}

function buildFaqSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

function buildWebAppSchema(baseUrl: string, name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url: `${baseUrl}${path}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function resolveRouteSeo(pathname: string, baseUrl = 'https://finance.tools'): RouteSeoMetadata {
  const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  // Category pages
  const catSlug = cleanPath.slice(1) as CategorySlug;
  if (CATEGORY_MAP[catSlug]) {
    const cat = CATEGORY_MAP[catSlug];
    return {
      title: cat.metaTitle,
      description: cat.metaDescription,
      canonicalPath: `/${cat.slug}`,
      ogType: 'website',
      schemas: [
        buildBreadcrumbSchema(baseUrl, [
          { name: 'Home', path: '/' },
          { name: cat.shortName, path: `/${cat.slug}` },
        ]),
        buildWebAppSchema(baseUrl, `Finance.Tools ${cat.name}`, cat.metaDescription, `/${cat.slug}`),
      ],
    };
  }

  // Core Calculators: /calculators/:slug
  if (cleanPath.startsWith('/calculators/')) {
    const slug = cleanPath.replace('/calculators/', '');
    const calc = Object.values(CALCULATOR_MAP).find((c) => c.slug === slug);
    if (calc) {
      const cat = CATEGORY_MAP[calc.category];
      return {
        title: calc.metaTitle,
        description: calc.metaDescription,
        canonicalPath: `/calculators/${calc.slug}`,
        ogType: 'website',
        schemas: [
          buildWebAppSchema(baseUrl, calc.name, calc.metaDescription, `/calculators/${calc.slug}`),
          buildBreadcrumbSchema(baseUrl, [
            { name: 'Home', path: '/' },
            { name: cat.shortName, path: `/${cat.slug}` },
            { name: calc.name, path: `/calculators/${calc.slug}` },
          ]),
          buildFaqSchema(calc.faqs),
        ],
      };
    }
  }

  // 100 Long-Tail SEO Landing Pages: /tools/:slug
  if (cleanPath.startsWith('/tools/')) {
    const slug = cleanPath.replace('/tools/', '');
    const page = SEO_PAGE_MAP[slug];
    if (page) {
      const cat = CATEGORY_MAP[page.category];
      const calc = CALCULATOR_MAP[page.calculatorId];
      return {
        title: page.metaTitle,
        description: page.metaDescription,
        canonicalPath: `/tools/${page.slug}`,
        ogType: 'website',
        schemas: [
          buildWebAppSchema(baseUrl, page.title, page.metaDescription, `/tools/${page.slug}`),
          buildBreadcrumbSchema(baseUrl, [
            { name: 'Home', path: '/' },
            { name: cat.shortName, path: `/${cat.slug}` },
            { name: calc.shortName, path: `/calculators/${calc.slug}` },
            { name: page.title, path: `/tools/${page.slug}` },
          ]),
          buildFaqSchema(page.faqs),
        ],
      };
    }
  }

  // All 100 Tools Directory
  if (cleanPath === '/tools') {
    return {
      title: 'All 100 Financial Calculators & Scenarios | Finance.Tools',
      description:
        'Browse 100 specialized calculators for compound interest, FIRE by age, inflation-adjusted retirement, mortgages, loans, and ROI.',
      canonicalPath: '/tools',
      ogType: 'website',
      schemas: [
        buildBreadcrumbSchema(baseUrl, [
          { name: 'Home', path: '/' },
          { name: 'All Tools', path: '/tools' },
        ]),
      ],
    };
  }

  // Blog index
  if (cleanPath === '/blog') {
    return {
      title: 'Personal Finance Guides & Wealth Research | Finance.Tools',
      description:
        'Read in-depth guides on compound interest, the FIRE movement, retirement readiness, renting vs buying a home, and high-ROI assets.',
      canonicalPath: '/blog',
      ogType: 'website',
      schemas: [
        buildBreadcrumbSchema(baseUrl, [
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/blog' },
        ]),
      ],
    };
  }

  // Blog article detail
  if (cleanPath.startsWith('/blog/')) {
    const slug = cleanPath.replace('/blog/', '');
    const art = ARTICLE_MAP[slug];
    if (art) {
      const cat = CATEGORY_MAP[art.category];
      return {
        title: art.metaTitle,
        description: art.metaDescription,
        canonicalPath: `/blog/${art.slug}`,
        ogType: 'article',
        schemas: [
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: art.title,
            description: art.metaDescription,
            author: { '@type': 'Person', name: art.authorName },
            publisher: { '@type': 'Organization', name: 'Finance.Tools' },
            mainEntityOfPage: `${baseUrl}/blog/${art.slug}`,
          },
          buildBreadcrumbSchema(baseUrl, [
            { name: 'Home', path: '/' },
            { name: cat.shortName, path: `/${cat.slug}` },
            { name: art.title, path: `/blog/${art.slug}` },
          ]),
          buildFaqSchema(art.faqs),
        ],
      };
    }
  }

  // Partners / Affiliate Directory
  if (cleanPath === '/partners') {
    return {
      title: 'Compare Brokers, High-Yield Savings & Mortgage Lenders | Finance.Tools',
      description:
        'Independent comparison of top investment brokers, high-yield savings accounts, mortgage providers, and IRA platforms.',
      canonicalPath: '/partners',
      ogType: 'website',
      schemas: [
        buildBreadcrumbSchema(baseUrl, [
          { name: 'Home', path: '/' },
          { name: 'Partners', path: '/partners' },
        ]),
      ],
    };
  }

  // Homepage fallback
  return {
    title: 'Finance.Tools – Financial Calculators & Wealth Planning',
    description:
      'Calculate compound interest, FIRE timelines, retirement savings, mortgage payments, loans, and investment ROI with interactive charts and guides.',
    canonicalPath: '/',
    ogType: 'website',
    schemas: [
      buildWebAppSchema(
        baseUrl,
        'Finance.Tools',
        'Precision financial calculator suite for compound interest, FIRE, retirement, mortgages, loans, and ROI.',
        '/'
      ),
      buildBreadcrumbSchema(baseUrl, [{ name: 'Home', path: '/' }]),
      buildFaqSchema(HOME_FAQS),
    ],
  };
}
