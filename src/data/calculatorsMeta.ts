import type { CalculatorId, CalculatorMeta } from '../types/finance';

export const CALCULATORS: CalculatorMeta[] = [
  {
    id: 'compound-interest',
    slug: 'compound-interest',
    name: 'Compound Interest Calculator',
    shortName: 'Compound Interest',
    category: 'investing',
    tagline: 'Project investment growth across recurring deposits, compounding frequency, and inflation.',
    metaTitle: 'Compound Interest Calculator – Growth & Inflation | Finance.Tools',
    metaDescription:
      'Calculate compound interest with monthly contributions, daily/monthly/annual compounding, and inflation-adjusted real returns.',
    affiliateGroup: 'brokers',
    defaultInputs: {
      principal: 10000,
      monthlyContribution: 500,
      annualRate: 8.0,
      years: 20,
      compoundingFrequency: 'monthly',
      inflationRate: 2.5,
    },
    formulaSummary: 'A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) − 1) / (r/n)]',
    faqs: [
      {
        question: 'How does compounding frequency affect long-term investment returns?',
        answer:
          'More frequent compounding (daily or monthly versus annually) applies interest to earned returns sooner, slightly raising the Effective Annual Yield (APY). On an 8% nominal rate, monthly compounding yields 8.30% APY compared to 8.00% for annual compounding.',
      },
      {
        question: 'Should I adjust my compound interest projections for inflation?',
        answer:
          'Yes. Nominal balances show future dollar totals, while inflation-adjusted (real) balances show actual future purchasing power. Modeling 2.5% to 3.0% annual inflation gives a realistic estimate of what your portfolio can buy.',
      },
      {
        question: 'What is a realistic annual return assumption for index investing?',
        answer:
          'Broad U.S. equity indexes have historically averaged roughly 9% to 10% nominal returns over multi-decade horizons, or roughly 6.5% to 7.5% after inflation. Conservative balanced portfolios often model 5% to 7%.',
      },
    ],
  },
  {
    id: 'fire',
    slug: 'fire',
    name: 'FIRE Calculator',
    shortName: 'FIRE Calculator',
    category: 'fire',
    tagline: 'Find your Financial Independence number, Coast FIRE threshold, and target retirement age.',
    metaTitle: 'FIRE Calculator – Financial Independence & Retire Early | Finance.Tools',
    metaDescription:
      'Calculate your exact FIRE number, Lean and Fat FIRE milestones, Coast FIRE target, and years to financial independence.',
    affiliateGroup: 'savings',
    defaultInputs: {
      currentAge: 30,
      currentPortfolio: 75000,
      monthlySavings: 2500,
      annualExpenses: 55000,
      annualReturn: 7.5,
      inflationRate: 2.5,
      withdrawalRate: 4.0,
    },
    formulaSummary: 'FIRE Number = Annual Living Expenses ÷ Safe Withdrawal Rate (e.g., 25 × Expenses at 4%)',
    faqs: [
      {
        question: 'What is the 4% Rule in FIRE planning?',
        answer:
          'Derived from the Trinity Study, the 4% Rule suggests that withdrawing 4% of your starting portfolio in year one—and adjusting that dollar amount for inflation annually—historically sustained a balanced stock/bond portfolio for at least 30 years.',
      },
      {
        question: 'What is Coast FIRE vs. Full FIRE?',
        answer:
          'Full FIRE means your portfolio already covers 100% of annual expenses today. Coast FIRE means you have invested enough early on that compound growth alone will reach your Full FIRE target by traditional retirement age (such as 65) without adding another dollar.',
      },
      {
        question: 'Should early retirees use a 3.5% withdrawal rate instead of 4%?',
        answer:
          'Retiring at age 35 or 40 requires a 45-to-55 year portfolio horizon rather than 30 years. Many early retirees model a 3.25% to 3.75% safe withdrawal rate or keep flexible discretionary spending buffers.',
      },
    ],
  },
  {
    id: 'retirement',
    slug: 'retirement',
    name: 'Retirement Calculator',
    shortName: 'Retirement',
    category: 'retirement',
    tagline: 'Simulate accumulation with employer matching and inflation-adjusted retirement drawdowns.',
    metaTitle: 'Retirement Calculator – 401(k), IRA & Drawdown | Finance.Tools',
    metaDescription:
      'Forecast your retirement nest egg, employer match impact, and sustainable monthly income through age 90 with inflation modeling.',
    affiliateGroup: 'retirement',
    defaultInputs: {
      currentAge: 35,
      retirementAge: 65,
      lifeExpectancy: 90,
      currentSavings: 95000,
      monthlyContribution: 1100,
      employerMatchMonthly: 300,
      preRetirementReturn: 7.5,
      postRetirementReturn: 5.0,
      inflationRate: 2.5,
      desiredAnnualIncome: 75000,
    },
    formulaSummary: 'Real Sustainable Income = (Real Nest Egg × r_real) ÷ (1 − (1 + r_real)^(−N_retire))',
    faqs: [
      {
        question: 'Why does the calculator use different returns before and after retirement?',
        answer:
          'During accumulation, portfolios typically hold higher equity allocations for growth. Near and during retirement, shifting toward bonds and cash reduces sequence-of-returns risk, resulting in a slightly lower expected return with lower volatility.',
      },
      {
        question: 'How much does an employer 401(k) match change retirement outcomes?',
        answer:
          'An employer match provides an immediate 100% return on matched dollars. Adding even $300/month in employer contributions at 7.5% over 30 years adds over $400,000 to a retirement balance.',
      },
      {
        question: 'What income replacement ratio should I target?',
        answer:
          'Most planners target 70% to 85% of pre-retirement gross income because payroll taxes, retirement savings deductions, and often mortgage payments disappear in retirement.',
      },
    ],
  },
  {
    id: 'mortgage',
    slug: 'mortgage',
    name: 'Mortgage Calculator',
    shortName: 'Mortgage',
    category: 'mortgages',
    tagline: 'Compute full monthly PITI payments, PMI, and interest saved from extra principal.',
    metaTitle: 'Mortgage Calculator – PITI, PMI & Extra Payments | Finance.Tools',
    metaDescription:
      'Calculate monthly mortgage payments including principal, interest, property taxes, insurance, PMI, and extra principal payment savings.',
    affiliateGroup: 'mortgages',
    defaultInputs: {
      homePrice: 450000,
      downPaymentPercent: 20,
      loanTermYears: 30,
      interestRate: 6.5,
      propertyTaxAnnual: 5400,
      homeInsuranceAnnual: 1800,
      hoaMonthly: 0,
      extraMonthlyPayment: 200,
    },
    formulaSummary: 'M = P × [r(1 + r)^n] ÷ [(1 + r)^n − 1], plus Escrow (Tax + Insurance + PMI + HOA)',
    faqs: [
      {
        question: 'How does making extra monthly principal payments affect a 30-year mortgage?',
        answer:
          'Every extra dollar applied directly to principal permanently removes that balance from future interest compounding. Adding $200/month on a $360,000 loan at 6.5% typically cuts over 5 years off the loan and saves tens of thousands in interest.',
      },
      {
        question: 'When do I have to pay Private Mortgage Insurance (PMI)?',
        answer:
          'Conventional loans generally require PMI whenever your down payment is below 20% of the home purchase price. Once your loan-to-value ratio reaches 78%–80% through payments or appreciation, you can typically request PMI removal.',
      },
      {
        question: 'What is included in PITI?',
        answer:
          'PITI stands for Principal, Interest, Taxes (property tax), and Insurance (homeowners hazard insurance). Lenders evaluate total PITI plus HOA dues when calculating debt-to-income underwriting limits.',
      },
    ],
  },
  {
    id: 'loan',
    slug: 'loan',
    name: 'Loan Calculator',
    shortName: 'Loan',
    category: 'loans',
    tagline: 'Analyze monthly payments, origination fees, and payoff timelines for personal and auto loans.',
    metaTitle: 'Loan Calculator – Monthly Payment & Amortization | Finance.Tools',
    metaDescription:
      'Calculate fixed-rate loan monthly payments, total interest, origination fee costs, and early payoff savings with an amortization schedule.',
    affiliateGroup: 'savings',
    defaultInputs: {
      loanAmount: 25000,
      interestRate: 7.9,
      termMonths: 60,
      extraMonthlyPayment: 100,
      originationFeePercent: 0,
    },
    formulaSummary: 'Monthly Payment = L × [i(1 + i)^m] ÷ [(1 + i)^m − 1]',
    faqs: [
      {
        question: 'What is the difference between interest rate and APR on a loan?',
        answer:
          'The interest rate determines your monthly principal-and-interest payment, while APR incorporates upfront origination or administrative fees into the annualized borrowing cost. Always compare APRs across lenders.',
      },
      {
        question: 'Are there penalties for paying off a personal or auto loan early?',
        answer:
          'Most mainstream consumer personal loans and prime auto loans have no prepayment penalties, though some subprime lenders include prepayment clauses. Always confirm your promissory note stipulates simple interest with no prepayment fee.',
      },
      {
        question: 'Is a shorter loan term always better?',
        answer:
          'A shorter term lowers total interest dramatically and often qualifies for a lower interest rate, but increases the required monthly cash commitment. Verify the higher monthly payment leaves room for an emergency fund.',
      },
    ],
  },
  {
    id: 'roi',
    slug: 'roi',
    name: 'ROI Calculator',
    shortName: 'ROI',
    category: 'business',
    tagline: 'Evaluate total return, annualized CAGR, cash-on-cash yield, and after-tax investment profit.',
    metaTitle: 'ROI Calculator – Total Return, CAGR & After-Tax Yield | Finance.Tools',
    metaDescription:
      'Calculate investment ROI, annualized CAGR, cash-on-cash yield, and after-tax net profit for real estate, stocks, and business projects.',
    affiliateGroup: 'brokers',
    defaultInputs: {
      initialInvestment: 50000,
      additionalCosts: 5000,
      finalValue: 85000,
      annualCashFlow: 3200,
      years: 5,
      taxRatePercent: 15,
    },
    formulaSummary: 'ROI = (Net Profit ÷ Total Cost Basis) × 100 | CAGR = (Ending ÷ Beginning)^(1/t) − 1',
    faqs: [
      {
        question: 'Why is annualized CAGR better than simple Total ROI?',
        answer:
          'Simple ROI ignores time. A 50% total return achieved in 2 years (22.5% CAGR) represents far stronger capital efficiency than a 50% total return achieved over 10 years (4.1% CAGR).',
      },
      {
        question: 'What should I include in Additional Costs / Cost Basis?',
        answer:
          'Include brokerage commissions, real estate closing costs, renovation capex, software implementation fees, or legal expenses required to acquire and maintain the asset.',
      },
      {
        question: 'How does Cash-on-Cash Yield differ from Total ROI?',
        answer:
          'Cash-on-Cash Yield measures only the annual recurring cash flow divided by total capital invested, whereas Total ROI combines recurring cash flow plus appreciation or exit proceeds.',
      },
    ],
  },
];

export const CALCULATOR_MAP: Record<CalculatorId, CalculatorMeta> = CALCULATORS.reduce(
  (acc, calc) => {
    acc[calc.id] = calc;
    return acc;
  },
  {} as Record<CalculatorId, CalculatorMeta>
);
