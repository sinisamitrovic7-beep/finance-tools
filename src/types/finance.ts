export type CalculatorId =
  | 'compound-interest'
  | 'fire'
  | 'retirement'
  | 'mortgage'
  | 'loan'
  | 'roi';

export type CategorySlug =
  | 'investing'
  | 'retirement'
  | 'fire'
  | 'mortgages'
  | 'loans'
  | 'business';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  shortName: string;
  headline: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  calculatorIds: CalculatorId[];
  featuredArticleSlugs: string[];
  affiliateGroup: AffiliateGroupKey;
  editorialIntro: string;
}

export type AffiliateGroupKey =
  | 'brokers'
  | 'savings'
  | 'mortgages'
  | 'retirement';

export interface AffiliatePartner {
  id: string;
  name: string;
  group: AffiliateGroupKey;
  highlightMetricLabel: string;
  highlightMetricValue: string;
  secondaryMetricLabel: string;
  secondaryMetricValue: string;
  bestFor: string;
  summary: string;
  ctaLabel: string;
  disclosure: string;
  url: string;
}

export interface CalculatorMeta {
  id: CalculatorId;
  slug: string;
  name: string;
  shortName: string;
  category: CategorySlug;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  affiliateGroup: AffiliateGroupKey;
  defaultInputs: Record<string, number | string>;
  faqs: FAQItem[];
  formulaSummary: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  category: CategorySlug;
  publishedAt: string;
  readTime: string;
  authorName: string;
  authorRole: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  imageUrl: string;
  imageAlt: string;
  relatedCalculatorId: CalculatorId;
  keyTakeaways: string[];
  sections: {
    heading: string;
    paragraphs: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
  }[];
  faqs: FAQItem[];
}

export interface SeoLandingPage {
  slug: string;
  keyword: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  calculatorId: CalculatorId;
  category: CategorySlug;
  presetInputs: Record<string, number | string>;
  focusAngle: string;
  scenarioContext: string;
  strategyPoints: string[];
  pitfalls: string[];
  faqs: FAQItem[];
  relatedSlugs: string[];
}
