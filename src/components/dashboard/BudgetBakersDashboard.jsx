import React, { useState, useMemo } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Coins,
  Smartphone,
  Building2,
  Wallet,
  TrendingDown,
  TrendingUp,
  Receipt,
  PieChart,
  Edit2,
  Layers,
  Sparkles,
  Star,
} from 'lucide-react';
import {
  RealisticWallet,
  RealisticCoins,
  RealisticBank,
  RealisticMobile,
  RealisticLayers,
} from '../common/RealisticIcons';
import { useFinance } from '../../context/FinanceContext';
import SpeedometerGauge from './SpeedometerGauge';
import {
  ComposedChart,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from 'recharts';
import { EXPENSE_CATEGORIES } from '../../utils/constants';

export const BudgetBakersDashboard = ({
  onOpenAddTx,
  onOpenAddAccount,
  onEditAccount,
  setActiveTab,
  onOpenAddBudget,
}) => {
  const {
    accounts,
    transactions,
    totalBalance,
    currentMonthIncome,
    currentMonthExpense,
    formatMoney,
    currentCurrency,
    getCategory,
  } = useFinance();

  // Active Account Filter: 'all' or specific accountId
  const [selectedAccountFilter, setSelectedAccountFilter] = useState('all');

  // Month navigation: offset 0 = this month, -1 = last month, +1 = next month
  const [monthOffset, setMonthOffset] = useState(0);

  // Card view preferences
  const [cardModes, setCardModes] = useState({
    gauges: 'expanded',
    trend: 'line',
    structure: 'donut',
  });

  // Calculate current interval label based on monthOffset
  const intervalLabel = useMemo(() => {
    if (monthOffset === 0) return 'This month';
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset);
    return d.toLocaleString('default', { month: 'short', year: 'numeric' });
  }, [monthOffset]);

  // Filter transactions by selected account and month offset
  const filteredTransactions = useMemo(() => {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + monthOffset);
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();

    return transactions.filter((t) => {
      // Date filter
      if (t.date) {
        const d = new Date(t.date);
        if (d.getFullYear() !== targetYear || d.getMonth() !== targetMonth) {
          return false;
        }
      }

      // Account filter
      if (selectedAccountFilter !== 'all') {
        if (t.accountId !== selectedAccountFilter && t.toAccountId !== selectedAccountFilter) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, selectedAccountFilter, monthOffset]);

  // Metrics for active filter
  const activeBalance = useMemo(() => {
    if (selectedAccountFilter === 'all') return totalBalance;
    const acc = accounts.find((a) => a.id === selectedAccountFilter);
    return Number(acc?.balance || 0);
  }, [accounts, selectedAccountFilter, totalBalance]);

  const activeIncome = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [filteredTransactions]);

  const activeExpense = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [filteredTransactions]);

  const activeCashFlow = activeIncome - activeExpense;

  // Previous period expenses for accurate BudgetBakers Spending gauge comparison
  const previousExpense = useMemo(() => {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + monthOffset - 1);
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();

    return transactions
      .filter((t) => {
        if (!t.date || t.type !== 'expense') return false;
        const d = new Date(t.date);
        if (d.getFullYear() !== targetYear || d.getMonth() !== targetMonth) return false;
        if (selectedAccountFilter !== 'all') {
          return t.accountId === selectedAccountFilter || t.toAccountId === selectedAccountFilter;
        }
        return true;
      })
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  }, [transactions, selectedAccountFilter, monthOffset]);

  // Build Balance Trend line data matching exact reference style
  const trendData = useMemo(() => {
    const now = new Date();
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + monthOffset);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;
    const todayDate = isCurrentMonth ? now.getDate() : 32;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = targetDate.toLocaleString('default', { month: 'short' });

    const checkpoints = [1, 4, 7, 10, 14, 18, 22, 26, 31].filter((d) => d <= daysInMonth);

    // Baseline available funds in the month:
    // If user has income or expenses in the month, before the expenses were spent,
    // the available balance was (activeBalance + activeExpense) or activeIncome
    const baselineFunds = Math.max(
      Number(activeBalance || 0) + Number(activeExpense || 0),
      Number(activeIncome || 0),
      Number(activeBalance || 0)
    );

    const getTxDay = (t) => {
      if (!t || !t.date) return 10;
      if (typeof t.date === 'string') {
        const parts = t.date.split('T')[0].split('-');
        if (parts.length === 3) {
          const d = parseInt(parts[2], 10);
          if (!isNaN(d) && d >= 1 && d <= 31) return d;
        }
      }
      const d = new Date(t.date);
      return !isNaN(d.getDate()) ? d.getDate() : 10;
    };

    return checkpoints.map((day) => {
      const dayLabel = `${day} ${monthName}`;
      const isPastOrToday = !isCurrentMonth || day <= todayDate;

      if (!isPastOrToday) {
        return {
          date: dayLabel,
          actualBalance: null,
        };
      }

      // If checkpoint is today, it shows the actual active balance (e.g. 0.00 BDT)
      if (day === todayDate) {
        return {
          date: dayLabel,
          actualBalance: Number(activeBalance || 0),
        };
      }

      // For checkpoints before today:
      // In Image 2, the baseline balance remains steady at the peak income/funds level,
      // and only drops when expenses occur.
      let computedBalance;
      if (baselineFunds > 0) {
        // Expenses that already occurred on or before this day
        const expensesUpToDay = filteredTransactions
          .filter((t) => t.type === 'expense' && getTxDay(t) <= day && getTxDay(t) < todayDate)
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);

        computedBalance = Math.max(0, baselineFunds - expensesUpToDay);
      } else {
        computedBalance = Number(activeBalance || 0);
      }

      return {
        date: dayLabel,
        actualBalance: computedBalance,
      };
    });
  }, [activeBalance, activeIncome, activeExpense, filteredTransactions, monthOffset]);

  // Expenses Structure (by Category)
  const expenseStructureData = useMemo(() => {
    const expenseTxs = filteredTransactions.filter((t) => t.type === 'expense');
    if (expenseTxs.length === 0) return [];

    const map = {};
    expenseTxs.forEach((t) => {
      const rawCat = (t.category || t.categoryId || 'other_expense').toLowerCase();
      map[rawCat] = (map[rawCat] || 0) + Number(t.amount || 0);
    });

    const totalExp = Object.values(map).reduce((sum, v) => sum + v, 0);

    return Object.entries(map).map(([catKey, amount]) => {
      let name = 'Other';
      let color = '#64748B';

      if (catKey.includes('food') || catKey.includes('dining') || catKey.includes('grocer') || catKey.includes('teat')) {
        name = 'Food & Drinks';
        color = '#EF4444';
      } else if (catKey.includes('income')) {
        name = 'Income';
        color = '#F59E0B';
      } else if (catKey.includes('shop') || catKey.includes('cloth')) {
        name = 'Shopping';
        color = '#0284C7';
      } else if (catKey.includes('hous') || catKey.includes('rent') || catKey.includes('util')) {
        name = 'Housing';
        color = '#D97706';
      } else if (catKey.includes('transp') || catKey.includes('bus')) {
        name = 'Transportation';
        color = '#64748B';
      } else if (catKey.includes('vehic') || catKey.includes('car') || catKey.includes('fuel')) {
        name = 'Vehicle';
        color = '#9333EA';
      } else if (catKey.includes('life') || catKey.includes('entertain') || catKey.includes('health')) {
        name = 'Life & Entertainment';
        color = '#16A34A';
      } else if (catKey.includes('comm') || catKey.includes('pc') || catKey.includes('internet')) {
        name = 'Communication, PC';
        color = '#4F46E5';
      } else if (catKey.includes('finan') || catKey.includes('zakat') || catKey.includes('tax')) {
        name = 'Financial expenses';
        color = '#0D9488';
      } else {
        const fallback = getCategory(catKey, 'expense');
        name = fallback?.name || catKey.charAt(0).toUpperCase() + catKey.slice(1).replace(/_/g, ' ');
        color = fallback?.color?.startsWith('#') ? fallback.color : '#EF4444';
      }

      const percent = totalExp > 0 ? Math.round((amount / totalExp) * 100) : 0;

      return {
        key: catKey,
        name,
        value: amount,
        color,
        percent,
      };
    }).sort((a, b) => b.value - a.value);
  }, [filteredTransactions, getCategory]);

  // Selected account object (if any)
  const selectedAccountObj = accounts.find((a) => a.id === selectedAccountFilter);

  return (
    <div className="space-y-3.5 sm:space-y-4 animate-fade-in pt-1 sm:pt-0">
      {/* Accounts Grid (2-Column Grid on Mobile, Flex scroll on Desktop) */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:flex lg:items-center lg:gap-3 lg:overflow-x-auto pb-1 lg:scrollbar-none w-full">
        {/* Individual Accounts: Crisp box shaped (rounded-[8px]) matching Image 2 & 3 */}
        {accounts.map((acc) => {
          const hasFilter = selectedAccountFilter !== 'all';
          const isSelected = selectedAccountFilter === acc.id;
          const nameLower = acc.name.toLowerCase();
          const isCash = acc.type === 'cash' || nameLower.includes('cash');
          const isBkash = acc.type === 'mobile_banking' || nameLower.includes('bkash') || nameLower.includes('nagad');
          const isBank = acc.type === 'bank' || nameLower.includes('bank');

          // Normal vibrant colors
          const vibrantColor = isCash
            ? '#17B8D8'
            : isBkash
            ? '#E2136E'
            : isBank
            ? '#007AFF'
            : acc.color || '#0097A7';

          // When any account is selected:
          // ONLY the selected account retains its vibrant color!
          // All other accounts become muted grey (#8E8E93) exactly as shown in Image 3!
          // When NO account is selected (selectedAccountFilter === 'all'):
          // Every account has its normal full color!
          const cardBgColor = hasFilter
            ? (isSelected ? vibrantColor : '#8E8E93')
            : vibrantColor;

          // Realistic icons
          const AccountIcon = isCash
            ? RealisticCoins
            : isBkash
            ? RealisticMobile
            : isBank
            ? RealisticBank
            : RealisticWallet;

          return (
            <div
              key={acc.id}
              onClick={() => {
                const next = isSelected ? 'all' : acc.id;
                setSelectedAccountFilter(next);
                if (next !== 'all') {
                  localStorage.setItem('wallet_active_account_id', next);
                } else {
                  localStorage.removeItem('wallet_active_account_id');
                }
              }}
              style={{ backgroundColor: cardBgColor }}
              className={`relative flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 h-[50px] sm:h-[54px] rounded-[8px] text-white shadow-2xs cursor-pointer transition-all duration-150 w-full lg:w-auto lg:min-w-[200px] lg:flex-shrink-0 select-none group ${
                hasFilter && !isSelected
                  ? 'opacity-85 hover:opacity-100'
                  : 'hover:opacity-95'
              }`}
            >
              <AccountIcon className="w-5 h-5 text-white flex-shrink-0 drop-shadow-2xs" />
              <div className="min-w-0 pr-2">
                <h4 className="text-[12px] sm:text-[13px] font-bold leading-tight truncate text-white">
                  {acc.name}
                </h4>
                <p className="text-[11px] sm:text-[12px] font-bold mt-0.5 tracking-tight text-white truncate">
                  {currentCurrency.code} {Number(acc.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </p>
              </div>

              {/* Edit Pencil on Hover */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEditAccount) onEditAccount(acc);
                }}
                title="Edit balance & details"
                className="absolute right-1.5 top-1.5 p-1 rounded-[4px] bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="w-2.5 h-2.5" />
              </button>
            </div>
          );
        })}

        {/* Add Account Button: Centered if odd slot on mobile grid */}
        <button
          type="button"
          onClick={onOpenAddAccount}
          className={`flex items-center px-3.5 py-2 sm:px-4 sm:py-2.5 h-[50px] sm:h-[54px] rounded-[8px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#1C1C1E] text-[#007AFF] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-xs font-bold transition-all w-full lg:w-auto lg:min-w-[140px] lg:flex-shrink-0 cursor-pointer shadow-2xs ${
            accounts.length % 2 === 0
              ? 'col-span-2 sm:col-span-1 justify-center'
              : 'justify-between'
          }`}
        >
          <span className="text-[12px] font-bold truncate">Add account</span>
          <Plus className="w-4 h-4 stroke-[2.5] text-[#007AFF] flex-shrink-0 ml-1.5" />
        </button>
      </div>

      {/* Account Selection Actions matching Image 3: "Select all" link and "Account Detail" button */}
      {selectedAccountFilter !== 'all' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-0.5 animate-fade-in">
          {/* Blue 'Select all' button */}
          <button
            type="button"
            onClick={() => {
              setSelectedAccountFilter('all');
              localStorage.removeItem('wallet_active_account_id');
            }}
            className="text-xs font-semibold text-[#007AFF] hover:underline cursor-pointer py-1"
          >
            Select all
          </button>

          {/* Action buttons: 'Account Detail' & 'Record' */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const acc = accounts.find((a) => a.id === selectedAccountFilter);
                if (acc && onEditAccount) onEditAccount(acc);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Account Detail
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenAddTx) onOpenAddTx('expense', selectedAccountFilter);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#00875A] hover:bg-[#00704A] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Record</span>
            </button>
          </div>
        </div>
      )}


      {/* 2. Month Interval Navigator (Centered) */}
      <div className="flex items-center justify-center relative py-1">
        {/* Time Interval Navigator: iOS Capsule Centered */}
        <div className="flex items-center ios-segmented rounded-full px-1.5 py-1">
          <button
            type="button"
            onClick={() => setMonthOffset((prev) => prev - 1)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-[#2C2C2E] transition-all cursor-pointer"
            title="Previous period"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 px-3 min-w-[90px] text-center select-none">
            {intervalLabel}
          </span>

          <button
            type="button"
            onClick={() => setMonthOffset((prev) => prev + 1)}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-[#2C2C2E] transition-all cursor-pointer"
            title="Next period"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Widget Cards: Dashboard Gauges, Balance Trend & Expenses Structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 lg:gap-4">
        {/* Card 1: Dashboard (The 3 Speedometer Gauges) */}
        <div className="bg-white dark:bg-[#1E1E20] border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs relative flex flex-col justify-between select-none">
          {/* Card Header matching reference */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">Dashboard</h3>
              {selectedAccountFilter !== 'all' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {selectedAccountObj?.name}
                </span>
              )}
            </div>
          </div>

          {/* 3 Speedometer Gauges in a single row - enlarged to fill box */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2 pt-1 pb-1 my-auto items-center w-full">
            <SpeedometerGauge
              title="BALANCE"
              value={activeBalance}
              income={activeIncome}
              expense={activeExpense}
              previousExpense={previousExpense}
              balance={activeBalance}
              formattedValue={activeBalance > 0 ? formatMoney(activeBalance) : '0'}
              min={0}
              max={Math.max(50000, activeBalance * 1.5)}
              hint={`Total liquid balance: ${formatMoney(activeBalance)}`}
            />
            <SpeedometerGauge
              title="CASH FLOW"
              value={activeCashFlow}
              income={activeIncome}
              expense={activeExpense}
              previousExpense={previousExpense}
              balance={activeBalance}
              formattedValue={activeCashFlow !== 0 ? formatMoney(activeCashFlow) : '0'}
              min={-50000}
              max={50000}
              hint={`Inflow (${formatMoney(activeIncome)}) - Outflow (${formatMoney(activeExpense)})`}
            />
            <SpeedometerGauge
              title="SPENDING"
              value={activeExpense > 0 ? -activeExpense : activeExpense}
              income={activeIncome}
              expense={activeExpense}
              previousExpense={previousExpense}
              balance={activeBalance}
              formattedValue={activeExpense > 0 ? formatMoney(activeExpense) : '0'}
              min={0}
              max={Math.max(50000, activeExpense * 1.5)}
              hint={`Total outflow in ${intervalLabel}`}
            />
          </div>

          {/* Corner resize grip mark matching BudgetBakers reference */}
          <div className="absolute bottom-1 right-1 text-slate-300 dark:text-slate-600 pointer-events-none select-none">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M7 1v6H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Balance Trend */}
        <div className="bg-white dark:bg-[#1E1E20] border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs relative flex flex-col justify-between select-none">
          {/* Card Header matching reference */}
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">Balance Trend</h3>
          </div>

          {/* Balance Subhead matching BudgetBakers screenshot - tight gap with title */}
          <div className="mt-1 flex items-start justify-between">
            <div>
              <span className="text-xs text-[#8898AA] font-normal">{intervalLabel || 'This month'}</span>
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 font-sans mt-0.5 tracking-tight">
                {currentCurrency.code} {Number(activeBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-xs text-[#8898AA] font-normal">VS Previous Period</span>
              {activeExpense > 0 ? (
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEE2E2] dark:bg-rose-950/60 text-[#EF4444] dark:text-rose-400 font-semibold text-xs">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[9px] font-bold leading-none select-none">
                    ↓
                  </span>
                  <span>-100%</span>
                </div>
              ) : (
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200/90 dark:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold text-xs">
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-400 text-white flex items-center justify-center text-[9px] font-bold leading-none select-none">
                    −
                  </span>
                  <span>0%</span>
                </div>
              )}
            </div>
          </div>

          {/* Area Chart matching Image 2 */}
          {(() => {
            const maxDataVal = Math.max(
              Number(activeBalance || 0),
              ...trendData.map((d) => (d.actualBalance !== null ? Number(d.actualBalance) : 0))
            );

            let step = 25;
            let yMax = 100;

            if (maxDataVal <= 0) {
              step = 1;
              yMax = 4;
            } else if (maxDataVal <= 4) {
              step = 1;
              yMax = 4;
            } else if (maxDataVal <= 100) {
              step = 25;
              yMax = 100;
            } else if (maxDataVal <= 200) {
              step = 50;
              yMax = 200;
            } else if (maxDataVal <= 500) {
              step = 125;
              yMax = 500;
            } else if (maxDataVal <= 1000) {
              step = 250;
              yMax = 1000;
            } else {
              const targetStep = maxDataVal / 4;
              if (targetStep >= 4000) {
                step = 6000;
                yMax = 24000;
              } else if (targetStep >= 1000) {
                step = Math.round(targetStep / 500) * 500 || 500;
                yMax = step * 4;
              } else {
                step = Math.round(targetStep / 100) * 100 || 100;
                yMax = step * 4;
              }
              if (yMax < maxDataVal) yMax = step * 5;
            }

            const yTicks = [0, step, step * 2, step * 3, yMax];

            const formatYAxisTick = (val) => {
              if (val === 0) return '0';
              if (val >= 1000) {
                const k = val / 1000;
                return k % 1 === 0 ? `${k}K` : `${k.toFixed(1).replace(/\.0$/, '')}K`;
              }
              return String(Math.round(val));
            };

            return (
              <div className="h-44 w-full pt-2 outline-none focus:outline-none select-none [&_.recharts-surface]:outline-none [&_.recharts-wrapper]:outline-none [&_svg]:outline-none [&_*]:outline-none">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={trendData}
                    margin={{ top: 10, right: 10, left: -18, bottom: 0 }}
                    accessibilityLayer={false}
                  >
                    <defs>
                      <linearGradient id="balanceTrendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#007AFF" stopOpacity={0.16} />
                        <stop offset="90%" stopColor="#007AFF" stopOpacity={0.02} />
                        <stop offset="100%" stopColor="#007AFF" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#E5E7EB"
                      className="dark:stroke-slate-800"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#8898AA', fontWeight: 400 }}
                      axisLine={false}
                      tickLine={false}
                      dy={4}
                    />
                    <YAxis
                      domain={[0, yMax]}
                      ticks={yTicks}
                      tickFormatter={formatYAxisTick}
                      tick={{ fontSize: 11, fill: '#8898AA', fontWeight: 400 }}
                      axisLine={false}
                      tickLine={false}
                      dx={-2}
                    />
                    <Tooltip
                      formatter={(val) => [formatMoney(val), 'Balance']}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px',
                        fontWeight: '500',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      }}
                    />
                    {/* Actual balance area with solid blue line matching Image 2 */}
                    <Area
                      type="linear"
                      dataKey="actualBalance"
                      stroke="#007AFF"
                      strokeWidth={2.2}
                      fill="url(#balanceTrendFill)"
                      dot={false}
                      activeDot={{ r: 4, stroke: '#007AFF', strokeWidth: 2, fill: '#FFFFFF' }}
                      connectNulls={false}
                      isAnimationActive={true}
                      animationDuration={700}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            );
          })()}

          {/* Corner resize grip mark matching reference */}
          <div className="absolute bottom-1 right-1 text-slate-300 dark:text-slate-600 pointer-events-none select-none">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M7 1v6H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Expenses Structure (Matching BudgetBakers Image 3 & 5) */}
        <div className="bg-white dark:bg-[#1E1E20] border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs relative flex flex-col justify-between select-none">
          {/* Card Header matching reference */}
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">Expenses Structure</h3>
          </div>

          {/* Subheader matching BudgetBakers reference - tight gap with title */}
          <div className="mt-1 flex items-start justify-between">
            <div>
              <span className="text-xs text-[#8898AA] font-normal">{intervalLabel || 'This month'}</span>
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 font-sans mt-0.5 tracking-tight">
                {activeExpense > 0
                  ? `-${currentCurrency.code} ${Number(activeExpense).toFixed(2)}`
                  : `-${currentCurrency.code} 0.00`}
              </h2>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-xs text-[#8898AA] font-normal">VS Previous Period</span>
              {activeExpense > 0 ? (
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEE2E2] dark:bg-rose-950/60 text-[#EF4444] dark:text-rose-400 font-semibold text-xs">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[9px] font-bold leading-none select-none">
                    ↓
                  </span>
                  <span>-100%</span>
                </div>
              ) : (
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200/90 dark:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold text-xs">
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-400 text-white flex items-center justify-center text-[9px] font-black leading-none select-none">
                    −
                  </span>
                  <span>0%</span>
                </div>
              )}
            </div>
          </div>

          {/* Body: No data empty state or Donut chart with categories list */}
          {expenseStructureData.length === 0 ? (
            <div className="h-42 flex flex-col items-center justify-center text-center px-4 select-none">
              <span className="text-slate-400 dark:text-slate-500 text-xs sm:text-[13px] font-medium">
                There are no data in the selected time interval.
              </span>
              <span className="text-slate-400/80 dark:text-slate-600 text-[11px] mt-1 font-normal">
                Add an expense record to view distribution
              </span>
            </div>
          ) : (
            <div className="h-42 pt-1 flex items-start justify-start gap-4 sm:gap-6">
              {/* Donut Chart with "All categories" centered */}
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex-shrink-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={expenseStructureData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={68}
                      stroke="transparent"
                      paddingAngle={expenseStructureData.length > 1 ? 3 : 0}
                      isAnimationActive={true}
                      animationDuration={600}
                    >
                      {expenseStructureData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                  <span className="text-[12px] font-normal text-slate-800 dark:text-slate-200 text-center leading-tight">
                    All categories
                  </span>
                </div>
              </div>

              {/* Category legend on right: Aligned UP and LEFT, with reduced gap between Name and Value */}
              <div className="grid grid-cols-[auto_auto] gap-x-3.5 sm:gap-x-4 gap-y-2.5 items-center justify-start pt-2 sm:pt-2.5 max-h-40 overflow-y-auto scrollbar-none">
                {expenseStructureData.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex items-center gap-2 min-w-0 pr-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-slate-900 dark:text-slate-100 truncate text-xs sm:text-[13px]">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-normal text-slate-500 dark:text-slate-400 text-xs sm:text-[13px] flex-shrink-0 whitespace-nowrap">
                      {currentCurrency.code} {Number(item.value).toFixed(2)}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Corner resize grip mark matching reference */}
          <div className="absolute bottom-1 right-1 text-slate-300 dark:text-slate-600 pointer-events-none select-none">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M7 1v6H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export { BudgetBakersDashboard as FinoraDashboard };
export default BudgetBakersDashboard;
