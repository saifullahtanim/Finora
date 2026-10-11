import React, { useState } from 'react';
import {
  CalendarClock,
  Plus,
  Check,
  RotateCcw,
  Trash2,
  Edit2,
  CreditCard,
  Zap,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import IconHelper from '../common/IconHelper';

export const PlannedPaymentsView = ({ onOpenAddPlanned, onEditPlanned }) => {
  const {
    plannedPayments,
    accounts,
    deletePlannedPayment,
    markPlannedPaid,
    updatePlannedPayment,
    formatMoney,
  } = useFinance();

  const [filter, setFilter] = useState('all'); // 'all' | 'upcoming' | 'paid'

  const filteredBills = plannedPayments.filter((p) => {
    if (filter === 'upcoming') return p.status === 'upcoming';
    if (filter === 'paid') return p.status === 'paid';
    return true;
  });

  const totalMonthlyCost = plannedPayments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );
  const totalUpcomingCost = plannedPayments
    .filter((p) => p.status === 'upcoming')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Subscriptions & Fixed Commitments
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              {formatMoney(totalUpcomingCost)}
            </h2>
            <span className="text-sm font-semibold text-slate-400">
              pending / {formatMoney(totalMonthlyCost)} total monthly
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracking {plannedPayments.length} recurring services and bills
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({plannedPayments.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('upcoming')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'upcoming'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setFilter('paid')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'paid'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Settled
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenAddPlanned}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Bill</span>
          </button>
        </div>
      </div>

      {/* Bills List / Grid */}
      {filteredBills.length === 0 ? (
        <div className="py-20 text-center text-slate-400 glass-panel bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <CalendarClock className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No planned bills in this view
          </h4>
          <p className="text-xs mt-1 mb-4">Never miss another utility, rent, or SaaS renewal.</p>
          <button
            type="button"
            onClick={onOpenAddPlanned}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 shadow-sm"
          >
            Schedule a Recurring Bill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBills.map((bill) => {
            const cat = EXPENSE_CATEGORIES.find((c) => c.id === bill.categoryId);
            const acc = accounts.find((a) => a.id === bill.accountId);
            const isPaid = bill.status === 'paid';

            return (
              <div
                key={bill.id}
                className={`p-6 rounded-3xl glass-panel bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between space-y-4 shadow-card hover:shadow-card-hover ${
                  isPaid
                    ? 'border-emerald-500/30 dark:border-emerald-500/20 opacity-80'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                      <IconHelper name={cat?.icon || 'CalendarClock'} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {bill.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400 capitalize">
                        {bill.frequency} • {cat?.name || 'General'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditPlanned(bill)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Bill"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePlannedPayment(bill.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Bill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Amount & Due Date */}
                <div className="flex items-baseline justify-between pt-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Due Date
                    </span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {bill.dueDate || 'Flexible'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Charge
                    </span>
                    <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                      {formatMoney(bill.amount)}
                    </span>
                  </div>
                </div>

                {/* Account & Status Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[120px]">{acc?.name || 'Any Account'}</span>
                  </div>

                  {isPaid ? (
                    <button
                      type="button"
                      onClick={() => updatePlannedPayment(bill.id, { status: 'upcoming' })}
                      className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-600"
                      title="Mark as upcoming again"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Paid (Undo)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markPlannedPaid(bill.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white font-bold text-xs transition-all shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Pay / Settle</span>
                    </button>
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

export default PlannedPaymentsView;
