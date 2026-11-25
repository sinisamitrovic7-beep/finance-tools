import type { CalculatorId } from '../types/finance';

export function formatCurrency(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) return '0.0%';
  return `${value.toFixed(decimals)}%`;
}

export function formatCompactCurrency(value: number): string {
  if (!Number.isFinite(value)) return '$0';
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}k`;
  }
  return formatCurrency(value);
}

// 1. Compound Interest Calculator
export interface CompoundInputs {
  principal: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
  compoundingFrequency: 'monthly' | 'quarterly' | 'annually' | 'daily';
  inflationRate: number;
}

export interface CompoundYearRow {
  year: number;
  principalTotal: number;
  interestTotal: number;
  yearlyInterest: number;
  endingBalance: number;
  realBalance: number;
}

export interface CompoundResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  realFinalBalance: number;
  effectiveAnnualYield: number;
  schedule: CompoundYearRow[];
}

export function calculateCompoundInterest(raw: Partial<CompoundInputs>): CompoundResult {
  const principal = Math.max(0, Number(raw.principal ?? 10000));
  const monthlyContribution = Math.max(0, Number(raw.monthlyContribution ?? 500));
  const annualRate = Math.max(0, Math.min(50, Number(raw.annualRate ?? 8)));
  const years = Math.max(1, Math.min(60, Math.round(Number(raw.years ?? 20))));
  const freq = raw.compoundingFrequency ?? 'monthly';
  const inflationRate = Math.max(0, Math.min(20, Number(raw.inflationRate ?? 2.5)));

  const r = annualRate / 100;
  const inf = inflationRate / 100;
  const nMap: Record<CompoundInputs['compoundingFrequency'], number> = {
    daily: 365,
    monthly: 12,
    quarterly: 4,
    annually: 1,
  };
  const n = nMap[freq] ?? 12;
  const effectiveAnnualYield = (Math.pow(1 + r / n, n) - 1) * 100;

  let balance = principal;
  let totalContributed = principal;
  const schedule: CompoundYearRow[] = [];

  for (let y = 1; y <= years; y++) {
    const startYearBalance = balance;
    // Simulate month by month for accurate monthly contribution + compounding
    for (let m = 1; m <= 12; m++) {
      if (freq === 'daily') {
        const dailyRate = r / 365;
        const daysInMonth = 365 / 12;
        balance = balance * Math.pow(1 + dailyRate, daysInMonth) + monthlyContribution;
      } else if (freq === 'monthly') {
        balance = balance * (1 + r / 12) + monthlyContribution;
      } else if (freq === 'quarterly') {
        balance += monthlyContribution;
        if (m % 3 === 0) {
          balance *= 1 + r / 4;
        }
      } else {
        balance += monthlyContribution;
        if (m === 12) {
          balance *= 1 + r;
        }
      }
      totalContributed += monthlyContribution;
    }

    const yearlyInterest = balance - startYearBalance - monthlyContribution * 12;
    const interestTotal = Math.max(0, balance - totalContributed);
    const realBalance = balance / Math.pow(1 + inf, y);

    schedule.push({
      year: y,
      principalTotal: totalContributed,
      interestTotal,
      yearlyInterest: Math.max(0, yearlyInterest),
      endingBalance: balance,
      realBalance,
    });
  }

  const last = schedule[schedule.length - 1];
  return {
    finalBalance: last?.endingBalance ?? principal,
    totalContributions: totalContributed,
    totalInterest: last?.interestTotal ?? 0,
    realFinalBalance: last?.realBalance ?? principal,
    effectiveAnnualYield,
    schedule,
  };
}

// 2. FIRE Calculator
export interface FireInputs {
  currentAge: number;
  currentPortfolio: number;
  monthlySavings: number;
  annualExpenses: number;
  annualReturn: number;
  inflationRate: number;
  withdrawalRate: number;
}

export interface FireYearRow {
  age: number;
  year: number;
  portfolio: number;
  fireTarget: number;
  passiveIncome: number;
  contributionsTotal: number;
}

export interface FireResult {
  fireNumber: number;
  leanFireNumber: number;
  fatFireNumber: number;
  coastFireNumber: number;
  yearsToFire: number;
  fireAge: number;
  projectedAt65: number;
  monthlyPassiveIncomeAtFire: number;
  schedule: FireYearRow[];
}

export function calculateFire(raw: Partial<FireInputs>): FireResult {
  const currentAge = Math.max(18, Math.min(80, Math.round(Number(raw.currentAge ?? 30))));
  const currentPortfolio = Math.max(0, Number(raw.currentPortfolio ?? 75000));
  const monthlySavings = Math.max(0, Number(raw.monthlySavings ?? 2500));
  const annualExpenses = Math.max(1000, Number(raw.annualExpenses ?? 55000));
  const annualReturn = Math.max(0, Math.min(25, Number(raw.annualReturn ?? 7.5)));
  const inflationRate = Math.max(0, Math.min(15, Number(raw.inflationRate ?? 2.5)));
  const withdrawalRate = Math.max(2, Math.min(8, Number(raw.withdrawalRate ?? 4.0)));

  // Real return rate for constant purchasing-power FIRE modeling
  const realReturn = (1 + annualReturn / 100) / (1 + inflationRate / 100) - 1;
  const swr = withdrawalRate / 100;

  const fireNumber = annualExpenses / swr;
  const leanFireNumber = (annualExpenses * 0.7) / swr;
  const fatFireNumber = (annualExpenses * 1.5) / swr;
  const yearsTo65 = Math.max(1, 65 - currentAge);
  const coastFireNumber = fireNumber / Math.pow(1 + Math.max(0.01, realReturn), yearsTo65);

  let balance = currentPortfolio;
  let totalContributions = currentPortfolio;
  let yearsToFire = -1;
  const maxYears = Math.max(45, 75 - currentAge);
  const schedule: FireYearRow[] = [];

  for (let y = 0; y <= maxYears; y++) {
    const age = currentAge + y;
    const passiveIncome = balance * swr;
    schedule.push({
      age,
      year: y,
      portfolio: balance,
      fireTarget: fireNumber,
      passiveIncome,
      contributionsTotal: totalContributions,
    });

    if (yearsToFire === -1 && balance >= fireNumber) {
      yearsToFire = y;
    }

    // Compound monthly using real return
    const monthlyReal = Math.pow(1 + realReturn, 1 / 12) - 1;
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyReal) + monthlySavings;
      totalContributions += monthlySavings;
    }
  }

  const effectiveYears = yearsToFire === -1 ? maxYears : yearsToFire;
  const fireAge = currentAge + effectiveYears;
  const at65Row = schedule.find((r) => r.age === 65) ?? schedule[schedule.length - 1];

  return {
    fireNumber,
    leanFireNumber,
    fatFireNumber,
    coastFireNumber,
    yearsToFire: effectiveYears,
    fireAge,
    projectedAt65: at65Row?.portfolio ?? balance,
    monthlyPassiveIncomeAtFire: (fireNumber * swr) / 12,
    schedule,
  };
}

// 3. Retirement Calculator
export interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlyContribution: number;
  employerMatchMonthly: number;
  preRetirementReturn: number;
  postRetirementReturn: number;
  inflationRate: number;
  desiredAnnualIncome: number;
}

export interface RetirementYearRow {
  age: number;
  balance: number;
  annualContribution: number;
  annualWithdrawal: number;
  phase: 'Accumulation' | 'Retirement';
}

export interface RetirementResult {
  nestEggAtRetirement: number;
  realNestEggAtRetirement: number;
  sustainableAnnualIncomeToday: number;
  projectedSuccessAge: number;
  monthlyShortfallOrSurplus: number;
  isOnTrack: boolean;
  schedule: RetirementYearRow[];
}

export function calculateRetirement(raw: Partial<RetirementInputs>): RetirementResult {
  const currentAge = Math.max(18, Math.min(80, Math.round(Number(raw.currentAge ?? 35))));
  const retirementAge = Math.max(currentAge + 1, Math.min(85, Math.round(Number(raw.retirementAge ?? 65))));
  const lifeExpectancy = Math.max(retirementAge + 5, Math.min(105, Math.round(Number(raw.lifeExpectancy ?? 90))));
  const currentSavings = Math.max(0, Number(raw.currentSavings ?? 95000));
  const monthlyContribution = Math.max(0, Number(raw.monthlyContribution ?? 1100));
  const employerMatchMonthly = Math.max(0, Number(raw.employerMatchMonthly ?? 300));
  const preRetReturn = Math.max(0, Math.min(20, Number(raw.preRetirementReturn ?? 7.5))) / 100;
  const postRetReturn = Math.max(0, Math.min(15, Number(raw.postRetirementReturn ?? 5.0))) / 100;
  const inf = Math.max(0, Math.min(15, Number(raw.inflationRate ?? 2.5))) / 100;
  const desiredAnnualIncome = Math.max(10000, Number(raw.desiredAnnualIncome ?? 75000));

  let balance = currentSavings;
  const schedule: RetirementYearRow[] = [];
  let nestEggAtRetirement = currentSavings;
  let projectedSuccessAge = lifeExpectancy;
  let depleted = false;

  const totalMonthlySave = monthlyContribution + employerMatchMonthly;

  for (let age = currentAge; age <= lifeExpectancy; age++) {
    const yearsElapsed = age - currentAge;
    if (age < retirementAge) {
      const annualContribution = totalMonthlySave * 12;
      schedule.push({
        age,
        balance,
        annualContribution,
        annualWithdrawal: 0,
        phase: 'Accumulation',
      });
      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + preRetReturn / 12) + totalMonthlySave;
      }
      if (age + 1 === retirementAge) {
        nestEggAtRetirement = balance;
      }
    } else {
      const inflatedNeed = desiredAnnualIncome * Math.pow(1 + inf, yearsElapsed);
      const actualWithdrawal = Math.min(balance, inflatedNeed);
      schedule.push({
        age,
        balance,
        annualContribution: 0,
        annualWithdrawal: actualWithdrawal,
        phase: 'Retirement',
      });
      if (balance <= 0 && !depleted) {
        depleted = true;
        projectedSuccessAge = age;
      }
      balance = Math.max(0, (balance - inflatedNeed) * (1 + postRetReturn));
    }
  }

  const yearsToRetire = retirementAge - currentAge;
  const realNestEggAtRetirement = nestEggAtRetirement / Math.pow(1 + inf, yearsToRetire);
  const retirementYears = Math.max(1, lifeExpectancy - retirementAge);
  const realPostReturn = (1 + postRetReturn) / (1 + inf) - 1;
  let sustainableAnnualIncomeToday = 0;
  if (Math.abs(realPostReturn) < 0.0001) {
    sustainableAnnualIncomeToday = realNestEggAtRetirement / retirementYears;
  } else {
    sustainableAnnualIncomeToday =
      (realNestEggAtRetirement * realPostReturn) /
      (1 - Math.pow(1 + realPostReturn, -retirementYears));
  }

  const monthlyShortfallOrSurplus = (sustainableAnnualIncomeToday - desiredAnnualIncome) / 12;

  return {
    nestEggAtRetirement,
    realNestEggAtRetirement,
    sustainableAnnualIncomeToday,
    projectedSuccessAge: depleted ? projectedSuccessAge : lifeExpectancy,
    monthlyShortfallOrSurplus,
    isOnTrack: !depleted && monthlyShortfallOrSurplus >= 0,
    schedule,
  };
}

// 4. Mortgage Calculator
export interface MortgageInputs {
  homePrice: number;
  downPaymentPercent: number;
  loanTermYears: number;
  interestRate: number;
  propertyTaxAnnual: number;
  homeInsuranceAnnual: number;
  hoaMonthly: number;
  extraMonthlyPayment: number;
}

export interface MortgageYearRow {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  remainingBalance: number;
  baselineBalance: number;
  equity: number;
}

export interface MortgageResult {
  loanAmount: number;
  downPaymentAmount: number;
  monthlyPI: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  monthlyHOA: number;
  totalMonthlyPayment: number;
  totalInterestStandard: number;
  totalInterestWithExtra: number;
  interestSaved: number;
  monthsSaved: number;
  payoffYears: number;
  schedule: MortgageYearRow[];
}

export function calculateMortgage(raw: Partial<MortgageInputs>): MortgageResult {
  const homePrice = Math.max(10000, Number(raw.homePrice ?? 450000));
  const downPaymentPercent = Math.max(0, Math.min(90, Number(raw.downPaymentPercent ?? 20)));
  const loanTermYears = Math.max(1, Math.min(40, Math.round(Number(raw.loanTermYears ?? 30))));
  const interestRate = Math.max(0.1, Math.min(20, Number(raw.interestRate ?? 6.5)));
  const propertyTaxAnnual = Math.max(0, Number(raw.propertyTaxAnnual ?? 5400));
  const homeInsuranceAnnual = Math.max(0, Number(raw.homeInsuranceAnnual ?? 1800));
  const hoaMonthly = Math.max(0, Number(raw.hoaMonthly ?? 0));
  const extraMonthlyPayment = Math.max(0, Number(raw.extraMonthlyPayment ?? 0));

  const downPaymentAmount = homePrice * (downPaymentPercent / 100);
  const loanAmount = Math.max(0, homePrice - downPaymentAmount);
  const totalMonths = loanTermYears * 12;
  const r = interestRate / 100 / 12;

  const monthlyPI =
    loanAmount === 0
      ? 0
      : (loanAmount * (r * Math.pow(1 + r, totalMonths))) / (Math.pow(1 + r, totalMonths) - 1);

  const monthlyTax = propertyTaxAnnual / 12;
  const monthlyInsurance = homeInsuranceAnnual / 12;
  const monthlyPMI = downPaymentPercent < 20 ? (loanAmount * 0.0055) / 12 : 0;
  const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + hoaMonthly;

  let balExtra = loanAmount;
  let balStandard = loanAmount;
  let totalInterestStandard = 0;
  let totalInterestWithExtra = 0;
  let actualMonths = 0;

  const schedule: MortgageYearRow[] = [];

  for (let y = 1; y <= loanTermYears; y++) {
    let yearPrincipal = 0;
    let yearInterest = 0;

    for (let m = 1; m <= 12; m++) {
      if (balStandard > 0) {
        const stdInt = balStandard * r;
        const stdPrin = Math.min(balStandard, monthlyPI - stdInt);
        totalInterestStandard += stdInt;
        balStandard = Math.max(0, balStandard - stdPrin);
      }

      if (balExtra > 0.01) {
        actualMonths++;
        const extInt = balExtra * r;
        const payment = Math.min(balExtra + extInt, monthlyPI + extraMonthlyPayment);
        const extPrin = Math.max(0, payment - extInt);
        totalInterestWithExtra += extInt;
        yearInterest += extInt;
        yearPrincipal += extPrin;
        balExtra = Math.max(0, balExtra - extPrin);
      }
    }

    schedule.push({
      year: y,
      principalPaid: yearPrincipal,
      interestPaid: yearInterest,
      totalPaid: yearPrincipal + yearInterest,
      remainingBalance: balExtra,
      baselineBalance: balStandard,
      equity: homePrice - balExtra,
    });
  }

  return {
    loanAmount,
    downPaymentAmount,
    monthlyPI,
    monthlyTax,
    monthlyInsurance,
    monthlyPMI,
    monthlyHOA: hoaMonthly,
    totalMonthlyPayment,
    totalInterestStandard,
    totalInterestWithExtra,
    interestSaved: Math.max(0, totalInterestStandard - totalInterestWithExtra),
    monthsSaved: Math.max(0, totalMonths - actualMonths),
    payoffYears: Number((actualMonths / 12).toFixed(1)),
    schedule,
  };
}

// 5. Loan Calculator
export interface LoanInputs {
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  extraMonthlyPayment: number;
  originationFeePercent: number;
}

export interface LoanRow {
  period: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
  cumulativeInterest: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  originationFee: number;
  interestSaved: number;
  monthsSaved: number;
  effectivePayoffMonths: number;
  schedule: LoanRow[];
}

export function calculateLoan(raw: Partial<LoanInputs>): LoanResult {
  const loanAmount = Math.max(100, Number(raw.loanAmount ?? 25000));
  const interestRate = Math.max(0.1, Math.min(40, Number(raw.interestRate ?? 7.9)));
  const termMonths = Math.max(3, Math.min(360, Math.round(Number(raw.termMonths ?? 60))));
  const extraMonthlyPayment = Math.max(0, Number(raw.extraMonthlyPayment ?? 0));
  const originationFeePercent = Math.max(0, Math.min(10, Number(raw.originationFeePercent ?? 0)));

  const r = interestRate / 100 / 12;
  const monthlyPayment =
    (loanAmount * (r * Math.pow(1 + r, termMonths))) / (Math.pow(1 + r, termMonths) - 1);

  let balStandard = loanAmount;
  let stdInterest = 0;
  for (let m = 1; m <= termMonths; m++) {
    const intr = balStandard * r;
    stdInterest += intr;
    balStandard = Math.max(0, balStandard - (monthlyPayment - intr));
  }

  let balExtra = loanAmount;
  let totalInterest = 0;
  let totalPayments = 0;
  let effectivePayoffMonths = 0;
  const schedule: LoanRow[] = [];

  for (let m = 1; m <= termMonths; m++) {
    if (balExtra <= 0.01) break;
    effectivePayoffMonths = m;
    const intr = balExtra * r;
    const pay = Math.min(balExtra + intr, monthlyPayment + extraMonthlyPayment);
    const prin = Math.max(0, pay - intr);
    balExtra = Math.max(0, balExtra - prin);
    totalInterest += intr;
    totalPayments += pay;

    schedule.push({
      period: m,
      principalPaid: prin,
      interestPaid: intr,
      remainingBalance: balExtra,
      cumulativeInterest: totalInterest,
    });
  }

  const originationFee = loanAmount * (originationFeePercent / 100);

  return {
    monthlyPayment,
    totalPayments: totalPayments + originationFee,
    totalInterest,
    originationFee,
    interestSaved: Math.max(0, stdInterest - totalInterest),
    monthsSaved: Math.max(0, termMonths - effectivePayoffMonths),
    effectivePayoffMonths,
    schedule,
  };
}

// 6. ROI Calculator
export interface RoiInputs {
  initialInvestment: number;
  additionalCosts: number;
  finalValue: number;
  annualCashFlow: number;
  years: number;
  taxRatePercent: number;
}

export interface RoiYearRow {
  year: number;
  equityValue: number;
  cumulativeCashFlow: number;
  totalValue: number;
  netGain: number;
}

export interface RoiResult {
  totalCostBasis: number;
  grossReturn: number;
  netProfitBeforeTax: number;
  estimatedTaxes: number;
  netProfitAfterTax: number;
  totalRoiPercent: number;
  afterTaxRoiPercent: number;
  annualizedCagrPercent: number;
  cashOnCashYieldPercent: number;
  schedule: RoiYearRow[];
}

export function calculateRoi(raw: Partial<RoiInputs>): RoiResult {
  const initialInvestment = Math.max(1, Number(raw.initialInvestment ?? 50000));
  const additionalCosts = Math.max(0, Number(raw.additionalCosts ?? 5000));
  const finalValue = Math.max(0, Number(raw.finalValue ?? 85000));
  const annualCashFlow = Number(raw.annualCashFlow ?? 3200);
  const years = Math.max(0.5, Math.min(50, Number(raw.years ?? 5)));
  const taxRatePercent = Math.max(0, Math.min(50, Number(raw.taxRatePercent ?? 15)));

  const totalCostBasis = initialInvestment + additionalCosts;
  const totalCashFlow = annualCashFlow * years;
  const grossReturn = finalValue + totalCashFlow;
  const netProfitBeforeTax = grossReturn - totalCostBasis;
  const estimatedTaxes = netProfitBeforeTax > 0 ? netProfitBeforeTax * (taxRatePercent / 100) : 0;
  const netProfitAfterTax = netProfitBeforeTax - estimatedTaxes;

  const totalRoiPercent = (netProfitBeforeTax / totalCostBasis) * 100;
  const afterTaxRoiPercent = (netProfitAfterTax / totalCostBasis) * 100;
  const multiple = Math.max(0.01, grossReturn / totalCostBasis);
  const annualizedCagrPercent = (Math.pow(multiple, 1 / years) - 1) * 100;
  const cashOnCashYieldPercent = (annualCashFlow / totalCostBasis) * 100;

  const wholeYears = Math.max(1, Math.ceil(years));
  const schedule: RoiYearRow[] = [];
  const impliedGrowthRate = Math.pow(Math.max(0.01, finalValue / initialInvestment), 1 / years) - 1;

  for (let y = 1; y <= wholeYears; y++) {
    const t = Math.min(y, years);
    const equityValue = initialInvestment * Math.pow(1 + impliedGrowthRate, t);
    const cumulativeCashFlow = annualCashFlow * t;
    const totalValue = equityValue + cumulativeCashFlow;
    schedule.push({
      year: y,
      equityValue,
      cumulativeCashFlow,
      totalValue,
      netGain: totalValue - totalCostBasis,
    });
  }

  return {
    totalCostBasis,
    grossReturn,
    netProfitBeforeTax,
    estimatedTaxes,
    netProfitAfterTax,
    totalRoiPercent,
    afterTaxRoiPercent,
    annualizedCagrPercent,
    cashOnCashYieldPercent,
    schedule,
  };
}

export function getHeadlineSummaryForPreset(
  calculatorId: CalculatorId,
  inputs: Record<string, number | string>
): { primaryLabel: string; primaryValue: string; secondaryLabel: string; secondaryValue: string } {
  switch (calculatorId) {
    case 'compound-interest': {
      const res = calculateCompoundInterest(inputs as Partial<CompoundInputs>);
      return {
        primaryLabel: 'Projected Balance',
        primaryValue: formatCurrency(res.finalBalance),
        secondaryLabel: 'Total Interest Earned',
        secondaryValue: formatCurrency(res.totalInterest),
      };
    }
    case 'fire': {
      const res = calculateFire(inputs as Partial<FireInputs>);
      return {
        primaryLabel: 'Target FIRE Number',
        primaryValue: formatCurrency(res.fireNumber),
        secondaryLabel: 'Projected FIRE Age',
        secondaryValue: `Age ${res.fireAge} (${res.yearsToFire} yrs)`,
      };
    }
    case 'retirement': {
      const res = calculateRetirement(inputs as Partial<RetirementInputs>);
      return {
        primaryLabel: 'Nest Egg at Retirement',
        primaryValue: formatCurrency(res.nestEggAtRetirement),
        secondaryLabel: 'Sustainable Annual Income',
        secondaryValue: `${formatCurrency(res.sustainableAnnualIncomeToday)}/yr`,
      };
    }
    case 'mortgage': {
      const res = calculateMortgage(inputs as Partial<MortgageInputs>);
      return {
        primaryLabel: 'Total Monthly Payment',
        primaryValue: formatCurrency(res.totalMonthlyPayment),
        secondaryLabel: 'Total Interest Saved',
        secondaryValue: formatCurrency(res.interestSaved),
      };
    }
    case 'loan': {
      const res = calculateLoan(inputs as Partial<LoanInputs>);
      return {
        primaryLabel: 'Monthly Payment',
        primaryValue: formatCurrency(res.monthlyPayment),
        secondaryLabel: 'Total Interest Cost',
        secondaryValue: formatCurrency(res.totalInterest),
      };
    }
    case 'roi': {
      const res = calculateRoi(inputs as Partial<RoiInputs>);
      return {
        primaryLabel: 'Total ROI',
        primaryValue: formatPercent(res.totalRoiPercent),
        secondaryLabel: 'Annualized CAGR',
        secondaryValue: formatPercent(res.annualizedCagrPercent),
      };
    }
  }
}
