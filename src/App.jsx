import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import MobileNav from './components/layout/MobileNav';
import MobileSideNav from './components/layout/MobileSideNav';

// Authentication Entry Gate
import LoginScreen from './components/auth/LoginScreen';

// Views
import DashboardView from './components/dashboard/DashboardView';
import TransactionListView from './components/transactions/TransactionListView';
import AccountsView from './components/accounts/AccountsView';
import BudgetsView from './components/budgets/BudgetsView';
import AnalyticsView from './components/analytics/AnalyticsView';
import DebtsView from './components/debts/DebtsView';
import PlannedPaymentsView from './components/planned/PlannedPaymentsView';
import GoalsView from './components/goals/GoalsView';
import ProfileDashboard from './components/profile/ProfileDashboard';
import SettingsView from './components/settings/SettingsView';
import ImportsView from './components/imports/ImportsView';

// Modals & Tools
import TransactionModal from './components/transactions/TransactionModal';
import AccountModal from './components/accounts/AccountModal';
import TransferModal from './components/accounts/TransferModal';
import BudgetModal from './components/budgets/BudgetModal';
import PlannedPaymentModal from './components/planned/PlannedPaymentModal';
import GoalModal from './components/goals/GoalModal';
import DebtModal from './components/debts/DebtModal';
import BillSplitterModal from './components/tools/BillSplitterModal';
import AuthModal from './components/auth/AuthModal';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import SecurityHubModal from './components/security/SecurityHubModal';
import CategoryManagerModal from './components/categories/CategoryManagerModal';

import { Sparkles, ArrowRight, Plus, X, Pencil, ArrowLeftRight } from 'lucide-react';

const MainLayout = () => {
  const { isGuest, currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFabOpen, setMobileFabOpen] = useState(false);

  // Exit demo and go to Sign Up screen
  const handleExitToSignUp = () => {
    try {
      localStorage.setItem('wallet_initial_auth_view', 'signup');
    } catch (e) {}
    logout();
  };

  // Dynamic Browser Tab Title based on active function (smart & concise)
  useEffect(() => {
    if (activeTab === 'budgets' || activeTab === 'goals') {
      setActiveTab('dashboard');
      return;
    }
    const TAB_TITLES = {
      dashboard: 'Dashboard',
      accounts: 'Accounts',
      transactions: 'Records',
      planner: 'Planner',
      analytics: 'Analytics',
      debts: 'Debts',
      planned: 'Subscriptions',
      profile: 'Profile',
      settings: 'Settings',
    };
    const tabName = TAB_TITLES[activeTab] || 'Dashboard';
    document.title = `${tabName} • Finora`;
  }, [activeTab]);

  // Modal States
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [defaultTxType, setDefaultTxType] = useState('expense');

  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const [transferModalOpen, setTransferModalOpen] = useState(false);

  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [plannedModalOpen, setPlannedModalOpen] = useState(false);
  const [editingPlanned, setEditingPlanned] = useState(null);

  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [debtModalOpen, setDebtModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);

  const [billSplitterOpen, setBillSplitterOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // Transaction modal handlers
  const handleOpenAddTx = (type = 'expense', initialAccId = '') => {
    const savedActiveAcc = localStorage.getItem('wallet_active_account_id');
    const targetAccId = initialAccId || (savedActiveAcc && savedActiveAcc !== 'all' ? savedActiveAcc : '');
    setEditingTx(targetAccId ? { accountId: targetAccId, type } : { type });
    setDefaultTxType(type);
    setTxModalOpen(true);
  };
  const handleEditTx = (tx) => {
    setEditingTx(tx);
    setDefaultTxType(tx.type || 'expense');
    setTxModalOpen(true);
  };

  // Account modal handlers
  const handleOpenAddAccount = () => {
    setEditingAccount(null);
    setAccountModalOpen(true);
  };
  const handleEditAccount = (acc) => {
    setEditingAccount(acc);
    setAccountModalOpen(true);
  };

  // Budget modal handlers
  const handleOpenAddBudget = () => {
    setEditingBudget(null);
    setBudgetModalOpen(true);
  };
  const handleEditBudget = (bud) => {
    setEditingBudget(bud);
    setBudgetModalOpen(true);
  };

  // Planned modal handlers
  const handleOpenAddPlanned = () => {
    setEditingPlanned(null);
    setPlannedModalOpen(true);
  };
  const handleEditPlanned = (plan) => {
    setEditingPlanned(plan);
    setPlannedModalOpen(true);
  };

  // Goal modal handlers
  const handleOpenAddGoal = () => {
    setEditingGoal(null);
    setGoalModalOpen(true);
  };
  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setGoalModalOpen(true);
  };

  // Debt modal handlers
  const handleOpenAddDebt = () => {
    setEditingDebt(null);
    setDebtModalOpen(true);
  };
  const handleEditDebt = (debt) => {
    setEditingDebt(debt);
    setDebtModalOpen(true);
  };

  // Mobile drawer select tab
  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] text-[#1C1C1E] dark:text-[#F2F2F7] transition-colors flex flex-col font-sans">
      {/* Apple iOS Translucent Navigation Bar */}
      <Navbar
        onOpenAddTx={() => handleOpenAddTx('expense')}
        onOpenAddAccount={handleOpenAddAccount}
        onOpenTransfer={() => handleOpenAddTx('transfer')}
        onOpenBillSplitter={() => setBillSplitterOpen(true)}
        onOpenAuth={isGuest ? handleExitToSignUp : () => setAuthModalOpen(true)}
        onOpenSecurity={() => setSecurityModalOpen(true)}
        onOpenSideNav={() => setMobileMenuOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Guest Preview Notice: iOS Capsule Pill */}
      {isGuest && (
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-3 animate-fade-in">
          <div className="ios-glass rounded-full px-4 py-2 text-xs flex items-center justify-between shadow-xs border border-black/[0.05] dark:border-white/[0.08]">
            <div className="flex items-center gap-2.5 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-[#34C759] animate-pulse flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 truncate">
                <strong className="text-slate-900 dark:text-white">Demo Mode:</strong> Exploring with Bangladeshi Taka (৳ BDT). Sign up for a private cloud vault.
              </span>
            </div>
            <button
              type="button"
              onClick={handleExitToSignUp}
              className="bg-[#34C759] hover:bg-[#2EB84F] text-white px-3.5 py-1 rounded-full font-bold transition-all flex items-center gap-1 shadow-xs flex-shrink-0 ml-3 cursor-pointer text-xs active:scale-95"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport - Full width without empty side gaps */}
      <main className="flex-1 px-3 sm:px-6 lg:px-8 pt-3.5 sm:pt-5 pb-6 w-full max-w-[1600px] mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenAddTx={handleOpenAddTx}
              onOpenAddAccount={handleOpenAddAccount}
              onEditAccount={handleEditAccount}
              onOpenAddBudget={handleOpenAddBudget}
              onOpenAddPlanned={handleOpenAddPlanned}
              onOpenTransfer={() => handleOpenAddTx('transfer')}
              onOpenBillSplitter={() => setBillSplitterOpen(true)}
              onEditTransaction={handleEditTx}
              setActiveTab={setActiveTab}
              onOpenSecurity={() => setSecurityModalOpen(true)}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionListView
              onOpenAddTx={() => handleOpenAddTx('expense')}
              onEditTransaction={handleEditTx}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountsView
              onOpenAddAccount={handleOpenAddAccount}
              onEditAccount={handleEditAccount}
              onOpenTransfer={() => handleOpenAddTx('transfer')}
              onOpenAddTx={() => handleOpenAddTx('expense')}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'imports' && (
            <ImportsView
              setActiveTab={setActiveTab}
              onOpenAddAccount={handleOpenAddAccount}
            />
          )}

          {activeTab === 'debts' && (
            <DebtsView
              onOpenAddDebt={handleOpenAddDebt}
              onEditDebt={handleEditDebt}
            />
          )}

          {activeTab === 'planned' && (
            <PlannedPaymentsView
              onOpenAddPlanned={handleOpenAddPlanned}
              onEditPlanned={handleEditPlanned}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileDashboard onOpenSecurity={() => setSecurityModalOpen(true)} />
          )}

          {(activeTab === 'settings' || activeTab === 'help') && (
            <SettingsView
              key={activeTab}
              initialTab={activeTab === 'help' ? 'help' : 'currencies'}
              onOpenSecurity={() => setSecurityModalOpen(true)}
              onOpenCategoryManager={() => setCategoryModalOpen(true)}
            />
          )}
        </main>

        {/* Backdrop for Mobile Speed Dial */}
        {mobileFabOpen && (
          <div
            onClick={() => setMobileFabOpen(false)}
            className="md:hidden fixed inset-0 z-35 bg-black/25 backdrop-blur-2xs transition-opacity animate-fade-in"
          />
        )}

        {/* Floating Speed Dial Action Buttons matching Image 1 & 2 */}
        <div className="md:hidden fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3 select-none">
          {mobileFabOpen && (
            <div className="flex flex-col items-end gap-2.5 mb-1 animate-slide-up">
              {/* 1. Transfer Button (⇄ Transfer) */}
              <button
                type="button"
                onClick={() => {
                  setMobileFabOpen(false);
                  handleOpenAddTx('transfer');
                }}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#D0E2FF] dark:bg-blue-900/80 text-[#002D62] dark:text-blue-100 shadow-md hover:bg-[#B9D5FF] active:scale-95 transition-all cursor-pointer group"
              >
                <ArrowLeftRight className="w-4.5 h-4.5 stroke-[2.4] text-[#002D62] dark:text-blue-200" />
                <span className="text-[13.5px] font-bold">Transfer</span>
              </button>

              {/* 2. New Record Button (✏️ New record) */}
              <button
                type="button"
                onClick={() => {
                  setMobileFabOpen(false);
                  handleOpenAddTx('expense');
                }}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#D0E2FF] dark:bg-blue-900/80 text-[#002D62] dark:text-blue-100 shadow-md hover:bg-[#B9D5FF] active:scale-95 transition-all cursor-pointer group"
              >
                <Pencil className="w-4.5 h-4.5 stroke-[2.4] text-[#002D62] dark:text-blue-200" />
                <span className="text-[13.5px] font-bold">New record</span>
              </button>
            </div>
          )}

          {/* Primary Circular FAB Button (+ / ✕) */}
          <button
            type="button"
            onClick={() => setMobileFabOpen(!mobileFabOpen)}
            className={`w-14 h-14 rounded-full bg-[#007AFF] text-white flex items-center justify-center shadow-lg shadow-blue-500/40 active:scale-90 transition-all duration-200 cursor-pointer ${
              mobileFabOpen ? 'bg-blue-600' : ''
            }`}
            title={mobileFabOpen ? 'Close Menu' : 'Add Record or Transfer'}
            aria-label={mobileFabOpen ? 'Close Menu' : 'Add Record or Transfer'}
          >
            {mobileFabOpen ? (
              <X className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <Plus className="w-7 h-7 stroke-[2.8]" />
            )}
          </button>
        </div>

        {/* 3-Line Mobile Side Navigation Drawer (Image 3) */}
        <MobileSideNav
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAddTx={() => handleOpenAddTx('expense')}
          onOpenAddAccount={handleOpenAddAccount}
          onOpenSecurity={() => setSecurityModalOpen(true)}
        />

      {/* Modals & Dialogs */}
      <TransactionModal
        isOpen={txModalOpen}
        onClose={() => setTxModalOpen(false)}
        initialData={editingTx}
        defaultType={defaultTxType}
      />

      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        initialData={editingAccount}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      <TransferModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
      />

      <BudgetModal
        isOpen={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        initialData={editingBudget}
      />

      <PlannedPaymentModal
        isOpen={plannedModalOpen}
        onClose={() => setPlannedModalOpen(false)}
        initialData={editingPlanned}
      />

      <GoalModal
        isOpen={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        initialData={editingGoal}
      />

      <DebtModal
        isOpen={debtModalOpen}
        onClose={() => setDebtModalOpen(false)}
        initialData={editingDebt}
      />

      <BillSplitterModal
        isOpen={billSplitterOpen}
        onClose={() => setBillSplitterOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Bank-Grade Security Shield Modals */}
      <SecurityHubModal
        isOpen={securityModalOpen}
        onClose={() => setSecurityModalOpen(false)}
      />
      <CategoryManagerModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />

      {/* Security Modals */}
    </div>
  );
};

// Root App Controller: Shows LoginScreen if not authenticated, otherwise enters MainLayout Dashboard directly!
const AppRoot = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      document.title = 'Log In • Finora';
    }
  }, [currentUser]);

  // If not logged in, always render LoginScreen first!
  if (!currentUser) {
    return <LoginScreen />;
  }

  // Once logged in, go straight to Dashboard! (No passcode barrier)
  return (
    <FinanceProvider>
      <MainLayout />
    </FinanceProvider>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0d1117] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-400 max-w-md mb-6">
            {this.state.error?.message || "An unexpected error occurred while rendering."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-colors shadow-lg shadow-emerald-500/20"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SecurityProvider>
            <AppRoot />
          </SecurityProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

