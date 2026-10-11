import React, { useState, useMemo } from 'react';
import {
  Zap,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Calculator,
  Calendar,
  DollarSign,
  Plus,
  Clock,
  Sparkles,
  HelpCircle,
  Percent,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export const VelocityBankingView = ({ onOpenAddDebt }) => {
  const {
    debts,
    totalBalance,
    currentMonthIncome,
    currentMonthExpense,
    formatMoney,
    currentCurrency,
    payDebtInstallment,
  } = useFinance();

  // 1. Velocity Banking Simulator State
  const [loanBalance, setLoanBalance] = useState('150000');
  const [loanInterestRate, setLoanInterestRate] = useState('11.5');
  const [monthlySurplus, setMonthlySurplus] = useState('15000');
  const [minimumPayment, setMinimumPayment] = useState('7500');

  // Strategy Mode: 'snowball' or 'avalanche'
  const [payoffStrategy, setPayoffStrategy] = useState('avalanche');

  // 2. Net Worth Forecaster State
  const [startingWealth, setStartingWealth] = useState(String(Math.max(10000, totalBalance)));
  const [monthlyContribution, setMonthlyContribution] = useState('10000');
  const [annualGrowthRate, setAnnualGrowthRate] = useState('8.5'); // 8.5%

  // Velocity Banking Calculation
  const balanceNum = parseFloat(loanBalance) || 0;
  const rateNum = (parseFloat(loanInterestRate) || 0) / 100;
  const surplusNum = parseFloat(monthlySurplus) || 0;
  const minPayNum = parseFloat(minimumPayment) || 0;

  // Conventional payoff calculation (paying min payment)
  const conventionalMonths = useMemo(() => {
    if (minPayNum <= 0 || balanceNum <= 0) return 0;
    const monthlyRate = rateNum / 12;
    if (minPayNum <= balanceNum * monthlyRate) return 999; // Interest exceeds payment
    const months =
      Math.log(minPayNum / (minPayNum - balanceNum * monthlyRate)) / Math.log(1 + monthlyRate);
    return Math.ceil(months);
  }, [balanceNum, rateNum, minPayNum]);

  // Velocity payoff calculation (injecting surplus cash flow)
  const velocityMonths = useMemo(() => {
    const totalMonthlyAttack = minPayNum + surplusNum;
    if (totalMonthlyAttack <= 0 || balanceNum <= 0) return 0;
    const monthlyRate = rateNum / 12;
    if (totalMonthlyAttack <= balanceNum * monthlyRate) return 999;
    const months =
      Math.log(totalMonthlyAttack / (totalMonthlyAttack - balanceNum * monthlyRate)) /
      Math.log(1 + monthlyRate);
    return Math.ceil(months);
  }, [balanceNum, rateNum, minPayNum, surplusNum]);

  const monthsSaved = Math.max(0, conventionalMonths - velocityMonths);
  const totalConventionalInterest = Math.max(0, conventionalMonths * minPayNum - balanceNum);
  const totalVelocityInterest = Math.max(0, velocityMonths * (minPayNum + surplusNum) - balanceNum);
  const interestSaved = Math.max(0, totalConventionalInterest - totalVelocityInterest);

  // Ranked Debts (Snowball vs Avalanche)
  const sortedDebts = useMemo(() => {
    const list = [...debts];
    if (payoffStrategy === 'snowball') {
      // Smallest balance first
      return list.sort((a, b) => Number(a.remainingAmount || 0) - Number(b.remainingAmount || 0));
    } else {
      // Highest interest rate first
      return list.sort((a, b) => Number(b.interestRate || 0) - Number(a.interestRate || 0));
    }
  }, [debts, payoffStrategy]);

  // Wealth Growth Projection (Compound Interest across 1, 5, 10, 20 Years)
  const forecastData = useMemo(() => {
    const start = parseFloat(startingWealth) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const r = (parseFloat(annualGrowthRate) || 0) / 100 / 12;

    const milestones = [0, 1, 3, 5, 10, 15, 20];
    return milestones.map((year) => {
      const months = year * 12;
      let total = start * Math.pow(1 + r, months);
      if (r > 0 && months > 0) {
        total += monthly * ((Math.pow(1 + r, months) - 1) / r);
      } else if (months > 0) {
        total += monthly * months;
      }

      return {
        year: year === 0 ? 'Now' : `Yr ${year}`,
        wealth: Math.round(total),
      };
    });
  }, [startingWealth, monthlyContribution, annualGrowthRate]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Debt Acceleration Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Velocity Banking & Debt Payoff Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Inspired by financial acceleration strategies: Eliminate amortized loans, compare Snowball vs. Avalanche priorities, and forecast long-term compound wealth.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAddDebt && (
            <button
              type="button"
              onClick={onOpenAddDebt}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Debt / Loan</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 1: Velocity Banking Simulator */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Velocity Banking Acceleration Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Harness cash flow surplus to crush principal balance early
              </p>
            </div>
          </div>

          <div className="p-1 px-3 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 text-xs font-bold border border-emerald-200/60 dark:border-emerald-800/40">
            Estimated Savings: {formatMoney(interestSaved)}
          </div>
        </div>

        {/* Inputs & Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Simulator Inputs */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Loan Principal ({currentCurrency.code})
              </label>
              <input
                type="number"
                value={loanBalance}
                onChange={(e) => setLoanBalance(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-xs focus:ring-2 focus:ring-[#00875A]/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Interest Rate (% APR)
              </label>
              <input
                type="number"
                step="0.1"
                value={loanInterestRate}
                onChange={(e) => setLoanInterestRate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-xs focus:ring-2 focus:ring-[#00875A]/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Minimum Monthly EMI ({currentCurrency.code})
              </label>
              <input
                type="number"
                value={minimumPayment}
                onChange={(e) => setMinimumPayment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-xs focus:ring-2 focus:ring-[#00875A]/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Cash Flow Surplus Injection ({currentCurrency.code})
              </label>
              <input
                type="number"
                value={monthlySurplus}
                onChange={(e) => setMonthlySurplus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-xs focus:ring-2 focus:ring-[#00875A]/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Right: Comparative Payoff Matrix */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Standard Path */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Standard Amortization
              </span>
              <h4 className="text-xl font-black text-slate-800 dark:text-slate-200 font-mono">
                {conventionalMonths < 999 ? `${conventionalMonths} Months` : 'Perpetual Debt'}
              </h4>
              <p className="text-xs text-slate-500">
                Paying minimum required EMI ({formatMoney(minPayNum)}/mo)
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                <span className="text-slate-400">Total Interest Cost: </span>
                <span className="font-bold text-rose-500 font-mono">
                  {formatMoney(totalConventionalInterest)}
                </span>
              </div>
            </div>

            {/* Velocity Banking Path */}
            <div className="p-4 rounded-2xl bg-[#E6F4EA] dark:bg-[#00875A]/15 border border-[#00875A]/40 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00875A] block">
                Velocity Banking Path ⚡
              </span>
              <h4 className="text-xl font-black text-[#00875A] font-mono">
                {velocityMonths} Months
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Injecting surplus ({formatMoney(minPayNum + surplusNum)}/mo total)
              </p>
              <div className="pt-2 border-t border-[#00875A]/20 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500">Debt-Free: </span>
                  <strong className="text-[#00875A]">
                    {monthsSaved} Months Earlier
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Debt Snowball vs. Avalanche Strategy Ranking */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Debt Payoff Strategy Matrix
            </h3>
            <p className="text-xs text-slate-400">
              {payoffStrategy === 'avalanche'
                ? 'Avalanche Strategy: Prioritizing highest interest rates to save maximum interest'
                : 'Snowball Strategy: Prioritizing smallest balances first for psychological momentum'}
            </p>
          </div>

          {/* Strategy Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setPayoffStrategy('avalanche')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                payoffStrategy === 'avalanche'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Debt Avalanche (Max Savings)
            </button>
            <button
              type="button"
              onClick={() => setPayoffStrategy('snowball')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                payoffStrategy === 'snowball'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Debt Snowball (Fast Wins)
            </button>
          </div>
        </div>

        {debts.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold">No active debts registered. You are debt-free!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDebts.map((debt, index) => {
              const remaining = Number(debt.remainingAmount || 0);
              const total = Number(debt.totalAmount || 1);
              const percent = Math.min(100, Math.round(((total - remaining) / total) * 100));

              return (
                <div
                  key={debt.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        Priority #{index + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {debt.name}
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-500">
                      {debt.interestRate}% APR
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
                      <span>Remaining Balance</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {formatMoney(remaining)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${Math.max(5, 100 - percent)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400">Monthly EMI: {formatMoney(debt.monthlyEMI)}</span>
                    <button
                      type="button"
                      onClick={() => payDebtInstallment(debt.id, debt.monthlyEMI)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white text-[11px] font-bold transition-all cursor-pointer"
                    >
                      Pay EMI
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Row 3: Compound Wealth & Net Worth Forecaster (1, 5, 10, 20 Years) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00875A]" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Compound Wealth & Net Worth Forecaster
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Long-term wealth projection with monthly contributions and compound compounding
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-black text-[#00875A]">
              20-Yr Projection: {formatMoney(forecastData[forecastData.length - 1]?.wealth)}
            </span>
          </div>
        </div>

        {/* Sliders and Projection Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-4 space-y-4">
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                <span>Monthly Investment ({currentCurrency.code})</span>
                <span className="font-mono text-[#00875A]">{formatMoney(monthlyContribution)}</span>
              </label>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="w-full accent-[#00875A] cursor-pointer"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                <span>Expected Annual Growth (%)</span>
                <span className="font-mono text-purple-600">{annualGrowthRate}%</span>
              </label>
              <input
                type="range"
                min="4"
                max="20"
                step="0.5"
                value={annualGrowthRate}
                onChange={(e) => setAnnualGrowthRate(e.target.value)}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">5-Year Net Worth:</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">
                  {formatMoney(forecastData.find((d) => d.year === 'Yr 5')?.wealth || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">10-Year Net Worth:</span>
                <span className="font-bold font-mono text-[#00875A]">
                  {formatMoney(forecastData.find((d) => d.year === 'Yr 10')?.wealth || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Area Chart */}
          <div className="lg:col-span-8 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00875A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00875A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip
                  formatter={(val) => [formatMoney(val), 'Projected Wealth']}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontWeight: 'bold',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="wealth"
                  stroke="#00875A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#wealthGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VelocityBankingView;
