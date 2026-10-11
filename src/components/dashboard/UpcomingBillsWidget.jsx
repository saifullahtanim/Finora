import React from 'react';
import { CalendarClock, Check, ChevronRight, Plus } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import IconHelper from '../common/IconHelper';
import { EXPENSE_CATEGORIES } from '../../utils/constants';

export const UpcomingBillsWidget = ({ onOpenPlannedTab, onOpenAddPlanned }) => {
  const { plannedPayments, markPlannedPaid, formatMoney, accounts } = useFinance();

  const upcomingBills = plannedPayments.filter((p) => p.status === 'upcoming');

  return (
    <div className="ios-widget rounded-[28px] p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-black/[0.05] dark:border-white/[0.08]">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">Upcoming Bills</h3>
          <p className="text-xs text-slate-400">Scheduled Subscriptions & Due Dates</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddPlanned}
            className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
            title="Schedule New Bill"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
          <button
            type="button"
            onClick={onOpenPlannedTab}
            className="text-xs font-semibold text-[#007AFF] hover:underline flex items-center gap-0.5"
          >
            <span>All ({plannedPayments.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {upcomingBills.length === 0 ? (
        <div className="py-6 text-center text-slate-400">
          <CalendarClock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-xs font-semibold">No pending bills due soon!</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {upcomingBills.slice(0, 4).map((bill) => {
            const cat = EXPENSE_CATEGORIES.find((c) => c.id === bill.categoryId);
            const acc = accounts.find((a) => a.id === bill.accountId);
            const dueDate = bill.dueDate ? new Date(bill.dueDate) : null;
            const daysDiff = dueDate
              ? Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24))
              : null;

            return (
              <div
                key={bill.id}
                className="flex items-center justify-between p-3.5 rounded-[20px] bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] hover:border-black/[0.08] dark:hover:border-white/[0.1] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-[12px] bg-gradient-to-br from-[#FF9500] to-[#FF5E3A] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <IconHelper name={cat?.icon || 'CalendarClock'} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {bill.name}
                    </h5>
                    <p className="text-[11px] text-slate-400 truncate">
                      Due: {bill.dueDate || 'Soon'}{' '}
                      {daysDiff !== null && daysDiff >= 0 ? `(in ${daysDiff}d)` : '(Overdue)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {formatMoney(bill.amount)}
                    </p>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[80px]">
                      {acc?.name || 'Any'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => markPlannedPaid(bill.id)}
                    className="w-7 h-7 rounded-full bg-[#34C759]/15 hover:bg-[#34C759] text-[#34C759] hover:text-white flex items-center justify-center transition-all shadow-xs"
                    title="Mark Settled & Create Expense"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingBillsWidget;
