import {
  calculateCompoundInterest,
  calculateFire,
  calculateLoan,
  calculateMortgage,
  calculateRetirement,
  calculateRoi,
  formatCurrency,
  formatPercent,
  type CompoundInputs,
  type FireInputs,
  type LoanInputs,
  type MortgageInputs,
  type RetirementInputs,
  type RoiInputs,
} from '../lib/calculators';
import type { CalculatorId, SeoLandingPage } from '../types/finance';

export interface GeneratedSeoArticleContent {
  summaryRows: { label: string; value: string }[];
  milestoneTableHeaders: string[];
  milestoneTableRows: string[][];
  sections: { heading: string; paragraphs: string[] }[];
  wordCount: number;
}

const CALCULATOR_METHODOLOGY_PROSE: Record<CalculatorId, string[]> = {
  'compound-interest': [
    'Compound interest modeling separates out-of-pocket contributions from reinvested growth across every compounding cycle. Unlike simple interest—which calculates earnings strictly against your original principal—compound growth applies each period’s yield to the combined balance of principal, recurring monthly additions, and previously credited interest or reinvested dividends. Over shorter five-year stretches, your monthly contribution rate dominates total account value; over fifteen-to-thirty-year horizons, exponential compounding overtakes cash contributions as the primary wealth driver.',
    'Because real-world purchasing power determines what your portfolio can actually fund in the future, this model computes both nominal ending balances and inflation-adjusted real equivalents. Evaluating both figures prevents the common planning mistake of treating future nominal dollars as equivalent to today’s living costs, while the interactive compounding frequency switch lets you compare daily bank interest accrual against monthly, quarterly, and annual investment schedules.',
  ],
  fire: [
    'Financial Independence, Retire Early (FIRE) planning centers on the crossover point where sustainable annual portfolio withdrawals permanently cover living expenses. Rather than relying on arbitrary age-65 retirement norms, FIRE math ties directly to two controllable variables: your household savings rate and your annual spending floor. Lowering annual expenses simultaneously reduces the capital target you need to accumulate and increases the monthly surplus available to invest.',
    'Because early retirees frequently fund 40-to-55 year horizons rather than conventional 30-year retirements, sequence-of-returns risk during the first five years after leaving full-time employment requires deliberate management. Adjusting the Safe Withdrawal Rate slider between 3.25% and 4.0% alongside real inflation-adjusted return assumptions allows you to quantify Lean FIRE, full FIRE, Fat FIRE, and Coast FIRE milestones on a single continuous projection.',
  ],
  retirement: [
    'Comprehensive retirement modeling bridges two distinct financial phases: multi-decade asset accumulation while working, followed by inflation-indexed income distribution after paychecks stop. During accumulation, steady payroll contributions and employer 401(k) matching compound inside tax-advantaged accounts at higher equity-oriented return assumptions. Once retirement begins, portfolios typically shift toward balanced fixed-income buffers to dampen sequence-of-returns volatility.',
    'Our projection escalates your desired annual retirement income by the selected inflation rate every year through your specified life expectancy. Viewing both the nominal balance on retirement day and its inflation-adjusted equivalent in today’s dollars ensures you can evaluate whether current monthly savings, employer matching, and target retirement age align comfortably—or whether modest contribution increases today eliminate late-life shortfall risk.',
  ],
  mortgage: [
    'Fixed-rate mortgage amortization distributes payments so early installments go disproportionately toward interest while principal reduction accelerates steadily in later years. Evaluating housing affordability accurately requires looking beyond bare Principal and Interest (P&I) to full PITI: annual property taxes, homeowners hazard insurance, Private Mortgage Insurance (PMI) when down payments sit below 20%, and recurring HOA assessments.',
    'Directing even modest extra monthly principal payments immediately lowers the remaining balance against which future monthly interest is calculated. That reverse compounding effect eliminates years of scheduled payments from the tail end of your mortgage and builds home equity significantly faster without requiring a formal refinance or shorter contractual loan term.',
  ],
  loan: [
    'Installment loan amortization locks in a fixed monthly payment across a defined repayment term, but the cost structure inside each payment shifts continuously. During early months, interest charges consume a larger share of every installment; as principal shrinks, progressively more of each fixed payment pays down debt directly. Reviewing upfront origination fees alongside nominal APR prevents underestimating the true effective cost of borrowed capital.',
    'Applying extra monthly principal payments toward a simple-interest personal, auto, student, or business loan guarantees a risk-free return equal to the loan’s interest rate. Every dollar paid above the minimum contractual installment cuts total interest paid and pulls your debt-free date forward, provided your lender does not assess prepayment penalties.',
  ],
  roi: [
    'Evaluating investment performance rigorously requires pairing total net profit with time-normalized Compound Annual Growth Rate (CAGR). Raw return percentages ignore holding duration—making a 40% gain achieved over two years appear identical to a 40% gain spread across ten years. Including acquisition fees, renovation capital expenditures, holding expenses, and annual cash flow inside your total cost basis yields an honest apples-to-apples comparison across real estate, equities, and business projects.',
    'Equally important is measuring after-tax net return. Ordinary income tax rates on short-term gains or business profits impact spendable outcomes far differently than long-term capital gains rates or tax-exempt savings. Adjusting the tax rate slider and annual cash flow inputs reveals both Cash-on-Cash Yield and true after-tax wealth creation.',
  ],
};

export function buildSeoLandingContent(page: SeoLandingPage): GeneratedSeoArticleContent {
  const { calculatorId, presetInputs, keyword, scenarioContext, focusAngle, strategyPoints, pitfalls } =
    page;

  let summaryRows: { label: string; value: string }[] = [];
  let milestoneTableHeaders: string[] = [];
  let milestoneTableRows: string[][] = [];
  let mathWalkthrough = '';
  let benchmarkParagraph = '';

  if (calculatorId === 'compound-interest') {
    const inp = presetInputs as Partial<CompoundInputs>;
    const res = calculateCompoundInterest(inp);
    const principal = Number(inp.principal ?? 10000);
    const monthly = Number(inp.monthlyContribution ?? 500);
    const rate = Number(inp.annualRate ?? 8);
    const years = Number(inp.years ?? 20);
    const inf = Number(inp.inflationRate ?? 2.5);

    summaryRows = [
      { label: 'Starting Principal', value: formatCurrency(principal) },
      { label: 'Monthly Contribution', value: formatCurrency(monthly) },
      { label: 'Projected Final Balance', value: formatCurrency(res.finalBalance) },
      { label: 'Total Interest Earned', value: formatCurrency(res.totalInterest) },
      { label: 'Purchasing Power (After Inflation)', value: formatCurrency(res.realFinalBalance) },
    ];
    milestoneTableHeaders = ['Year', 'Total Contributed', 'Cumulative Interest', 'Ending Balance', 'Real Value'];
    const sampleYears = pickMilestoneIndices(res.schedule.length);
    milestoneTableRows = sampleYears.map((idx) => {
      const r = res.schedule[idx];
      return [
        `Year ${r.year}`,
        formatCurrency(r.principalTotal),
        formatCurrency(r.interestTotal),
        formatCurrency(r.endingBalance),
        formatCurrency(r.realBalance),
      ];
    });

    const interestShare = res.finalBalance > 0 ? (res.totalInterest / res.finalBalance) * 100 : 0;
    mathWalkthrough = `In this pre-configured ${keyword} scenario, starting with ${formatCurrency(principal)} and adding ${formatCurrency(monthly)} per month at a ${formatPercent(rate)} annual return for ${years} years generates ${formatCurrency(res.finalBalance)} in total nominal wealth. Out of that final figure, ${formatCurrency(res.totalContributions)} comes from out-of-pocket contributions while ${formatCurrency(res.totalInterest)} (${formatPercent(interestShare)} of the portfolio) is generated strictly by compound growth.`;
    benchmarkParagraph = `Adjusted for ${formatPercent(inf)} annual inflation, the future balance retains ${formatCurrency(res.realFinalBalance)} in today's purchasing power. Comparing the nominal curve against the inflation-adjusted column highlights why reinvesting dividends inside low-fee index funds or tax-advantaged accounts makes a decisive multi-year difference.`;
  } else if (calculatorId === 'fire') {
    const inp = presetInputs as Partial<FireInputs>;
    const res = calculateFire(inp);
    const age = Number(inp.currentAge ?? 30);
    const portfolio = Number(inp.currentPortfolio ?? 75000);
    const savings = Number(inp.monthlySavings ?? 2500);
    const expenses = Number(inp.annualExpenses ?? 55000);
    const swr = Number(inp.withdrawalRate ?? 4.0);

    summaryRows = [
      { label: 'Target FIRE Number', value: formatCurrency(res.fireNumber) },
      { label: 'Coast FIRE Milestone', value: formatCurrency(res.coastFireNumber) },
      { label: 'Years to Independence', value: `${res.yearsToFire} years` },
      { label: 'Projected FIRE Age', value: `Age ${res.fireAge}` },
      { label: 'Monthly Passive Income', value: `${formatCurrency(res.monthlyPassiveIncomeAtFire)}/mo` },
    ];
    milestoneTableHeaders = ['Age', 'Year', 'Projected Portfolio', 'Target FIRE', 'Annual Passive Income'];
    const sampleYears = pickMilestoneIndices(res.schedule.length);
    milestoneTableRows = sampleYears.map((idx) => {
      const r = res.schedule[idx];
      return [
        `Age ${r.age}`,
        `Yr ${r.year}`,
        formatCurrency(r.portfolio),
        formatCurrency(r.fireTarget),
        formatCurrency(r.passiveIncome),
      ];
    });

    mathWalkthrough = `For this ${keyword} profile starting at age ${age} with ${formatCurrency(portfolio)} already invested and saving ${formatCurrency(savings)} per month, covering ${formatCurrency(expenses)} in annual living costs at a ${formatPercent(swr)} safe withdrawal rate requires a ${formatCurrency(res.fireNumber)} portfolio. At real market returns, the crossover point occurs in ${res.yearsToFire} years at age ${res.fireAge}.`;
    benchmarkParagraph = `Your Coast FIRE threshold sits at ${formatCurrency(res.coastFireNumber)} today—meaning once your balance crosses that line, compound growth alone carries your portfolio to full retirement by age 65 even if monthly contributions pause. Meanwhile, Lean FIRE (${formatCurrency(res.leanFireNumber)}) and Fat FIRE (${formatCurrency(res.fatFireNumber)}) establish clear spending guardrails.`;
  } else if (calculatorId === 'retirement') {
    const inp = presetInputs as Partial<RetirementInputs>;
    const res = calculateRetirement(inp);
    const curAge = Number(inp.currentAge ?? 35);
    const retAge = Number(inp.retirementAge ?? 65);
    const curSav = Number(inp.currentSavings ?? 95000);
    const contrib = Number(inp.monthlyContribution ?? 1100) + Number(inp.employerMatchMonthly ?? 300);

    summaryRows = [
      { label: 'Nest Egg at Retirement', value: formatCurrency(res.nestEggAtRetirement) },
      { label: 'Inflation-Adjusted Nest Egg', value: formatCurrency(res.realNestEggAtRetirement) },
      { label: 'Sustainable Income (Today $)', value: `${formatCurrency(res.sustainableAnnualIncomeToday)}/yr` },
      { label: 'Plan Status', value: res.isOnTrack ? 'On Track' : 'Needs Adjustment' },
      { label: 'Portfolio Lasts Through', value: `Age ${res.projectedSuccessAge}` },
    ];
    milestoneTableHeaders = ['Age', 'Phase', 'Portfolio Balance', 'Annual Contribution', 'Annual Withdrawal'];
    const sampleYears = pickMilestoneIndices(res.schedule.length);
    milestoneTableRows = sampleYears.map((idx) => {
      const r = res.schedule[idx];
      return [
        `Age ${r.age}`,
        r.phase,
        formatCurrency(r.balance),
        formatCurrency(r.annualContribution),
        formatCurrency(r.annualWithdrawal),
      ];
    });

    mathWalkthrough = `Modeling a worker at age ${curAge} targeting retirement at age ${retAge} with ${formatCurrency(curSav)} saved and ${formatCurrency(contrib)} in combined monthly contributions produces an estimated nominal balance of ${formatCurrency(res.nestEggAtRetirement)} on retirement day. In today's inflation-adjusted dollars, that nest egg equals ${formatCurrency(res.realNestEggAtRetirement)}.`;
    benchmarkParagraph = `Across a multi-decade drawdown through age ${inp.lifeExpectancy ?? 90}, this plan supports ${formatCurrency(res.sustainableAnnualIncomeToday)} per year in real purchasing power (${res.monthlyShortfallOrSurplus >= 0 ? 'a surplus of ' : 'a shortfall of '}${formatCurrency(Math.abs(res.monthlyShortfallOrSurplus))}/month against your spending target). Adjusting retirement age by just 24 months or capturing full employer 401(k) matching can shift longevity dramatically.`;
  } else if (calculatorId === 'mortgage') {
    const inp = presetInputs as Partial<MortgageInputs>;
    const res = calculateMortgage(inp);
    const price = Number(inp.homePrice ?? 450000);
    const rate = Number(inp.interestRate ?? 6.5);
    const extra = Number(inp.extraMonthlyPayment ?? 0);

    summaryRows = [
      { label: 'Loan Principal', value: formatCurrency(res.loanAmount) },
      { label: 'Monthly P&I Payment', value: formatCurrency(res.monthlyPI) },
      { label: 'Total Monthly PITI', value: formatCurrency(res.totalMonthlyPayment) },
      { label: 'Total Interest Saved', value: formatCurrency(res.interestSaved) },
      { label: 'Payoff Timeline', value: `${res.payoffYears} years` },
    ];
    milestoneTableHeaders = ['Year', 'Principal Paid', 'Interest Paid', 'Remaining Balance', 'Home Equity'];
    const sampleYears = pickMilestoneIndices(res.schedule.length);
    milestoneTableRows = sampleYears.map((idx) => {
      const r = res.schedule[idx];
      return [
        `Year ${r.year}`,
        formatCurrency(r.principalPaid),
        formatCurrency(r.interestPaid),
        formatCurrency(r.remainingBalance),
        formatCurrency(r.equity),
      ];
    });

    mathWalkthrough = `On a ${formatCurrency(price)} property with ${inp.downPaymentPercent ?? 20}% down at a ${formatPercent(rate, 2)} fixed interest rate, your base principal-and-interest payment is ${formatCurrency(res.monthlyPI)} per month, rising to ${formatCurrency(res.totalMonthlyPayment)} once taxes, insurance, and applicable PMI or HOA fees are included.`;
    benchmarkParagraph =
      extra > 0
        ? `Applying an extra ${formatCurrency(extra)} toward principal each month saves ${formatCurrency(res.interestSaved)} in total lifetime interest and trims ${res.monthsSaved} monthly payments off the schedule—dropping your effective payoff horizon to ${res.payoffYears} years.`
        : `Without extra principal payments, total interest reaches ${formatCurrency(res.totalInterestStandard)} over the full loan term. Test adding even $150 to $300 in extra monthly principal above to observe how rapidly early amortization accelerates equity.`;
  } else if (calculatorId === 'loan') {
    const inp = presetInputs as Partial<LoanInputs>;
    const res = calculateLoan(inp);
    const amt = Number(inp.loanAmount ?? 25000);
    const rate = Number(inp.interestRate ?? 7.9);
    const term = Number(inp.termMonths ?? 60);

    summaryRows = [
      { label: 'Loan Principal', value: formatCurrency(amt) },
      { label: 'Base Monthly Payment', value: formatCurrency(res.monthlyPayment) },
      { label: 'Total Interest Paid', value: formatCurrency(res.totalInterest) },
      { label: 'Interest Saved (Extra Pmt)', value: formatCurrency(res.interestSaved) },
      { label: 'Effective Payoff', value: `${res.effectivePayoffMonths} months` },
    ];
    milestoneTableHeaders = ['Month', 'Principal Paid', 'Interest Paid', 'Remaining Balance', 'Cumulative Interest'];
    const sampleIndices = pickMilestoneIndices(res.schedule.length);
    milestoneTableRows = sampleIndices.map((idx) => {
      const r = res.schedule[idx];
      return [
        `Mo ${r.period}`,
        formatCurrency(r.principalPaid),
        formatCurrency(r.interestPaid),
        formatCurrency(r.remainingBalance),
        formatCurrency(r.cumulativeInterest),
      ];
    });

    mathWalkthrough = `Borrowing ${formatCurrency(amt)} at ${formatPercent(rate, 2)} APR over ${term} months establishes a fixed baseline installment of ${formatCurrency(res.monthlyPayment)} per month. Across the repayment schedule, total interest equals ${formatCurrency(res.totalInterest)} alongside ${formatCurrency(res.originationFee)} in upfront origination charges.`;
    benchmarkParagraph = `Because fixed-rate debt charges interest on the declining principal balance each month, adding ${formatCurrency(Number(inp.extraMonthlyPayment ?? 0))} per month in extra payments cuts ${res.monthsSaved} months off your debt and keeps ${formatCurrency(res.interestSaved)} in your pocket.`;
  } else {
    const inp = presetInputs as Partial<RoiInputs>;
    const res = calculateRoi(inp);
    const init = Number(inp.initialInvestment ?? 50000);
    const finalV = Number(inp.finalValue ?? 85000);
    const yrs = Number(inp.years ?? 5);

    summaryRows = [
      { label: 'Total Cost Basis', value: formatCurrency(res.totalCostBasis) },
      { label: 'Net Profit (Pre-Tax)', value: formatCurrency(res.netProfitBeforeTax) },
      { label: 'Total Pre-Tax ROI', value: formatPercent(res.totalRoiPercent) },
      { label: 'Annualized CAGR', value: formatPercent(res.annualizedCagrPercent) },
      { label: 'After-Tax Net Profit', value: formatCurrency(res.netProfitAfterTax) },
    ];
    milestoneTableHeaders = ['Year', 'Asset Equity Value', 'Cumulative Cash Flow', 'Total Value', 'Net Gain'];
    const sampleYears = pickMilestoneIndices(res.schedule.length);
    milestoneTableRows = sampleYears.map((idx) => {
      const r = res.schedule[idx];
      return [
        `Year ${r.year}`,
        formatCurrency(r.equityValue),
        formatCurrency(r.cumulativeCashFlow),
        formatCurrency(r.totalValue),
        formatCurrency(r.netGain),
      ];
    });

    mathWalkthrough = `Allocating ${formatCurrency(init)} plus ${formatCurrency(Number(inp.additionalCosts ?? 0))} in transaction and holding expenses yields a total cost basis of ${formatCurrency(res.totalCostBasis)}. Combining the ${formatCurrency(finalV)} exit valuation with ${formatCurrency(Number(inp.annualCashFlow ?? 0))} annual cash flow over ${yrs} years generates ${formatCurrency(res.netProfitBeforeTax)} in pre-tax profit—a ${formatPercent(res.totalRoiPercent)} total ROI.`;
    benchmarkParagraph = `Time-normalizing that outcome yields a ${formatPercent(res.annualizedCagrPercent)} Compound Annual Growth Rate (CAGR) and a ${formatPercent(res.cashOnCashYieldPercent)} annual cash-on-cash yield. Accounting for an estimated ${formatPercent(Number(inp.taxRatePercent ?? 15))} tax rate leaves ${formatCurrency(res.netProfitAfterTax)} in spendable after-tax gain.`;
  }

  const methodologyParagraphs = CALCULATOR_METHODOLOGY_PROSE[calculatorId];

  const sections = [
    {
      heading: `Understanding the ${page.title} Benchmark`,
      paragraphs: [scenarioContext, mathWalkthrough],
    },
    {
      heading: `${focusAngle}: Key Drivers and Purchasing Power`,
      paragraphs: [
        benchmarkParagraph,
        ...methodologyParagraphs,
      ],
    },
    {
      heading: 'How to Stress-Test and Optimize Your Scenario',
      paragraphs: [
        ...strategyPoints,
        `Interactive sensitivity testing helps prevent fragile financial assumptions. Try shifting the primary rate or contribution slider by +/-1.0% inside the workspace above, inspect the milestone projection table, and compare conservative versus baseline curves before finalizing major cash allocations.`,
        `Whether you are benchmarking this exact ${keyword} goal or evaluating competing options across categories, use the Share Results button to bookmark a link containing your exact inputs, export the full schedule as a CSV spreadsheet, or click Print Results for a clean, ad-free report.`,
      ],
    },
    {
      heading: 'Common Mistakes & Risk Factors to Avoid',
      paragraphs: [
        ...pitfalls,
        `Remember that mathematical projections assume steady inputs across changing economic cycles. Revisit your numbers annually as income, tax brackets, interest rates, and household expenses evolve—keeping a resilient cash reserve so short-term surprises never force you to liquidate long-term positions at unfavorable prices.`,
      ],
    },
    {
      heading: 'Reading the Chart, Schedule, and Account Placement',
      paragraphs: [
        `The interactive chart and year-by-year schedule above break your ${keyword} projection into measurable annual checkpoints. Notice how early periods lean heavily on cash flow and contractual payments, while later periods reflect compounding velocity—whether in portfolio gains or accelerated debt principal elimination. Hover across any point on the chart to inspect exact milestone figures.`,
        `Where you house capital matters nearly as much as your headline rate of return. Placing high-growth investments inside tax-advantaged accounts (such as 401(k)s, Roth IRAs, or HSAs) shields compounding from annual dividend and capital-gains drag, while keeping emergency reserves inside FDIC-insured high-yield savings accounts preserves instant liquidity without interrupting long-term holdings.`,
      ],
    },
  ];

  const allText = sections
    .flatMap((s) => [s.heading, ...s.paragraphs])
    .concat(page.faqs.flatMap((f) => [f.question, f.answer]))
    .join(' ');
  const wordCount = allText.trim().split(/\s+/).length;

  return {
    summaryRows,
    milestoneTableHeaders,
    milestoneTableRows,
    sections,
    wordCount,
  };
}

function pickMilestoneIndices(length: number): number[] {
  if (length <= 5) {
    return Array.from({ length }, (_, i) => i);
  }
  const indices = new Set<number>([
    0,
    Math.floor((length - 1) * 0.25),
    Math.floor((length - 1) * 0.5),
    Math.floor((length - 1) * 0.75),
    length - 1,
  ]);
  return Array.from(indices).sort((a, b) => a - b);
}
