import React from 'react';
import { Plus, CreditCard, ChevronRight, Wifi, Edit2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import IconHelper from '../common/IconHelper';

export const AccountsCarousel = ({ onOpenAddAccount, onOpenAccountsTab, onEditAccount }) => {
  const { accounts, formatMoney } = useFinance();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Wallets & Accounts
          </h3>
          <p className="text-xs text-slate-400">Manage multiple accounts, cash & cards</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenAccountsTab}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({accounts.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none pt-1">
        {accounts.map((acc, index) => {
          return (
            <div
              key={acc.id}
              onClick={() => onEditAccount && onEditAccount(acc)}
              role="button"
              tabIndex={0}
              title="Click to edit balance and details"
              className="relative flex-shrink-0 w-64 sm:w-72 h-40 p-5 rounded-3xl text-white shadow-xl flex flex-col justify-between overflow-hidden transition-all hover:-translate-y-1 group cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              style={{
                background: `linear-gradient(135deg, ${acc.color || '#3B82F6'} 0%, #0F172A 100%)`,
              }}
            >
              {/* Gloss subtle reflection */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

              {/* Top Row: Account Name & Contactless */}
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-white/70">
                    {acc.type.replace('_', ' ')}
                  </span>
                  <h4 className="text-sm font-bold text-white truncate max-w-[150px]">
                    {acc.name}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onEditAccount) onEditAccount(acc);
                    }}
                    title="Edit Wallet Balance"
                    className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
                    <IconHelper name={acc.icon || 'CreditCard'} className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Card Chip & Wave Icon */}
              <div className="flex items-center gap-2 relative z-10">
                <div className="w-7 h-5 rounded-md bg-amber-300/80 border border-amber-200/60 shadow-inner flex items-center justify-center">
                  <div className="w-3.5 h-3 border border-amber-600/40 rounded-sm" />
                </div>
                <Wifi className="w-4 h-4 text-white/70 rotate-90" />
                <span className="text-xs font-mono tracking-widest text-white/80 ml-auto">
                  {acc.accountNumber || '•••• 0000'}
                </span>
              </div>

              {/* Bottom Balance */}
              <div className="relative z-10 pt-1 flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-white/70 block uppercase font-semibold">
                    Balance
                  </span>
                  <p className="text-lg font-black tracking-tight text-white font-mono">
                    {formatMoney(acc.balance)}
                  </p>
                </div>
                <span className="text-[10px] text-white/80 bg-white/15 px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                  Edit
                </span>
              </div>
            </div>
          );
        })}

        {/* Add Account Card */}
        <button
          type="button"
          onClick={onOpenAddAccount}
          className="flex-shrink-0 w-44 sm:w-52 h-40 p-4 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition-colors">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-bold">New Account</span>
        </button>
      </div>
    </div>
  );
};

export default AccountsCarousel;
