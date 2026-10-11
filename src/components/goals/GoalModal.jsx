import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import Modal from '../common/Modal';

export const GoalModal = ({ isOpen, onClose, initialData = null }) => {
  const { addGoal, updateGoal, currentCurrency } = useFinance();
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Savings');
  const [color, setColor] = useState('#10B981');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setTargetAmount(initialData.targetAmount ? String(initialData.targetAmount) : '');
      setCurrentAmount(initialData.currentAmount !== undefined ? String(initialData.currentAmount) : '0');
      setTargetDate(initialData.targetDate || '');
      setCategory(initialData.category || 'Savings');
      setColor(initialData.color || '#10B981');
    } else {
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      const nextYear = new Date();
      nextYear.setMonth(nextYear.getMonth() + 6);
      setTargetDate(nextYear.toISOString().split('T')[0]);
      setCategory('Savings');
      setColor('#10B981');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a goal name.');
      return;
    }
    const target = parseFloat(targetAmount);
    const curr = parseFloat(currentAmount) || 0;
    if (isNaN(target) || target <= 0) {
      setError('Please provide a valid target amount.');
      return;
    }

    const payload = {
      name: name.trim(),
      targetAmount: target,
      currentAmount: curr,
      targetDate,
      category,
      color,
      icon: 'Target',
    };

    if (initialData && initialData.id) {
      updateGoal(initialData.id, payload);
    } else {
      addGoal(payload);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Savings Goal' : 'Create New Savings Goal'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs font-semibold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Goal Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Emergency Fund, New Car, Vacation"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Target Amount ({currentCurrency.symbol})
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="5000.00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Already Saved ({currentCurrency.symbol})
            </label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Target Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            >
              <option value="Savings">Savings & Emergency</option>
              <option value="Travel">Travel & Vacation</option>
              <option value="Gadgets">Gadgets & Tech</option>
              <option value="Vehicle">Vehicle & Transport</option>
              <option value="Real Estate">House & Property</option>
              <option value="Investment">Long-term Investment</option>
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
            {initialData ? 'Save Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default GoalModal;
