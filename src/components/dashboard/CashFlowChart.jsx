import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';

export const CashFlowChart = () => {
  const { transactions, formatMoney, currentCurrency } = useFinance();
  const { isDark } = useTheme();
  const [period, setPeriod] = useState('months'); // 'days' | 'months'

  // Aggregate cash flow data
  const chartData = useMemo(() => {
    if (period === 'months') {
      const monthMap = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();

      // Setup last 6 months in order
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = monthNames[d.getMonth()];
        monthMap[key] = { name: label, income: 0, expense: 0, net: 0 };
      }

      transactions.forEach((t) => {
        if (!t.date) return;
        const key = t.date.substring(0, 7);
        if (monthMap[key]) {
          const amt = Number(t.amount || 0);
          if (t.type === 'income') monthMap[key].income += amt;
          if (t.type === 'expense') monthMap[key].expense += amt;
        }
      });

      return Object.values(monthMap).map((m) => ({
        ...m,
        net: m.income - m.expense,
      }));
    } else {
      // Days mode: Last 14 days
      const dayMap = {};
      const now = new Date();
      for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const key = d.toISOString().split('T')[0];
        const label = `${d.getDate()}/${d.getMonth() + 1}`;
        dayMap[key] = { name: label, income: 0, expense: 0 };
      }

      transactions.forEach((t) => {
        if (!t.date) return;
        if (dayMap[t.date]) {
          const amt = Number(t.amount || 0);
          if (t.type === 'income') dayMap[t.date].income += amt;
          if (t.type === 'expense') dayMap[t.date].expense += amt;
        }
      });

      return Object.values(dayMap);
    }
  }, [transactions, period]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-2xl glass-panel bg-white/95 dark:bg-slate-900/95 shadow-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 font-sans">
          <p className="font-bold text-slate-700 dark:text-slate-300">{label}</p>
          <div className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Income:</span>
            <span>{formatMoney(payload[0]?.value || 0)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-rose-500 dark:text-rose-400 font-semibold">
            <span>Expense:</span>
            <span>{formatMoney(payload[1]?.value || 0)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Cash Flow Dynamics</h3>
          <p className="text-xs text-slate-400">Income vs. Expense over time</p>
        </div>
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setPeriod('months')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              period === 'months'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            6 Months
          </button>
          <button
            type="button"
            onClick={() => setPeriod('days')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              period === 'days'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            14 Days
          </button>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeFlowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expenseFlowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#334155' : '#F1F5F9'}
            />
            <XAxis
              dataKey="name"
              stroke={isDark ? '#94A3B8' : '#64748B'}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={isDark ? '#94A3B8' : '#64748B'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${currentCurrency.symbol}${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#incomeFlowGrad)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#F43F5E"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#expenseFlowGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
          <span className="text-slate-600 dark:text-slate-300">Income Inflow</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
          <span className="text-slate-600 dark:text-slate-300">Expense Outflow</span>
        </div>
      </div>
    </div>
  );
};

export default CashFlowChart;
