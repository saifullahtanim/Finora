import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Sparkles, Check, Wallet, ArrowRight, X } from 'lucide-react';
import IconHelper from '../common/IconHelper';

export const QuickBalanceSetup = ({ onOpenAddAccount }) => {
  const { accounts, updateAccount, formatMoney, transactions } = useFinance();
  const [balances, setBalances] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Show only if all accounts have 0 balance and 0 transactions
  const hasZeroActivity =
    accounts.length > 0 &&
    accounts.every((a) => Number(a.balance || 0) === 0) &&
    transactions.length === 0;

  if (!hasZeroActivity || isDismissed) return null;

  const handleInputChange = (accId, value) => {
    setBalances((prev) => ({ ...prev, [accId]: value }));
  };

  const handleSaveAll = (e) => {
    e.preventDefault();
    accounts.forEach((acc) => {
      const val = parseFloat(balances[acc.id]);
      if (!isNaN(val) && val >= 0) {
        updateAccount(acc.id, { balance: val });
      }
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsDismissed(true);
    }, 1500);
  };

  return (
    <div className="p-6 rounded-3xl glass-panel bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-500/5 border border-emerald-500/30 shadow-card animate-fade-in space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Welcome! Set Your Starting Balances</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            What are your current wallet and account balances?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your current cash in hand, bKash, or bank balances to get started. You can update these anytime.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-4 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: acc.color || '#10B981' }}
                >
                  <IconHelper name={acc.icon} className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {acc.name}
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">৳</span>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={balances[acc.id] !== undefined ? balances[acc.id] : ''}
                  onChange={(e) => handleInputChange(acc.id, e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          ))}

          {onOpenAddAccount && (
            <button
              type="button"
              onClick={onOpenAddAccount}
              className="p-3.5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50/40 dark:bg-slate-800/20 hover:bg-emerald-50/30 text-slate-500 hover:text-emerald-600 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer min-h-[90px]"
            >
              <Wallet className="w-5 h-5" />
              <span className="text-xs font-bold">+ New Wallet</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <span className="text-[11px] text-slate-400">
            * You can also click on any wallet card anytime to edit its balance or settings.
          </span>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Balances Saved!</span>
              </>
            ) : (
              <>
                <span>Save Starting Balances</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuickBalanceSetup;
