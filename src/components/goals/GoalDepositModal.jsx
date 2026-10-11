import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useFinance } from '../../context/FinanceContext';
import Modal from '../common/Modal';
import { PiggyBank, Sparkles } from 'lucide-react';

export const GoalDepositModal = ({ isOpen, onClose, goal }) => {
  const { accounts, depositToGoal, formatMoney, currentCurrency } = useFinance();
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [error, setError] = useState('');

  if (!goal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) {
      setError('Please enter a valid deposit amount.');
      return;
    }

    const selectedAcc = accounts.find((a) => a.id === accountId);
    if (selectedAcc && Number(selectedAcc.balance) < numAmt) {
      setError('Insufficient funds in the selected account.');
      return;
    }

    depositToGoal(goal.id, numAmt, accountId);

    // If new total exceeds target, trigger fireworks confetti!
    if (goal.currentAmount + numAmt >= goal.targetAmount) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    setAmount('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Deposit into ${goal.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs font-semibold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span>Goal Progress</span>
            <span>
              {formatMoney(goal.currentAmount)} / {formatMoney(goal.targetAmount)}
            </span>
          </div>
          <div className="w-full bg-emerald-200/60 dark:bg-emerald-950/60 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))}%`,
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Deposit Amount ({currentCurrency.symbol})
          </label>
          <input
            type="number"
            step="any"
            required
            autoFocus
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-mono focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Deduct from Account
          </label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
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
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Confirm Deposit</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default GoalDepositModal;
