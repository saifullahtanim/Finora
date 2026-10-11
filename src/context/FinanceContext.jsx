import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getInitialDemoData, getFreshUserData } from '../utils/demoData';
import { CURRENCIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/constants';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Selected currency (default to BDT)
  const [currencyCode, setCurrencyCode] = useState(currentUser?.currency || 'BDT');

  // Core Financial States
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [plannedPayments, setPlannedPayments] = useState([]);
  const [goals, setGoals] = useState([]);
  const [debts, setDebts] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user data on currentUser switch
  useEffect(() => {
    if (!currentUser) {
      setAccounts([]);
      setTransactions([]);
      setBudgets([]);
      setPlannedPayments([]);
      setGoals([]);
      setDebts([]);
      setIsLoaded(false);
      return;
    }

    const storageKey = `wallet_data_${currentUser.id}`;
    let data;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        data = JSON.parse(saved);
        // Automatic cleanup migration: If real registered user still has demo seed data from earlier testing, reset to fresh!
        if (!currentUser.isGuest) {
          const hasOldDemoData =
            data?.transactions?.some((t) => t.id === 'tx-1' || t.payee?.includes('Tech Innovators') || t.payee?.includes('Shwapno Super Shop')) ||
            data?.accounts?.some((a) => a.id === 'acc-1' && Number(a.balance) === 85400) ||
            data?.accounts?.some((a) => a.name === 'City Bank Checking' && Number(a.balance) === 85400);
          if (hasOldDemoData) {
            data = getFreshUserData(currentUser.currency || 'BDT');
            localStorage.setItem(storageKey, JSON.stringify(data));
          }
        }
      } else {
        // If guest, load rich demo data; if real user, load FRESH clean empty dashboard!
        data = currentUser.isGuest
          ? getInitialDemoData(currentUser.currency || 'BDT')
          : getFreshUserData(currentUser.currency || 'BDT');
        localStorage.setItem(storageKey, JSON.stringify(data));
      }
    } catch (e) {
      console.error('Failed to parse financial data', e);
      data = currentUser.isGuest
        ? getInitialDemoData(currentUser.currency || 'BDT')
        : getFreshUserData(currentUser.currency || 'BDT');
    }

    setAccounts(data.accounts || []);
    setTransactions(data.transactions || []);
    setBudgets(data.budgets || []);
    setPlannedPayments(data.plannedPayments || []);
    setGoals(data.goals || []);
    setDebts(data.debts || []);
    setCustomCategories(data.customCategories || []);
    setCurrencyCode(currentUser.currency || 'BDT');
    setIsLoaded(true);
  }, [currentUser]);

  // Persist whenever state changes (only if loaded)
  useEffect(() => {
    if (!currentUser || !isLoaded) return;
    const storageKey = `wallet_data_${currentUser.id}`;
    const payload = {
      accounts,
      transactions,
      budgets,
      plannedPayments,
      goals,
      debts,
      customCategories,
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to persist financial data', e);
    }
  }, [accounts, transactions, budgets, plannedPayments, goals, debts, customCategories, currentUser, isLoaded]);

  // Currency helpers
  const currentCurrency = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];

  const formatMoney = (amount, options = {}) => {
    // Respect privacy mode (can be bypassed with forceVisible: true)
    try {
      const isPrivacy = localStorage.getItem('wallet_privacy_mode') === 'true';
      if (isPrivacy && !options.forceVisible) {
        return `${currentCurrency.symbol} ••••••`;
      }
    } catch (e) {
      // Fallback
    }

    if (amount === undefined || amount === null || isNaN(amount)) amount = 0;
    const num = Number(amount);
    const abs = Math.abs(num);
    const formatted = abs.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const prefix = num < 0 ? '-' : (options.showPlus && num > 0 ? '+' : '');
    return `${prefix}${currentCurrency.symbol} ${formatted}`;
  };

  // 1. Transaction Handlers
  const addTransaction = (txData) => {
    const id = 'tx-' + Date.now();
    const newTx = { ...txData, id };
    const amount = Number(txData.amount);

    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        if (newTx.type === 'expense' && acc.id === newTx.accountId) {
          return { ...acc, balance: Number(acc.balance) - amount };
        }
        if (newTx.type === 'income' && acc.id === newTx.accountId) {
          return { ...acc, balance: Number(acc.balance) + amount };
        }
        if (newTx.type === 'transfer') {
          if (acc.id === newTx.accountId) {
            return { ...acc, balance: Number(acc.balance) - amount };
          }
          if (acc.id === newTx.toAccountId) {
            return { ...acc, balance: Number(acc.balance) + amount };
          }
        }
        return acc;
      })
    );

    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  const updateTransaction = (id, updatedData) => {
    const existing = transactions.find((t) => t.id === id);
    if (!existing) return;

    const oldAmt = Number(existing.amount);
    const newAmt = Number(updatedData.amount);

    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        let bal = Number(acc.balance);
        if (existing.type === 'expense' && acc.id === existing.accountId) bal += oldAmt;
        if (existing.type === 'income' && acc.id === existing.accountId) bal -= oldAmt;
        if (existing.type === 'transfer') {
          if (acc.id === existing.accountId) bal += oldAmt;
          if (acc.id === existing.toAccountId) bal -= oldAmt;
        }

        if (updatedData.type === 'expense' && acc.id === updatedData.accountId) bal -= newAmt;
        if (updatedData.type === 'income' && acc.id === updatedData.accountId) bal -= newAmt;
        if (updatedData.type === 'transfer') {
          if (acc.id === updatedData.accountId) bal -= newAmt;
          if (acc.id === updatedData.toAccountId) bal += newAmt;
        }

        return { ...acc, balance: bal };
      })
    );

    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t))
    );
  };

  const deleteTransaction = (id) => {
    const existing = transactions.find((t) => t.id === id);
    if (!existing) return;

    const amt = Number(existing.amount);

    setAccounts((prevAccounts) =>
      prevAccounts.map((acc) => {
        let bal = Number(acc.balance);
        if (existing.type === 'expense' && acc.id === existing.accountId) bal += amt;
        if (existing.type === 'income' && acc.id === existing.accountId) bal -= amt;
        if (existing.type === 'transfer') {
          if (acc.id === existing.accountId) bal += amt;
          if (acc.id === existing.toAccountId) bal -= amt;
        }
        return { ...acc, balance: bal };
      })
    );

    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // 2. Account Handlers
  const addAccount = (accData) => {
    const id = 'acc-' + Date.now();
    const newAcc = {
      ...accData,
      id,
      balance: Number(accData.balance || 0),
      currency: currencyCode,
    };
    setAccounts((prev) => [...prev, newAcc]);
    return newAcc;
  };

  const updateAccount = (id, accData) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, ...accData, balance: Number(accData.balance ?? acc.balance) } : acc))
    );
  };

  const deleteAccount = (id) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  // 3. Budgets Handlers
  const addBudget = (budgetData) => {
    const id = 'bud-' + Date.now();
    const newBudget = {
      ...budgetData,
      id,
      limit: Number(budgetData.limit || 0),
    };
    setBudgets((prev) => [...prev, newBudget]);
    return newBudget;
  };

  const updateBudget = (id, budgetData) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...budgetData, limit: Number(budgetData.limit ?? b.limit) } : b))
    );
  };

  const deleteBudget = (id) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  // 4. Planned Payments Handlers
  const addPlannedPayment = (planData) => {
    const id = 'plan-' + Date.now();
    const newPlan = {
      ...planData,
      id,
      amount: Number(planData.amount || 0),
      status: planData.status || 'upcoming',
    };
    setPlannedPayments((prev) => [...prev, newPlan]);
    return newPlan;
  };

  const updatePlannedPayment = (id, planData) => {
    setPlannedPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...planData, amount: Number(planData.amount ?? p.amount) } : p))
    );
  };

  const deletePlannedPayment = (id) => {
    setPlannedPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const markPlannedPaid = (id) => {
    const plan = plannedPayments.find((p) => p.id === id);
    if (!plan) return;

    addTransaction({
      type: 'expense',
      amount: plan.amount,
      category: plan.categoryId || 'utilities',
      accountId: plan.accountId || accounts[0]?.id || 'acc-1',
      date: new Date().toISOString().split('T')[0],
      note: `Bill settlement: ${plan.name}`,
      payee: plan.name,
      status: 'cleared',
    });

    setPlannedPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'paid' } : p))
    );
  };

  // 5. Goals Handlers
  const addGoal = (goalData) => {
    const id = 'goal-' + Date.now();
    const newGoal = {
      ...goalData,
      id,
      targetAmount: Number(goalData.targetAmount || 0),
      currentAmount: Number(goalData.currentAmount || 0),
    };
    setGoals((prev) => [...prev, newGoal]);
    return newGoal;
  };

  const updateGoal = (id, goalData) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...goalData } : g))
    );
  };

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const depositToGoal = (goalId, amount, accountId) => {
    const numAmt = Number(amount);
    const goal = goals.find((g) => g.id === goalId);
    if (!goal || numAmt <= 0) return;

    if (accountId) {
      addTransaction({
        type: 'expense',
        amount: numAmt,
        category: 'other_expense',
        accountId,
        date: new Date().toISOString().split('T')[0],
        note: `Goal Deposit: ${goal.name}`,
        payee: `Savings Goal: ${goal.name}`,
        status: 'cleared',
      });
    }

    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, currentAmount: Number(g.currentAmount) + numAmt } : g
      )
    );
  };

  // 6. Debts & Loans Handlers
  const addDebt = (debtData) => {
    const id = 'debt-' + Date.now();
    const newDebt = {
      ...debtData,
      id,
      totalAmount: Number(debtData.totalAmount || 0),
      remainingAmount: Number(debtData.remainingAmount || debtData.totalAmount || 0),
      monthlyEMI: Number(debtData.monthlyEMI || 0),
      interestRate: Number(debtData.interestRate || 0),
    };
    setDebts((prev) => [...prev, newDebt]);
    return newDebt;
  };

  const updateDebt = (id, debtData) => {
    setDebts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...debtData } : d))
    );
  };

  const deleteDebt = (id) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const payDebtInstallment = (debtId, paymentAmount, accountId) => {
    const debt = debts.find((d) => d.id === debtId);
    const amt = Number(paymentAmount);
    if (!debt || amt <= 0) return;

    if (accountId) {
      addTransaction({
        type: 'expense',
        amount: amt,
        category: 'housing',
        accountId,
        date: new Date().toISOString().split('T')[0],
        note: `Loan EMI Payment: ${debt.name}`,
        payee: `Loan Payment (${debt.name})`,
        status: 'cleared',
      });
    }

    setDebts((prev) =>
      prev.map((d) =>
        d.id === debtId
          ? { ...d, remainingAmount: Math.max(0, Number(d.remainingAmount) - amt) }
          : d
      )
    );
  };

  // Clear dashboard to 100% fresh clean state for users
  const clearToFreshDashboard = () => {
    if (!currentUser) return;
    const fresh = getFreshUserData(currencyCode);
    setAccounts(fresh.accounts);
    setTransactions([]);
    setBudgets([]);
    setPlannedPayments([]);
    setGoals([]);
    setDebts([]);
    try {
      localStorage.setItem(`wallet_data_${currentUser.id}`, JSON.stringify(fresh));
    } catch (e) {
      console.error('Failed to clear to fresh data in storage', e);
    }
  };

  // Load sample demo data on demand
  const loadSampleDemoData = () => {
    if (!currentUser) return;
    const demo = getInitialDemoData(currencyCode);
    setAccounts(demo.accounts);
    setTransactions(demo.transactions);
    setBudgets(demo.budgets);
    setPlannedPayments(demo.plannedPayments);
    setGoals(demo.goals);
    setDebts(demo.debts || []);
  };

  // Reset to initial demo
  const resetToDefaults = () => {
    if (!currentUser) return;
    if (currentUser.isGuest) {
      loadSampleDemoData();
    } else {
      clearToFreshDashboard();
    }
  };

  // Export JSON
  const exportDataJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      user: currentUser?.email,
      currency: currencyCode,
      accounts,
      transactions,
      budgets,
      plannedPayments,
      goals,
      debts,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallet-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV of transactions
  const exportDataCSV = () => {
    const headers = ['Date', 'Type', 'Amount', 'Currency', 'Category', 'Account', 'Payee', 'Note', 'Status'];
    const rows = transactions.map((t) => {
      const acc = accounts.find((a) => a.id === t.accountId)?.name || 'Unknown';
      return [
        t.date,
        t.type,
        t.amount,
        currentCurrency.code,
        t.category || '',
        acc,
        `"${(t.payee || '').replace(/"/g, '""')}"`,
        `"${(t.note || '').replace(/"/g, '""')}"`,
        t.status || 'cleared',
      ].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallet-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const importDataJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.accounts) setAccounts(parsed.accounts);
      if (parsed.transactions) setTransactions(parsed.transactions);
      if (parsed.budgets) setBudgets(parsed.budgets);
      if (parsed.plannedPayments) setPlannedPayments(parsed.plannedPayments);
      if (parsed.goals) setGoals(parsed.goals);
      if (parsed.debts) setDebts(parsed.debts);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      throw new Error('Invalid JSON format.');
    }
  };

  // Calculations for summary stats
  const totalBalance = accounts.reduce((acc, a) => acc + Number(a.balance || 0), 0);
  const totalDebtRemaining = debts.reduce((sum, d) => sum + Number(d.remainingAmount || 0), 0);
  const netWorth = totalBalance - totalDebtRemaining;

  // Current Month calculations
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const currentMonthTransactions = transactions.filter((t) => t.date && t.date.startsWith(currentMonthStr));
  const currentMonthIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);
  const currentMonthExpense = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const savingsRate = currentMonthIncome > 0
    ? Math.max(0, Math.round(((currentMonthIncome - currentMonthExpense) / currentMonthIncome) * 100))
    : 0;

  // Custom Category Handlers
  const addCustomCategory = (catData) => {
    const id = 'cat-' + Date.now();
    const newCat = {
      id,
      name: catData.name.trim(),
      icon: catData.icon || 'Tag',
      emoji: catData.emoji || '',
      color: catData.color || '#10B981',
      type: catData.type || 'expense',
      isCustom: true,
      bg: 'bg-emerald-500/10 text-emerald-600',
    };
    setCustomCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const deleteCustomCategory = (id) => {
    setCustomCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const allExpenseCategories = [
    ...EXPENSE_CATEGORIES,
    ...customCategories.filter((c) => c.type === 'expense'),
  ];

  const allIncomeCategories = [
    ...INCOME_CATEGORIES,
    ...customCategories.filter((c) => c.type === 'income'),
  ];

  const allCategories = [...allExpenseCategories, ...allIncomeCategories];

  const getCategory = (catId, type) => {
    if (type === 'income') {
      const found = allIncomeCategories.find((c) => c.id === catId);
      if (found) return found;
    } else if (type === 'expense') {
      const found = allExpenseCategories.find((c) => c.id === catId);
      if (found) return found;
    }
    const foundAny = allCategories.find((c) => c.id === catId);
    if (foundAny) return foundAny;
    return {
      id: catId || 'other',
      name: catId ? catId.replace(/_/g, ' ') : 'Other Expenses',
      icon: 'Tag',
      color: 'text-slate-500',
      bg: 'bg-slate-100 dark:bg-slate-800',
    };
  };

  return (
    <FinanceContext.Provider
      value={{
        accounts,
        transactions,
        budgets,
        plannedPayments,
        goals,
        debts,
        customCategories,
        addCustomCategory,
        deleteCustomCategory,
        allExpenseCategories,
        allIncomeCategories,
        allCategories,
        getCategory,
        currencyCode,
        setCurrencyCode,
        currentCurrency,
        formatMoney,
        // Transaction actions
        addTransaction,
        updateTransaction,
        deleteTransaction,
        // Account actions
        addAccount,
        updateAccount,
        deleteAccount,
        // Budget actions
        addBudget,
        updateBudget,
        deleteBudget,
        // Planned payments
        addPlannedPayment,
        updatePlannedPayment,
        deletePlannedPayment,
        markPlannedPaid,
        // Goals
        addGoal,
        updateGoal,
        deleteGoal,
        depositToGoal,
        // Debts & Loans
        addDebt,
        updateDebt,
        deleteDebt,
        payDebtInstallment,
        totalDebtRemaining,
        netWorth,
        // Clean dashboard & demo data
        clearToFreshDashboard,
        loadSampleDemoData,
        // Backup
        exportDataJSON,
        exportDataCSV,
        importDataJSON,
        resetToDefaults,
        // Metrics
        totalBalance,
        currentMonthIncome,
        currentMonthExpense,
        savingsRate,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
