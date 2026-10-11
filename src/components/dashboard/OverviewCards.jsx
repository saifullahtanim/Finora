import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const OverviewCards = ({ onOpenAddTx, isPrivacyMode, togglePrivacyMode }) => {
  const {
    totalBalance,
    currentMonthIncome,
    currentMonthExpense,
    savingsRate,
    formatMoney,
    accounts,
  } = useFinance();

  const netSavings = currentMonthIncome - currentMonthExpense;

  const displayMoney = (amt, options = {}) => {
    if (isPrivacyMode) return '••••••';
    return formatMoney(amt, options);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Net Worth */}
      <div className="relative overflow-hidden p-5 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Net Worth</span>
            {togglePrivacyMode && (
              <button
                type="button"
                onClick={togglePrivacyMode}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer p-0.5"
                title={isPrivacyMode ? 'Show Balances' : 'Hide Balances (Privacy Mode)'}
              >
                {isPrivacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            {displayMoney(totalBalance)}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Across {accounts.length} active wallets</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Liquid Assets</span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 2. Monthly Income */}
      <div className="relative overflow-hidden p-5 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">This Month's Inflow</span>
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
            {displayMoney(currentMonthIncome)}
          </h3>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          <ArrowUpRight className="w-4 h-4" />
          <span>Earned income & returns</span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-teal-500/5 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 3. Monthly Expense */}
      <div className="relative overflow-hidden p-5 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">This Month's Outflow</span>
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight font-mono">
            {displayMoney(currentMonthExpense)}
          </h3>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold">
          <ArrowDownRight className="w-4 h-4" />
          <span>Spent & subscriptions</span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* 4. Net Savings & Savings Rate */}
      <div className="relative overflow-hidden p-5 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Savings & Margin</span>
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <h3
            className={`text-2xl sm:text-3xl font-black tracking-tight font-mono ${
              netSavings >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {displayMoney(netSavings)}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Savings Rate:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded-full ${
              savingsRate >= 20
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}
          >
            {savingsRate}%
          </span>
        </div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
      </div>
    </div>
  );
};

export default OverviewCards;
