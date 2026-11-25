import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Download, Printer, RotateCcw, Share2 } from 'lucide-react';
import { CALCULATOR_MAP } from '../data/calculatorsMeta';
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
import type { CalculatorId } from '../types/finance';
import { ProjectionChart, type ChartSeries } from './ProjectionChart';

interface CalculatorWorkspaceProps {
  calculatorId: CalculatorId;
  initialPreset?: Record<string, number | string>;
}

interface FieldControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (val: number) => void;
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  onChange,
}: FieldControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <div className="flex items-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1 focus-within:border-emerald-600 dark:focus-within:border-emerald-500">
          {prefix && (
            <span className="text-xs text-slate-400 dark:text-slate-500 mr-1 font-mono">
              {prefix}
            </span>
          )}
          <input
            type="number"
            value={Number.isFinite(value) ? value : 0}
            min={min}
            max={max}
            step={step}
            aria-label={label}
            onChange={(e) => {
              const parsed = parseFloat(e.target.value);
              onChange(Number.isNaN(parsed) ? 0 : parsed);
            }}
            className="w-24 bg-transparent text-right font-mono text-sm font-medium tabular-nums text-slate-900 dark:text-slate-100 focus:outline-none"
          />
          {suffix && (
            <span className="text-xs text-slate-400 dark:text-slate-500 ml-1 font-mono">
              {suffix}
            </span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        aria-label={`${label} slider`}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 cursor-pointer"
      />
    </div>
  );
}

export function CalculatorWorkspace({ calculatorId, initialPreset }: CalculatorWorkspaceProps) {
  const meta = CALCULATOR_MAP[calculatorId];
  const baseDefaults = useMemo(
    () => ({ ...meta.defaultInputs, ...(initialPreset ?? {}) }),
    [meta.defaultInputs, initialPreset]
  );

  const [inputs, setInputs] = useState<Record<string, number | string>>(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const hydrated: Record<string, number | string> = { ...baseDefaults };
      let foundAny = false;
      for (const key of Object.keys(baseDefaults)) {
        const raw = params.get(key);
        if (raw !== null) {
          foundAny = true;
          hydrated[key] = typeof baseDefaults[key] === 'number' ? Number(raw) : raw;
        }
      }
      if (foundAny) return hydrated;
    }
    return baseDefaults;
  });

  // Reset inputs when switching calculator or SEO preset route
  useEffect(() => {
    setInputs(baseDefaults);
  }, [baseDefaults]);

  const [copied, setCopied] = useState(false);
  const [showAllRows, setShowAllRows] = useState(false);

  const setField = (key: string, val: number | string) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(inputs)) {
      params.set(k, String(v));
    }
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      window.history.replaceState({}, '', `?${params.toString()}`);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const computed = useMemo(() => {
    if (calculatorId === 'compound-interest') {
      const res = calculateCompoundInterest(inputs as Partial<CompoundInputs>);
      return {
        kpis: [
          { label: 'Projected Balance', value: formatCurrency(res.finalBalance), accent: true },
          { label: 'Total Contributions', value: formatCurrency(res.totalContributions), accent: false },
          { label: 'Total Interest Earned', value: formatCurrency(res.totalInterest), accent: false },
          { label: 'Inflation-Adjusted Value', value: formatCurrency(res.realFinalBalance), accent: false },
        ],
        chartTitle: 'Compound Growth vs. Total Contributions',
        chartSubtitle: `Effective Annual Yield: ${formatPercent(res.effectiveAnnualYield, 2)}`,
        xLabels: res.schedule.map((r) => `Yr ${r.year}`),
        series: [
          { label: 'Ending Balance', color: '#059669', values: res.schedule.map((r) => r.endingBalance) },
          { label: 'Principal Contributed', color: '#64748b', values: res.schedule.map((r) => r.principalTotal) },
          { label: 'Inflation-Adjusted', color: '#d97706', values: res.schedule.map((r) => r.realBalance), dashed: true },
        ] as ChartSeries[],
        headers: ['Year', 'Total Contributed', 'Yearly Interest', 'Cumulative Interest', 'Ending Balance', 'Real Value'],
        rows: res.schedule.map((r) => [
          `Year ${r.year}`,
          formatCurrency(r.principalTotal),
          formatCurrency(r.yearlyInterest),
          formatCurrency(r.interestTotal),
          formatCurrency(r.endingBalance),
          formatCurrency(r.realBalance),
        ]),
      };
    }

    if (calculatorId === 'fire') {
      const res = calculateFire(inputs as Partial<FireInputs>);
      return {
        kpis: [
          { label: 'FIRE Number', value: formatCurrency(res.fireNumber), accent: true },
          { label: 'Projected FIRE Age', value: `Age ${res.fireAge} (${res.yearsToFire} yrs)`, accent: false },
          { label: 'Coast FIRE Target', value: formatCurrency(res.coastFireNumber), accent: false },
          { label: 'Monthly Passive Income', value: `${formatCurrency(res.monthlyPassiveIncomeAtFire)}/mo`, accent: false },
        ],
        chartTitle: 'Portfolio Growth Toward Financial Independence',
        chartSubtitle: `Lean FIRE: ${formatCurrency(res.leanFireNumber)} · Fat FIRE: ${formatCurrency(res.fatFireNumber)}`,
        xLabels: res.schedule.map((r) => `Age ${r.age}`),
        series: [
          { label: 'Projected Portfolio', color: '#059669', values: res.schedule.map((r) => r.portfolio) },
          { label: 'Target FIRE Number', color: '#0284c7', values: res.schedule.map((r) => r.fireTarget), dashed: true },
          { label: 'Total Contributed', color: '#64748b', values: res.schedule.map((r) => r.contributionsTotal) },
        ] as ChartSeries[],
        headers: ['Age', 'Year', 'Portfolio Value', 'FIRE Target', 'Annual Passive Income'],
        rows: res.schedule.map((r) => [
          `Age ${r.age}`,
          `Year ${r.year}`,
          formatCurrency(r.portfolio),
          formatCurrency(r.fireTarget),
          formatCurrency(r.passiveIncome),
        ]),
      };
    }

    if (calculatorId === 'retirement') {
      const res = calculateRetirement(inputs as Partial<RetirementInputs>);
      return {
        kpis: [
          { label: 'Nest Egg at Retirement', value: formatCurrency(res.nestEggAtRetirement), accent: true },
          { label: 'Today-Dollar Equivalent', value: formatCurrency(res.realNestEggAtRetirement), accent: false },
          { label: 'Sustainable Income', value: `${formatCurrency(res.sustainableAnnualIncomeToday)}/yr`, accent: false },
          {
            label: res.monthlyShortfallOrSurplus >= 0 ? 'Monthly Surplus' : 'Monthly Shortfall',
            value: `${res.monthlyShortfallOrSurplus >= 0 ? '+' : '−'}${formatCurrency(Math.abs(res.monthlyShortfallOrSurplus))}/mo`,
            accent: false,
          },
        ],
        chartTitle: 'Accumulation & Retirement Drawdown Trajectory',
        chartSubtitle: `Plan sustains spending through Age ${res.projectedSuccessAge}`,
        xLabels: res.schedule.map((r) => `Age ${r.age}`),
        series: [
          { label: 'Projected Balance', color: '#059669', values: res.schedule.map((r) => r.balance) },
          { label: 'Annual Withdrawal', color: '#d97706', values: res.schedule.map((r) => r.annualWithdrawal), dashed: true },
        ] as ChartSeries[],
        headers: ['Age', 'Phase', 'Portfolio Balance', 'Annual Contribution', 'Annual Withdrawal'],
        rows: res.schedule.map((r) => [
          `Age ${r.age}`,
          r.phase,
          formatCurrency(r.balance),
          formatCurrency(r.annualContribution),
          formatCurrency(r.annualWithdrawal),
        ]),
      };
    }

    if (calculatorId === 'mortgage') {
      const res = calculateMortgage(inputs as Partial<MortgageInputs>);
      return {
        kpis: [
          { label: 'Total Monthly Payment', value: formatCurrency(res.totalMonthlyPayment), accent: true },
          { label: 'Principal & Interest', value: formatCurrency(res.monthlyPI), accent: false },
          { label: 'Interest Saved (Extra Pmt)', value: formatCurrency(res.interestSaved), accent: false },
          { label: 'Effective Payoff', value: `${res.payoffYears} yrs (${res.monthsSaved} mo saved)`, accent: false },
        ],
        chartTitle: 'Remaining Mortgage Balance vs. Home Equity',
        chartSubtitle: `Taxes: ${formatCurrency(res.monthlyTax)}/mo · Insurance: ${formatCurrency(res.monthlyInsurance)}/mo${res.monthlyPMI > 0 ? ` · PMI: ${formatCurrency(res.monthlyPMI)}/mo` : ''}`,
        xLabels: res.schedule.map((r) => `Yr ${r.year}`),
        series: [
          { label: 'Home Equity', color: '#059669', values: res.schedule.map((r) => r.equity) },
          { label: 'Balance (With Extra)', color: '#0284c7', values: res.schedule.map((r) => r.remainingBalance) },
          { label: 'Standard Balance', color: '#64748b', values: res.schedule.map((r) => r.baselineBalance), dashed: true },
        ] as ChartSeries[],
        headers: ['Year', 'Principal Paid', 'Interest Paid', 'Remaining Balance', 'Home Equity'],
        rows: res.schedule.map((r) => [
          `Year ${r.year}`,
          formatCurrency(r.principalPaid),
          formatCurrency(r.interestPaid),
          formatCurrency(r.remainingBalance),
          formatCurrency(r.equity),
        ]),
      };
    }

    if (calculatorId === 'loan') {
      const res = calculateLoan(inputs as Partial<LoanInputs>);
      return {
        kpis: [
          { label: 'Monthly Payment', value: formatCurrency(res.monthlyPayment), accent: true },
          { label: 'Total Interest Cost', value: formatCurrency(res.totalInterest), accent: false },
          { label: 'Interest Saved', value: formatCurrency(res.interestSaved), accent: false },
          { label: 'Payoff Duration', value: `${res.effectivePayoffMonths} mo (${res.monthsSaved} mo saved)`, accent: false },
        ],
        chartTitle: 'Loan Principal Paydown & Cumulative Interest',
        chartSubtitle: `Total Outlay: ${formatCurrency(res.totalPayments)} (incl. ${formatCurrency(res.originationFee)} fees)`,
        xLabels: res.schedule.map((r) => `Mo ${r.period}`),
        series: [
          { label: 'Remaining Principal', color: '#0284c7', values: res.schedule.map((r) => r.remainingBalance) },
          { label: 'Cumulative Interest', color: '#d97706', values: res.schedule.map((r) => r.cumulativeInterest) },
        ] as ChartSeries[],
        headers: ['Month', 'Principal Paid', 'Interest Paid', 'Remaining Balance', 'Cumulative Interest'],
        rows: res.schedule.map((r) => [
          `Month ${r.period}`,
          formatCurrency(r.principalPaid),
          formatCurrency(r.interestPaid),
          formatCurrency(r.remainingBalance),
          formatCurrency(r.cumulativeInterest),
        ]),
      };
    }

    // ROI Calculator
    const res = calculateRoi(inputs as Partial<RoiInputs>);
    return {
      kpis: [
        { label: 'Total Pre-Tax ROI', value: formatPercent(res.totalRoiPercent), accent: true },
        { label: 'Annualized CAGR', value: formatPercent(res.annualizedCagrPercent), accent: false },
        { label: 'After-Tax Net Profit', value: formatCurrency(res.netProfitAfterTax), accent: false },
        { label: 'Cash-on-Cash Yield', value: formatPercent(res.cashOnCashYieldPercent), accent: false },
      ],
      chartTitle: 'Total Investment Value & Cumulative Net Gain',
      chartSubtitle: `Total Cost Basis: ${formatCurrency(res.totalCostBasis)} · After-Tax ROI: ${formatPercent(res.afterTaxRoiPercent)}`,
      xLabels: res.schedule.map((r) => `Yr ${r.year}`),
      series: [
        { label: 'Total Asset + Cash Flow', color: '#059669', values: res.schedule.map((r) => r.totalValue) },
        { label: 'Asset Equity Value', color: '#0284c7', values: res.schedule.map((r) => r.equityValue), dashed: true },
        { label: 'Net Gain', color: '#64748b', values: res.schedule.map((r) => Math.max(0, r.netGain)) },
      ] as ChartSeries[],
      headers: ['Year', 'Asset Value', 'Cumulative Cash Flow', 'Total Return Value', 'Net Gain'],
      rows: res.schedule.map((r) => [
        `Year ${r.year}`,
        formatCurrency(r.equityValue),
        formatCurrency(r.cumulativeCashFlow),
        formatCurrency(r.totalValue),
        formatCurrency(r.netGain),
      ]),
    };
  }, [calculatorId, inputs]);

  const exportCsv = () => {
    const csv = [computed.headers.join(','), ...computed.rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${calculatorId}-projection.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const visibleRows = showAllRows ? computed.rows : computed.rows.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3.5">
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-xl">
          Formula: {meta.formulaSummary}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setInputs(baseDefaults)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span className="text-emerald-700 dark:text-emerald-400">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Share Results</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Print Results</span>
          </button>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Inputs Panel */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-200 dark:border-slate-800">
            Calculator Parameters
          </h2>

          {calculatorId === 'compound-interest' && (
            <>
              <SliderField label="Initial Investment" value={Number(inputs.principal)} min={0} max={500000} step={500} prefix="$" onChange={(v) => setField('principal', v)} />
              <SliderField label="Monthly Contribution" value={Number(inputs.monthlyContribution)} min={0} max={10000} step={50} prefix="$" onChange={(v) => setField('monthlyContribution', v)} />
              <SliderField label="Annual Return Rate" value={Number(inputs.annualRate)} min={0.5} max={20} step={0.1} suffix="%" onChange={(v) => setField('annualRate', v)} />
              <SliderField label="Time Horizon" value={Number(inputs.years)} min={1} max={50} step={1} suffix="yrs" onChange={(v) => setField('years', v)} />
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Compounding Frequency</label>
                <div className="grid grid-cols-4 gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 p-1">
                  {(['daily', 'monthly', 'quarterly', 'annually'] as const).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setField('compoundingFrequency', freq)}
                      className={`py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                        inputs.compoundingFrequency === freq
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
              <SliderField label="Expected Inflation Rate" value={Number(inputs.inflationRate)} min={0} max={10} step={0.1} suffix="%" onChange={(v) => setField('inflationRate', v)} />
            </>
          )}

          {calculatorId === 'fire' && (
            <>
              <SliderField label="Current Age" value={Number(inputs.currentAge)} min={18} max={70} step={1} suffix="yrs" onChange={(v) => setField('currentAge', v)} />
              <SliderField label="Current Invested Portfolio" value={Number(inputs.currentPortfolio)} min={0} max={2000000} step={5000} prefix="$" onChange={(v) => setField('currentPortfolio', v)} />
              <SliderField label="Monthly Savings / Investments" value={Number(inputs.monthlySavings)} min={100} max={20000} step={100} prefix="$" onChange={(v) => setField('monthlySavings', v)} />
              <SliderField label="Annual Living Expenses" value={Number(inputs.annualExpenses)} min={15000} max={300000} step={1000} prefix="$" onChange={(v) => setField('annualExpenses', v)} />
              <SliderField label="Expected Annual Return" value={Number(inputs.annualReturn)} min={2} max={14} step={0.1} suffix="%" onChange={(v) => setField('annualReturn', v)} />
              <SliderField label="Expected Inflation" value={Number(inputs.inflationRate)} min={0} max={8} step={0.1} suffix="%" onChange={(v) => setField('inflationRate', v)} />
              <SliderField label="Safe Withdrawal Rate" value={Number(inputs.withdrawalRate)} min={2.5} max={6} step={0.25} suffix="%" onChange={(v) => setField('withdrawalRate', v)} />
            </>
          )}

          {calculatorId === 'retirement' && (
            <>
              <SliderField label="Current Age" value={Number(inputs.currentAge)} min={18} max={75} step={1} suffix="yrs" onChange={(v) => setField('currentAge', v)} />
              <SliderField label="Target Retirement Age" value={Number(inputs.retirementAge)} min={40} max={80} step={1} suffix="yrs" onChange={(v) => setField('retirementAge', v)} />
              <SliderField label="Life Expectancy" value={Number(inputs.lifeExpectancy)} min={75} max={100} step={1} suffix="yrs" onChange={(v) => setField('lifeExpectancy', v)} />
              <SliderField label="Current Retirement Savings" value={Number(inputs.currentSavings)} min={0} max={3000000} step={5000} prefix="$" onChange={(v) => setField('currentSavings', v)} />
              <SliderField label="Your Monthly Contribution" value={Number(inputs.monthlyContribution)} min={0} max={10000} step={50} prefix="$" onChange={(v) => setField('monthlyContribution', v)} />
              <SliderField label="Employer Match (Monthly)" value={Number(inputs.employerMatchMonthly)} min={0} max={4000} step={25} prefix="$" onChange={(v) => setField('employerMatchMonthly', v)} />
              <SliderField label="Desired Annual Income (Today $)" value={Number(inputs.desiredAnnualIncome)} min={20000} max={300000} step={1000} prefix="$" onChange={(v) => setField('desiredAnnualIncome', v)} />
              <SliderField label="Pre-Retirement Return" value={Number(inputs.preRetirementReturn)} min={2} max={13} step={0.1} suffix="%" onChange={(v) => setField('preRetirementReturn', v)} />
              <SliderField label="Post-Retirement Return" value={Number(inputs.postRetirementReturn)} min={1} max={10} step={0.1} suffix="%" onChange={(v) => setField('postRetirementReturn', v)} />
              <SliderField label="Annual Inflation Rate" value={Number(inputs.inflationRate)} min={0} max={8} step={0.1} suffix="%" onChange={(v) => setField('inflationRate', v)} />
            </>
          )}

          {calculatorId === 'mortgage' && (
            <>
              <SliderField label="Home Purchase Price" value={Number(inputs.homePrice)} min={50000} max={2500000} step={5000} prefix="$" onChange={(v) => setField('homePrice', v)} />
              <SliderField label="Down Payment" value={Number(inputs.downPaymentPercent)} min={0} max={60} step={0.5} suffix="%" onChange={(v) => setField('downPaymentPercent', v)} />
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Loan Term</label>
                <div className="grid grid-cols-4 gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 p-1">
                  {[10, 15, 20, 30].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setField('loanTermYears', term)}
                      className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                        Number(inputs.loanTermYears) === term
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {term} yr
                    </button>
                  ))}
                </div>
              </div>
              <SliderField label="Interest Rate" value={Number(inputs.interestRate)} min={1} max={12} step={0.05} suffix="%" onChange={(v) => setField('interestRate', v)} />
              <SliderField label="Extra Monthly Principal" value={Number(inputs.extraMonthlyPayment)} min={0} max={5000} step={25} prefix="$" onChange={(v) => setField('extraMonthlyPayment', v)} />
              <SliderField label="Annual Property Tax" value={Number(inputs.propertyTaxAnnual)} min={0} max={35000} step={100} prefix="$" onChange={(v) => setField('propertyTaxAnnual', v)} />
              <SliderField label="Annual Home Insurance" value={Number(inputs.homeInsuranceAnnual)} min={0} max={12000} step={50} prefix="$" onChange={(v) => setField('homeInsuranceAnnual', v)} />
              <SliderField label="Monthly HOA Dues" value={Number(inputs.hoaMonthly)} min={0} max={2000} step={25} prefix="$" onChange={(v) => setField('hoaMonthly', v)} />
            </>
          )}

          {calculatorId === 'loan' && (
            <>
              <SliderField label="Loan Amount" value={Number(inputs.loanAmount)} min={500} max={500000} step={500} prefix="$" onChange={(v) => setField('loanAmount', v)} />
              <SliderField label="Interest Rate (APR)" value={Number(inputs.interestRate)} min={0.5} max={36} step={0.1} suffix="%" onChange={(v) => setField('interestRate', v)} />
              <SliderField label="Loan Term" value={Number(inputs.termMonths)} min={6} max={240} step={6} suffix="mo" onChange={(v) => setField('termMonths', v)} />
              <SliderField label="Extra Monthly Payment" value={Number(inputs.extraMonthlyPayment)} min={0} max={3000} step={25} prefix="$" onChange={(v) => setField('extraMonthlyPayment', v)} />
              <SliderField label="Origination Fee" value={Number(inputs.originationFeePercent)} min={0} max={8} step={0.25} suffix="%" onChange={(v) => setField('originationFeePercent', v)} />
            </>
          )}

          {calculatorId === 'roi' && (
            <>
              <SliderField label="Initial Investment" value={Number(inputs.initialInvestment)} min={500} max={2000000} step={500} prefix="$" onChange={(v) => setField('initialInvestment', v)} />
              <SliderField label="Additional / Holding Costs" value={Number(inputs.additionalCosts)} min={0} max={500000} step={500} prefix="$" onChange={(v) => setField('additionalCosts', v)} />
              <SliderField label="Final / Exit Value" value={Number(inputs.finalValue)} min={0} max={5000000} step={1000} prefix="$" onChange={(v) => setField('finalValue', v)} />
              <SliderField label="Annual Cash Flow / Income" value={Number(inputs.annualCashFlow)} min={-20000} max={250000} step={250} prefix="$" onChange={(v) => setField('annualCashFlow', v)} />
              <SliderField label="Holding Period" value={Number(inputs.years)} min={0.5} max={40} step={0.5} suffix="yrs" onChange={(v) => setField('years', v)} />
              <SliderField label="Estimated Tax Rate" value={Number(inputs.taxRatePercent)} min={0} max={45} step={1} suffix="%" onChange={(v) => setField('taxRatePercent', v)} />
            </>
          )}
        </div>

        {/* Right: Results + Chart */}
        <div className="lg:col-span-7 space-y-6">
          {/* 4 KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {computed.kpis.map((kpi) => (
              <div
                key={kpi.label}
                className={`rounded-xl border p-5 ${
                  kpi.accent
                    ? 'border-emerald-600/30 dark:border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {kpi.label}
                </div>
                <div
                  className={`mt-1.5 font-mono text-2xl font-semibold tabular-nums tracking-tight ${
                    kpi.accent
                      ? 'text-emerald-800 dark:text-emerald-300'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive SVG Chart */}
          <ProjectionChart
            title={computed.chartTitle}
            subtitle={computed.chartSubtitle}
            xLabels={computed.xLabels}
            series={computed.series}
          />
        </div>
      </div>

      {/* Year-by-Year / Amortization Schedule */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Year-by-Year Projection Schedule
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {visibleRows.length} of {computed.rows.length} periods
            </p>
          </div>
          <div className="no-print flex items-center gap-2">
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Export CSV</span>
            </button>
            {computed.rows.length > 10 && (
              <button
                type="button"
                onClick={() => setShowAllRows((v) => !v)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{showAllRows ? 'Show Less' : `Show All (${computed.rows.length})`}</span>
                {showAllRows ? (
                  <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                {computed.headers.map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3 font-medium whitespace-nowrap ${
                      i === 0 ? 'text-left' : 'text-right'
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {visibleRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`px-4 py-2.5 whitespace-nowrap ${
                        cIdx === 0
                          ? 'font-medium text-slate-900 dark:text-slate-100 text-left'
                          : 'font-mono tabular-nums text-slate-700 dark:text-slate-300 text-right'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
