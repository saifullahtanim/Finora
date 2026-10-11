import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  CreditCard,
  LayoutGrid,
  Tag,
  Coins,
  ArrowRightLeft,
  Ban,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Info,
  Save,
  Check,
  Utensils,
  ShoppingBag,
  Home,
  Bus,
  Car,
  User,
  Monitor,
  HelpCircle,
  Menu as MenuIcon,
  Wallet,
  Receipt,
  FileDown,
  Trash2,
  Copy,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import IconHelper from '../common/IconHelper';

export const TransactionListView = ({ onOpenAddTx, onEditTransaction }) => {
  const {
    transactions,
    accounts,
    deleteTransaction,
    formatMoney,
    allCategories,
    currentCurrency,
  } = useFinance();

  // Selected transactions for bulk actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Filter States matching the exact sidebar in screenshot
  const [selectedPreset, setSelectedPreset] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [accountFilter, setAccountFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [labelFilter, setLabelFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [recordTypeFilter, setRecordTypeFilter] = useState('all');
  const [transferFilter, setTransferFilter] = useState('include');
  const [recordStateFilter, setRecordStateFilter] = useState('all');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');

  // Amount Range
  const maxPossibleAmount = useMemo(() => {
    if (!transactions.length) return 20251;
    const maxVal = Math.max(...transactions.map((t) => Number(t.amount || 0)));
    return Math.max(maxVal, 20251);
  }, [transactions]);

  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(20251);

  // Time / Period Filter (Centered in top)
  const [periodFilter, setPeriodFilter] = useState('this_month');
  const [periodOffset, setPeriodOffset] = useState(0);

  // Category Icon & Color mapping matching BudgetBakers reference
  const getCategoryMeta = (t) => {
    const catId = (t.category || t.categoryId || '').toLowerCase();
    const type = t.type;

    if (type === 'transfer') {
      return {
        name: 'Transfer',
        icon: ArrowRightLeft,
        bg: '#E0F2FE',
        color: '#0284C7',
      };
    }

    // Check custom categories or exact matched categories with emoji/icon
    const matchedCategory = (allCategories || []).find(
      (c) => c.id === t.categoryId || c.id === t.category || c.name.toLowerCase() === catId
    );
    if (matchedCategory) {
      return {
        name: matchedCategory.name,
        icon: Tag,
        iconName: matchedCategory.icon || 'Tag',
        emoji: matchedCategory.emoji || '',
        bg: `${matchedCategory.color || '#00875A'}20`,
        color: matchedCategory.color || '#00875A',
        isCustom: !!matchedCategory.isCustom,
      };
    }

    if (catId.includes('food') || catId.includes('dining') || catId.includes('grocer')) {
      return {
        name: 'Food & Drinks',
        icon: Utensils,
        bg: '#FEE2E2',
        color: '#EF4444',
      };
    }
    if (catId.includes('shop') || catId.includes('cloth')) {
      return {
        name: 'Shopping',
        icon: ShoppingBag,
        bg: '#E0F2FE',
        color: '#0284C7',
      };
    }
    if (catId.includes('hous') || catId.includes('util') || catId.includes('rent')) {
      return {
        name: 'Housing',
        icon: Home,
        bg: '#FEF3C7',
        color: '#D97706',
      };
    }
    if (catId.includes('transp') || catId.includes('bus') || catId.includes('train')) {
      return {
        name: 'Transportation',
        icon: Bus,
        bg: '#F1F5F9',
        color: '#64748B',
      };
    }
    if (catId.includes('vehic') || catId.includes('car') || catId.includes('fuel')) {
      return {
        name: 'Vehicle',
        icon: Car,
        bg: '#F3E8FF',
        color: '#9333EA',
      };
    }
    if (catId.includes('life') || catId.includes('entert') || catId.includes('gift') || catId.includes('health')) {
      return {
        name: 'Life & Entertainment',
        icon: User,
        bg: '#DCFCE7',
        color: '#16A34A',
      };
    }
    if (catId.includes('comm') || catId.includes('mobile') || catId.includes('internet') || catId.includes('pc')) {
      return {
        name: 'Communication, PC',
        icon: Monitor,
        bg: '#E0E7FF',
        color: '#4F46E5',
      };
    }
    if (catId.includes('finan') || catId.includes('charity') || catId.includes('zakat')) {
      return {
        name: 'Financial expenses',
        icon: Info,
        bg: '#CCFBF1',
        color: '#0D9488',
      };
    }
    if (catId.includes('invest') || catId.includes('saving')) {
      return {
        name: 'Investments',
        icon: TrendingUp,
        bg: '#FCE7F3',
        color: '#DB2777',
      };
    }
    if (catId.includes('other')) {
      return {
        name: 'Others',
        icon: MenuIcon,
        bg: '#F3F4F6',
        color: '#6B7280',
      };
    }

    return {
      name: t.category || 'Food & Drinks',
      icon: Utensils,
      bg: '#FEE2E2',
      color: '#EF4444',
    };
  };

  // Filter & Sort Logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Search
        if (search.trim()) {
          const q = search.toLowerCase();
          const payeeMatch = (t.payee || '').toLowerCase().includes(q);
          const noteMatch = (t.note || '').toLowerCase().includes(q);
          const catMeta = getCategoryMeta(t);
          if (!payeeMatch && !noteMatch && !catMeta.name.toLowerCase().includes(q)) return false;
        }

        // Record Types
        if (recordTypeFilter === 'expense' && t.type !== 'expense') return false;
        if (recordTypeFilter === 'income' && t.type !== 'income') return false;
        if (recordTypeFilter === 'transfer' && t.type !== 'transfer') return false;

        // Transfers filter
        if (transferFilter === 'exclude' && t.type === 'transfer') return false;
        if (transferFilter === 'only' && t.type !== 'transfer') return false;

        // Account filter
        if (accountFilter !== 'all') {
          if (t.accountId !== accountFilter && t.toAccountId !== accountFilter) return false;
        }

        // Category filter
        if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

        // Amount range filter
        const amt = Number(t.amount || 0);
        if (amt < minAmount || amt > maxAmount) return false;

        // Record State
        if (recordStateFilter !== 'all') {
          const status = t.status || 'cleared';
          if (status !== recordStateFilter) return false;
        }

        // Period filter
        const now = new Date();
        now.setMonth(now.getMonth() + periodOffset);
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const prefix = `${y}-${m}`;

        if (periodFilter === 'this_month') {
          if (t.date && !t.date.startsWith(prefix)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount-desc') return Number(b.amount) - Number(a.amount);
        if (sortBy === 'amount-asc') return Number(a.amount) - Number(b.amount);
        return 0;
      });
  }, [
    transactions,
    search,
    recordTypeFilter,
    transferFilter,
    accountFilter,
    categoryFilter,
    minAmount,
    maxAmount,
    recordStateFilter,
    periodFilter,
    periodOffset,
    sortBy,
  ]);

  // Group transactions by date: e.g. "October 10, 2026"
  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach((tx) => {
      const d = tx.date ? new Date(tx.date) : new Date();
      const dateKey = d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      if (!groups[dateKey]) {
        groups[dateKey] = {
          dateStr: dateKey,
          items: [],
          dayTotal: 0,
        };
      }
      groups[dateKey].items.push(tx);
      const amt = Number(tx.amount || 0);
      if (tx.type === 'expense') {
        groups[dateKey].dayTotal -= amt;
      } else if (tx.type === 'income') {
        groups[dateKey].dayTotal += amt;
      }
    });
    return Object.values(groups);
  }, [filteredTransactions]);

  // Overall total for found records
  const overallTotal = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      const amt = Number(t.amount || 0);
      if (t.type === 'expense') return acc - amt;
      if (t.type === 'income') return acc + amt;
      return acc;
    }, 0);
  }, [filteredTransactions]);

  // Selected total for checked records
  const selectedTotal = useMemo(() => {
    if (selectedIds.length === 0) return 0;
    const selectedSet = new Set(selectedIds);
    return filteredTransactions.reduce((acc, t) => {
      if (!selectedSet.has(t.id)) return acc;
      const amt = Number(t.amount || 0);
      if (t.type === 'expense') return acc - amt;
      if (t.type === 'income') return acc + amt;
      return acc;
    }, 0);
  }, [filteredTransactions, selectedIds]);

  const clearFilters = () => {
    setSelectedPreset('');
    setSearch('');
    setSortBy('date-desc');
    setAccountFilter('all');
    setCategoryFilter('all');
    setLabelFilter('all');
    setCurrencyFilter('all');
    setRecordTypeFilter('all');
    setTransferFilter('include');
    setRecordStateFilter('all');
    setPaymentTypeFilter('all');
    setMinAmount(0);
    setMaxAmount(maxPossibleAmount);
    setPeriodFilter('this_month');
    setPeriodOffset(0);
  };

  // Format amount with currency: negative gets "-BDT 10,000.00", positive gets "BDT 10,000.00"
  const formatDisplayAmount = (val, isNegativeExplicit = false) => {
    const num = Number(val || 0);
    const code = currentCurrency?.code || 'BDT';
    const formatted = Math.abs(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (isNegativeExplicit || num < 0) {
      return `-${code} ${formatted}`;
    }
    return `${code} ${formatted}`;
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredTransactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTransactions.map((t) => t.id));
    }
  };

  const handleToggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleEditSelected = () => {
    if (selectedIds.length === 0) return;
    const target = filteredTransactions.find((t) => selectedIds.includes(t.id));
    if (target && onEditTransaction) {
      onEditTransaction(target);
    }
  };

  const handleExportSelected = () => {
    if (selectedIds.length === 0) return;
    const selectedRows = filteredTransactions.filter((t) => selectedIds.includes(t.id));
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Currency', 'Note'];
    const rows = selectedRows.map((t) => [
      t.date || '',
      t.type || '',
      t.category || '',
      t.amount || 0,
      t.currency || currentCurrency?.code || 'BDT',
      `"${(t.note || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `records_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} selected records?`)) {
      selectedIds.forEach((id) => deleteTransaction(id));
      setSelectedIds([]);
    }
  };

  const handleSolveDuplicities = () => {
    if (selectedIds.length === 0) return;
    const seen = new Set();
    const dups = [];
    selectedIds.forEach((id) => {
      const tx = filteredTransactions.find((t) => t.id === id);
      if (tx) {
        const key = `${tx.date}-${tx.amount}-${tx.type}-${tx.category}`;
        if (seen.has(key)) {
          dups.push(id);
        } else {
          seen.add(key);
        }
      }
    });

    if (dups.length > 0) {
      if (window.confirm(`Found ${dups.length} duplicate record(s). Do you want to remove them?`)) {
        dups.forEach((id) => deleteTransaction(id));
        setSelectedIds((prev) => prev.filter((id) => !dups.includes(id)));
      }
    } else {
      alert('No duplicate records detected among the selected items.');
    }
  };

  return (
    <div className="w-full pb-12 animate-fade-in select-none">
      <div className="flex flex-col lg:flex-row items-start gap-5 xl:gap-6">
        {/* ============================================================= */}
        {/* LEFT SIDEBAR: Exact Replica of Reference Screenshot            */}
        {/* ============================================================= */}
        <div className="w-full lg:w-[250px] xl:w-[270px] flex-shrink-0 bg-white dark:bg-[#1E1E20] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-4 flex flex-col gap-3">
          {/* Header: Title + Sliders + Green Plus Button */}
          <div className="flex items-center justify-between pb-0.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Records
            </h2>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                title="Filter Presets"
              >
                <SlidersHorizontal className="w-4 h-4 stroke-[1.8]" />
              </button>

              <button
                type="button"
                onClick={onOpenAddTx}
                className="w-6 h-6 rounded-md bg-[#00875A] hover:bg-[#00704A] text-white transition-colors cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
                title="Add Record"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* 1. My filter */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <span>My filter</span>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <div className="relative flex items-center">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Select filter"
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#00875A]"
              />
              <Save className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
            </div>
          </div>

          {/* 2. Search */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Search
            </label>
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#00875A]"
              />
            </div>
          </div>

          {/* 3. Sort by */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Sort by
            </label>
            <div className="relative flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-xs text-slate-700 dark:text-slate-300 font-normal focus:outline-none focus:border-[#00875A] cursor-pointer"
              >
                <option value="date-desc">Time (newest first)</option>
                <option value="date-asc">Time (oldest first)</option>
                <option value="amount-desc">Amount (highest first)</option>
                <option value="amount-asc">Amount (lowest first)</option>
              </select>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* 4. Accounts */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Accounts
            </label>
            <div className="relative flex items-center">
              <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="w-full appearance-none pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-xs text-slate-700 dark:text-slate-300 font-normal focus:outline-none focus:border-[#00875A] cursor-pointer"
              >
                <option value="all">All accounts</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* 5. Categories */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Categories
            </label>
            <div className="relative flex items-center">
              <LayoutGrid className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-xs text-slate-700 dark:text-slate-300 font-normal focus:outline-none focus:border-[#00875A] cursor-pointer"
              >
                <option value="all">All categories</option>
                {allCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* 6. Labels */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Labels
            </label>
            <div className="relative flex items-center">
              <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={labelFilter}
                onChange={(e) => setLabelFilter(e.target.value)}
                className="w-full appearance-none pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-xs text-slate-700 dark:text-slate-300 font-normal focus:outline-none focus:border-[#00875A] cursor-pointer"
              >
                <option value="all">All</option>
              </select>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* 7. Currencies */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Currencies
            </label>
            <div className="relative flex items-center">
              <span className="text-xs font-bold text-slate-400 absolute left-3 pointer-events-none">
                €
              </span>
              <select
                value={currencyFilter}
                onChange={(e) => setCurrencyFilter(e.target.value)}
                className="w-full appearance-none pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-xs text-slate-700 dark:text-slate-300 font-normal focus:outline-none focus:border-[#00875A] cursor-pointer"
              >
                <option value="all">All Currencies</option>
                <option value="BDT">BDT</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* 8. Record types */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Record types
            </label>
            <div className="relative flex items-center">
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={recordTypeFilter}
                onChange={(e) => setRecordTypeFilter(e.target.value)}
                className="w-full appearance-none pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-xs text-slate-700 dark:text-slate-300 font-normal focus:outline-none focus:border-[#00875A] cursor-pointer"
              >
                <option value="all">All Record types</option>
                <option value="expense">Expenses</option>
                <option value="income">Incomes</option>
                <option value="transfer">Transfers</option>
              </select>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* 9. Amount range matching screenshot */}
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <span>Amount range</span>
              <span className="text-[10px] text-slate-400 font-sans">
                {currentCurrency?.code || 'BDT'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-normal">
              Absolute amount in referential currency
            </p>

            {/* Slider track with green filled bar matching screenshot */}
            <div className="pt-1.5 pb-0.5 relative flex items-center">
              <div className="w-full h-1.5 bg-[#00875A] rounded-full relative">
                {/* Min Circle Handle */}
                <span className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#00875A] shadow-xs absolute left-0 -top-1" />
                {/* Max Circle Handle */}
                <span className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#00875A] shadow-xs absolute right-0 -top-1" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-normal">
              <span>BDT 0</span>
              <span>BDT {maxPossibleAmount.toLocaleString()}</span>
            </div>

            {/* Two numerical input boxes */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(Number(e.target.value))}
                className="w-full px-2 py-1 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-xs font-normal focus:outline-none"
              />
              <input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(Number(e.target.value))}
                className="w-full px-2 py-1 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-xs font-normal focus:outline-none"
              />
            </div>
          </div>

          {/* 10. Transfers */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Transfers
            </label>
            <div className="relative flex items-center">
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={transferFilter}
                onChange={(e) => setTransferFilter(e.target.value)}
                className="w-full appearance-none pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-xs text-slate-700 dark:text-slate-300 font-normal focus:outline-none focus:border-[#00875A] cursor-pointer"
              >
                <option value="include">Include transfers</option>
                <option value="exclude">Exclude transfers</option>
                <option value="only">Transfers only</option>
              </select>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* 11. Record States */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Record States
            </label>
            <div className="relative flex items-center">
              <Ban className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={recordStateFilter}
                onChange={(e) => setRecordStateFilter(e.target.value)}
                className="w-full appearance-none pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-xs text-slate-700 dark:text-slate-300 font-normal focus:outline-none focus:border-[#00875A] cursor-pointer"
              >
                <option value="all">All Record States</option>
                <option value="cleared">Cleared</option>
                <option value="pending">Pending</option>
              </select>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* 12. Payment types */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              Payment types
            </label>
            <div className="relative flex items-center">
              <Wallet className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={paymentTypeFilter}
                onChange={(e) => setPaymentTypeFilter(e.target.value)}
                className="w-full appearance-none pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-xs text-slate-700 dark:text-slate-300 font-normal focus:outline-none focus:border-[#00875A] cursor-pointer"
              >
                <option value="all">All Payment types</option>
                <option value="cash">Cash</option>
                <option value="mobile">Mobile Banking</option>
                <option value="bank">Bank Transfer</option>
              </select>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* 13. Reset Filter Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={clearFilters}
              className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* ============================================================= */}
        {/* RIGHT MAIN VIEW: Top Period Navigator & Records Feed          */}
        {/* ============================================================= */}
        <div className="flex-1 w-full space-y-3">
          {/* 1. Centered Month / Time Navigator (matching screenshot) */}
          <div className="flex items-center justify-center gap-2 py-0.5">
            <button
              type="button"
              onClick={() => setPeriodOffset((prev) => prev - 1)}
              className="p-1 rounded text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Previous period"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="relative inline-flex items-center">
              <select
                value={periodFilter}
                onChange={(e) => {
                  setPeriodFilter(e.target.value);
                  setPeriodOffset(0);
                }}
                className="appearance-none px-7 py-1.5 rounded-lg border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-xs font-semibold text-slate-800 dark:text-slate-200 pr-7 focus:outline-none cursor-pointer shadow-2xs"
              >
                <option value="this_month">This month</option>
                <option value="last_month">Last month</option>
                <option value="all_time">All time</option>
              </select>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() => setPeriodOffset((prev) => prev + 1)}
              className="p-1 rounded text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Next period"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Selection & Action Bar matching Screenshot */}
          <div
            className={`rounded-xl border shadow-xs px-5 py-2.5 flex items-center justify-between gap-4 transition-colors duration-200 ${
              selectedIds.length > 0
                ? 'bg-[#FFF9D2] border-[#FCE89F] dark:bg-[#342F17] dark:border-yellow-700/60'
                : 'bg-white dark:bg-[#1E1E20] border-slate-200/80 dark:border-slate-800'
            }`}
          >
            {/* Left: Checkbox & Count */}
            <div className="flex flex-col gap-1 select-none">
              <h4 className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
                Found {selectedIds.length > 0 ? selectedIds.length : filteredTransactions.length} records
              </h4>
              <div
                onClick={handleToggleSelectAll}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <button
                  type="button"
                  aria-label="Toggle select all"
                  className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
                    selectedIds.length > 0
                      ? 'bg-[#00875A] border border-[#00875A] text-white'
                      : 'bg-white dark:bg-[#1E1E20] border border-slate-300 dark:border-slate-600 group-hover:border-slate-400'
                  }`}
                >
                  {selectedIds.length > 0 && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
                <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  {selectedIds.length > 0 ? 'Deselect all' : 'Select all'}
                </span>
              </div>
            </div>

            {/* Middle: 4 Pill Action Buttons matching screenshot */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={handleEditSelected}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedIds.length > 0
                    ? 'bg-[#00A86B] hover:bg-[#00925D] text-white cursor-pointer shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 disabled:opacity-70 disabled:cursor-not-allowed'
                }`}
              >
                Edit
              </button>
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={handleExportSelected}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedIds.length > 0
                    ? 'bg-[#FF9500] hover:bg-[#E68600] text-white cursor-pointer shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 disabled:opacity-70 disabled:cursor-not-allowed'
                }`}
              >
                Export
              </button>
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={handleDeleteSelected}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedIds.length > 0
                    ? 'bg-[#FF4D4D] hover:bg-[#E63E3E] text-white cursor-pointer shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 disabled:opacity-70 disabled:cursor-not-allowed'
                }`}
              >
                Delete
              </button>
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={handleSolveDuplicities}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedIds.length > 0
                    ? 'bg-[#007AFF] hover:bg-[#006DE6] text-white cursor-pointer shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 disabled:opacity-70 disabled:cursor-not-allowed'
                }`}
              >
                Solve Duplicities
              </button>
            </div>

            {/* Right: Total Amount for found records */}
            <div className="text-right">
              <span className="text-xs sm:text-[13px] font-semibold text-slate-600 dark:text-slate-400">
                {selectedIds.length > 0
                  ? formatDisplayAmount(selectedTotal, selectedTotal < 0)
                  : formatDisplayAmount(overallTotal, overallTotal < 0)}
              </span>
            </div>
          </div>

          {/* 3. Grouped Transaction Feed */}
          {groupedTransactions.length === 0 ? (
            <div className="bg-white dark:bg-[#1E1E20] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-12 text-center select-none">
              <p className="text-sm text-slate-400 font-normal">
                Sorry, no records were found for this combination of filters.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {groupedTransactions.map((group) => (
                <div key={group.dateStr} className="space-y-1.5">
                  {/* Date Header matching screenshot */}
                  <div className="flex items-center justify-between px-1 pt-1 text-[13px] font-bold text-slate-900 dark:text-white">
                    <span>{group.dateStr}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-semibold text-xs sm:text-[13px]">
                      {formatDisplayAmount(group.dayTotal, group.dayTotal < 0)}
                    </span>
                  </div>

                  {/* Transactions Container - Separate cards matching BudgetBakers reference */}
                  <div className="space-y-2">
                    {group.items.map((tx) => {
                      const cat = getCategoryMeta(tx);
                      const isExpense = tx.type === 'expense';
                      const isIncome = tx.type === 'income';
                      const sourceAcc = accounts.find((a) => a.id === tx.accountId);
                      const isSelected = selectedIds.includes(tx.id);

                      // Determine account color
                      const accName = sourceAcc?.name || 'Cash in Hand';
                      const accColor =
                        accName.toLowerCase().includes('bkash')
                          ? '#E2136E'
                          : accName.toLowerCase().includes('cash')
                          ? '#17B8D8'
                          : accName.toLowerCase().includes('bank')
                          ? '#007AFF'
                          : sourceAcc?.color || '#17B8D8';

                      // Format time (e.g. 7:45 PM)
                      let timeStr = '7:45 PM';
                      if (tx.createdAt) {
                        try {
                          const d = new Date(tx.createdAt);
                          timeStr = d.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          });
                        } catch (e) {
                          timeStr = '7:45 PM';
                        }
                      }

                      const CatIcon = cat.icon;

                      return (
                        <div
                          key={tx.id}
                          onClick={() => onEditTransaction && onEditTransaction(tx)}
                          className="bg-white dark:bg-[#1E1E20] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs px-5 py-3.5 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:border-slate-300/80 dark:hover:border-slate-700 hover:shadow-xs transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer group"
                        >
                          {/* Left: Checkbox + Icon + Category Name (fixed width so middle column aligns in a straight line) */}
                          <div className="flex items-center gap-3.5 w-48 sm:w-60 md:w-72 flex-shrink-0 min-w-0">
                            {/* Custom emerald green checkbox matching screenshot */}
                            <button
                              type="button"
                              aria-label={`Select transaction ${tx.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSelectOne(tx.id);
                              }}
                              className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
                                isSelected
                                  ? 'bg-[#00875A] border border-[#00875A] text-white'
                                  : 'bg-white dark:bg-[#1E1E20] border border-slate-300 dark:border-slate-600 hover:border-slate-400'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </button>

                            {/* Category Icon with verified checkmark badge matching screenshot */}
                            <div className="relative flex-shrink-0">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: cat.bg, color: cat.color }}
                              >
                                {cat.emoji ? (
                                  <span className="text-[18px] select-none leading-none flex items-center justify-center">{cat.emoji}</span>
                                ) : cat.isCustom ? (
                                  <IconHelper name={cat.iconName || 'Tag'} className="w-4 h-4 stroke-[2.2]" />
                                ) : (
                                  <CatIcon className="w-4 h-4 stroke-[2.2]" />
                                )}
                              </div>
                              {/* Green verified badge at bottom right */}
                              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00875A] border-2 border-white dark:border-[#1E1E20] flex items-center justify-center text-white">
                                <Check className="w-2 h-2 stroke-[3]" />
                              </div>
                            </div>

                            <span className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white truncate">
                              {cat.name}
                            </span>
                          </div>

                          {/* Middle: Account Badge (Colored Dot + Account Name) - perfectly aligned in a straight line */}
                          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium flex-1 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: accColor }}
                            />
                            <span className="truncate">{accName}</span>
                          </div>

                          {/* Right: Amount & Time */}
                          {/* CRITICAL USER REQUIREMENT: - hole red hobe image e jemon style temon */}
                          <div className="text-right flex-shrink-0">
                            <span
                              className={`text-[13px] sm:text-sm font-bold block tracking-tight ${
                                isExpense
                                  ? 'text-[#FF3B30] dark:text-[#FF453A]'
                                  : isIncome
                                  ? 'text-[#00875A] dark:text-[#34C759]'
                                  : 'text-blue-600 dark:text-blue-400'
                              }`}
                            >
                              {isExpense ? '-' : isIncome ? '+' : ''}
                              {currentCurrency?.code || 'BDT'}{' '}
                              {Math.abs(Number(tx.amount || 0)).toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                            <span className="text-[11px] text-slate-400 font-normal">
                              {timeStr}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionListView;
