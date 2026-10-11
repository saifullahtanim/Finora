import React, { useState } from 'react';
import { Users, Calculator, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import Modal from '../common/Modal';

export const BillSplitterModal = ({ isOpen, onClose }) => {
  const { addTransaction, accounts, formatMoney, currentCurrency } = useFinance();
  const [totalBill, setTotalBill] = useState('');
  const [peopleCount, setPeopleCount] = useState('4');
  const [extraTip, setExtraTip] = useState('0');
  const [description, setDescription] = useState('Group Dinner / Hangout');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [recordedSuccess, setRecordedSuccess] = useState(false);

  const numBill = parseFloat(totalBill) || 0;
  const numPeople = Math.max(1, parseInt(peopleCount) || 1);
  const numExtra = parseFloat(extraTip) || 0;

  const grandTotal = numBill + numExtra;
  const perPersonShare = grandTotal / numPeople;

  const handleRecordExpense = () => {
    if (perPersonShare <= 0) return;

    addTransaction({
      type: 'expense',
      amount: Math.round(perPersonShare * 100) / 100,
      category: 'food_dining',
      accountId: accountId || accounts[0]?.id,
      date: new Date().toISOString().split('T')[0],
      note: `Split Bill (${numPeople} people): ${description}`,
      payee: `Group Split: ${description}`,
      status: 'cleared',
    });

    setRecordedSuccess(true);
    setTimeout(() => {
      setRecordedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Group Bill Splitter & Calculator">
      <div className="space-y-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Split restaurant bills, tour costs, or shared flat expenses easily with your friends.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Total Bill Amount ({currentCurrency.symbol})
            </label>
            <input
              type="number"
              step="any"
              autoFocus
              placeholder="e.g. 4800"
              value={totalBill}
              onChange={(e) => setTotalBill(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-mono focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Number of People
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="50"
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-mono focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              />
              <Users className="w-5 h-5 text-slate-400 flex-shrink-0" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Service Charge / VAT / Tip ({currentCurrency.symbol})
            </label>
            <input
              type="number"
              step="any"
              placeholder="0"
              value={extraTip}
              onChange={(e) => setExtraTip(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Occasion / Description
            </label>
            <input
              type="text"
              placeholder="e.g. Sultan's Dine Kacchi Hangout"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Calculation Result Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-center space-y-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Each Person Pays
          </span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
            {formatMoney(perPersonShare)}
          </p>
          <span className="text-[11px] text-slate-400 block">
            Total {formatMoney(grandTotal)} divided by {numPeople} members
          </span>
        </div>

        {/* Auto record option */}
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Deduct My Share from Wallet
          </label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({formatMoney(a.balance)})
              </option>
            ))}
          </select>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Close
          </button>

          <button
            type="button"
            disabled={perPersonShare <= 0 || recordedSuccess}
            onClick={handleRecordExpense}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
          >
            {recordedSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Recorded to Wallet!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Record My Share ({formatMoney(perPersonShare)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BillSplitterModal;
