import React from 'react';
import { ShieldCheck, TrendingUp, PiggyBank, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const FinancialHealthScore = ({ onOpenAnalyticsTab, onOpenBudgetsTab }) => {
  const {
    totalBalance,
    currentMonthIncome,
    currentMonthExpense,
    savingsRate,
    budgets,
    transactions,
    formatMoney,
  } = useFinance();

  // 1. Calculate Savings Component (0 - 35 points)
  let savingsScore = 0;
  if (savingsRate >= 25) savingsScore = 35;
  else if (savingsRate >= 15) savingsScore = 28;
  else if (savingsRate >= 5) savingsScore = 20;
  else if (savingsRate >= 0) savingsScore = 12;
  else savingsScore = 5;

  // 2. Calculate Budget Adherence (0 - 35 points)
  let budgetScore = 30; // default baseline
  if (budgets.length > 0) {
    const totalLimit = budgets.reduce((acc, b) => acc + Number(b.limit || 0), 0);
    const totalSpentInBudgets = budgets.reduce((acc, b) => {
      const spent = transactions
        .filter((t) => t.type === 'expense' && t.category === b.categoryId)
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      return acc + spent;
    }, 0);

    if (totalLimit > 0) {
      const budgetUsage = (totalSpentInBudgets / totalLimit) * 100;
      if (budgetUsage <= 70) budgetScore = 35;
      else if (budgetUsage <= 90) budgetScore = 30;
      else if (budgetUsage <= 100) budgetScore = 22;
      else budgetScore = 10;
    }
  }

  // 3. Calculate Liquidity / Emergency Buffer (0 - 30 points)
  let liquidityScore = 15;
  const avgMonthlyExpense = currentMonthExpense > 0 ? currentMonthExpense : 25000;
  const monthsCovered = totalBalance > 0 ? (totalBalance / avgMonthlyExpense).toFixed(1) : 0;

  if (monthsCovered >= 6) liquidityScore = 30;
  else if (monthsCovered >= 3) liquidityScore = 25;
  else if (monthsCovered >= 1) liquidityScore = 20;
  else liquidityScore = 10;

  const totalScore = Math.min(100, Math.max(10, Math.round(savingsScore + budgetScore + liquidityScore)));

  // Status configuration
  let statusText = 'Excellent';
  let statusColor = 'text-emerald-500';
  let strokeColor = '#10B981';
  let badgeBg = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';

  if (totalScore < 50) {
    statusText = 'Needs Attention';
    statusColor = 'text-rose-500';
    strokeColor = '#F43F5E';
    badgeBg = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  } else if (totalScore < 75) {
    statusText = 'Good';
    statusColor = 'text-amber-500';
    strokeColor = '#F59E0B';
    badgeBg = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
  }

  // Radial calculation (radius 42, circumference ~ 264)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  return (
    <div className="p-6 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Financial Health</h3>
              <p className="text-xs text-slate-400">Holistic financial wellness rating</p>
            </div>
          </div>

          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeBg}`}>
            {statusText}
          </span>
        </div>

        {/* Gauge & Score overview */}
        <div className="flex items-center gap-5 my-3">
          <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="9"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={strokeColor}
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                {totalScore}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                / 100
              </span>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Cash Reserve:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {monthsCovered > 0 ? `${monthsCovered} mo buffer` : 'Setup required'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Savings Margin:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {savingsRate}%
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Budgets Tracked:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {budgets.length} Active
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
          {totalScore >= 80
            ? 'Finances are in prime condition. Keep maintaining high savings.'
            : totalScore >= 60
            ? 'Solid foundation. Consider capping variable expenses.'
            : 'Focus on building at least 1 month emergency buffer.'}
        </span>

        {onOpenAnalyticsTab && (
          <button
            type="button"
            onClick={onOpenAnalyticsTab}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 flex-shrink-0 cursor-pointer"
          >
            <span>Breakdown</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FinancialHealthScore;
