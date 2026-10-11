import React, { useState } from 'react';
import {
  Scale,
  Plus,
  CreditCard,
  Trash2,
  Edit2,
  CheckCircle2,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import Modal from '../common/Modal';

export const DebtsView = ({ onOpenAddDebt, onEditDebt }) => {
  const {
    debts,
    deleteDebt,
    payDebtInstallment,
    accounts,
    formatMoney,
    totalBalance,
    totalDebtRemaining,
    netWorth,
  } = useFinance();

  const [payingDebt, setPayingDebt] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payAccount, setPayAccount] = useState(accounts[0]?.id || '');

  const handlePayInstallment = (e) => {
    e.preventDefault();
    const amt = parseFloat(payAmount);
    if (!payingDebt || isNaN(amt) || amt <= 0) return;

    payDebtInstallment(payingDebt.id, amt, payAccount);
    setPayingDebt(null);
    setPayAmount('');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Debt & Liabilities
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="text-3xl font-black text-rose-600 dark:text-rose-400">
              {formatMoney(totalDebtRemaining)}
            </h2>
            <span className="text-sm font-semibold text-slate-400">
              remaining balance
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Liquid Assets: <strong className="text-emerald-600 dark:text-emerald-400">{formatMoney(totalBalance)}</strong> • Real Net Worth:{' '}
            <strong className="text-slate-900 dark:text-white">{formatMoney(netWorth)}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddDebt}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Loan / Liability</span>
        </button>
      </div>

      {/* Debts Grid */}
      {debts.length === 0 ? (
        <div className="py-20 text-center text-slate-400 glass-panel bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <Scale className="w-12 h-12 mx-auto mb-3 opacity-30 text-emerald-500" />
          <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
            Zero Debt Recorded!
          </h4>
          <p className="text-xs mt-1 mb-4">
            You are 100% debt-free, or you haven't tracked loans and borrowings yet.
          </p>
          <button
            type="button"
            onClick={onOpenAddDebt}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 shadow-sm"
          >
            Track a Loan or Debt
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {debts.map((debt) => {
            const paid = debt.totalAmount - debt.remainingAmount;
            const percentPaid =
              debt.totalAmount > 0
                ? Math.min(100, Math.round((paid / debt.totalAmount) * 100))
                : 100;
            const isSettled = debt.remainingAmount <= 0;

            return (
              <div
                key={debt.id}
                className={`p-6 rounded-3xl glass-panel bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between space-y-4 shadow-card hover:shadow-card-hover ${
                  isSettled
                    ? 'border-emerald-500/30'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {debt.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {debt.category} {debt.interestRate > 0 && `• ${debt.interestRate}% interest`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditDebt(debt)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteDebt(debt.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Balance & Progress */}
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
                      {formatMoney(debt.remainingAmount)}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      of {formatMoney(debt.totalAmount)}
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${percentPaid}%` }}
                    />
                  </div>
                </div>

                {/* Footer and Payment Trigger */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      {percentPaid}% Repaid
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Monthly EMI: {formatMoney(debt.monthlyEMI)}
                    </span>
                  </div>

                  {!isSettled && (
                    <button
                      type="button"
                      onClick={() => {
                        setPayingDebt(debt);
                        setPayAmount(String(debt.monthlyEMI || 1000));
                        setPayAccount(accounts[0]?.id || '');
                      }}
                      className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                      <span>Pay Installment</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pay Installment Modal */}
      {payingDebt && (
        <Modal
          isOpen={!!payingDebt}
          onClose={() => setPayingDebt(null)}
          title={`Pay Installment on ${payingDebt.name}`}
        >
          <form onSubmit={handlePayInstallment} className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-800 dark:text-rose-200 flex items-center justify-between">
              <span>Remaining Loan Liability:</span>
              <span className="font-mono font-bold text-sm">
                {formatMoney(payingDebt.remainingAmount)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Payment Amount
              </label>
              <input
                type="number"
                step="any"
                required
                autoFocus
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Deduct from Wallet
              </label>
              <select
                value={payAccount}
                onChange={(e) => setPayAccount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({formatMoney(a.balance)})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPayingDebt(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all"
              >
                Confirm EMI Payment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default DebtsView;
