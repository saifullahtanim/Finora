import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  TrendingDown,
  TrendingUp,
  ArrowRightLeft,
  Receipt,
  Trash2,
  Edit2,
  Plus,
  Check,
  Search,
  Filter,
  Utensils,
  ShoppingBag,
  Home,
  Bus,
  Car,
  Smile,
  Monitor,
  Coins,
  Layers,
  Briefcase,
  Zap,
  Tag,
  HeartPulse,
  Wifi,
  Building2,
  GraduationCap,
  Gift,
  Key,
  MoreHorizontal,
  Film,
  HandHeart,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import IconHelper from '../common/IconHelper';

// Map of category colors and icons matching Wallet by BudgetBakers
const CATEGORY_STYLE_MAP = {
  // Food & Dining / Groceries
  food_dining: { name: 'Food & Restaurants', color: '#F97316', icon: Utensils },
  groceries: { name: 'Bazar & Groceries', color: '#10B981', icon: ShoppingBag },
  'food & restaurants': { name: 'Food & Restaurants', color: '#F97316', icon: Utensils },
  'food & drinks': { name: 'Food & Drinks', color: '#F97316', icon: Utensils },
  'bazar & groceries': { name: 'Bazar & Groceries', color: '#10B981', icon: ShoppingBag },

  // Shopping
  shopping: { name: 'Shopping & Clothing', color: '#EC4899', icon: ShoppingBag },
  'shopping & clothing': { name: 'Shopping & Clothing', color: '#EC4899', icon: ShoppingBag },

  // Housing & Rent
  housing: { name: 'House Rent & Service', color: '#FFA726', icon: Home },
  'house rent & service': { name: 'House Rent & Service', color: '#FFA726', icon: Home },
  'house rent': { name: 'House Rent & Service', color: '#FFA726', icon: Home },

  // Utilities
  utilities: { name: 'Electricity, Gas & WASA', color: '#EAB308', icon: Zap },
  'electricity, gas & wasa': { name: 'Electricity, Gas & WASA', color: '#EAB308', icon: Zap },

  // Transport & Vehicle
  transportation: { name: 'Transport, Fuel & Ride', color: '#3B82F6', icon: Bus },
  'transport, fuel & ride': { name: 'Transport, Fuel & Ride', color: '#3B82F6', icon: Bus },
  vehicle: { name: 'Vehicle', color: '#9C27B0', icon: Car },

  // Healthcare & Medicine (FIX: previously missing)
  health: { name: 'Healthcare & Medicine', color: '#EF4444', icon: HeartPulse },
  'healthcare & medicine': { name: 'Healthcare & Medicine', color: '#EF4444', icon: HeartPulse },
  'healthcare': { name: 'Healthcare & Medicine', color: '#EF4444', icon: HeartPulse },

  // Internet & Mobile Recharge (FIX: previously missing)
  mobile_internet: { name: 'Internet & Mobile Recharge', color: '#06B6D4', icon: Wifi },
  'internet & mobile recharge': { name: 'Internet & Mobile Recharge', color: '#06B6D4', icon: Wifi },
  'mobile & internet': { name: 'Internet & Mobile Recharge', color: '#06B6D4', icon: Wifi },
  communication_pc: { name: 'Communication, PC', color: '#3F51B5', icon: Monitor },

  // Business Profits (FIX: previously missing)
  business: { name: 'Business Profits', color: '#3B82F6', icon: Building2 },
  'business profits': { name: 'Business Profits', color: '#3B82F6', icon: Building2 },

  // Education & Tuition (FIX: previously missing)
  education: { name: 'Education & Tuition', color: '#6366F1', icon: GraduationCap },
  'education & tuition': { name: 'Education & Tuition', color: '#6366F1', icon: GraduationCap },

  // Family Support & Gifts (FIX: previously missing)
  family_gift: { name: 'Family Support & Gifts', color: '#A855F7', icon: Gift },
  'family support & gifts': { name: 'Family Support & Gifts', color: '#A855F7', icon: Gift },

  // Zakat & Charity (FIX: previously missing)
  zakat_charity: { name: 'Zakat & Sadakah / Charity', color: '#14B8A6', icon: Coins },
  'zakat & sadakah / charity': { name: 'Zakat & Sadakah / Charity', color: '#14B8A6', icon: Coins },

  // Entertainment
  entertainment: { name: 'Entertainment & Outing', color: '#F43F5E', icon: Film },
  'entertainment & outing': { name: 'Entertainment & Outing', color: '#F43F5E', icon: Film },
  life_entertainment: { name: 'Life & Entertainment', color: '#4CAF50', icon: Smile },

  // Income
  salary: { name: 'Monthly Salary', color: '#10B981', icon: Briefcase },
  'monthly salary': { name: 'Monthly Salary', color: '#10B981', icon: Briefcase },
  freelance: { name: 'Freelance & Remittance', color: '#06B6D4', icon: Monitor },
  'freelance & remittance': { name: 'Freelance & Remittance', color: '#06B6D4', icon: Monitor },
  rental: { name: 'Rental Income', color: '#F97316', icon: Key },
  'rental income': { name: 'Rental Income', color: '#F97316', icon: Key },
  bonus: { name: 'Festival / Eid Bonus', color: '#EC4899', icon: Gift },
  'festival / eid bonus': { name: 'Festival / Eid Bonus', color: '#EC4899', icon: Gift },
  investments: { name: 'Investments', color: '#E91E63', icon: Layers },
  investments_income: { name: 'DPS Profit & Dividends', color: '#8B5CF6', icon: Layers },
  'dps profit & dividends': { name: 'DPS Profit & Dividends', color: '#8B5CF6', icon: Layers },

  // Financial & Other
  financial_expenses: { name: 'Financial expenses', color: '#00BFA5', icon: Coins },
  other_expense: { name: 'Other Expenses', color: '#64748B', icon: MoreHorizontal },
  'other expenses': { name: 'Other Expenses', color: '#64748B', icon: MoreHorizontal },
  other_income: { name: 'Other Income', color: '#64748B', icon: MoreHorizontal },
  'other income': { name: 'Other Income', color: '#64748B', icon: MoreHorizontal },
  other: { name: 'General', color: '#78909C', icon: Tag },
};

export const RecentTransactions = ({
  onOpenTransactionsTab,
  onEditTransaction,
  onOpenAddTx,
}) => {
  const { transactions, accounts, deleteTransaction, formatMoney, getCategory, currentCurrency } = useFinance();

  // Active time interval filter matching reference screenshot (7D | 30D | 12W | 6M | 1Y)
  const [selectedInterval, setSelectedInterval] = useState('30D');

  // Filter transactions based on selected interval
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let daysToInclude = 30;
    if (selectedInterval === '7D') daysToInclude = 7;
    else if (selectedInterval === '30D') daysToInclude = 30;
    else if (selectedInterval === '12W') daysToInclude = 84;
    else if (selectedInterval === '6M') daysToInclude = 180;
    else if (selectedInterval === '1Y') daysToInclude = 365;

    const cutoff = new Date(now.getTime() - daysToInclude * 24 * 60 * 60 * 1000);

    return transactions.filter((t) => {
      if (!t.date) return true;
      const tDate = new Date(t.date);
      return tDate >= cutoff;
    });
  }, [transactions, selectedInterval]);

  // Total balance sum of filtered period
  const totalPeriodSum = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      if (t.type === 'income') return acc + Number(t.amount || 0);
      if (t.type === 'expense') return acc - Number(t.amount || 0);
      return acc;
    }, 0);
  }, [filteredTransactions]);

  // Format currency without privacy masking in this clean overview
  const formatAmountBadge = (amount, isExpense) => {
    const num = Number(amount || 0);
    const abs = Math.abs(num);
    const formatted = abs.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${isExpense ? '-' : ''}${currentCurrency.code} ${formatted}`;
  };

  // Current week number helper
  const currentWeekNumber = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Helper to resolve category style and icon for any transaction
  const resolveCategoryStyle = (tx) => {
    const raw = (tx.categoryId || tx.category || '').trim();
    const rawLower = raw.toLowerCase();

    // 1. Direct match in CATEGORY_STYLE_MAP
    if (CATEGORY_STYLE_MAP[raw]) return CATEGORY_STYLE_MAP[raw];
    if (CATEGORY_STYLE_MAP[rawLower]) return CATEGORY_STYLE_MAP[rawLower];

    // 2. FinanceContext category lookup (handles custom & standard)
    if (getCategory) {
      const found = getCategory(tx.categoryId || tx.category, tx.type);
      if (found && found.id !== 'other') {
        const mapped = CATEGORY_STYLE_MAP[found.id];
        if (mapped) return mapped;
        return {
          name: found.name,
          color: found.color && found.color.startsWith('#') ? found.color : '#00A86B',
          icon: Tag,
          iconName: found.icon || 'Tag',
          emoji: found.emoji,
        };
      }
    }

    // 3. Normalized alphanumeric match
    const cleanRaw = rawLower.replace(/[^a-z0-9]/g, '');
    for (const [k, v] of Object.entries(CATEGORY_STYLE_MAP)) {
      if (k.replace(/[^a-z0-9]/g, '') === cleanRaw) return v;
      if (v.name && v.name.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanRaw) return v;
    }

    return CATEGORY_STYLE_MAP.other;
  };

  return (
    <div className="ios-widget rounded-[28px] overflow-hidden bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800 relative">
      {/* 1. Header Bar: Green Banner matching screenshot */}
      <div className="bg-[#00A86B] text-white px-5 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-white/95">
            {selectedInterval === '7D' ? 'LAST 7 DAYS' :
             selectedInterval === '30D' ? 'LAST 30 DAYS' :
             selectedInterval === '12W' ? 'LAST 12 WEEKS' :
             selectedInterval === '6M' ? 'LAST 6 MONTHS' : 'LAST 1 YEAR'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-black font-mono tracking-tight text-white">
            Σ {currentCurrency.code} {Math.abs(totalPeriodSum).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>

          {onOpenTransactionsTab && (
            <button
              type="button"
              onClick={onOpenTransactionsTab}
              className="p-1 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              title="View all records"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Week / Period Sub-header matching reference screenshot */}
      <div className="bg-slate-100 dark:bg-slate-800/80 px-5 py-2 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 text-xs">
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200 block">
            WEEK {currentWeekNumber}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Balance {currentCurrency.code} {Math.abs(totalPeriodSum).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="text-right">
          <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-xs">
            Σ {currentCurrency.code} {Math.abs(totalPeriodSum).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* 3. Recent Records List matching reference screenshot */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[460px] overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="py-14 text-center text-slate-400">
            <Receipt className="w-9 h-9 mx-auto mb-2 opacity-40 text-emerald-500" />
            <p className="text-sm font-semibold">No recent records in selected period.</p>
            {onOpenAddTx && (
              <button
                type="button"
                onClick={() => onOpenAddTx('expense')}
                className="mt-3 px-4 py-1.5 rounded-xl bg-[#00A86B] text-white text-xs font-bold hover:bg-emerald-600 transition-all cursor-pointer"
              >
                + Add Record
              </button>
            )}
          </div>
        ) : (
          filteredTransactions.slice(0, 10).map((tx) => {
            const catStyle = resolveCategoryStyle(tx);
            const IconComp = catStyle.icon || Tag;
            const sourceAcc = accounts.find((a) => a.id === tx.accountId);
            const isExpense = tx.type === 'expense';
            const isIncome = tx.type === 'income';

            // Relative date string
            let dateStr = tx.date || 'Today';
            if (tx.date === todayStr) dateStr = 'Today';
            else if (tx.date === yesterdayStr) dateStr = 'Yesterday';

            return (
              <div
                key={tx.id}
                onClick={() => onEditTransaction && onEditTransaction(tx)}
                className="mx-2 my-0.5 rounded-2xl flex items-center justify-between px-4 py-3 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:shadow-2xs transition-all duration-150 cursor-pointer group"
              >
                {/* Left: Round category icon with teal checkmark badge (Image 1 & Screenshot) */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-xs select-none"
                      style={{ backgroundColor: catStyle.color || '#00A86B' }}
                    >
                      {catStyle.emoji ? (
                        <span className="text-xl leading-none">{catStyle.emoji}</span>
                      ) : catStyle.iconName && catStyle.iconName !== 'Tag' ? (
                        <IconHelper name={catStyle.iconName} className="w-5 h-5 text-white stroke-[2.2]" />
                      ) : (
                        <IconComp className="w-5 h-5 text-white stroke-[2.2]" />
                      )}
                    </div>

                    {/* Small rounded check badge matching screenshot */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#00A86B] border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-2xs">
                      <Check className="w-2.5 h-2.5 stroke-[3] text-white" />
                    </div>
                  </div>

                  {/* Title & Account Name */}
                  <div className="min-w-0">
                    <span className="text-[15px] font-bold text-slate-900 dark:text-white truncate block">
                      {tx.payee || catStyle.name}
                    </span>
                    <span className="text-xs text-slate-400 font-medium block truncate">
                      {sourceAcc ? sourceAcc.name : 'Teat'}
                    </span>
                  </div>
                </div>

                {/* Right: Amount & Date */}
                <div className="text-right flex-shrink-0">
                  <span
                    className={`text-[15px] font-bold font-mono block ${
                      isExpense
                        ? 'text-[#FE3B2C]'
                        : isIncome
                        ? 'text-[#21CB87]'
                        : 'text-blue-500'
                    }`}
                  >
                    {isIncome && '+'}
                    {formatAmountBadge(tx.amount, isExpense)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium block mt-0.5">
                    {dateStr}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Bottom Period Navigator Pills matching screenshot: 7D | 30D | 12W | 6M | 1Y */}
      <div className="bg-slate-50 dark:bg-slate-850 p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="inline-flex rounded-xl p-0.5 bg-slate-200/70 dark:bg-slate-800 border border-slate-300/40 dark:border-slate-700">
          {['7D', '30D', '12W', '6M', '1Y'].map((interval) => (
            <button
              key={interval}
              type="button"
              onClick={() => setSelectedInterval(interval)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedInterval === interval
                  ? 'bg-[#007AFF] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {interval}
            </button>
          ))}
        </div>

        {/* Quick Add Record Button calling onOpenAddTx */}
        {onOpenAddTx && (
          <button
            type="button"
            onClick={() => onOpenAddTx('expense')}
            className="w-10 h-10 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-95 text-white shadow-md shadow-blue-500/25 flex items-center justify-center transition-all cursor-pointer"
            title="Add New Record"
          >
            <Plus className="w-5 h-5 stroke-[2.8]" />
          </button>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
