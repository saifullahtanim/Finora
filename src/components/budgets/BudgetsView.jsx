import React from 'react';
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit2,
  TrendingDown,
  Calendar,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import IconHelper from '../common/IconHelper';

export const BudgetsView = ({ onOpenAddBudget, onEditBudget }) => {
  const { budgets, transactions, deleteBudget, formatMoney, getCategory } = useFinance();

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, daysInMonth - now.getDate());

  let totalLimit = 0;
  let totalSpent = 0;

  const budgetStats = budgets.map((b) => {
    const cat = getCategory(b.categoryId, 'expense');

    const spent = transactions
      .filter(
        (t) =>
          t.type === 'expense' &&
          t.category === b.categoryId &&
          t.date &&
          t.date.startsWith(currentMonthStr)
      )
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    totalLimit += Number(b.limit || 0);
    totalSpent += spent;

    const percent = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;
    const remaining = Math.max(0, b.limit - spent);
    const dailyAllowance = remaining / daysRemaining;

    return {
      ...b,
      name: cat.name,
      icon: cat.icon,
      spent,
      percent,
      remaining,
      dailyAllowance,
      isExceeded: spent > b.limit,
      isWarning: percent >= 80 && percent <= 100,
    };
  });

  const totalRemaining = Math.max(0, totalLimit - totalSpent);
  const overallPercent = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner: Total Budgets Health */}
      <div className="p-6 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Monthly Budget Capacity
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              {formatMoney(totalSpent)}
            </h2>
            <span className="text-base font-semibold text-slate-400">
              / {formatMoney(totalLimit)} allocated
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {daysRemaining} days left in the current cycle • Safe daily burn rate:{' '}
            <strong className="text-emerald-600 dark:text-emerald-400">
              {formatMoney(totalRemaining / daysRemaining)} / day
            </strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block pr-2">
            <span className="text-xs text-slate-400 block font-medium">Cycle Status</span>
            <span
              className={`text-sm font-black ${
                overallPercent > 100
                  ? 'text-rose-500'
                  : overallPercent >= 80
                  ? 'text-amber-500'
                  : 'text-emerald-500'
              }`}
            >
              {overallPercent}% Utilized
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenAddBudget}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create New Budget</span>
          </button>
        </div>
      </div>

      {/* Grid of Category Budgets */}
      {budgetStats.length === 0 ? (
        <div className="py-20 text-center text-slate-400 glass-panel bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <PieChart className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No budgets established
          </h4>
          <p className="text-xs mt-1 mb-4">Set spending caps to avoid overspending each month.</p>
          <button
            type="button"
            onClick={onOpenAddBudget}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 shadow-sm"
          >
            Add Your First Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgetStats.map((item) => {
            const barColor = item.isExceeded
              ? 'bg-rose-500'
              : item.isWarning
              ? 'bg-amber-500'
              : 'bg-emerald-500';

            return (
              <div
                key={item.id}
                className="p-6 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      <IconHelper name={item.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Monthly limit
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditBudget(item)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Budget"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteBudget(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Budget"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Numbers */}
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                      {formatMoney(item.spent)}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      of {formatMoney(item.limit)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${Math.min(100, item.percent)}%` }}
                    />
                  </div>
                </div>

                {/* Footer notes */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {item.percent}% spent
                  </span>

                  {item.isExceeded ? (
                    <span className="text-rose-500 font-bold flex items-center gap-1 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      +{formatMoney(item.spent - item.limit)} over
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      {formatMoney(item.remaining)} left ({formatMoney(item.dailyAllowance)}/d)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetsView;
