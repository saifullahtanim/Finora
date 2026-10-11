import React, { useState, useMemo } from 'react';
import {
  PiggyBank,
  Target,
  Sparkles,
  Calculator,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Flame,
  Plus,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const SavingsPlannerView = ({ onOpenAddGoal }) => {
  const {
    currentMonthIncome,
    currentMonthExpense,
    totalBalance,
    formatMoney,
    currentCurrency,
    addGoal,
    goals,
  } = useFinance();

  // 1. Target Goal Calculator State
  const [goalName, setGoalName] = useState('Emergency Fund');
  const [targetAmount, setTargetAmount] = useState('100000');
  const [initialSaved, setInitialSaved] = useState('15000');
  const [targetMonths, setTargetMonths] = useState('12');
  const [goalSavedSuccess, setGoalSavedSuccess] = useState(false);

  // Computed calculations for Target Goal
  const targetNum = parseFloat(targetAmount) || 0;
  const initialNum = parseFloat(initialSaved) || 0;
  const monthsNum = Math.max(1, parseInt(targetMonths, 10) || 1);
  const remainingToSave = Math.max(0, targetNum - initialNum);
  const monthlyRequired = remainingToSave / monthsNum;
  const dailyRequired = monthlyRequired / 30;

  // 2. Safe to Spend Today (Burn Rate)
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, daysInMonth - now.getDate());
  const effectiveIncome = currentMonthIncome > 0 ? currentMonthIncome : 50000;
  const targetMonthlySavings = effectiveIncome * 0.2; // 20%
  const disposableBudget = Math.max(0, effectiveIncome - currentMonthExpense - targetMonthlySavings);
  const safeToSpendDaily = disposableBudget / daysRemaining;

  // 3. 50/30/20 Rule Analysis
  const needsBudget = effectiveIncome * 0.5;
  const wantsBudget = effectiveIncome * 0.3;
  const savingsBudget = effectiveIncome * 0.2;

  // Estimate current allocation
  const currentSavings = Math.max(0, currentMonthIncome - currentMonthExpense);
  const currentNeeds = currentMonthExpense * 0.65; // ~65% estimated
  const currentWants = currentMonthExpense * 0.35;

  const handleCreateGoalFromPlan = (e) => {
    e.preventDefault();
    if (!goalName.trim() || targetNum <= 0) return;

    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + monthsNum);

    addGoal({
      name: goalName.trim(),
      targetAmount: targetNum,
      currentAmount: initialNum,
      targetDate: targetDate.toISOString().split('T')[0],
      color: '#00875A',
      icon: 'Target',
      category: 'Savings Plan',
    });

    setGoalSavedSuccess(true);
    setTimeout(() => setGoalSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#00875A] uppercase tracking-wider mb-1">
            <PiggyBank className="w-4 h-4" />
            <span>Smart Savings Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Savings Planner & Wealth Architect
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Inspired by proven wealth management frameworks: Calculate required daily contributions, audit your 50/30/20 budget allocations, and stay on track.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-[#E6F4EA] dark:bg-[#00875A]/20 border border-[#00875A]/30 text-right">
            <span className="text-[10px] uppercase font-bold text-[#00875A] block">
              Safe to Spend Today
            </span>
            <span className="text-xl font-black text-[#00875A] font-mono">
              {formatMoney(safeToSpendDaily)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {daysRemaining} days left in month
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Calculator & 50/30/20 Rule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Target Goal Calculator */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Target Savings Calculator
                </h3>
                <p className="text-xs text-slate-400">Pace planning for major financial milestones</p>
              </div>
            </div>

            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 border border-purple-200 dark:border-purple-800">
              Interactive
            </span>
          </div>

          <form onSubmit={handleCreateGoalFromPlan} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  required
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g. 6-Month Emergency Fund"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00875A]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Amount ({currentCurrency.code})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="100000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00875A]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Already Saved ({currentCurrency.code})
                </label>
                <input
                  type="number"
                  step="any"
                  value={initialSaved}
                  onChange={(e) => setInitialSaved(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00875A]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Timeline (Months)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={targetMonths}
                  onChange={(e) => setTargetMonths(e.target.value)}
                  placeholder="12"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00875A]/20"
                />
              </div>
            </div>

            {/* Calculated Breakdown Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-semibold">Remaining Needed</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
                    {formatMoney(remainingToSave)}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-semibold">Monthly Deposit</span>
                  <span className="text-sm font-black text-[#00875A] font-mono mt-0.5 block">
                    {formatMoney(monthlyRequired)}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 block font-semibold">Daily Savings Target</span>
                  <span className="text-sm font-black text-purple-600 dark:text-purple-400 font-mono mt-0.5 block">
                    {formatMoney(dailyRequired)}
                  </span>
                </div>
              </div>

              {/* Progress meter */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-500">Starting Progress</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono">
                    {targetNum > 0 ? Math.min(100, Math.round((initialNum / targetNum) * 100)) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00875A] rounded-full transition-all duration-500"
                    style={{
                      width: `${targetNum > 0 ? Math.min(100, Math.round((initialNum / targetNum) * 100)) : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                {goalSavedSuccess ? '✓ Goal added to your active savings goals!' : '* Click to add this to your live tracking list'}
              </span>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Save to Goals</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: 50 / 30 / 20 Framework Audit */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-[#00875A] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    50 / 30 / 20 Budget Rule
                  </h3>
                  <p className="text-xs text-slate-400">Golden rule of income distribution</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-3">
              {/* 50% Needs */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                    50% Needs (Rent, Utilities, Food)
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    {formatMoney(needsBudget)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full w-1/2" />
                </div>
                <p className="text-[10px] text-slate-400">
                  Fixed essentials that keep your life operating smoothly.
                </p>
              </div>

              {/* 30% Wants */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    30% Wants (Dining, Shopping, Fun)
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    {formatMoney(wantsBudget)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[30%]" />
                </div>
                <p className="text-[10px] text-slate-400">
                  Lifestyle choices, entertainment, dining out, and hobbies.
                </p>
              </div>

              {/* 20% Savings & Debt Reduction */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00875A] inline-block" />
                    20% Savings & Debt Freedom
                  </span>
                  <span className="font-mono text-[#00875A]">
                    {formatMoney(savingsBudget)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00875A] rounded-full w-1/5" />
                </div>
                <p className="text-[10px] text-slate-400">
                  DPS, emergency cushion, retirement, and loan payoffs.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300">
            💡 <strong>Pro Tip:</strong> Setting aside 20% ({formatMoney(savingsBudget)}) right on pay day builds an emergency cushion of {formatMoney(savingsBudget * 6)} in just 6 months.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsPlannerView;
