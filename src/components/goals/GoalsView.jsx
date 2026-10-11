import React, { useState } from 'react';
import {
  Target,
  Plus,
  Sparkles,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import IconHelper from '../common/IconHelper';
import GoalDepositModal from './GoalDepositModal';

export const GoalsView = ({ onOpenAddGoal, onEditGoal }) => {
  const { goals, deleteGoal, formatMoney } = useFinance();
  const [depositGoal, setDepositGoal] = useState(null);

  const totalTarget = goals.reduce((sum, g) => sum + Number(g.targetAmount || 0), 0);
  const totalSaved = goals.reduce((sum, g) => sum + Number(g.currentAmount || 0), 0);
  const overallPercentage = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Savings Goals & Dream Projects
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              {formatMoney(totalSaved)}
            </h2>
            <span className="text-sm font-semibold text-slate-400">
              accumulated / {formatMoney(totalTarget)} target
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {overallPercentage}% of all combined savings objectives completed
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddGoal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Savings Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="py-20 text-center text-slate-400 glass-panel bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No savings goals yet
          </h4>
          <p className="text-xs mt-1 mb-4">
            Build wealth by assigning dedicated targets for emergency funds, travel, or gadgets.
          </p>
          <button
            type="button"
            onClick={onOpenAddGoal}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 shadow-sm"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal) => {
            const percent =
              goal.targetAmount > 0
                ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
                : 0;
            const isCompleted = goal.currentAmount >= goal.targetAmount;
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

            return (
              <div
                key={goal.id}
                className={`p-6 rounded-3xl glass-panel bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between space-y-4 shadow-card hover:shadow-card-hover ${
                  isCompleted
                    ? 'border-emerald-500/40 dark:border-emerald-500/30'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white"
                      style={{ backgroundColor: goal.color || '#10B981' }}
                    >
                      <IconHelper name={goal.icon || 'Target'} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {goal.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {goal.category || 'Savings'} • Target: {goal.targetDate || 'Ongoing'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditGoal(goal)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Goal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteGoal(goal.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Visual */}
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                      {formatMoney(goal.currentAmount)}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      of {formatMoney(goal.targetAmount)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Footer and Deposit Trigger */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                      {percent}% Reached
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {isCompleted ? 'Goal Achieved! 🎉' : `${formatMoney(remaining)} remaining`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDepositGoal(goal)}
                    className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 shadow-sm transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                    <span>Deposit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Deposit Modal */}
      {depositGoal && (
        <GoalDepositModal
          isOpen={!!depositGoal}
          onClose={() => setDepositGoal(null)}
          goal={depositGoal}
        />
      )}
    </div>
  );
};

export default GoalsView;
