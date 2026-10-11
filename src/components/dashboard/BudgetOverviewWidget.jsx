import React from 'react';
import { ChevronRight, AlertTriangle, CheckCircle, PieChart, Plus } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import IconHelper from '../common/IconHelper';

export const BudgetOverviewWidget = ({ onOpenBudgetsTab, onOpenAddBudget }) => {
  const { budgets, transactions, formatMoney } = useFinance();

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = Math.max(1, daysInMonth - now.getDate());

  // Calculate spent per budget category
  const budgetStats = budgets.map((b) => {
    const cat = EXPENSE_CATEGORIES.find((c) => c.id === b.categoryId) || {
      name: 'General',
      icon: 'PieChart',
      color: '#10B981',
    };

    const spent = transactions
      .filter(
        (t) =>
          t.type === 'expense' &&
          t.category === b.categoryId &&
          t.date &&
          t.date.startsWith(currentMonthStr)
      )
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

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

  return (
    <div className="ios-widget rounded-[28px] p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-black/[0.05] dark:border-white/[0.08]">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">Active Budgets</h3>
          <p className="text-xs text-slate-400">Monthly Spending Limits & Velocity</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddBudget}
            className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
            title="Add Budget"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
          <button
            type="button"
            onClick={onOpenBudgetsTab}
            className="text-xs font-semibold text-[#007AFF] hover:underline flex items-center gap-0.5"
          >
            <span>All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {budgetStats.length === 0 ? (
        <div className="py-8 text-center text-slate-400">
          <PieChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold">No spending budgets configured yet.</p>
          <button
            type="button"
            onClick={onOpenAddBudget}
            className="mt-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 underline"
          >
            Set your first monthly budget
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {budgetStats.slice(0, 4).map((item) => {
            const barColor = item.isExceeded
              ? 'bg-[#FF3B30]'
              : item.isWarning
              ? 'bg-[#FF9500]'
              : 'bg-[#34C759]';

            return (
              <div key={item.id} className="space-y-1.5 p-2 rounded-[16px] hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-[10px] flex items-center justify-center text-white text-[11px] shadow-xs"
                      style={{ backgroundColor: item.color }}
                    >
                      <IconHelper name={item.icon} className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.name}
                    </span>
                    {item.isExceeded && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#FF3B30] bg-[#FF3B30]/10 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" /> Exceeded
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatMoney(item.spent)}
                    </span>
                    <span className="text-slate-400"> / {formatMoney(item.limit)}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-black/[0.05] dark:bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.min(100, item.percent)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{item.percent}% used</span>
                  <span>
                    {item.isExceeded
                      ? `${formatMoney(item.spent - item.limit)} over limit`
                      : `${formatMoney(item.remaining)} left (${formatMoney(item.dailyAllowance)}/day)`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetOverviewWidget;
