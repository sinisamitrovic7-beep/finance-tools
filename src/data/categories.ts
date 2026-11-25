import type { CategoryInfo, CategorySlug } from '../types/finance';

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: 'investing',
    name: 'Investing & Wealth Building',
    shortName: 'Investing',
    headline: 'Compound growth modeling, brokerage comparisons, and portfolio math.',
    description:
      'Model exponential returns across monthly contributions, compounding cadences, and inflation drag to structure long-term wealth accumulation.',
    metaTitle: 'Investing Calculators & Wealth Tools | Finance.Tools',
    metaDescription:
      'Interactive investing and compound interest calculators with inflation modeling, brokerage fee comparisons, and wealth-building guides.',
    calculatorIds: ['compound-interest', 'roi'],
    featuredArticleSlugs: ['how-compound-interest-builds-wealth', 'best-roi-investments'],
    affiliateGroup: 'brokers',
    editorialIntro:
      'Long-term wealth rarely depends on timing short-term market swings. It depends on contribution consistency, minimizing expense ratios, and letting compounding run uninterrupted across market cycles.',
  },
  {
    slug: 'retirement',
    name: 'Retirement Planning',
    shortName: 'Retirement',
    headline: 'Project retirement nest eggs, inflation-adjusted income, and drawdown durability.',
    description:
      'Stress-test your 401(k), IRA, and taxable accounts against real inflation and post-retirement withdrawal schedules through age 90+.',
    metaTitle: 'Retirement Calculators & Savings Planning | Finance.Tools',
    metaDescription:
      'Plan your retirement nest egg, employer match impact, inflation-adjusted spending, and sustainable withdrawal rates with Finance.Tools.',
    calculatorIds: ['retirement', 'compound-interest'],
    featuredArticleSlugs: ['how-much-money-do-you-need-to-retire', 'how-compound-interest-builds-wealth'],
    affiliateGroup: 'retirement',
    editorialIntro:
      'Effective retirement math bridges two distinct phases: maximizing tax-advantaged accumulation while working, then managing sequence-of-returns risk and inflation once paychecks stop.',
  },
  {
    slug: 'fire',
    name: 'Financial Independence (FIRE)',
    shortName: 'FIRE',
    headline: 'Calculate your exact crossover point, Coast FIRE number, and early retirement age.',
    description:
      'Measure how savings rate, safe withdrawal rates, and portfolio growth determine when passive income permanently covers living expenses.',
    metaTitle: 'FIRE Calculators & Early Retirement Planning | Finance.Tools',
    metaDescription:
      'Calculate your FIRE number, Coast FIRE milestone, Lean vs Fat FIRE targets, and exact years to financial independence.',
    calculatorIds: ['fire', 'compound-interest'],
    featuredArticleSlugs: ['what-is-fire', 'how-much-money-do-you-need-to-retire'],
    affiliateGroup: 'savings',
    editorialIntro:
      'Financial Independence is governed primarily by your savings rate rather than income alone. Higher savings simultaneously grow your invested capital and reduce the annual expenses your portfolio must sustain.',
  },
  {
    slug: 'mortgages',
    name: 'Mortgages & Real Estate',
    shortName: 'Mortgages',
    headline: 'Break down PITI payments, PMI thresholds, and extra-payment amortization.',
    description:
      'Compare 15-year and 30-year fixed mortgages, quantify how extra principal payments shorten payoff timelines, and evaluate rental property ROI.',
    metaTitle: 'Mortgage Calculators & Home Loan Tools | Finance.Tools',
    metaDescription:
      'Calculate monthly mortgage payments with taxes, insurance, PMI, and extra principal payments. Compare top mortgage lenders.',
    calculatorIds: ['mortgage', 'roi'],
    featuredArticleSlugs: ['mortgage-vs-renting', 'best-roi-investments'],
    affiliateGroup: 'mortgages',
    editorialIntro:
      'Housing is typically the largest household capital commitment. Small adjustments to interest rate, down payment percentage, or monthly principal prepayments regularly shift lifetime borrowing costs by tens of thousands of dollars.',
  },
  {
    slug: 'loans',
    name: 'Loans & Debt Amortization',
    shortName: 'Loans',
    headline: 'Evaluate true APR, origination fees, and accelerated payoff schedules.',
    description:
      'Calculate exact monthly installments and total interest paid across auto loans, personal loans, student debt, and consolidation financing.',
    metaTitle: 'Loan Payment & Payoff Calculators | Finance.Tools',
    metaDescription:
      'Compute monthly loan payments, origination fee impact, and interest savings from extra monthly principal payments.',
    calculatorIds: ['loan', 'mortgage'],
    featuredArticleSlugs: ['mortgage-vs-renting', 'how-compound-interest-builds-wealth'],
    affiliateGroup: 'savings',
    editorialIntro:
      'Debt amortization concentrates interest charges heavily in early payment periods. Understanding exact principal-to-interest splits empowers smarter refinancing and accelerated payoff decisions.',
  },
  {
    slug: 'business',
    name: 'Business & Investment ROI',
    shortName: 'Business',
    headline: 'Measure annualized CAGR, cash-on-cash yields, and after-tax project returns.',
    description:
      'Standardize capital allocation decisions across real estate acquisitions, SaaS initiatives, marketing budgets, and equity investments.',
    metaTitle: 'Business & Real Estate ROI Calculators | Finance.Tools',
    metaDescription:
      'Calculate total ROI, annualized CAGR, cash-on-cash yield, and after-tax net profit for real estate and business investments.',
    calculatorIds: ['roi', 'loan'],
    featuredArticleSlugs: ['best-roi-investments', 'how-compound-interest-builds-wealth'],
    affiliateGroup: 'brokers',
    editorialIntro:
      'Raw return percentages mislead when holding periods differ. Annualizing returns into Compound Annual Growth Rate (CAGR) and factoring holding costs lets operators compare wildly different assets on equal footing.',
  },
];

export const CATEGORY_MAP: Record<CategorySlug, CategoryInfo> = CATEGORIES.reduce(
  (acc, item) => {
    acc[item.slug] = item;
    return acc;
  },
  {} as Record<CategorySlug, CategoryInfo>
);
