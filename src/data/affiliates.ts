import type { AffiliateGroupKey, AffiliatePartner } from '../types/finance';

export const AFFILIATE_GROUP_TITLES: Record<
  AffiliateGroupKey,
  { title: string; subtitle: string; disclosure: string }
> = {
  brokers: {
    title: 'Compare Top Investment Brokers',
    subtitle: 'Low-cost index funds, commission-free ETFs, and automated dividend reinvestment.',
    disclosure:
      'Partner Disclosure: Finance.Tools may receive compensation when you open an account through partner links. Editorial rankings remain independent.',
  },
  savings: {
    title: 'High-Yield Savings & Cash Management',
    subtitle: 'Keep your emergency fund and near-term down payment earning competitive APY.',
    disclosure:
      'Partner Disclosure: Rates shown reflect illustrative market benchmarks; verify current APY and FDIC terms directly with each institution.',
  },
  mortgages: {
    title: 'Compare Mortgage Lenders & Rates',
    subtitle: 'Pre-qualify in minutes to benchmark APR, origination fees, and rate lock options.',
    disclosure:
      'Partner Disclosure: Mortgage rates vary by credit score, LTV, and location. Finance.Tools may earn referral fees from featured lenders.',
  },
  retirement: {
    title: 'Recommended IRA & Retirement Platforms',
    subtitle: 'Tax-advantaged Traditional, Roth, and Rollover IRAs with automated rebalancing.',
    disclosure:
      'Partner Disclosure: Investing involves risk. Compare advisory fees and fund expense ratios before transferring retirement assets.',
  },
};

export const AFFILIATE_PARTNERS: AffiliatePartner[] = [
  // Brokers
  {
    id: 'fidelity-brokerage',
    name: 'Fidelity Brokerage',
    group: 'brokers',
    highlightMetricLabel: 'Stock & ETF Fees',
    highlightMetricValue: '$0',
    secondaryMetricLabel: 'Account Minimum',
    secondaryMetricValue: '$0',
    bestFor: 'Zero-fee index funds & all-in-one investing',
    summary:
      'Access zero-expense-ratio index mutual funds, fractional shares, and automated recurring ETF purchases.',
    ctaLabel: 'Explore Fidelity',
    disclosure: 'SIPC insured · $0 online equity trades',
    url: '#partner-fidelity',
  },
  {
    id: 'vanguard-personal',
    name: 'Vanguard',
    group: 'brokers',
    highlightMetricLabel: 'Avg ETF Expense',
    highlightMetricValue: '0.07%',
    secondaryMetricLabel: 'Account Minimum',
    secondaryMetricValue: '$0 (ETFs)',
    bestFor: 'Long-term buy-and-hold index investors',
    summary:
      'Client-owned structure built around ultra-low-cost ETFs and target-date index portfolios.',
    ctaLabel: 'View Vanguard ETFs',
    disclosure: 'Low-cost index leader · SIPC member',
    url: '#partner-vanguard',
  },
  {
    id: 'schwab-one',
    name: 'Charles Schwab',
    group: 'brokers',
    highlightMetricLabel: 'Stock & ETF Fees',
    highlightMetricValue: '$0',
    secondaryMetricLabel: '24/7 Support',
    secondaryMetricValue: 'Included',
    bestFor: 'Research tools & integrated checking',
    summary:
      'Strong fixed-income screener, no-fee ATM checking integration, and robust portfolio analytics.',
    ctaLabel: 'Compare Schwab',
    disclosure: 'SIPC insured · $0 online equity trades',
    url: '#partner-schwab',
  },

  // Savings
  {
    id: 'wealthfront-cash',
    name: 'Wealthfront Cash',
    group: 'savings',
    highlightMetricLabel: 'Target APY',
    highlightMetricValue: '4.25%',
    secondaryMetricLabel: 'FDIC Coverage',
    secondaryMetricValue: 'Up to $8M',
    bestFor: 'High-yield emergency & FIRE cash buffers',
    summary:
      'Automated savings buckets, zero account fees, and fast transfers to investment accounts.',
    ctaLabel: 'Check Cash Rate',
    disclosure: 'FDIC sweep via partner banks · $1 minimum',
    url: '#partner-wealthfront',
  },
  {
    id: 'ally-savings',
    name: 'Ally Online Savings',
    group: 'savings',
    highlightMetricLabel: 'Target APY',
    highlightMetricValue: '4.00%',
    secondaryMetricLabel: 'Monthly Fees',
    secondaryMetricValue: '$0',
    bestFor: 'Goal-based savings buckets',
    summary:
      'Organize emergency cash, property tax reserves, and down payment funds in separate smart buckets.',
    ctaLabel: 'View Ally Account',
    disclosure: 'Member FDIC · No minimum balance',
    url: '#partner-ally',
  },
  {
    id: 'sofi-checking-savings',
    name: 'SoFi Checking & Savings',
    group: 'savings',
    highlightMetricLabel: 'Target APY',
    highlightMetricValue: '4.10%',
    secondaryMetricLabel: 'Overdraft Fees',
    secondaryMetricValue: '$0',
    bestFor: 'Direct-deposit rate optimization',
    summary:
      'Combines competitive savings APY with early paycheck direct deposit and automated vaults.',
    ctaLabel: 'Explore SoFi',
    disclosure: 'Member FDIC · Direct deposit terms apply',
    url: '#partner-sofi',
  },

  // Mortgages
  {
    id: 'better-mortgage',
    name: 'Better Mortgage',
    group: 'mortgages',
    highlightMetricLabel: 'Lender Fees',
    highlightMetricValue: '$0 Origination',
    secondaryMetricLabel: 'Pre-Approval',
    secondaryMetricValue: 'Under 3 min',
    bestFor: 'Transparent digital rate comparison',
    summary:
      'Compare real-time 15-year and 30-year rate sheets without hard credit pulls or commission sales.',
    ctaLabel: 'Check Rates',
    disclosure: 'NMLS #330511 · Equal Housing Lender',
    url: '#partner-better',
  },
  {
    id: 'rocket-mortgage',
    name: 'Rocket Mortgage',
    group: 'mortgages',
    highlightMetricLabel: 'Loan Options',
    highlightMetricValue: 'Conv / FHA / VA',
    secondaryMetricLabel: 'Custom Terms',
    secondaryMetricValue: '8–30 Years',
    bestFor: 'Custom term flexibility & servicing',
    summary:
      'Pick your exact payoff term instead of resetting to 30 years when refinancing an existing balance.',
    ctaLabel: 'View Loan Options',
    disclosure: 'NMLS #3030 · Equal Housing Lender',
    url: '#partner-rocket',
  },
  {
    id: 'chase-home',
    name: 'Chase Home Lending',
    group: 'mortgages',
    highlightMetricLabel: 'Closing Guarantee',
    highlightMetricValue: 'On-Time Credit',
    secondaryMetricLabel: 'Relationship Discount',
    secondaryMetricValue: 'Up to 0.50%',
    bestFor: 'Existing banking clients & jumbo loans',
    summary:
      'Rate discounts for qualifying asset balances and specialized jumbo mortgage underwriting.',
    ctaLabel: 'Explore Chase',
    disclosure: 'Equal Housing Lender · Terms apply',
    url: '#partner-chase',
  },

  // Retirement
  {
    id: 'fidelity-ira',
    name: 'Fidelity Roth & Traditional IRA',
    group: 'retirement',
    highlightMetricLabel: 'Account Fee',
    highlightMetricValue: '$0/year',
    secondaryMetricLabel: 'Zero-Fee Index Funds',
    secondaryMetricValue: '4 Core Funds',
    bestFor: 'DIY retirement tax optimization',
    summary:
      'Open a Traditional, Roth, or Rollover IRA with zero custodial fees and full target-date index access.',
    ctaLabel: 'Open IRA Guide',
    disclosure: 'SIPC insured · Tax rules depend on eligibility',
    url: '#partner-fidelity-ira',
  },
  {
    id: 'betterment-ira',
    name: 'Betterment Automated IRA',
    group: 'retirement',
    highlightMetricLabel: 'Advisory Fee',
    highlightMetricValue: '0.25%/yr',
    secondaryMetricLabel: 'Rebalancing',
    secondaryMetricValue: 'Automated',
    bestFor: 'Hands-off glide-path rebalancing',
    summary:
      'Automatically adjusts stock-to-bond allocation as your target retirement date approaches.',
    ctaLabel: 'Explore Betterment',
    disclosure: 'SEC Registered Advisor · SIPC insured',
    url: '#partner-betterment',
  },
  {
    id: 'empower-retirement',
    name: 'Empower Wealth Planning',
    group: 'retirement',
    highlightMetricLabel: 'Portfolio Tracker',
    highlightMetricValue: 'Free Dashboard',
    secondaryMetricLabel: 'Fee Analyzer',
    secondaryMetricValue: 'Included',
    bestFor: '401(k) fee auditing & retirement checkups',
    summary:
      'Link external 401(k) and IRA accounts to audit hidden mutual fund expense ratios and Monte Carlo odds.',
    ctaLabel: 'Audit 401(k) Fees',
    disclosure: 'Advisory tiers optional · Free tools available',
    url: '#partner-empower',
  },
];
