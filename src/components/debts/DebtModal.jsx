import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Modal from '../common/Modal';

export const DebtModal = ({ isOpen, onClose, initialData = null }) => {
  const { addDebt, updateDebt, currentCurrency } = useFinance();
  const [name, setName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [remainingAmount, setRemainingAmount] = useState('');
  const [monthlyEMI, setMonthlyEMI] = useState('');
  const [interestRate, setInterestRate] = useState('0');
  const [category, setCategory] = useState('Bank Loan');
  const [dueDate, setDueDate] = useState('15th of month');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setTotalAmount(initialData.totalAmount ? String(initialData.totalAmount) : '');
      setRemainingAmount(initialData.remainingAmount ? String(initialData.remainingAmount) : '');
      setMonthlyEMI(initialData.monthlyEMI ? String(initialData.monthlyEMI) : '');
      setInterestRate(initialData.interestRate !== undefined ? String(initialData.interestRate) : '0');
      setCategory(initialData.category || 'Bank Loan');
      setDueDate(initialData.dueDate || '15th of month');
    } else {
      setName('');
      setTotalAmount('');
      setRemainingAmount('');
      setMonthlyEMI('');
      setInterestRate('0');
      setCategory('Bank Loan');
      setDueDate('15th of month');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a loan or borrowing name.');
      return;
    }
    const total = parseFloat(totalAmount);
    const remaining = remainingAmount ? parseFloat(remainingAmount) : total;
    if (isNaN(total) || total <= 0) {
      setError('Please enter a valid loan amount.');
      return;
    }

    const payload = {
      name: name.trim(),
      totalAmount: total,
      remainingAmount: isNaN(remaining) ? total : remaining,
      monthlyEMI: parseFloat(monthlyEMI) || 0,
      interestRate: parseFloat(interestRate) || 0,
      category,
      dueDate,
    };

    if (initialData && initialData.id) {
      updateDebt(initialData.id, payload);
    } else {
      addDebt(payload);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Debt / Loan Record' : 'Record New Loan or Debt'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs font-semibold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Loan or Liability Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. City Bank Personal Loan, Friend Borrowing"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Original Amount ({currentCurrency.symbol})
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="100000"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Remaining Balance ({currentCurrency.symbol})
            </label>
            <input
              type="number"
              step="any"
              placeholder="Leave blank if equal"
              value={remainingAmount}
              onChange={(e) => setRemainingAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Monthly Installment (EMI)
            </label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 8500"
              value={monthlyEMI}
              onChange={(e) => setMonthlyEMI(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Interest Rate (%)
            </label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 9.5"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Loan Type
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none"
            >
              <option value="Bank Loan">Bank Loan</option>
              <option value="Personal Borrowing">Personal Borrowing</option>
              <option value="Credit Card EMI">Credit Card EMI</option>
              <option value="Mobile / bKash Loan">bKash / Nano Loan</option>
              <option value="Vehicle / Bike Loan">Vehicle Loan</option>
            </select>
          </div>
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
            className="px-5 py-2.5 text-sm font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25 transition-all"
          >
            {initialData ? 'Update Loan' : 'Save Loan'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DebtModal;
