import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import {
  TrendingDown,
  TrendingUp,
  ArrowRightLeft,
  Users,
  Sparkles,
  Calendar,
  CheckCircle,
  Plus,
  RefreshCw,
  Download,
} from 'lucide-react';

export const GreetingHeader = ({
  onOpenAddExpense,
  onOpenAddIncome,
  onOpenTransfer,
  onOpenBillSplitter,
  onOpenExport,
}) => {
  const { currentUser, isGuest } = useAuth();
  const {
    formatMoney,
    currentMonthExpense,
    currentMonthIncome,
    transactions,
    plannedPayments,
    loadSampleDemoData,
    clearToFreshDashboard,
  } = useFinance();

  const hour = new Date().getHours();
  let greeting = 'Hello';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  else greeting = 'Good evening';

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Friend';
  const hasTransactions = transactions.length > 0;

  // Find next upcoming bill
  const nextBill = plannedPayments.find((p) => p.status === 'upcoming');

  const handleStartFresh = () => {
    if (
      window.confirm(
        'Are you sure you want to start fresh with ৳0.00 balances and 0 records? You will be able to enter your own real cash, bKash & bank values.'
      )
    ) {
      clearToFreshDashboard();
    }
  };

  return (
    <div className="p-6 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-5 animate-fade-in">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {greeting}, {firstName}! 👋
          </h2>
          {isGuest ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Demo Mode
            </span>
          ) : !hasTransactions ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Fresh Account (৳ 0.00)
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Live Account
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {!hasTransactions ? (
            <span>
              Your dashboard is clean and ready. Enter your initial cash, bKash, or bank balances below to begin.
            </span>
          ) : nextBill ? (
            <span>
              💡 Next bill: <strong className="text-slate-700 dark:text-slate-200">{nextBill.name}</strong> ({formatMoney(nextBill.amount)}) due on {nextBill.dueDate}.
            </span>
          ) : (
            <span>
              Everything is on track. You've earned <strong className="text-emerald-600 dark:text-emerald-400">{formatMoney(currentMonthIncome)}</strong> and spent <strong className="text-rose-500">{formatMoney(currentMonthExpense)}</strong> this month.
            </span>
          )}
        </p>
      </div>

      {/* Quick Action Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={onOpenAddExpense}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Add Expense</span>
        </button>

        <button
          type="button"
          onClick={onOpenAddIncome}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Add Income</span>
        </button>

        <button
          type="button"
          onClick={onOpenTransfer}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Transfer</span>
        </button>

        <button
          type="button"
          onClick={onOpenBillSplitter}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Split Bill</span>
        </button>

        {onOpenExport && (
          <button
            type="button"
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Export transactions statement"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>
        )}

        {hasTransactions ? (
          <button
            type="button"
            onClick={handleStartFresh}
            title="Reset to ৳0.00 clean state"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Start Fresh (৳0)</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={loadSampleDemoData}
            title="Load sample transactions for preview"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Data</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default GreetingHeader;
