import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import IconHelper from '../common/IconHelper';

export const CategoryExpenseChart = () => {
  const { transactions, formatMoney, currentMonthExpense, getCategory } = useFinance();

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const { data, total } = useMemo(() => {
    const categoryTotals = {};

    transactions.forEach((t) => {
      if (t.type === 'expense' && t.date && t.date.startsWith(currentMonthStr)) {
        const catId = t.category || 'other_expense';
        categoryTotals[catId] = (categoryTotals[catId] || 0) + Number(t.amount || 0);
      }
    });

    let sum = 0;
    const items = Object.entries(categoryTotals).map(([catId, amount]) => {
      const cat = getCategory(catId, 'expense');
      sum += amount;
      return {
        id: catId,
        name: cat.name,
        value: amount,
        color: cat.color,
        icon: cat.icon,
      };
    });

    // Sort descending
    items.sort((a, b) => b.value - a.value);

    return { data: items, total: sum };
  }, [transactions, currentMonthStr]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="p-3 rounded-2xl glass-panel bg-white/95 dark:bg-slate-900/95 shadow-xl border border-slate-200 dark:border-slate-800 text-xs">
          <p className="font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
          <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
            {formatMoney(item.value)} ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Spending by Category</h3>
          <p className="text-xs text-slate-400">Current Month Expense Distribution</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {data.length} Categories
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-slate-400 text-center">
          <p className="text-sm font-semibold">No expense records this month yet.</p>
          <p className="text-xs">Add an expense to view category breakdown.</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6 my-auto">
          {/* Donut Chart */}
          <div className="w-48 h-48 sm:w-52 sm:h-52 relative flex items-center justify-center flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {formatMoney(total)}
              </span>
            </div>
          </div>

          {/* Ranked List */}
          <div className="flex-1 w-full space-y-2 max-h-56 overflow-y-auto pr-1">
            {data.slice(0, 5).map((item) => {
              const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-md flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                      {formatMoney(item.value)}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 w-8 text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryExpenseChart;
