import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Search,
  Filter,
  CreditCard,
  LayoutGrid,
  Tag,
  Coins,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Info,
  Save,
  FileText,
  TrendingUp,
  BarChart2,
  PieChart,
  Utensils,
  ShoppingBag,
  Home,
  Bus,
  Car,
  User,
  Monitor,
  HelpCircle,
  Menu as MenuIcon,
  Equal,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';

export const AnalyticsView = () => {
  const {
    transactions,
    accounts,
    allCategories,
    currentCurrency,
    formatMoney,
  } = useFinance();

  // Active view tab in right section
  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'trend' | 'cashflow' | 'charts'

  // Filter States matching the exact sidebar in screenshot
  const [selectedPreset, setSelectedPreset] = useState('');
  const [search, setSearch] = useState('');
  const [accountFilter, setAccountFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [labelFilter, setLabelFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [recordTypeFilter, setRecordTypeFilter] = useState('all');

  // Time Navigator: Month offset (0 = current month, -1 = last month, etc.)
  const [monthOffset, setMonthOffset] = useState(0);

  // Calculate current month date & previous month date
  const { currentMonthLabel, prevMonthLabel, currentMonthKey, prevMonthKey } =
    useMemo(() => {
      const now = new Date();
      const curr = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
      const prev = new Date(now.getFullYear(), now.getMonth() + monthOffset - 1, 1);

      const formatLabel = (d) =>
        d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      const formatKey = (d) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      return {
        currentMonthLabel: formatLabel(curr),
        prevMonthLabel: formatLabel(prev),
        currentMonthKey: formatKey(curr),
        prevMonthKey: formatKey(prev),
      };
    }, [monthOffset]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const payeeMatch = (t.payee || '').toLowerCase().includes(q);
        const noteMatch = (t.note || '').toLowerCase().includes(q);
        const catMatch = (t.category || '').toLowerCase().includes(q);
        if (!payeeMatch && !noteMatch && !catMatch) return false;
      }
      if (accountFilter !== 'all') {
        if (t.accountId !== accountFilter && t.toAccountId !== accountFilter) return false;
      }
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (recordTypeFilter !== 'all' && t.type !== recordTypeFilter) return false;
      return true;
    });
  }, [transactions, search, accountFilter, categoryFilter, recordTypeFilter]);

  // Current month transactions vs Prev month transactions
  const { currentMonthTx, prevMonthTx } = useMemo(() => {
    const curr = filteredTransactions.filter((t) => t.date && t.date.startsWith(currentMonthKey));
    const prev = filteredTransactions.filter((t) => t.date && t.date.startsWith(prevMonthKey));
    return { currentMonthTx: curr, prevMonthTx: prev };
  }, [filteredTransactions, currentMonthKey, prevMonthKey]);

  // Calculate Total Income & Total Expense for both periods
  const totals = useMemo(() => {
    let currInc = 0;
    let currExp = 0;
    let prevInc = 0;
    let prevExp = 0;

    currentMonthTx.forEach((t) => {
      const amt = Number(t.amount || 0);
      if (t.type === 'income') currInc += amt;
      if (t.type === 'expense') currExp += amt;
    });

    prevMonthTx.forEach((t) => {
      const amt = Number(t.amount || 0);
      if (t.type === 'income') prevInc += amt;
      if (t.type === 'expense') prevExp += amt;
    });

    return {
      currentIncome: currInc,
      currentExpense: currExp,
      prevIncome: prevInc,
      prevExpense: prevExp,
    };
  }, [currentMonthTx, prevMonthTx]);

  // Define Category rows matching the screenshot exactly
  const expenseCategories = useMemo(() => {
    const list = [
      { id: 'food', name: 'Food & Drinks', icon: Utensils, ids: ['food_dining', 'groceries', 'food'], bg: '#FEE2E2', color: '#EF4444' },
      { id: 'shopping', name: 'Shopping', icon: ShoppingBag, ids: ['shopping', 'clothing'], bg: '#E0F2FE', color: '#0284C7' },
      { id: 'housing', name: 'Housing', icon: Home, ids: ['housing', 'utilities'], bg: '#FEF3C7', color: '#D97706' },
      { id: 'transportation', name: 'Transportation', icon: Bus, ids: ['transportation'], bg: '#F1F5F9', color: '#64748B' },
      { id: 'vehicle', name: 'Vehicle', icon: Car, ids: ['vehicle', 'fuel'], bg: '#F3E8FF', color: '#9333EA' },
      { id: 'life', name: 'Life & Entertainment', icon: User, ids: ['entertainment', 'family_gift', 'health'], bg: '#DCFCE7', color: '#16A34A' },
      { id: 'comm', name: 'Communication, PC', icon: Monitor, ids: ['mobile_internet', 'education'], bg: '#E0E7FF', color: '#4F46E5' },
      { id: 'financial', name: 'Financial expenses', icon: Info, ids: ['zakat_charity', 'financial'], bg: '#CCFBF1', color: '#0D9488' },
      { id: 'investments', name: 'Investments', icon: TrendingUp, ids: ['investments', 'savings'], bg: '#FCE7F3', color: '#DB2777' },
      { id: 'others', name: 'Others', icon: MenuIcon, ids: ['other_expense', 'other'], bg: '#F3F4F6', color: '#6B7280' },
      { id: 'unknown', name: 'Unknown', icon: HelpCircle, ids: ['unknown'], bg: '#F3F4F6', color: '#9CA3AF' },
    ];

    return list.map((cat) => {
      let curr = 0;
      let prev = 0;

      currentMonthTx.forEach((t) => {
        if (t.type === 'expense') {
          if (cat.ids.includes(t.category) || (cat.id === 'unknown' && !t.category)) {
            curr += Number(t.amount || 0);
          }
        }
      });

      prevMonthTx.forEach((t) => {
        if (t.type === 'expense') {
          if (cat.ids.includes(t.category) || (cat.id === 'unknown' && !t.category)) {
            prev += Number(t.amount || 0);
          }
        }
      });

      return { ...cat, currentAmount: curr, prevAmount: prev };
    });
  }, [currentMonthTx, prevMonthTx]);

  // Format currency value as in screenshot: e.g. "BDT 0.00" or "-BDT 10,000.00"
  const formatAmount = (val, isExpense = false) => {
    const num = Number(val || 0);
    const code = currentCurrency?.code || 'BDT';
    if (num === 0) {
      return `${code} 0.00`;
    }
    const formatted = Math.abs(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (isExpense || num < 0) {
      return `-${code} ${formatted}`;
    }
    return `${code} ${formatted}`;
  };

  // 6-Month Data for Trends & Cash flow
  const multiMonthData = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const name = d.toLocaleString('en-US', { month: 'short' });

      let inc = 0;
      let exp = 0;
      transactions.forEach((t) => {
        if (t.date && t.date.startsWith(key)) {
          const amt = Number(t.amount || 0);
          if (t.type === 'income') inc += amt;
          if (t.type === 'expense') exp += amt;
        }
      });

      data.push({
        month: name,
        income: inc,
        expense: exp,
        net: inc - exp,
      });
    }
    return data;
  }, [transactions]);

  return (
    <div className="w-full pb-12 animate-fade-in select-none">
      <div className="flex flex-col lg:flex-row items-start gap-5 xl:gap-6">
        {/* ============================================================= */}
        {/* LEFT SIDEBAR: Matches Screenshot Exactly                        */}
        {/* ============================================================= */}
        <div className="w-full lg:w-[250px] xl:w-[270px] flex-shrink-0 bg-white dark:bg-[#1E1E20] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-4 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-0.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Analytics
            </h2>
            <button
              type="button"
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              title="Filter Presets"
            >
              <SlidersHorizontal className="w-4 h-4 stroke-[1.8]" />
            </button>
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

          {/* 3. Accounts */}
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

          {/* 4. Categories */}
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

          {/* 5. Labels */}
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

          {/* 6. Currencies */}
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

          {/* 7. Record types */}
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

          {/* 8. Amount range */}
          <div className="pt-1 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
            <span className="text-[11px] font-semibold">Amount range</span>
            <span className="text-[10px] text-slate-400 font-sans">
              {currentCurrency?.code || 'BDT'}
            </span>
          </div>
        </div>

        {/* ============================================================= */}
        {/* RIGHT MAIN VIEW: Time Navigator, Tabs & Reports Table         */}
        {/* ============================================================= */}
        <div className="flex-1 w-full space-y-3">
          {/* 1. Centered Month / Time Navigator (matching screenshot) */}
          <div className="flex items-center justify-center gap-2 py-0.5">
            <button
              type="button"
              onClick={() => setMonthOffset((prev) => prev - 1)}
              className="p-1 rounded text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="relative inline-flex items-center">
              <select
                value={monthOffset}
                onChange={(e) => setMonthOffset(Number(e.target.value))}
                className="appearance-none px-7 py-1.5 rounded-lg border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-xs font-semibold text-slate-800 dark:text-slate-200 pr-7 focus:outline-none cursor-pointer shadow-2xs"
              >
                <option value={0}>This month</option>
                <option value={-1}>Last month</option>
                <option value={-2}>2 months ago</option>
                <option value={-3}>3 months ago</option>
              </select>
              <ChevronsUpDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() => setMonthOffset((prev) => prev + 1)}
              className="p-1 rounded text-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Sub-Navigation Tabs matching Screenshot */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Tab 1: Incomes & Expenses Report */}
              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'report'
                    ? 'bg-[#00875A] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 stroke-[2]" />
                <span>Incomes & Expenses Report</span>
              </button>

              {/* Tab 2: Balance Trend */}
              <button
                type="button"
                onClick={() => setActiveTab('trend')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'trend'
                    ? 'bg-[#00875A] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 stroke-[2]" />
                <span>Balance Trend</span>
              </button>

              {/* Tab 3: Cash flow */}
              <button
                type="button"
                onClick={() => setActiveTab('cashflow')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'cashflow'
                    ? 'bg-[#00875A] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5 stroke-[2]" />
                <span>Cash flow</span>
              </button>

              {/* Tab 4: Advanced Charts and Reports */}
              <button
                type="button"
                onClick={() => setActiveTab('charts')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'charts'
                    ? 'bg-[#00875A] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <PieChart className="w-3.5 h-3.5 stroke-[2]" />
                <span>Advanced Charts and Reports</span>
              </button>
            </div>

            {/* Green Sliders Button on Far Right matching screenshot */}
            <button
              type="button"
              className="w-8 h-8 rounded-lg bg-[#00875A] hover:bg-[#00704A] text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs ml-auto"
              title="Report Controls"
            >
              <SlidersHorizontal className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

          {/* 3. Main Report View Container matching Screenshot */}
          {activeTab === 'report' && (
            <div className="bg-white dark:bg-[#1E1E20] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
              {/* Table Column Headers (Top) */}
              <div className="grid grid-cols-12 px-6 py-2.5 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                <div className="col-span-6 sm:col-span-7" />
                <div className="col-span-3 sm:col-span-3 text-right">
                  {currentMonthLabel}
                </div>
                <div className="col-span-3 sm:col-span-2 text-right">
                  {prevMonthLabel}
                </div>
              </div>

              {/* SECTION 1: Total Income */}
              <div>
                <div className="grid grid-cols-12 px-6 py-3 font-bold text-sm text-slate-900 dark:text-white items-center">
                  <div className="col-span-6 sm:col-span-7 font-bold">Total Income</div>
                  <div className="col-span-3 sm:col-span-3 text-right font-bold">
                    {formatAmount(totals.currentIncome)}
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-right font-bold text-slate-900 dark:text-white">
                    {formatAmount(totals.prevIncome)}
                  </div>
                </div>

                {/* Sub-item: Income */}
                <div className="grid grid-cols-12 px-6 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors items-center">
                  <div className="col-span-6 sm:col-span-7 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] dark:bg-amber-950/40 text-[#D97706] flex items-center justify-center flex-shrink-0 text-sm">
                      <Coins className="w-3.5 h-3.5 stroke-[2.2]" />
                    </div>
                    <span className="font-normal text-slate-600 dark:text-slate-300 text-xs">Income</span>
                  </div>
                  <div className="col-span-3 sm:col-span-3 text-right font-normal text-slate-600 dark:text-slate-300">
                    {formatAmount(totals.currentIncome)}
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-right font-normal text-slate-600 dark:text-slate-300">
                    {formatAmount(totals.prevIncome)}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Column Headers (Repeated before Total Expense exactly as in screenshot) */}
              <div className="grid grid-cols-12 px-6 py-2.5 border-t border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white mt-1">
                <div className="col-span-6 sm:col-span-7" />
                <div className="col-span-3 sm:col-span-3 text-right">
                  {currentMonthLabel}
                </div>
                <div className="col-span-3 sm:col-span-2 text-right">
                  {prevMonthLabel}
                </div>
              </div>

              {/* SECTION 2: Total Expense */}
              <div>
                <div className="grid grid-cols-12 px-6 py-3 font-bold text-sm text-slate-900 dark:text-white items-center">
                  <div className="col-span-6 sm:col-span-7 font-bold">Total Expense</div>
                  <div className="col-span-3 sm:col-span-3 text-right font-bold">
                    {formatAmount(totals.currentExpense, true)}
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-right font-bold text-slate-900 dark:text-white">
                    {formatAmount(totals.prevExpense, true)}
                  </div>
                </div>

                {/* Expense Categories List in Exact Screenshot Order */}
                <div className="divide-y divide-transparent">
                  {expenseCategories.map((cat) => {
                    const CatIcon = cat.icon;
                    const hasCurrent = cat.currentAmount > 0;
                    return (
                      <div
                        key={cat.id}
                        className="grid grid-cols-12 px-6 py-2 text-xs hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors items-center"
                      >
                        {/* Category Name & Icon */}
                        <div className="col-span-6 sm:col-span-7 flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: cat.bg, color: cat.color }}
                          >
                            <CatIcon className="w-3.5 h-3.5 stroke-[2.2]" />
                          </div>
                          <span
                            className={`text-xs truncate ${
                              hasCurrent
                                ? 'font-bold text-slate-900 dark:text-white'
                                : 'font-normal text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {cat.name}
                          </span>
                        </div>

                        {/* Current Month Amount */}
                        <div className="col-span-3 sm:col-span-3 text-right flex items-center justify-end gap-1.5">
                          {hasCurrent && (
                            <SlidersHorizontal className="w-3 h-3 text-slate-400 stroke-[2] flex-shrink-0" />
                          )}
                          <span
                            className={
                              hasCurrent
                                ? 'font-bold text-slate-900 dark:text-white'
                                : 'font-normal text-slate-600 dark:text-slate-300'
                            }
                          >
                            {formatAmount(cat.currentAmount, true)}
                          </span>
                        </div>

                        {/* Prev Month Amount */}
                        <div className="col-span-3 sm:col-span-2 text-right font-normal text-slate-600 dark:text-slate-300">
                          {formatAmount(cat.prevAmount, true)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Balance Trend Line Chart */}
          {activeTab === 'trend' && (
            <div className="bg-white dark:bg-[#1E1E20] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Balance & Cash Trajectory
                </h3>
                <p className="text-xs text-slate-400">
                  Net flow trend over the past 6 months
                </p>
              </div>
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={multiMonthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip
                      formatter={(val) => formatAmount(val)}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="net"
                      name="Net Flow"
                      stroke="#00875A"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#00875A' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TAB 3: Cash Flow Comparison Bar Chart */}
          {activeTab === 'cashflow' && (
            <div className="bg-white dark:bg-[#1E1E20] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Monthly Cash Flow
                </h3>
                <p className="text-xs text-slate-400">
                  Income vs Expenses breakdown over time
                </p>
              </div>
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={multiMonthData} barGap={6}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip
                      formatter={(val) => formatAmount(val)}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      }}
                    />
                    <Bar dataKey="income" name="Income" fill="#34C759" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expense" fill="#FF3B30" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TAB 4: Advanced Charts & Structure */}
          {activeTab === 'charts' && (
            <div className="bg-white dark:bg-[#1E1E20] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Expense Structure
                </h3>
                <p className="text-xs text-slate-400">
                  Distribution of expenses by category for {currentMonthLabel}
                </p>
              </div>

              {totals.currentExpense === 0 ? (
                <div className="h-56 flex items-center justify-center text-slate-400 text-xs">
                  No expenses recorded in {currentMonthLabel} to generate charts.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={expenseCategories.filter((c) => c.currentAmount > 0)}
                          dataKey="currentAmount"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {expenseCategories
                            .filter((c) => c.currentAmount > 0)
                            .map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(val) => formatAmount(val, true)} />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2">
                    {expenseCategories
                      .filter((c) => c.currentAmount > 0)
                      .map((cat) => (
                        <div key={cat.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {cat.name}
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {formatAmount(cat.currentAmount, true)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
