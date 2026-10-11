import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Receipt } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const SpendingCalendar = () => {
  const { transactions, formatMoney, currentCurrency } = useFinance();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayStr, setSelectedDayStr] = useState(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Days in current view month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Map expenses by day
  const dailySpendMap = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (t.type === 'expense' && t.date) {
        map[t.date] = (map[t.date] || 0) + Number(t.amount || 0);
      }
    });
    return map;
  }, [transactions]);

  // Transactions on currently selected day
  const selectedDayTransactions = useMemo(() => {
    return transactions.filter(
      (t) => t.date === selectedDayStr && t.type === 'expense'
    );
  }, [transactions, selectedDayStr]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="p-6 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
      {/* Month Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Daily Spending Calendar & Heatmap
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {monthNames[month]} {year}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-1 font-bold text-slate-400 text-[11px] uppercase">
            {d}
          </div>
        ))}

        {/* Empty padding days before month 1st */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-14 sm:h-16 rounded-xl bg-transparent" />
        ))}

        {/* Month days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const spent = dailySpendMap[dayStr] || 0;
          const isSelected = selectedDayStr === dayStr;

          // Intensity color
          let bgClass = 'bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';
          let indicatorClass = 'bg-slate-200 dark:bg-slate-700';

          if (spent > 0 && spent < 1500) {
            indicatorClass = 'bg-emerald-500';
          } else if (spent >= 1500 && spent < 5000) {
            indicatorClass = 'bg-amber-500';
          } else if (spent >= 5000) {
            indicatorClass = 'bg-rose-500';
          }

          return (
            <button
              key={dayStr}
              type="button"
              onClick={() => setSelectedDayStr(dayStr)}
              className={`h-14 sm:h-16 p-1.5 rounded-2xl flex flex-col justify-between items-center transition-all ${bgClass} ${
                isSelected
                  ? 'ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-[11px] font-bold">{dayNum}</span>

              {spent > 0 ? (
                <div className="flex flex-col items-center">
                  <span
                    className={`w-2 h-2 rounded-full mb-0.5 ${indicatorClass}`}
                  />
                  <span className="text-[10px] font-mono font-bold text-slate-800 dark:text-slate-200 truncate max-w-full">
                    {spent >= 1000 ? `${(spent / 1000).toFixed(1)}k` : spent}
                  </span>
                </div>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Details Preview */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Selected Day: {selectedDayStr}
          </span>
          <span className="text-slate-400 ml-2">
            ({selectedDayTransactions.length} expenses, total{' '}
            <strong className="text-rose-500 font-mono">
              {formatMoney(dailySpendMap[selectedDayStr] || 0)}
            </strong>
            )
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> &lt;1.5k (Low)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> 1.5k–5k (Medium)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> &gt;5k (High)
          </span>
        </div>
      </div>
    </div>
  );
};

export default SpendingCalendar;
