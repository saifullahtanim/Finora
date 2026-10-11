import React, { useState, useEffect } from 'react';
import BudgetBakersDashboard from './BudgetBakersDashboard';
import RecentTransactions from './RecentTransactions';
import ExportStatementModal from '../tools/ExportStatementModal';
import GoalDepositModal from '../goals/GoalDepositModal';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useSecurity } from '../../context/SecurityContext';

export const DashboardView = ({
  onOpenAddTx,
  onOpenAddAccount,
  onEditAccount,
  onOpenAddBudget,
  onOpenAddPlanned,
  onOpenTransfer,
  onOpenBillSplitter,
  onEditTransaction,
  setActiveTab,
  onOpenSecurity,
}) => {
  const { currentUser } = useAuth();
  const { transactions, accounts } = useFinance();
  const { securityHealth } = useSecurity();

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [depositingGoal, setDepositingGoal] = useState(null);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Core Finora Clean Dashboard (Accounts Strip, 3 Speedometer Gauges, Balance Trend, Expenses Structure) */}
      <BudgetBakersDashboard
        onOpenAddTx={onOpenAddTx}
        onOpenAddAccount={onOpenAddAccount}
        onEditAccount={onEditAccount}
        setActiveTab={setActiveTab}
        onOpenAddBudget={onOpenAddBudget}
      />

      {/* 2. Recent Chronological Ledger */}
      <RecentTransactions
        onOpenTransactionsTab={() => setActiveTab('transactions')}
        onEditTransaction={onEditTransaction}
        onOpenAddTx={onOpenAddTx}
      />

      {/* Export Statement Modal */}
      <ExportStatementModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />

      {/* Goal Deposit Modal */}
      {depositingGoal && (
        <GoalDepositModal
          isOpen={Boolean(depositingGoal)}
          onClose={() => setDepositingGoal(null)}
          goal={depositingGoal}
        />
      )}
    </div>
  );
};

export default DashboardView;
