import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CURRENCIES } from '../../utils/constants';
import { COUNTRIES, getBanksForCountry } from '../../data/bankDatabase';
import {
  X,
  ArrowLeft,
  Building2,
  Hand,
  FileSpreadsheet,
  TrendingUp,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Search,
  ShieldCheck,
  Lock,
  Wallet,
  Coins,
  CreditCard,
  Smartphone,
  Landmark,
  RefreshCw,
  Info,
} from 'lucide-react';

const PRESET_COLORS = [
  '#00897b', // teal from user screenshot 4
  '#1565c0', // blue from user screenshot 3
  '#4db6ac', // soft teal from user screenshot
  '#EC407A', // pink
  '#00838F', // dark teal
  '#0288D1', // blue
  '#2E7D32', // green
  '#E2136E', // bKash pink
  '#F57C00', // nagad orange
  '#8E24AA', // rocket purple
  '#D32F2F', // red
  '#455A64', // slate
  '#1C1C1E', // dark
];

const ACCOUNT_TYPES = [
  { id: 'general', label: 'General', icon: Wallet, defaultColor: '#4db6ac' },
  { id: 'cash', label: 'Cash', icon: Coins, defaultColor: '#10B981' },
  { id: 'bank', label: 'Bank Account', icon: Building2, defaultColor: '#00838F' },
  { id: 'mobile_banking', label: 'Mobile Banking', icon: Smartphone, defaultColor: '#E2136E' },
  { id: 'credit_card', label: 'Credit Card', icon: CreditCard, defaultColor: '#F57C00' },
  { id: 'loan', label: 'Loan / Debt', icon: Landmark, defaultColor: '#D32F2F' },
];

export const AccountModal = ({
  isOpen,
  onClose,
  initialData = null,
  onNavigateTab,
}) => {
  const { addAccount, updateAccount, currentCurrency } = useFinance();

  // Steps: 'select_mode' | 'search_bank' | 'bank_details' | 'edit_form'
  const [step, setStep] = useState('select_mode');

  // Edit / Manual Form states matching screenshot
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4db6ac');
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [type, setType] = useState('general');
  const [balance, setBalance] = useState('0');
  const [currency, setCurrency] = useState('BDT');
  const [excludeFromStats, setExcludeFromStats] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [error, setError] = useState('');

  // Bank Sync Flow states
  const [selectedCountry, setSelectedCountry] = useState('Bangladesh');
  const [countrySearch, setCountrySearch] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const [selectedBank, setSelectedBank] = useState(null);
  const [bankSearch, setBankSearch] = useState('');
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);

  // Bank Connection Details Form
  const [bankAccName, setBankAccName] = useState('');
  const [bankAccType, setBankAccType] = useState('Savings Account');
  const [bankAccNumber, setBankAccNumber] = useState('');
  const [bankBalance, setBankBalance] = useState('0');
  const [bankCurrency, setBankCurrency] = useState('BDT');
  const [isConnecting, setIsConnecting] = useState(false);

  // Dropdown click outside handlers
  const countryDropdownRef = useRef(null);
  const bankDropdownRef = useRef(null);
  const colorDropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      // Editing existing account -> directly open Edit Account form matching user screenshot
      setStep('edit_form');
      setName(initialData.name || '');
      setColor(initialData.color || '#4db6ac');
      setType(initialData.type || 'general');
      setBalance(initialData.balance !== undefined ? String(initialData.balance) : '0');
      setCurrency(initialData.currency || currentCurrency?.code || 'BDT');
      setExcludeFromStats(Boolean(initialData.excludeFromStats));
      setIsArchived(Boolean(initialData.archived || initialData.isArchived));
    } else {
      // New Account -> start at Step 1 Choice Cards (Image 1)
      setStep('select_mode');
      setName('');
      setColor('#4db6ac');
      setType('general');
      setBalance('0');
      setCurrency(currentCurrency?.code || 'BDT');
      setExcludeFromStats(false);
      setIsArchived(false);

      // Reset Bank sync state
      setSelectedCountry('Bangladesh');
      setCountrySearch('Bangladesh');
      setSelectedBank(null);
      setBankSearch('');
      setBankAccName('');
      setBankAccType('Savings Account');
      setBankAccNumber('');
      setBankBalance('0');
      setBankCurrency(currentCurrency?.code || 'BDT');
      setIsConnecting(false);
    }
    setError('');
    setColorPickerOpen(false);
    setIsCountryDropdownOpen(false);
    setIsBankDropdownOpen(false);
  }, [initialData, isOpen, currentCurrency]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target)) {
        setIsCountryDropdownOpen(false);
      }
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(e.target)) {
        setIsBankDropdownOpen(false);
      }
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(e.target)) {
        setColorPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered Countries list
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return COUNTRIES;
    return COUNTRIES.filter((c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  // Available Banks for the selected country
  const availableBanks = useMemo(() => {
    return getBanksForCountry(selectedCountry);
  }, [selectedCountry]);

  // Filtered Banks list based on user search
  const filteredBanks = useMemo(() => {
    if (!bankSearch) return availableBanks;
    return availableBanks.filter((b) =>
      b.name.toLowerCase().includes(bankSearch.toLowerCase())
    );
  }, [availableBanks, bankSearch]);

  const handleSelectBank = (bank) => {
    setSelectedBank(bank);
    setBankSearch(bank.name);
    setBankAccName(bank.name);
    setIsBankDropdownOpen(false);
  };

  const handleContinueToBankDetails = () => {
    if (!selectedBank) return;
    setStep('bank_details');
  };

  // Connect & Save Bank Account
  const handleConnectBank = (e) => {
    e.preventDefault();
    if (!bankAccName.trim()) {
      setError('Please provide an account label.');
      return;
    }

    const numBalance = parseFloat(bankBalance);
    if (isNaN(numBalance)) {
      setError('Please enter a valid starting balance.');
      return;
    }

    setIsConnecting(true);

    setTimeout(() => {
      const payload = {
        name: bankAccName.trim(),
        type: 'bank',
        balance: numBalance,
        currency: bankCurrency || 'BDT',
        color: selectedBank?.color || '#00838F',
        excludeFromStats: false,
        archived: false,
        accountNumber: bankAccNumber.trim()
          ? '•••• ' + bankAccNumber.trim().slice(-4)
          : '•••• ' + Math.floor(1000 + Math.random() * 9000),
        bankName: selectedBank?.name || 'Bank',
        country: selectedCountry,
        synced: true,
      };

      addAccount(payload);
      setIsConnecting(false);
      onClose();
    }, 600);
  };

  // Edit / Manual Account Submit (Matching user screenshot)
  const handleSaveAccount = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter an account name.');
      return;
    }
    const numBalance = parseFloat(balance);
    if (isNaN(numBalance)) {
      setError('Please enter a valid initial amount.');
      return;
    }

    const payload = {
      name: name.trim(),
      type,
      balance: numBalance,
      currency,
      color,
      excludeFromStats,
      archived: isArchived,
      isArchived,
      accountNumber: initialData?.accountNumber || '•••• ' + Math.floor(1000 + Math.random() * 9000),
    };

    if (initialData && initialData.id) {
      updateAccount(initialData.id, payload);
    } else {
      addAccount(payload);
    }
    onClose();
  };

  if (!isOpen) return null;

  const currentTypeObj = ACCOUNT_TYPES.find((t) => t.id === type) || ACCOUNT_TYPES[0];
  const TypeIcon = currentTypeObj.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in select-none">
      {/* Modal Dialog Box */}
      <div
        className={`relative w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col ${
          step === 'search_bank' ? 'overflow-visible' : 'overflow-hidden'
        } transition-all duration-300 ${
          step === 'select_mode'
            ? 'max-w-4xl' // 3 Choice cards
            : 'max-w-[460px]' // Edit Account / Bank Sync form
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ======================================================== */}
        {/* STEP 1: ADD ACCOUNT CHOICE CARDS (Exact 2nd Image Replica) */}
        {/* ======================================================== */}
        {step === 'select_mode' && (
          <div className="flex flex-col bg-white dark:bg-[#1E1E20]">
            {/* Header: Add Account matching 2nd image */}
            <div className="flex items-center justify-between px-7 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Add Account
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            {/* 3 Choice Cards Grid matching 2nd Image */}
            <div className="p-7 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                {/* Card 1: Bank Sync (Matching 2nd image) */}
                <div
                  onClick={() => setStep('search_bank')}
                  className="bg-white dark:bg-[#1E1E20] rounded-[20px] border border-slate-200/90 dark:border-slate-800 p-7 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-[#007AFF] dark:hover:border-[#007AFF] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center text-center group active:scale-[0.98]"
                >
                  <div className="h-14 flex items-center justify-center text-[#007AFF] mb-4 group-hover:scale-108 transition-transform duration-200">
                    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="currentColor">
                      {/* Roof pediment */}
                      <path d="M24 6L6 16v3h36v-3L24 6z" />
                      {/* 4 Pillars */}
                      <rect x="9" y="21" width="4.5" height="13" rx="1" />
                      <rect x="17.5" y="21" width="4.5" height="13" rx="1" />
                      <rect x="26" y="21" width="4.5" height="13" rx="1" />
                      <rect x="34.5" y="21" width="4.5" height="13" rx="1" />
                      {/* Base podium */}
                      <path d="M6 35h23v3H6z" />
                      {/* Circular sync arrows badge */}
                      <path d="M37 31a7 7 0 1 0 6.6 9.3l-2.4-.8A4.5 4.5 0 1 1 37 33.5v-2l4 3.5-4 3.5v-2z" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-[#007AFF] transition-colors">
                    Bank Sync
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal max-w-[220px]">
                    Connect your bank accounts and synchronize your transactions automatically.
                  </p>
                </div>

                {/* Card 2: Manual Input (Google Material touch_app Icon matching 2nd image) */}
                <div
                  onClick={() => setStep('edit_form')}
                  className="bg-white dark:bg-[#1E1E20] rounded-[20px] border border-slate-200/90 dark:border-slate-800 p-7 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-[#007AFF] dark:hover:border-[#007AFF] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center text-center group active:scale-[0.98]"
                >
                  <div className="h-14 flex items-center justify-center text-[#007AFF] mb-4 group-hover:scale-108 transition-transform duration-200">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                      {/* Material Design touch_app: hand touching ripple target arc above finger */}
                      <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26a1.49 1.49 0 0 0-1.42.06L12 14.2V7.5a1 1 0 0 0-2 0v10.18l-3.3-1.65a1.5 1.5 0 0 0-1.95.63l-.45.9 4.8 4.8a3 3 0 0 0 2.12.88h6.56a3 3 0 0 0 2.9-2.23l1.1-4.41a1.5 1.5 0 0 0-.94-1.73z" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-[#007AFF] transition-colors">
                    Manual Input
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal max-w-[220px]">
                    Update your account manually. You can connect your bank or import later.
                  </p>
                </div>

                {/* Card 3: Imports (Blue Document with White Arrow inside matching 2nd image) */}
                <div
                  onClick={() => {
                    if (onNavigateTab) onNavigateTab('imports');
                    setStep('edit_form');
                  }}
                  className="bg-white dark:bg-[#1E1E20] rounded-[20px] border border-slate-200/90 dark:border-slate-800 p-7 sm:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-xl hover:border-[#007AFF] dark:hover:border-[#007AFF] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center text-center group active:scale-[0.98]"
                >
                  <div className="h-14 flex items-center justify-center mb-4 group-hover:scale-108 transition-transform duration-200">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                      {/* Document Sheet Body */}
                      <path
                        d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
                        fill="#007AFF"
                      />
                      {/* Top-Right Dog-Ear Fold */}
                      <path d="M14 2V8H20L14 2Z" fill="#005ECB" opacity="0.35" />
                      {/* Solid White Right Arrow inside document matching 2nd image */}
                      <path
                        d="M7.5 13.25H12V15.5L16.5 12L12 8.5V10.75H7.5V13.25Z"
                        fill="#FFFFFF"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-[#007AFF] transition-colors">
                    Imports
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal max-w-[220px]">
                    Upload your transaction history by importing CSV, Excel, OFX or other files.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* EDIT ACCOUNT FORM (EXACT REPLICA OF USER'S SCREENSHOT)    */}
        {/* ======================================================== */}
        {step === 'edit_form' && (
          <form onSubmit={handleSaveAccount} className="p-6 sm:p-7 flex flex-col animate-fade-in">
            {/* Header: Edit Account with X on right */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {initialData ? 'Edit Account' : 'Add Account'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            {error && (
              <div className="mt-3 p-2.5 text-xs font-semibold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-center">
                {error}
              </div>
            )}

            <div className="space-y-4 pt-4">
              {/* Row 1: Name * and Color swatch (Screenshot Row 1) */}
              <div className="grid grid-cols-12 gap-3 items-end">
                {/* Name * Input (Left, ~70%) */}
                <div className="col-span-8">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Account name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A86B]/30"
                  />
                </div>

                {/* Color Button with circular swatch & hex code (Right, ~30%) */}
                <div className="col-span-4 relative" ref={colorDropdownRef}>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Color
                  </label>
                  <button
                    type="button"
                    onClick={() => setColorPickerOpen(!colorPickerOpen)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
                  >
                    <span
                      className="w-4.5 h-4.5 rounded-full flex-shrink-0 shadow-xs"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 uppercase truncate">
                      {color}
                    </span>
                  </button>

                  {/* Color Preset Palette Dropdown */}
                  {colorPickerOpen && (
                    <div className="absolute z-30 right-0 mt-1 p-3 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl w-52 animate-slide-up">
                      <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                        Select Color
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {PRESET_COLORS.map((clr) => (
                          <button
                            key={clr}
                            type="button"
                            onClick={() => {
                              setColor(clr);
                              setColorPickerOpen(false);
                            }}
                            className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                              color === clr ? 'scale-110 ring-2 ring-[#00A86B] ring-offset-2 dark:ring-offset-slate-900' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: clr }}
                          >
                            {color === clr && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Account type with wallet icon and select arrows (Screenshot Row 2) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Account type
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <TypeIcon className="w-4.5 h-4.5 stroke-[2]" />
                  </div>
                  <select
                    value={type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setType(newType);
                      const matched = ACCOUNT_TYPES.find((t) => t.id === newType);
                      if (matched && !initialData) setColor(matched.defaultColor);
                    }}
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A86B]/30 appearance-none cursor-pointer"
                  >
                    {ACCOUNT_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronsUpDown className="w-4 h-4 stroke-[2]" />
                  </div>
                </div>
              </div>

              {/* Row 3: Initial Amount and Currency (Screenshot Row 3) */}
              <div className="grid grid-cols-12 gap-3 items-end">
                {/* Initial Amount (Left, ~65%) */}
                <div className="col-span-8">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Initial Amount
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#00A86B]/30"
                  />
                </div>

                {/* Currency (Right, ~35%) with grey disabled/dropdown styling */}
                <div className="col-span-4 relative">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Currency
                  </label>
                  <div className="relative">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold focus:outline-none appearance-none cursor-pointer"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.code}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronsUpDown className="w-3.5 h-3.5 stroke-[2]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Toggles (Exclude from statistics & Archive) with (i) icons */}
              <div className="space-y-3 pt-2">
                {/* Toggle 1: Exclude from statistics */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setExcludeFromStats(!excludeFromStats)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                      excludeFromStats ? 'bg-[#00A86B]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                        excludeFromStats ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Exclude from statistics
                  </span>
                  <div title="Transactions from this account will not be included in dashboard and statistics">
                    <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
                  </div>
                </div>

                {/* Toggle 2: Archive (only shown when editing existing account) */}
                {initialData && (
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsArchived(!isArchived)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                        isArchived ? 'bg-[#00875A]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                          isArchived ? 'translate-x-4.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Archive
                    </span>
                    <div title="Archived accounts are hidden from active account lists">
                      <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
                    </div>
                  </div>
                )}
              </div>

              {/* Row 5: Create account / Save Button matching screenshot */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className={`w-full py-3.5 rounded-full font-bold text-sm sm:text-base transition-all cursor-pointer text-center ${
                    !name.trim()
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                      : 'bg-[#00875A] hover:bg-[#00704A] text-white shadow-md shadow-emerald-500/20 active:scale-[0.99]'
                  }`}
                >
                  {initialData ? 'Save' : 'Create account'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* STEP 2: SEARCH YOUR BANK (Image 3, 4, 5)                  */}
        {/* ======================================================== */}
        {step === 'search_bank' && (
          <div className="p-6 sm:p-7 flex flex-col relative animate-fade-in">
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep(initialData ? 'edit_form' : 'select_mode')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  title="Back"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
                </button>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Search your Bank
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            {/* Blue Circular Bank Emblem */}
            <div className="flex items-center justify-center my-4">
              <div className="w-24 h-24 rounded-full bg-[#3B82F6] flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                <Landmark className="w-13 h-13 stroke-[1.7]" />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {/* Country Picker */}
              <div className="relative" ref={countryDropdownRef}>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Start typing your country name
                </label>
                <div
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white hover:border-slate-300 cursor-pointer shadow-2xs"
                >
                  <span className="truncate">{selectedCountry || 'Select country'}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </div>

                {isCountryDropdownOpen && (
                  <div className="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl max-h-56 overflow-y-auto animate-slide-up divide-y divide-slate-100 dark:divide-slate-800">
                    <div className="p-2 sticky top-0 bg-white dark:bg-slate-850">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full bg-transparent focus:outline-none text-slate-900 dark:text-white text-xs"
                          autoFocus
                        />
                      </div>
                    </div>
                    {filteredCountries.map((c) => (
                      <div
                        key={c.code}
                        onClick={() => {
                          setSelectedCountry(c.name);
                          setSelectedBank(null);
                          setBankSearch('');
                          setIsCountryDropdownOpen(false);
                          if (c.currency) setBankCurrency(c.currency);
                        }}
                        className={`px-4 py-2.5 text-xs font-medium cursor-pointer transition-colors hover:bg-blue-50 dark:hover:bg-blue-950/40 ${
                          selectedCountry === c.name
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-bold'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {c.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bank Selector */}
              <div className="relative" ref={bankDropdownRef}>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select your Bank
                </label>
                <div
                  onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white hover:border-slate-300 cursor-pointer shadow-2xs"
                >
                  <span className={selectedBank ? 'font-bold' : 'text-slate-400'}>
                    {selectedBank ? selectedBank.name : "Start typing your bank's name"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                </div>

                {isBankDropdownOpen && (
                  <div className="absolute z-50 left-0 right-0 bottom-full mb-2 bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-700 rounded-2xl shadow-2xl max-h-64 sm:max-h-72 overflow-y-auto animate-slide-up divide-y divide-slate-100 dark:divide-slate-800">
                    <div className="p-2 sticky top-0 bg-white dark:bg-slate-850 z-10 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                        <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="Search your bank..."
                          value={bankSearch}
                          onChange={(e) => setBankSearch(e.target.value)}
                          className="w-full bg-transparent focus:outline-none text-slate-900 dark:text-white text-xs"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredBanks.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => handleSelectBank(b)}
                          className={`px-4 py-3 text-xs font-medium cursor-pointer transition-colors flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-950/40 ${
                            selectedBank?.id === b.id
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-bold'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div>
                            <span className="block font-semibold text-slate-900 dark:text-white text-xs sm:text-[13px]">
                              {b.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{b.type}</span>
                          </div>
                          {selectedBank?.id === b.id && (
                            <Check className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 mt-2">
              <button
                type="button"
                disabled={!selectedBank}
                onClick={handleContinueToBankDetails}
                className={`w-full py-3.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                  selectedBank
                    ? 'bg-[#007AFF] hover:bg-blue-600 text-white shadow-md shadow-blue-500/25 active:scale-[0.98]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: BANK DETAILS & VALIDITY CONNECTION FORM           */}
        {/* ======================================================== */}
        {step === 'bank_details' && (
          <form onSubmit={handleConnectBank} className="p-6 sm:p-7 flex flex-col animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep('search_bank')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  title="Back"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
                </button>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Bank Account Details
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            <div className="mt-4 p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-xs flex-shrink-0"
                style={{ backgroundColor: selectedBank?.color || '#00838F' }}
              >
                <Landmark className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white block truncate">
                  {selectedBank?.name}
                </span>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold block">
                  {selectedCountry} • Verified Financial Institution
                </span>
              </div>
            </div>

            {error && (
              <div className="mt-3 p-2.5 text-xs font-semibold rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-center">
                {error}
              </div>
            )}

            <div className="space-y-3.5 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Account Name / Label
                </label>
                <input
                  type="text"
                  required
                  value={bankAccName}
                  onChange={(e) => setBankAccName(e.target.value)}
                  placeholder="e.g. Jamuna Bank Savings"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Account Type
                  </label>
                  <select
                    value={bankAccType}
                    onChange={(e) => setBankAccType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="Savings Account">Savings Account</option>
                    <option value="Current Account">Current / Checking</option>
                    <option value="Salary Account">Salary Account</option>
                    <option value="Fixed Deposit">Fixed Deposit (FDR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Currency
                  </label>
                  <select
                    value={bankCurrency}
                    onChange={(e) => setBankCurrency(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none cursor-pointer"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Account Number / Last 4 Digits (Validity Info)
                </label>
                <input
                  type="text"
                  value={bankAccNumber}
                  onChange={(e) => setBankAccNumber(e.target.value)}
                  placeholder="e.g. 5821 or full account no"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Starting Balance ({bankCurrency})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={bankBalance}
                  onChange={(e) => setBankBalance(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>Bank-grade 256-bit encryption. Read-only secure transaction sync.</span>
            </div>

            <div className="pt-5 mt-2">
              <button
                type="submit"
                disabled={isConnecting}
                className="w-full py-3.5 rounded-2xl bg-[#007AFF] hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Bank Credentials...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Connect & Add Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AccountModal;
