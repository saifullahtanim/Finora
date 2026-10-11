import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import IconHelper from '../common/IconHelper';
import Modal from '../common/Modal';

export const BudgetModal = ({ isOpen, onClose, initialData = null }) => {
  const { addBudget, updateBudget, currentCurrency, transactions, allExpenseCategories } = useFinance();
  const [categoryId, setCategoryId] = useState('food_dining');
  const [limit, setLimit] = useState('');
  const [period, setPeriod] = useState('monthly');
  const [color, setColor] = useState('#10B981');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setCategoryId(initialData.categoryId || 'food_dining');
      setLimit(initialData.limit ? String(initialData.limit) : '');
      setPeriod(initialData.period || 'monthly');
      setColor(initialData.color || '#10B981');
    } else {
      setCategoryId('food_dining');
      setLimit('');
      setPeriod('monthly');
      setColor('#10B981');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const numLimit = parseFloat(limit);
    if (isNaN(numLimit) || numLimit <= 0) {
      setError('Please specify a valid spending limit.');
      return;
    }

    const catList = allExpenseCategories || EXPENSE_CATEGORIES;
    const cat = catList.find((c) => c.id === categoryId);
    const payload = {
      categoryId,
      limit: numLimit,
      period,
      color: cat?.color || color,
    };

    if (initialData && initialData.id) {
      updateBudget(initialData.id, payload);
    } else {
      addBudget(payload);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Spending Budget' : 'Set Category Budget'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs font-semibold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              const catList = allExpenseCategories || EXPENSE_CATEGORIES;
              const found = catList.find((c) => c.id === e.target.value);
              if (found) setColor(found.color);
            }}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
          >
            {(allExpenseCategories || EXPENSE_CATEGORIES).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Monthly Spending Limit ({currentCurrency.symbol})
          </label>
          <input
            type="number"
            step="any"
            required
            placeholder="e.g. 500.00"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-mono focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
          />
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
            {initialData ? 'Save Changes' : 'Create Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetModal;
