import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Check,
  ArrowLeft,
  Search,
  Plus,
  Calendar,
  Wallet,
  Coins,
  Building2,
  CreditCard,
  Smartphone,
  Tag,
  FileText,
  ChevronDown,
  Layers,
  Utensils,
  ShoppingBag,
  Home,
  Zap,
  Bus,
  Car,
  Smile,
  Film,
  Monitor,
  Wifi,
  HeartPulse,
  GraduationCap,
  Gift,
  Briefcase,
  Key,
  MoreHorizontal,
  Settings,
  Pipette,
  Trash2,
  ArrowDownRight,
  ArrowUpRight,
  ArrowLeftRight,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../utils/constants';
import IconHelper from '../common/IconHelper';
import CategoryManagerModal from '../categories/CategoryManagerModal';
import { searchWorldEmojis } from '../../utils/emojiData';

// Category style & icon mapping
const CATEGORY_STYLE_MAP = {
  food_dining: { name: 'Food & Drinks', color: '#EF4444', bg: '#FEE2E2', icon: Utensils },
  groceries: { name: 'Groceries & Bazar', color: '#F97316', bg: '#FFEDD5', icon: ShoppingBag },
  shopping: { name: 'Shopping', color: '#0284C7', bg: '#E0F2FE', icon: ShoppingBag },
  housing: { name: 'Housing', color: '#D97706', bg: '#FEF3C7', icon: Home },
  utilities: { name: 'Utilities & Bills', color: '#EAB308', bg: '#FEF9C3', icon: Zap },
  transportation: { name: 'Transportation', color: '#64748B', bg: '#F1F5F9', icon: Bus },
  vehicle: { name: 'Vehicle', color: '#9333EA', bg: '#F3E8FF', icon: Car },
  life_entertainment: { name: 'Life & Entertainment', color: '#16A34A', bg: '#DCFCE7', icon: Smile },
  entertainment: { name: 'Entertainment', color: '#16A34A', bg: '#DCFCE7', icon: Film },
  communication_pc: { name: 'Communication, PC', color: '#4F46E5', bg: '#E0E7FF', icon: Monitor },
  mobile_internet: { name: 'Mobile & Internet', color: '#4F46E5', bg: '#E0E7FF', icon: Wifi },
  financial_expenses: { name: 'Financial expenses', color: '#0D9488', bg: '#CCFBF1', icon: Coins },
  health: { name: 'Healthcare', color: '#E11D48', bg: '#FFE4E6', icon: HeartPulse },
  education: { name: 'Education', color: '#7C3AED', bg: '#EDE9FE', icon: GraduationCap },
  family_gift: { name: 'Family & Gifts', color: '#DB2777', bg: '#FCE7F3', icon: Gift },
  zakat_charity: { name: 'Charity & Zakat', color: '#059669', bg: '#D1FAE5', icon: Coins },
  investments: { name: 'Investments', color: '#DB2777', bg: '#FCE7F3', icon: Layers },
  salary: { name: 'Monthly Salary', color: '#10B981', bg: '#DCFCE7', icon: Briefcase },
  freelance: { name: 'Freelance & Remittance', color: '#06B6D4', bg: '#E0F2FE', icon: Monitor },
  business: { name: 'Business Profits', color: '#3B82F6', bg: '#DBEAFE', icon: Building2 },
  dps: { name: 'DPS Profit & Dividends', color: '#E11D48', bg: '#FFE4E6', icon: Layers },
  rental: { name: 'Rental Income', color: '#F97316', bg: '#FEF3C7', icon: Key },
  bonus: { name: 'Festival / Eid Bonus', color: '#EC4899', bg: '#FCE7F3', icon: Gift },
  income: { name: 'General Income', color: '#00875A', bg: '#DCFCE7', icon: Coins },
  other_expense: { name: 'Other Expenses', color: '#64748B', bg: '#F3F4F6', icon: MoreHorizontal },
  other_income: { name: 'Other Income', color: '#64748B', bg: '#F3F4F6', icon: MoreHorizontal },
};

export const TransactionModal = ({
  isOpen,
  onClose,
  initialData = null,
  defaultType = 'expense',
}) => {
  const {
    accounts,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addAccount,
    currentCurrency,
    allExpenseCategories,
    allIncomeCategories,
    addCustomCategory,
  } = useFinance();

  // Navigation views: 'form' | 'category' | 'account' | 'toAccount' | 'addCategory'
  const [activeView, setActiveView] = useState('form');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isCategorySearchOpen, setIsCategorySearchOpen] = useState(false);

  // Minimal Add Category view states (matches 1st popup theme)
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('expense');
  const [newCatColor, setNewCatColor] = useState('#00A86B');
  const [newCatEmoji, setNewCatEmoji] = useState('🍔');
  const [newCatEmojiSearch, setNewCatEmojiSearch] = useState('');
  const [newCatError, setNewCatError] = useState('');
  const colorPickerInputRef = useRef(null);

  // Form states
  const [type, setType] = useState('expense'); // 'expense' | 'income' | 'transfer'
  const [amountStr, setAmountStr] = useState('');
  const [categoryId, setCategoryId] = useState('food_dining');
  const [accountId, setAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const amountInputRef = useRef(null);
  const [isAmountFocused, setIsAmountFocused] = useState(false);

  const isEditing = Boolean(initialData && initialData.id);

  // Synchronize state when opened
  useEffect(() => {
    if (!isOpen) return;

    const savedActiveAcc = localStorage.getItem('wallet_active_account_id');
    const resolvedDefaultAcc =
      (savedActiveAcc && savedActiveAcc !== 'all' ? savedActiveAcc : '') ||
      accounts[0]?.id ||
      '';

    const isEditing = Boolean(initialData && initialData.id);

    if (isEditing) {
      setType(initialData.type || defaultType || 'expense');
      setAmountStr(initialData.amount ? String(initialData.amount) : '');
      setCategoryId(
        initialData.category ||
          (initialData.type === 'income' ? 'salary' : 'food_dining')
      );
      setAccountId(initialData.accountId || resolvedDefaultAcc);
      setToAccountId(
        initialData.toAccountId ||
          accounts.find((a) => a.id !== (initialData.accountId || resolvedDefaultAcc))?.id ||
          accounts[0]?.id ||
          ''
      );
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setNote(initialData.note || '');
    } else {
      const activeType = (initialData && initialData.type) || defaultType || 'expense';
      setType(activeType);
      setAmountStr('');
      setCategoryId(activeType === 'income' ? 'salary' : 'food_dining');
      const startAcc = (initialData && initialData.accountId) || resolvedDefaultAcc;
      setAccountId(startAcc);
      setToAccountId(
        (initialData && initialData.toAccountId) ||
          accounts.find((a) => a.id !== startAcc)?.id ||
          accounts[0]?.id ||
          ''
      );
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
    setActiveView('form');
    setError('');
    setCategorySearchQuery('');
    setIsAmountFocused(false);
  }, [initialData, isOpen, accounts, defaultType]);

  // Keyboard auto-typing listener: Typing digits (0-9, ., Backspace) automatically updates amount
  useEffect(() => {
    if (!isOpen || activeView !== 'form') return;

    const handleGlobalKeyDown = (e) => {
      const activeEl = document.activeElement;
      const targetTag = activeEl?.tagName?.toLowerCase();

      // Don't intercept if user is typing in note, date, or other input fields
      if (activeEl && activeEl !== amountInputRef.current) {
        if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
          return;
        }
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        setAmountStr((prev) => {
          if (prev === '0') return e.key;
          if (prev.length >= 10) return prev;
          return prev + e.key;
        });
        setError('');
        if (document.activeElement !== amountInputRef.current) {
          amountInputRef.current?.focus();
        }
      } else if (e.key === '.' && !amountStr.includes('.')) {
        e.preventDefault();
        setAmountStr((prev) => (prev ? prev + '.' : '0.'));
        setError('');
        if (document.activeElement !== amountInputRef.current) {
          amountInputRef.current?.focus();
        }
      } else if (e.key === 'Backspace' && activeEl !== amountInputRef.current) {
        e.preventDefault();
        setAmountStr((prev) => prev.slice(0, -1));
        setError('');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, activeView, amountStr]);

  // Selected account and category
  const selectedAccount = useMemo(() => {
    return accounts.find((a) => a.id === accountId) || accounts[0] || null;
  }, [accounts, accountId]);

  const selectedToAccount = useMemo(() => {
    return accounts.find((a) => a.id === toAccountId) || accounts[1] || accounts[0] || null;
  }, [accounts, toAccountId]);

  const allAvailableCategories = useMemo(() => {
    return type === 'income'
      ? allIncomeCategories || INCOME_CATEGORIES
      : allExpenseCategories || EXPENSE_CATEGORIES;
  }, [type, allIncomeCategories, allExpenseCategories]);

  const selectedCategory = useMemo(() => {
    const found = allAvailableCategories.find((c) => c.id === categoryId);
    if (found) return found;
    return (
      allAvailableCategories[0] || {
        id: 'other',
        name: 'General',
        icon: 'Tag',
        color: '#64748B',
      }
    );
  }, [allAvailableCategories, categoryId]);

  // Format account balance helper with currency and sign
  const formatAccountBalance = (balance, currencyCode = 'BDT') => {
    const num = Number(balance || 0);
    const absFormatted = Math.abs(num).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    if (num < 0) {
      return `-${currencyCode} ${absFormatted}`;
    }
    return `${currencyCode} ${absFormatted}`;
  };

  // Quick Amount preset increment
  const handleQuickAdd = (increment) => {
    const currentVal = parseFloat(amountStr) || 0;
    const nextVal = currentVal + increment;
    setAmountStr(String(nextVal));
    setError('');
  };

  // Submit Handler
  const handleSave = (e) => {
    if (e) e.preventDefault();
    setError('');

    const parsed = parseFloat(amountStr);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    const effectiveAccountId =
      accountId ||
      localStorage.getItem('wallet_active_account_id') ||
      accounts[0]?.id;

    if (!effectiveAccountId) {
      setError('No wallet or account found. Please create an account first.');
      return;
    }

    if (type === 'transfer' && effectiveAccountId === toAccountId) {
      setError('Source and destination accounts must be different.');
      return;
    }

    const payload = {
      type,
      amount: parsed,
      categoryId: type === 'transfer' ? 'transfer' : categoryId,
      category: type === 'transfer' ? 'transfer' : categoryId,
      accountId: effectiveAccountId,
      toAccountId: type === 'transfer' ? toAccountId : undefined,
      date,
      note: note.trim(),
      payee: type === 'transfer' ? 'Account Transfer' : selectedCategory.name,
      status: 'cleared',
    };

    if (initialData && initialData.id) {
      updateTransaction(initialData.id, payload);
    } else {
      addTransaction(payload);
    }

    onClose();
  };

  // Filtered categories for picker with multi-word intelligent token matching
  const filteredCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) return allAvailableCategories;
    const tokens = categorySearchQuery
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return allAvailableCategories.filter((cat) => {
      const name = (cat.name || '').toLowerCase();
      const cleanName = name.replace(/[^a-z0-9\s]/g, ' ');
      const id = (cat.id || '').toLowerCase();
      return tokens.every((token) => (
        name.includes(token) || cleanName.includes(token) || id.includes(token)
      ));
    });
  }, [allAvailableCategories, categorySearchQuery]);

  // Real-time zero-delay emoji search for Add Category view
  const displayedNewCatEmojis = useMemo(() => {
    return searchWorldEmojis(newCatEmojiSearch);
  }, [newCatEmojiSearch]);

  // Delete transaction handler for Edit mode
  const handleDeleteTransaction = () => {
    if (initialData?.id && window.confirm('Are you sure you want to delete this record?')) {
      deleteTransaction(initialData.id);
      onClose();
    }
  };

  // Save custom category handler from header checkmark
  const handleSaveNewCategory = () => {
    if (!newCatName.trim()) {
      setNewCatError('Please enter a category name');
      return;
    }
    const created = addCustomCategory({
      name: newCatName.trim(),
      emoji: newCatEmoji || '🏷️',
      color: newCatColor || '#00A86B',
      type: newCatType || 'expense',
    });
    setCategoryId(created.id);
    setNewCatName('');
    setActiveView('form');
  };

  // Step-back backdrop click handler:
  // If in nested views ('addCategory', 'category', 'account', 'toAccount'), clicking outside goes back.
  // When at the base form ('form'), clicking outside closes the modal.
  const handleBackdropClick = (e) => {
    if (e.target !== e.currentTarget) return;

    if (activeView === 'addCategory') {
      setActiveView('category');
    } else if (activeView === 'category' || activeView === 'account' || activeView === 'toAccount') {
      setActiveView('form');
    } else {
      onClose();
    }
  };

  // Keyboard Escape navigation: steps back through views before closing
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeView === 'addCategory') {
          setActiveView('category');
        } else if (activeView === 'category' || activeView === 'account' || activeView === 'toAccount') {
          setActiveView('form');
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeView, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in select-none overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-[450px] sm:max-w-[480px] max-h-[88vh] bg-white dark:bg-[#1E1E20] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden animate-scale-in my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ======================================================== */}
        {/* MAIN FORM VIEW (Modern, Attractive & Premium Fintech UI) */}
        {/* ======================================================== */}
        {activeView === 'form' && (
          <form onSubmit={handleSave} className="flex flex-col">
            {/* Header: Title Badge + Actions (Delete if editing, Close) */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs transition-colors ${
                    type === 'expense'
                      ? 'bg-rose-100/80 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      : type === 'income'
                      ? 'bg-emerald-100/80 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-400'
                      : 'bg-blue-100/80 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {type === 'expense' ? (
                    <ArrowDownRight className="w-5 h-5 stroke-[2.4]" />
                  ) : type === 'income' ? (
                    <ArrowUpRight className="w-5 h-5 stroke-[2.4]" />
                  ) : (
                    <ArrowLeftRight className="w-5 h-5 stroke-[2.4]" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {isEditing ? 'Edit Record' : type === 'transfer' ? 'Transfer Money' : 'New Record'}
                    </h2>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        type === 'expense'
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300'
                          : type === 'income'
                          ? 'bg-emerald-50 text-[#00875A] dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300'
                      }`}
                    >
                      {type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {isEditing
                      ? 'Update transaction details or delete record'
                      : type === 'transfer'
                      ? 'Transfer funds between your accounts'
                      : 'Fill details below to save'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleDeleteTransaction}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                  title={isEditing ? 'Save Changes' : type === 'transfer' ? 'Transfer Funds' : 'Save Record'}
                >
                  <Check className="w-4.5 h-4.5 stroke-[2.2]" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4.5 h-4.5 stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mx-6 mt-3 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold text-center animate-shake">
                {error}
              </div>
            )}

            <div className="p-5 sm:p-6 space-y-4">
              {/* 1. Mode Segmented Control: Expense | Income | Transfer */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 dark:bg-[#151517] rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setType('expense');
                    setCategoryId('food_dining');
                  }}
                  className={`py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    type === 'expense'
                      ? 'bg-white dark:bg-[#202024] text-rose-600 dark:text-rose-400 shadow-sm border border-rose-100/80 dark:border-rose-950/60 scale-[1.01]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Expense</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('income');
                    setCategoryId('salary');
                  }}
                  className={`py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    type === 'income'
                      ? 'bg-white dark:bg-[#202024] text-[#00875A] dark:text-emerald-400 shadow-sm border border-emerald-100/80 dark:border-emerald-950/60 scale-[1.01]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Income</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('transfer')}
                  className={`py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    type === 'transfer'
                      ? 'bg-white dark:bg-[#202024] text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100/80 dark:border-blue-950/60 scale-[1.01]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Transfer</span>
                </button>
              </div>

              {/* 2. Hero Amount Card (Modern Finora Design with subtle ambient tint) */}
              <div
                className={`relative rounded-3xl p-4 sm:p-5 text-center transition-all duration-300 border ${
                  type === 'expense'
                    ? 'bg-gradient-to-b from-rose-50/70 via-slate-50/40 to-white dark:from-rose-950/20 dark:via-[#161618] dark:to-[#18181B] border-rose-100/80 dark:border-rose-900/30 shadow-xs'
                    : type === 'income'
                    ? 'bg-gradient-to-b from-emerald-50/70 via-slate-50/40 to-white dark:from-emerald-950/20 dark:via-[#161618] dark:to-[#18181B] border-emerald-100/80 dark:border-emerald-900/30 shadow-xs'
                    : 'bg-gradient-to-b from-blue-50/70 via-slate-50/40 to-white dark:from-blue-950/20 dark:via-[#161618] dark:to-[#18181B] border-blue-100/80 dark:border-blue-900/30 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Total Amount
                  </span>
                </div>

                <div
                  onClick={() => amountInputRef.current?.focus()}
                  className="flex items-center justify-center gap-2 cursor-pointer select-none py-1"
                >
                  <span
                    className={`text-3xl sm:text-4xl font-extrabold select-none transition-colors ${
                      type === 'expense'
                        ? 'text-rose-500'
                        : type === 'income'
                        ? 'text-[#00875A]'
                        : 'text-blue-500'
                    }`}
                  >
                    {type === 'expense' ? '−' : type === 'income' ? '+' : '⇄'}
                  </span>

                  <div className="relative inline-flex items-center justify-center">
                    <input
                      ref={amountInputRef}
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*"
                      value={amountStr}
                      onFocus={() => setIsAmountFocused(true)}
                      onBlur={() => setIsAmountFocused(false)}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        const parts = val.split('.');
                        const sanitized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : val;
                        setAmountStr(sanitized);
                        setError('');
                      }}
                      placeholder={isAmountFocused ? '' : '0'}
                      className="min-w-[80px] max-w-[260px] bg-transparent text-center text-4xl sm:text-5xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700 caret-[#00A86B] dark:caret-emerald-400 transition-colors cursor-text"
                      style={{
                        width: `${Math.max(1, (amountStr || '0').length) * 1.3}ch`,
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/90 dark:bg-white/10 border border-slate-200/80 dark:border-white/10 shadow-2xs">
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 tracking-wide">
                      {currentCurrency?.code || 'BDT'}
                    </span>
                  </div>
                </div>

                {/* Quick Add Chips */}
                <div className="flex items-center justify-center flex-wrap gap-1.5 pt-3.5 mt-3 border-t border-slate-200/40 dark:border-white/5">
                  {[50, 100, 500, 1000, 5000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickAdd(val)}
                      className="px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-[#222226] hover:bg-slate-100 dark:hover:bg-[#2c2c32] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-white/10 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                    >
                      +{val >= 1000 ? `${val / 1000}k` : val}
                    </button>
                  ))}
                  {amountStr && (
                    <button
                      type="button"
                      onClick={() => setAmountStr('')}
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* 3. Account & Category Selector Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Account Picker */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {type === 'transfer' ? 'From Account' : 'Account'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveView('account')}
                    className="w-full flex items-center justify-between p-2.5 sm:p-3 min-h-[62px] rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#1E1E20] hover:border-emerald-400/70 hover:shadow-sm dark:hover:border-emerald-600 transition-all cursor-pointer text-left group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-2xs"
                        style={{ backgroundColor: selectedAccount?.color || '#00875A' }}
                      >
                        <Wallet className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[13px] font-bold text-slate-900 dark:text-white truncate block">
                          {selectedAccount?.name || 'Select'}
                        </span>
                        {selectedAccount && (
                          <span
                            className={`text-[11px] font-bold block truncate tracking-tight ${
                              Number(selectedAccount.balance || 0) < 0
                                ? 'text-[#FE3B2C] dark:text-rose-400'
                                : 'text-[#00875A] dark:text-emerald-400'
                            }`}
                          >
                            {formatAccountBalance(
                              selectedAccount.balance,
                              currentCurrency?.code || selectedAccount.currency || 'BDT'
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex-shrink-0" />
                  </button>
                </div>

                {/* Category Picker (or To Account for Transfer) */}
                {type === 'transfer' ? (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      To Account
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveView('toAccount')}
                      className="w-full flex items-center justify-between p-2.5 sm:p-3 min-h-[62px] rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#1E1E20] hover:border-blue-400/70 hover:shadow-sm dark:hover:border-blue-600 transition-all cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-2xs"
                          style={{ backgroundColor: selectedToAccount?.color || '#3B82F6' }}
                        >
                          <Wallet className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-slate-900 dark:text-white truncate block">
                            {selectedToAccount?.name || 'Select'}
                          </span>
                          {selectedToAccount && (
                            <span
                              className={`text-[11px] font-bold block truncate tracking-tight ${
                                Number(selectedToAccount.balance || 0) < 0
                                  ? 'text-[#FE3B2C] dark:text-rose-400'
                                  : 'text-[#00875A] dark:text-emerald-400'
                              }`}
                            >
                              {formatAccountBalance(
                                selectedToAccount.balance,
                                currentCurrency?.code || selectedToAccount.currency || 'BDT'
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex-shrink-0" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveView('category')}
                      className="w-full flex items-center justify-between p-2.5 sm:p-3 min-h-[62px] rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#1E1E20] hover:border-emerald-400/70 hover:shadow-sm dark:hover:border-emerald-600 transition-all cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-2xs"
                          style={{ backgroundColor: selectedCategory?.color || '#00A86B' }}
                        >
                          {selectedCategory?.emoji ? (
                            <span className="text-lg leading-none select-none">{selectedCategory.emoji}</span>
                          ) : (
                            <Tag className="w-4 h-4 stroke-[2.2]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold text-slate-900 dark:text-white truncate block">
                            {selectedCategory?.name || 'Select'}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium block truncate">
                            Category
                          </span>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex-shrink-0" />
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Date & Note Inputs */}
              <div className="grid grid-cols-2 gap-3">
                {/* Date */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Date
                  </label>
                  <div className="relative flex items-center">
                    <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#1E1E20] text-xs sm:text-[13px] font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00A86B]/30 focus:border-[#00A86B] cursor-pointer transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Note */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Note (optional)
                  </label>
                  <div className="relative flex items-center">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. Lunch with team..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#1E1E20] text-xs sm:text-[13px] font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A86B]/30 focus:border-[#00A86B] transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: CATEGORY SELECTOR (Modern Record Theme)          */}
        {/* ======================================================== */}
        {activeView === 'category' && (
          <div className="flex flex-col h-[520px] sm:h-[560px] max-h-[82vh] bg-white dark:bg-[#1C1C1E] animate-slide-up">
            {/* Header: Clean Record Theme */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('form');
                    setIsCategorySearchOpen(false);
                    setCategorySearchQuery('');
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Back to record"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      Select Category
                    </h3>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        type === 'expense'
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300'
                          : 'bg-emerald-50 text-[#00875A] dark:bg-emerald-950/50 dark:text-emerald-300'
                      }`}
                    >
                      {type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Choose a category or create a new one
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsCategorySearchOpen(!isCategorySearchOpen)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isCategorySearchOpen
                      ? 'bg-emerald-50 text-[#00875A] dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Search categories"
                >
                  <Search className="w-4.5 h-4.5 stroke-[2.2]" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewCatType(type === 'income' ? 'income' : 'expense');
                    setActiveView('addCategory');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-bold transition-all cursor-pointer"
                  title="Add Category"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
                  <span>New</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-0.5"
                  title="Close"
                >
                  <X className="w-4.5 h-4.5 stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* In-place Search Bar (if search open) */}
            {isCategorySearchOpen && (
              <div className="px-5 py-2.5 bg-slate-50/80 dark:bg-[#151517] border-b border-slate-100 dark:border-slate-800 animate-fade-in flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search categories (e.g. food, drinks, rent)..."
                    value={categorySearchQuery}
                    onChange={(e) => setCategorySearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-[#202024] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-xs sm:text-sm font-medium border border-slate-200/80 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-[#00A86B]/30"
                    autoFocus
                  />
                  {categorySearchQuery && (
                    <button
                      type="button"
                      onClick={() => setCategorySearchQuery('')}
                      className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Subheader: ALL CATEGORIES */}
            <div className="px-6 py-2 bg-slate-50/60 dark:bg-[#151517] text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              ALL CATEGORIES
            </div>

            {/* Categories List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">

              {filteredCategories.length === 0 ? (
                <div className="p-10 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                  No categories found matching "{categorySearchQuery}"
                </div>
              ) : (
                filteredCategories.map((cat) => {
                  const meta = CATEGORY_STYLE_MAP[cat.id] || {
                    name: cat.name,
                    color: cat.color || '#00A86B',
                    icon: Tag,
                  };
                  const CatIcon = meta.icon;
                  const isSelected = categoryId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setCategoryId(cat.id);
                        setActiveView('form');
                      }}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40'
                          : 'hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-transparent hover:shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Vibrant Solid Rounded Box with Icon/Emoji */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-xs select-none"
                          style={{ backgroundColor: cat.color || meta.color || '#00A86B' }}
                        >
                          {cat.emoji ? (
                            <span className="text-[22px] leading-none select-none flex items-center justify-center">{cat.emoji}</span>
                          ) : cat.isCustom ? (
                            <IconHelper name={cat.icon || 'Tag'} className="w-5 h-5 stroke-[2.2]" />
                          ) : (
                            <CatIcon className="w-5 h-5 stroke-[2.2]" />
                          )}
                        </div>
                        <span className="text-[13.5px] font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {cat.name}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#00A86B] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: MINIMAL ADD CATEGORY (Record Theme)               */}
        {/* ======================================================== */}
        {activeView === 'addCategory' && (
          <div className="flex flex-col bg-white dark:bg-[#1C1C1E] animate-slide-up">
            {/* Header: Clean Record Theme */}
            <div className="px-5 sm:px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('category');
                    setNewCatError('');
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Back to categories"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      Add Category
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-[#00875A] dark:bg-emerald-950/50 dark:text-emerald-300">
                      Custom
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Create a personalized category with emoji & color
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSaveNewCategory}
                  className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                  title="Save Category"
                >
                  <Check className="w-4.5 h-4.5 stroke-[2.2]" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4.5 h-4.5 stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* Form Body - Ultra-clean, Compact & Fits in 1 Screen */}
            <div className="px-5 sm:px-6 pt-2.5 pb-4 space-y-2.5 overflow-hidden">
              {/* Preview Hero Card (Compact) */}
              <div className="relative rounded-2xl p-2.5 sm:p-3 text-center border border-emerald-100/80 dark:border-emerald-900/30 bg-gradient-to-b from-emerald-50/70 via-slate-50/40 to-white dark:from-emerald-950/20 dark:via-[#161618] dark:to-[#18181B] shadow-xs">
                <input
                  ref={colorPickerInputRef}
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="sr-only"
                />
                <button
                  type="button"
                  onClick={() => colorPickerInputRef.current?.click()}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md ring-4 ring-white dark:ring-[#202024] cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                  style={{ backgroundColor: newCatColor }}
                  title="Click to choose circle color"
                >
                  {newCatEmoji ? (
                    <span className="text-[26px] sm:text-[30px] leading-none select-none flex items-center justify-center">
                      {newCatEmoji}
                    </span>
                  ) : (
                    <Tag className="w-6 h-6 stroke-[2.2]" />
                  )}
                </button>
                <div className="mt-1.5 flex items-center justify-center gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {newCatName.trim() || 'Category Preview'}
                  </span>
                  <button
                    type="button"
                    onClick={() => colorPickerInputRef.current?.click()}
                    className="px-2 py-0.5 rounded-full bg-white/90 dark:bg-white/10 border border-slate-200/80 dark:border-white/10 text-[10.5px] font-semibold text-[#00A86B] dark:text-emerald-400 hover:scale-105 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                    title="Change color"
                  >
                    <Pipette className="w-3 h-3" />
                    <span>Change color</span>
                  </button>
                </div>
              </div>

              {/* Error Alert */}
              {newCatError && (
                <p className="text-xs font-semibold text-rose-500 text-center animate-shake">
                  {newCatError}
                </p>
              )}

              {/* Category Name Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Coffee, Gym, Eid Gifts, Freelance..."
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (newCatError) setNewCatError('');
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#151517] text-xs sm:text-[13px] font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A86B]/30 focus:bg-white dark:focus:bg-[#1E1E20] transition-all"
                  autoFocus
                />
              </div>

              {/* Type Switcher (Segmented Control matching Record modal) */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Category Type
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100/90 dark:bg-[#151517] rounded-xl border border-slate-200/60 dark:border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setNewCatType('expense')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      newCatType === 'expense'
                        ? 'bg-white dark:bg-[#202024] text-rose-600 dark:text-rose-400 shadow-sm border border-rose-100/80 dark:border-rose-950/60 scale-[1.01]'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Expense</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCatType('income')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      newCatType === 'income'
                        ? 'bg-white dark:bg-[#202024] text-[#00875A] dark:text-emerald-400 shadow-sm border border-emerald-100/80 dark:border-emerald-950/60 scale-[1.01]'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Income</span>
                  </button>
                </div>
              </div>

              {/* Emoji Selection (Search Option alongside Icon/Emoji label) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex-shrink-0">
                    Icon / Emoji
                  </label>

                  {/* Clean Search Input on the right of Icon/Emoji */}
                  <div className="relative flex items-center flex-1 max-w-[220px] sm:max-w-[260px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={newCatEmojiSearch}
                      onChange={(e) => setNewCatEmojiSearch(e.target.value)}
                      placeholder="Search emoji..."
                      className="w-full pl-8 pr-7 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#151517] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                    />
                    {newCatEmojiSearch && (
                      <button
                        type="button"
                        onClick={() => setNewCatEmojiSearch('')}
                        className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer"
                        title="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Emoji Grid: Scrollable with world system emojis */}
                <div className="h-28 sm:h-32 overflow-y-auto p-1.5 rounded-xl bg-slate-50 dark:bg-[#151517] border border-slate-100 dark:border-slate-800 scrollbar-thin">
                  {displayedNewCatEmojis.length === 0 ? (
                    <div className="py-3 text-center">
                      <p className="text-xs text-slate-400">
                        No emoji found for "{newCatEmojiSearch}"
                      </p>
                      <button
                        type="button"
                        onClick={() => setNewCatEmojiSearch('')}
                        className="mt-1 text-[11px] text-[#00A86B] font-semibold hover:underline cursor-pointer"
                      >
                        Show popular emojis
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-8 gap-1 sm:gap-1.5">
                      {displayedNewCatEmojis.map((em, idx) => (
                        <button
                          key={`${em}-${idx}`}
                          type="button"
                          onClick={() => setNewCatEmoji(em)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-base sm:text-lg transition-all cursor-pointer ${
                            newCatEmoji === em
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 ring-2 ring-[#00A86B] scale-110 shadow-xs'
                              : 'hover:bg-slate-200/70 dark:hover:bg-slate-800'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: ACCOUNT SELECTOR (Record Theme)                   */}
        {/* ======================================================== */}
        {(activeView === 'account' || activeView === 'toAccount') && (
          <div className="flex flex-col h-[460px] bg-white dark:bg-[#1C1C1E] animate-slide-up">
            {/* Header: Clean Record Theme */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveView('form')}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Back to Record"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
                </button>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                    {activeView === 'toAccount' ? 'Destination Account' : 'Select Account'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {activeView === 'toAccount' ? 'Choose account to receive funds' : 'Choose source wallet or bank account'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const name = prompt('Enter account name:');
                    if (name && name.trim()) {
                      addAccount({
                        name: name.trim(),
                        type: 'general',
                        balance: 0,
                        currency: currentCurrency.code,
                        color: '#00875A',
                        icon: 'Wallet',
                      });
                    }
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
                  <span>Add</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-0.5"
                  title="Close"
                >
                  <X className="w-4.5 h-4.5 stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* Accounts List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
              {accounts.map((acc) => {
                const isSelected =
                  activeView === 'toAccount' ? toAccountId === acc.id : accountId === acc.id;

                return (
                  <div
                    key={acc.id}
                    onClick={() => {
                      if (activeView === 'toAccount') {
                        setToAccountId(acc.id);
                      } else {
                        setAccountId(acc.id);
                      }
                      setActiveView('form');
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40'
                        : 'hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-transparent hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className="w-4 h-4 rounded-full flex-shrink-0 shadow-2xs ring-2 ring-white dark:ring-[#202024]"
                        style={{ backgroundColor: acc.color || '#00875A' }}
                      />
                      <div className="truncate">
                        <span className="block text-xs sm:text-[13.5px] font-bold text-slate-800 dark:text-slate-100 truncate">
                          {acc.name}
                        </span>
                        <span className="text-[11px] text-slate-400 capitalize block">
                          {acc.type || 'General'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-2.5 flex-shrink-0">
                      <span
                        className={`text-xs font-bold tracking-tight ${
                          Number(acc.balance || 0) < 0
                            ? 'text-[#FE3B2C] dark:text-rose-400'
                            : 'text-[#00875A] dark:text-emerald-400'
                        }`}
                      >
                        {formatAccountBalance(
                          acc.balance,
                          currentCurrency?.code || acc.currency || 'BDT'
                        )}
                      </span>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#00A86B] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Category Manager Modal for custom categories */}
      <CategoryManagerModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onCategoryCreated={(newCat) => {
          setCategoryId(newCat.id);
          setActiveView('form');
        }}
        initialType={type === 'income' ? 'income' : 'expense'}
      />
    </div>
  );
};

export default TransactionModal;
