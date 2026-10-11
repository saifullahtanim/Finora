import React from 'react';
import { Target, Plus, ChevronRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import IconHelper from '../common/IconHelper';

export const DashboardGoalsWidget = ({ onOpenGoalsTab, onOpenAddGoal, onDepositGoal }) => {
  const { goals, formatMoney } = useFinance();

  return (
    <div className="ios-widget rounded-[28px] p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-black/[0.05] dark:border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[11px] bg-[#AF52DE]/15 text-[#AF52DE] flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">Savings Goals</h3>
            <p className="text-xs text-slate-400">Target funds & milestones</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAddGoal && (
            <button
              type="button"
              onClick={onOpenAddGoal}
              className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
              title="Add New Savings Goal"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          )}

          {onOpenGoalsTab && (
            <button
              type="button"
              onClick={onOpenGoalsTab}
              className="text-xs font-semibold text-[#007AFF] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>All ({goals.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {goals.length === 0 ? (
        <div className="py-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <Target className="w-7 h-7 mx-auto mb-2 text-slate-400 opacity-60" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No active savings targets</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Set a goal for an emergency fund, travel, or big purchase.</p>
          {onOpenAddGoal && (
            <button
              type="button"
              onClick={onOpenAddGoal}
              className="mt-3 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold transition-colors cursor-pointer"
            >
              + Create First Goal
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {goals.slice(0, 3).map((goal) => {
            const current = Number(goal.currentAmount || 0);
            const target = Number(goal.targetAmount || 1);
            const percent = Math.min(100, Math.round((current / target) * 100));

            return (
              <div
                key={goal.id}
                className="p-3.5 rounded-[20px] bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] hover:border-[#AF52DE]/30 transition-all space-y-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-[11px] flex items-center justify-center text-white flex-shrink-0 shadow-xs"
                      style={{ backgroundColor: goal.color || '#AF52DE' }}
                    >
                      <IconHelper name={goal.icon || 'Target'} className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {goal.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        Target: {goal.targetDate || 'No deadline'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {percent}%
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatMoney(current)}
                      </span>
                    </div>

                    {onDepositGoal && (
                      <button
                        type="button"
                        onClick={() => onDepositGoal(goal)}
                        className="px-2.5 py-1 rounded-full bg-[#34C759]/15 hover:bg-[#34C759] text-[#34C759] hover:text-white text-[11px] font-semibold transition-all cursor-pointer"
                        title="Deposit money into goal"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-black/[0.05] dark:bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: goal.color || '#AF52DE',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardGoalsWidget;
