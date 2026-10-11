import React, { useState, useRef } from 'react';
import {
  Coins,
  LayoutGrid,
  FileText,
  Tag,
  GitFork,
  SlidersHorizontal,
  HelpCircle,
  Terminal,
  Cpu,
  CreditCard,
  Lock,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Plus,
  ExternalLink,
  Mail,
  Globe,
  Copy,
  Check,
  User,
  Upload,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Utensils,
  ShoppingBag,
  Home,
  Car,
  Bike,
  Film,
  Laptop,
  CreditCard as CardIcon,
  TrendingUp,
  Banknote,
  MoreHorizontal,
  Star,
  Languages,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useTheme } from '../../context/ThemeContext';
import { useSecurity } from '../../context/SecurityContext';
import { CURRENCIES, EXPENSE_CATEGORIES } from '../../utils/constants';

// Clean GitHub SVG Vector
const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

// Categories list matching user's Image 3
const SIDEBAR_CATEGORIES = [
  { id: 'food', name: 'Food & Drinks', color: '#EF4444', icon: Utensils },
  { id: 'shopping', name: 'Shopping', color: '#3B82F6', icon: ShoppingBag },
  { id: 'housing', name: 'Housing', color: '#F97316', icon: Home },
  { id: 'transportation', name: 'Transportation', color: '#6B7280', icon: Car },
  { id: 'vehicle', name: 'Vehicle', color: '#A855F7', icon: Bike },
  { id: 'life', name: 'Life & Entertainment', color: '#22C55E', icon: Film },
  { id: 'communication', name: 'Communication, PC', color: '#0EA5E9', icon: Laptop },
  { id: 'financial', name: 'Financial expenses', color: '#14B8A6', icon: CardIcon },
  { id: 'investments', name: 'Investments', color: '#EC4899', icon: TrendingUp },
  { id: 'income', name: 'Income', color: '#EAB308', icon: Banknote },
  { id: 'others', name: 'Others', color: '#94A3B8', icon: MoreHorizontal },
];

export const SettingsView = ({
  initialTab = 'help',
  onOpenSecurity,
  onOpenCategoryManager,
}) => {
  const { currentUser, updateProfile, updateAvatar, getInitialsAvatar } = useAuth();
  const {
    currencyCode,
    setCurrencyCode,
    currentCurrency,
    exportDataJSON,
    exportDataCSV,
    importDataJSON,
    clearToFreshDashboard,
    loadSampleDemoData,
    transactions,
    accounts,
  } = useFinance();
  const { isDark, toggleTheme } = useTheme();
  const { isPrivacyMode, togglePrivacyMode, isPinEnabled } = useSecurity();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState(initialTab);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  // Currencies state
  const [selectedCurrencyToAdd, setSelectedCurrencyToAdd] = useState('USD');
  const [customCurrencies, setCustomCurrencies] = useState([
    { code: 'USD', name: 'US Dollar', rate: '0.0083' },
  ]);

  // Templates state
  const [templates, setTemplates] = useState([]);
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'groceries',
    amount: '',
    accountId: accounts[0]?.id || '',
  });

  // Labels state
  const [labels, setLabels] = useState([]);
  const [showAddLabel, setShowAddLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');

  // Rules state
  const [rules, setRules] = useState([]);

  // Copy status
  const [copiedField, setCopiedField] = useState('');

  // General profile state
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // States matching screenshots
  const [firstName, setFirstName] = useState(currentUser?.name?.split(' ')[0] || 'Saifulla');
  const [lastName, setLastName] = useState(currentUser?.name?.split(' ').slice(1).join(' ') || 'Tanim');
  const [userEmail, setUserEmail] = useState(currentUser?.email || 'saifullatanim.cse@gmail.com');
  const [language, setLanguage] = useState('English');
  const [defaultInterval, setDefaultInterval] = useState('This month');
  const [hideDecimals, setHideDecimals] = useState(false);
  const [autoLogout, setAutoLogout] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [mcpTab, setMcpTab] = useState('ChatGPT');
  const [apiTokens, setApiTokens] = useState([]);
  const [billingSubView, setBillingSubView] = useState('choose-plan');

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleAddCurrency = (e) => {
    e.preventDefault();
    const curr = CURRENCIES.find((c) => c.code === selectedCurrencyToAdd);
    if (!curr) return;
    if (curr.code === currencyCode) {
      setStatusMsg({ text: `${curr.code} is already your base currency.`, type: 'error' });
      return;
    }
    if (customCurrencies.some((c) => c.code === curr.code)) {
      setStatusMsg({ text: `${curr.code} is already added.`, type: 'error' });
      return;
    }
    setCustomCurrencies([...customCurrencies, { code: curr.code, name: curr.name, rate: curr.rate.toString() }]);
    setStatusMsg({ text: `${curr.name} added!`, type: 'success' });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
  };

  const handleCreateTemplate = (e) => {
    e.preventDefault();
    if (!newTemplate.name || !newTemplate.amount) return;
    setTemplates([
      ...templates,
      {
        id: Date.now().toString(),
        name: newTemplate.name,
        category: newTemplate.category,
        amount: parseFloat(newTemplate.amount),
        accountId: newTemplate.accountId || accounts[0]?.id,
      },
    ]);
    setNewTemplate({ name: '', category: 'groceries', amount: '', accountId: accounts[0]?.id || '' });
    setShowAddTemplate(false);
    setStatusMsg({ text: 'Template created successfully!', type: 'success' });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
  };

  const handleCreateLabel = (e) => {
    e.preventDefault();
    if (!newLabelName.trim()) return;
    setLabels([...labels, { id: Date.now().toString(), name: newLabelName.trim() }]);
    setNewLabelName('');
    setShowAddLabel(false);
    setStatusMsg({ text: 'Label created successfully!', type: 'success' });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!profileName.trim()) return;
    updateProfile({ name: profileName.trim() });
    setStatusMsg({ text: 'Profile updated!', type: 'success' });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      updateAvatar(event.target.result);
      setStatusMsg({ text: 'Avatar updated!', type: 'success' });
      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full bg-white dark:bg-[#1C1C1E] rounded-[24px] shadow-sm border border-black/[0.06] dark:border-white/[0.08] overflow-hidden min-h-[700px] flex flex-col md:flex-row animate-fade-in text-slate-800 dark:text-slate-100">
      {/* ============================================================== */}
      {/* LEFT SIDEBAR (Matching Images 1, 2, 3, 4, 5)                  */}
      {/* ============================================================== */}
      <aside className="w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-5 flex-shrink-0 bg-slate-50/50 dark:bg-[#161618]">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 px-2">
          Settings
        </h1>

        {/* WALLET GROUP */}
        <div className="mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 block mb-2">
            WALLET
          </span>

          <nav className="space-y-1">
            {/* Currencies */}
            <button
              type="button"
              onClick={() => setActiveTab('currencies')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'currencies'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00875A] dark:text-[#34C759]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>Currencies</span>
            </button>

            {/* Categories (Expandable Accordion matching Image 3) */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('categories');
                  setCategoriesExpanded(!categoriesExpanded);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00875A] dark:text-[#34C759]'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-4 h-4" />
                  <span>Categories</span>
                </div>
                {categoriesExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {/* Sub-categories dropdown (Image 3) */}
              {categoriesExpanded && (
                <div className="pl-6 pr-2 py-1.5 space-y-1 animate-fade-in border-l border-slate-200 dark:border-slate-800 ml-4 my-1">
                  {SIDEBAR_CATEGORIES.map((cat) => {
                    const IconComp = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setActiveTab('categories');
                          if (onOpenCategoryManager) onOpenCategoryManager();
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-left"
                      >
                        <div
                          style={{ backgroundColor: cat.color }}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-xs"
                        >
                          <IconComp className="w-3 h-3 stroke-[2.2]" />
                        </div>
                        <span className="truncate">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Templates */}
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00875A] dark:text-[#34C759]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Templates</span>
            </button>

            {/* Labels */}
            <button
              type="button"
              onClick={() => setActiveTab('labels')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'labels'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00875A] dark:text-[#34C759]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Labels</span>
            </button>

            {/* Automatic Rules */}
            <button
              type="button"
              onClick={() => setActiveTab('rules')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'rules'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00875A] dark:text-[#34C759]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <GitFork className="w-4 h-4" />
              <span>Automatic Rules</span>
            </button>
          </nav>
        </div>

        {/* GENERAL GROUP */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 block mb-2">
            GENERAL
          </span>

          <nav className="space-y-1">
            {/* General */}
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'general'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00875A] dark:text-[#34C759]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>General</span>
            </button>

            {/* Help (Requested Tab) */}
            <button
              type="button"
              onClick={() => setActiveTab('help')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'help'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00875A] dark:text-[#34C759]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help</span>
            </button>

            {/* REST API */}
            <button
              type="button"
              onClick={() => setActiveTab('api')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'api'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00875A] dark:text-[#34C759]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>REST API</span>
            </button>

            {/* MCP Server */}
            <button
              type="button"
              onClick={() => setActiveTab('mcp')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'mcp'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00875A] dark:text-[#34C759]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>MCP Server</span>
            </button>

            {/* Billing */}
            <button
              type="button"
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'billing'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00875A] dark:text-[#34C759]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Billing</span>
            </button>

            {/* Personal data & privacy */}
            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00875A] dark:text-[#34C759]'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Personal data & privacy</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* RIGHT CONTENT AREA (Matching Image 1, 2, 3, 4, 5)              */}
      {/* ============================================================== */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        {/* Status Notification Toast */}
        {statusMsg.text && (
          <div
            className={`mb-6 p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-fade-in ${
              statusMsg.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/40 text-[#FF3B30] border border-rose-200 dark:border-rose-900/50'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00875A] dark:text-[#34C759] border border-emerald-200 dark:border-emerald-900/50'
            }`}
          >
            {statusMsg.type === 'error' ? (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB: HELP (Exact match of Image 1 + User Contact Info)       */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'help' && (
          <div className="space-y-8 animate-fade-in max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
              Help
            </h2>

            {/* 1. Help Center */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
              <div className="pr-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Help Center</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Browse our help articles to quickly find answers to your questions.
                </p>
              </div>
              <a
                href="https://saifullatanim.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-full border border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF]/10 font-semibold text-xs transition-all active:scale-95 flex items-center gap-1.5 flex-shrink-0"
              >
                <span>Go to Help Center</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 2. Send Feedback */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
              <div className="pr-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Send Feedback</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Let us know what you think. Share your thoughts and suggestions with us to help improve Wallet for everyone.
                </p>
              </div>
              <a
                href="mailto:saifullatanim.cse@gmail.com?subject=Wallet%20App%20Feedback"
                className="px-6 py-2 rounded-full border border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF]/10 font-semibold text-xs transition-all active:scale-95 flex items-center gap-1.5 flex-shrink-0"
              >
                <span>Send Feedback</span>
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 3. Support Requests */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
              <div className="pr-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Support Requests</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Manage your support requests directly from the app.
                </p>
              </div>
              <a
                href="https://github.com/saifullahtanim"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-full border border-[#007AFF] text-[#007AFF] hover:bg-[#007AFF]/10 font-semibold text-xs transition-all active:scale-95 flex items-center gap-1.5 flex-shrink-0"
              >
                <span>View Requests</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 4. Dedicated Developer Contact Card (User Contacts) */}
            <div className="p-6 rounded-[22px] bg-slate-50 dark:bg-[#252528] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00875A] to-[#34C759] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  ST
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Saifulla Tanim</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Developer & Direct Support Contact</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* Email Contact */}
                <div className="p-3.5 rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Email</span>
                    <a
                      href="mailto:saifullatanim.cse@gmail.com"
                      className="text-xs font-semibold text-[#007AFF] hover:underline truncate block mt-0.5"
                    >
                      saifullatanim.cse@gmail.com
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('saifullatanim.cse@gmail.com', 'email')}
                    title="Copy Email"
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {copiedField === 'email' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* GitHub Profile */}
                <div className="p-3.5 rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">GitHub</span>
                    <a
                      href="https://github.com/saifullahtanim"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#007AFF] hover:underline truncate block mt-0.5"
                    >
                      github.com/saifullahtanim
                    </a>
                  </div>
                  <a
                    href="https://github.com/saifullahtanim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                </div>

                {/* Portfolio Website */}
                <div className="p-3.5 rounded-[16px] bg-white dark:bg-[#1C1C1E] border border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Website</span>
                    <a
                      href="https://saifullatanim.me/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#007AFF] hover:underline truncate block mt-0.5"
                    >
                      saifullatanim.me
                    </a>
                  </div>
                  <a
                    href="https://saifullatanim.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB: CURRENCIES (Exact match of Image 2)                     */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'currencies' && (
          <div className="space-y-8 animate-fade-in max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Currencies
            </h2>

            {/* Add a new currency section */}
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                Add a new currency
              </label>
              <form onSubmit={handleAddCurrency} className="flex items-center gap-3 max-w-md">
                <div className="relative flex-1">
                  <select
                    value={selectedCurrencyToAdd}
                    onChange={(e) => setSelectedCurrencyToAdd(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#2C2C2E] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00875A]/30 text-slate-800 dark:text-slate-100 appearance-none pr-8 cursor-pointer"
                  >
                    {CURRENCIES.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.code} - {curr.name} ({curr.symbol})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00875A] hover:bg-[#00704A] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add</span>
                </button>
              </form>
            </div>

            {/* Your currencies table */}
            <div className="pt-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Your currencies
              </h3>

              <div className="w-full border-t border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-3 py-3 text-xs font-bold text-slate-900 dark:text-white">
                  <span>Code</span>
                  <span>Name</span>
                  <span>Exchange rate</span>
                </div>

                {/* Base Currency (BDT) */}
                <div className="grid grid-cols-3 py-4 border-t border-slate-100 dark:border-slate-800/80 text-xs font-medium text-slate-600 dark:text-slate-300 items-center">
                  <span className="font-bold text-slate-900 dark:text-white">{currencyCode}</span>
                  <span>{currentCurrency.name}</span>
                  <span className="text-slate-400">This is your Base Currency</span>
                </div>

                {/* Additional Currencies */}
                {customCurrencies.map((curr) => (
                  <div
                    key={curr.code}
                    className="grid grid-cols-3 py-4 border-t border-slate-100 dark:border-slate-800/80 text-xs font-medium text-slate-600 dark:text-slate-300 items-center"
                  >
                    <span className="font-bold text-slate-900 dark:text-white">{curr.code}</span>
                    <span>{curr.name}</span>
                    <div className="flex items-center justify-between pr-4">
                      <span>1 {currencyCode} = {curr.rate} {curr.code}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrencyCode(curr.code);
                          setStatusMsg({ text: `Base currency switched to ${curr.code}!`, type: 'success' });
                          setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
                        }}
                        className="text-[11px] font-bold text-[#007AFF] hover:underline cursor-pointer"
                      >
                        Set as Base
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB: CATEGORIES (Exact match of Image 3)                     */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Categories
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Organize your expenses and incomes by category
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenCategoryManager}
                className="px-4 py-2 rounded-xl bg-[#00875A] hover:bg-[#00704A] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXPENSE_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#252528] border border-black/[0.05] dark:border-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: cat.color }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-xs"
                    >
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{cat.name}</h4>
                      <span className="text-[10px] text-slate-400">Expense category</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB: TEMPLATES (Exact match of Image 4)                      */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'templates' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Templates
              </h2>

              <button
                type="button"
                onClick={() => setShowAddTemplate(true)}
                className="px-4 py-2 rounded-xl bg-[#00875A] hover:bg-[#00704A] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add</span>
              </button>
            </div>

            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Your templates</h3>

            {/* Template Header Table */}
            <div className="w-full border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>CATEGORY</span>
                <span>NAME</span>
                <span>AMOUNT</span>
                <span>ACCOUNT NAME</span>
              </div>
            </div>

            {/* If Templates Empty: Match Image 4 Empty State */}
            {templates.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <h4 className="text-xl font-bold text-slate-600 dark:text-slate-300">Create Templates</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
                  Using templates, you can predefine your repetitive transactions and add them quickly.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddTemplate(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#00875A] hover:bg-[#00704A] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {templates.map((tpl) => (
                  <div key={tpl.id} className="grid grid-cols-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-200 items-center">
                    <span className="capitalize">{tpl.category}</span>
                    <span className="font-bold">{tpl.name}</span>
                    <span>{currentCurrency.code} {Number(tpl.amount).toFixed(2)}</span>
                    <span>{accounts.find((a) => a.id === tpl.accountId)?.name || 'Account'}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Inline Add Template Form */}
            {showAddTemplate && (
              <form
                onSubmit={handleCreateTemplate}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#252528] border border-black/[0.08] dark:border-white/[0.08] space-y-4 animate-fade-in"
              >
                <h4 className="text-sm font-bold">New Transaction Template</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Template Name (e.g. Daily Lunch)"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1C1C1E] text-xs font-medium"
                  />
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Amount (e.g. 250)"
                    value={newTemplate.amount}
                    onChange={(e) => setNewTemplate({ ...newTemplate, amount: e.target.value })}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1C1C1E] text-xs font-medium"
                  />
                  <select
                    value={newTemplate.accountId}
                    onChange={(e) => setNewTemplate({ ...newTemplate, accountId: e.target.value })}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1C1C1E] text-xs font-medium"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTemplate(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#00875A] text-white text-xs font-bold shadow-xs hover:bg-[#00704A]"
                  >
                    Save Template
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB: LABELS (Exact match of Image 5)                         */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'labels' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Labels
              </h2>

              <button
                type="button"
                onClick={() => setShowAddLabel(true)}
                className="px-4 py-2 rounded-xl bg-[#00875A] hover:bg-[#00704A] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add</span>
              </button>
            </div>

            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Your labels</h3>

            {/* If Labels Empty: Match Image 5 Empty State */}
            {labels.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <h4 className="text-xl font-bold text-slate-600 dark:text-slate-300">Create Labels</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
                  Labels help you understand and sort your transactions.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddLabel(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#00875A] hover:bg-[#00704A] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5 pt-2">
                {labels.map((lbl) => (
                  <span
                    key={lbl.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
                  >
                    <Tag className="w-3.5 h-3.5 text-[#00875A]" />
                    {lbl.name}
                  </span>
                ))}
              </div>
            )}

            {/* Add Label Form */}
            {showAddLabel && (
              <form
                onSubmit={handleCreateLabel}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#252528] border border-black/[0.08] dark:border-white/[0.08] space-y-3 animate-fade-in"
              >
                <h4 className="text-sm font-bold">New Label</h4>
                <div className="flex gap-2.5 max-w-md">
                  <input
                    type="text"
                    required
                    placeholder="Label name (e.g. Work, Vacation, Medical)"
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1C1C1E] text-xs font-medium"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#00875A] text-white text-xs font-bold shadow-xs hover:bg-[#00704A]"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddLabel(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB: AUTOMATIC RULES                                         */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'rules' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
              Automatic Rules
            </h2>
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <GitFork className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
              <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">Smart Auto-Categorization</h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Transactions with matching merchant names will automatically be assigned to your specified category.
              </p>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB: GENERAL (Screenshot 5)                                  */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'general' && (
          <div className="space-y-6 animate-fade-in max-w-4xl text-slate-800 dark:text-slate-100">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
              Settings
            </h2>

            {/* Profile */}
            <div className="pb-6 border-b border-slate-100 dark:border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Profile</h3>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div
                  onClick={() => avatarInputRef.current?.click()}
                  className="w-12 h-12 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-white flex-shrink-0 cursor-pointer overflow-hidden border border-black/10 dark:border-white/10"
                >
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        if (getInitialsAvatar) {
                          e.currentTarget.src = getInitialsAvatar(currentUser?.name || 'User');
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                  )}
                  <input
                    type="file"
                    ref={avatarInputRef}
                    accept="image/*"
                    onChange={handleAvatarFile}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">First name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#2C2C2E] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00875A]/30 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Last name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#2C2C2E] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00875A]/30 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">E-mail</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="E-mail"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#2C2C2E] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00875A]/30 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updateProfile({ name: `${firstName} ${lastName}`.trim(), email: userEmail });
                    setStatusMsg({ text: 'Profile updated!', type: 'success' });
                    setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
                  }}
                  className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer flex-shrink-0 sm:mt-5"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Website language */}
            <div className="pb-6 border-b border-slate-100 dark:border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Website language</h3>
              <div className="relative max-w-xs">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#2C2C2E] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00875A]/30 text-slate-800 dark:text-slate-100 appearance-none pl-9 pr-8 cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Bengali">Bengali</option>
                </select>
                <Languages className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Default interval on Dashboard */}
            <div className="pb-6 border-b border-slate-100 dark:border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Default interval on Dashboard</h3>
              <div className="relative max-w-xs">
                <select
                  value={defaultInterval}
                  onChange={(e) => setDefaultInterval(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#2C2C2E] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00875A]/30 text-slate-800 dark:text-slate-100 appearance-none pr-8 cursor-pointer"
                >
                  <option value="This month">This month</option>
                  <option value="This year">This year</option>
                  <option value="Last 30 days">Last 30 days</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Number format */}
            <div className="pb-6 border-b border-slate-100 dark:border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Number format</h3>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => setHideDecimals(!hideDecimals)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    hideDecimals ? 'bg-[#00875A]' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                      hideDecimals ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Hide decimals within amounts
                </span>
              </label>
            </div>

            {/* Enable auto-logout */}
            <div className="pb-6 border-b border-slate-100 dark:border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Enable auto-logout</h3>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => setAutoLogout(!autoLogout)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    autoLogout ? 'bg-[#00875A]' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                      autoLogout ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Automatically log out after a period of inactivity (5 minutes)
                </span>
              </label>
            </div>

            {/* Remove local data */}
            <div className="space-y-2 pt-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Remove local data</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log out and remove all cached data from this computer.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Log out and remove all cached data from this computer?')) {
                    clearToFreshDashboard();
                    setStatusMsg({ text: 'All local cached data cleared!', type: 'success' });
                    setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
                  }
                }}
                className="px-5 py-2.5 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Remove local data
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB: REST API (Screenshot 4)                                 */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'api' && (
          <div className="space-y-6 animate-fade-in max-w-4xl text-slate-800 dark:text-slate-100">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
              REST API - Advanced Data Access
            </h2>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create new token</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Create a personal API token (JWT) that you can use to authenticate third-party applications.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Keep this token private — anyone with access can act on your behalf.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You can revoke it at any time.
              </p>

              <div className="pt-1">
                <a
                  href="https://saifullatanim.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00875A] hover:underline"
                >
                  <span>Wallet API - Quick Reference Guide</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const token = 'wtk_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
                    setApiTokens([...apiTokens, { id: Date.now(), token, createdAt: new Date().toLocaleDateString() }]);
                    setStatusMsg({ text: 'New API token generated!', type: 'success' });
                    setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
                  }}
                  className="px-6 py-2 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Create</span>
                </button>
              </div>

              {apiTokens.length > 0 && (
                <div className="pt-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Tokens</h4>
                  {apiTokens.map((t) => (
                    <div key={t.id} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-xs font-mono">
                      <span>{t.token}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(t.token, 'token')}
                        className="text-[#007AFF] hover:underline font-sans font-bold"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB: MCP SERVER (Screenshot 3)                               */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'mcp' && (
          <div className="space-y-6 animate-fade-in max-w-4xl text-slate-800 dark:text-slate-100">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
              MCP Server
            </h2>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Connect Wallet MCP using the method that fits your application and workflow. Supported integrations may use either <strong className="text-slate-900 dark:text-white font-bold">OAuth</strong> or an <strong className="text-slate-900 dark:text-white font-bold">MCP token</strong>, depending on the client and setup path.
            </p>

            {/* URL box */}
            <div className="flex items-center gap-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#252528] text-xs">
              <span className="text-slate-500">URL address of the MCP server:</span>
              <code className="font-mono font-semibold text-slate-800 dark:text-slate-200 flex-1 truncate">
                https://mcp.finora.app
              </code>
              <button
                type="button"
                onClick={() => copyToClipboard('https://mcp.finora.app', 'mcp_url')}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                title="Copy URL"
              >
                {copiedField === 'mcp_url' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Blue info banner */}
            <div className="p-4 rounded-2xl bg-[#EBF5FB] dark:bg-[#152332] border border-[#BCE2F5] dark:border-[#1F3D5C] text-slate-700 dark:text-slate-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#007AFF] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">About authentication methods</h4>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Wallet MCP supports more than one connection model. Some applications connect through <strong className="font-bold">OAuth</strong>, while others may use a user-generated <strong className="font-bold">MCP token</strong>. In some cases, the same application may support both options depending on how the integration is configured.
                </p>
              </div>
            </div>

            {/* How to integrate */}
            <div className="pt-2 space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">How to integrate Wallet MCP?</h3>

              {/* Tabs */}
              <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
                {['ChatGPT', 'Claude Web (claude.ai)', 'Antigravity IDE'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setMcpTab(tab)}
                    className={`pb-2.5 transition-all cursor-pointer ${
                      mcpTab === tab
                        ? 'border-b-2 border-slate-900 dark:border-white text-slate-900 dark:text-white'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Integration card */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#202022] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{mcpTab}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    Apps · OAuth supported
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {mcpTab} can connect to Wallet MCP through its Apps flow, typically using <strong className="font-bold">OAuth authentication</strong>.
                </p>
                <div className="pt-2">
                  <a
                    href="https://saifullatanim.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span>View {mcpTab} Setup Guide</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB: BILLING (Screenshot 2 + User Request: billing Lifetime) */}
        {/* ------------------------------------------------------------ */}
        {/* TAB: BILLING / CHOOSE-PLAN (Matching User Screenshot)       */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'billing' && (
          <div className="space-y-6 animate-fade-in max-w-5xl text-slate-800 dark:text-slate-100">
            {billingSubView === 'choose-plan' ? (
              <div className="space-y-4">
                {/* Back button matching user screenshot */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setBillingSubView('overview')}
                    className="w-8 h-8 rounded-lg bg-white dark:bg-[#252528] border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                    title="Back to billing overview"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setBillingSubView('overview')}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    View Receipts & Overview
                  </button>
                </div>

                {/* Main White Card Container matching user screenshot */}
                <div className="bg-white dark:bg-[#252528] rounded-[24px] border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-xs">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
                    {/* Left Column: Wallet Premium */}
                    <div className="lg:col-span-5 space-y-6">
                      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Wallet Premium
                      </h2>

                      <ul className="space-y-3.5">
                        {[
                          'Unlimited Accounts',
                          'Unlimited Bank Account syncs',
                          'Multi-user collaboration',
                          'Advanced Charts and Reports',
                          'Tools and Widgets',
                          'Investments',
                          'REST API',
                          'MCP Server',
                        ].map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3.5">
                            <Star className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B] flex-shrink-0" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right Column: Choose your plan */}
                    <div className="lg:col-span-7 space-y-6">
                      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Choose your plan
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* MONTHLY PLAN */}
                        <div className="rounded-2xl bg-white dark:bg-[#1E1E20] border border-slate-200/90 dark:border-slate-800 p-6 flex flex-col items-center justify-between text-center min-h-[270px] shadow-xs hover:border-slate-300 transition-all">
                          <div className="w-full pt-6">
                            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 block mb-3">
                              MONTHLY PLAN
                            </span>
                            <div className="text-3xl lg:text-4xl font-extrabold text-[#007AFF] tracking-tight mb-2">
                              $6.79
                            </div>
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                              Billed monthly
                            </span>
                          </div>

                          <button
                            type="button"
                            disabled
                            className="w-full mt-4 py-2 px-3 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-400 cursor-not-allowed opacity-60"
                          >
                            Switch Plan
                          </button>
                        </div>

                        {/* YEARLY PLAN */}
                        <div className="rounded-2xl bg-white dark:bg-[#1E1E20] border border-slate-200/90 dark:border-slate-800 p-6 flex flex-col items-center justify-between text-center min-h-[270px] shadow-xs relative hover:border-slate-300 transition-all">
                          {/* SAVE 58% Badge */}
                          <div className="w-full flex flex-col items-center">
                            <span className="px-3.5 py-0.5 rounded-full bg-[#00875A] text-white text-[10px] font-extrabold tracking-wider uppercase mb-3 shadow-xs">
                              SAVE 58%
                            </span>
                            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 block mb-3">
                              YEARLY PLAN
                            </span>
                            <div className="text-3xl lg:text-4xl font-extrabold text-[#007AFF] tracking-tight mb-2">
                              $33.99
                            </div>
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                              Billed yearly
                            </span>
                          </div>

                          <button
                            type="button"
                            disabled
                            className="w-full mt-4 py-2 px-3 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-400 cursor-not-allowed opacity-60"
                          >
                            Switch Plan
                          </button>
                        </div>

                        {/* LIFETIME PREMIUM (User's Active Plan) */}
                        <div className="rounded-2xl bg-white dark:bg-[#1E1E20] border-2 border-[#00875A] p-6 flex flex-col items-center justify-between text-center min-h-[270px] shadow-sm relative ring-2 ring-[#00875A]/20">
                          <div className="w-full flex flex-col items-center">
                            <span className="px-3.5 py-0.5 rounded-full bg-[#00875A] text-white text-[10px] font-extrabold tracking-wider uppercase mb-3 shadow-xs">
                              ACTIVE PLAN
                            </span>
                            <span className="text-[11px] font-extrabold tracking-wider uppercase text-slate-900 dark:text-white block mb-3">
                              LIFETIME PREMIUM
                            </span>
                            <div className="text-3xl lg:text-4xl font-extrabold text-[#007AFF] tracking-tight mb-2">
                              $33.99
                            </div>
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                              Pay once
                            </span>
                          </div>

                          <div className="w-full mt-4 py-2 px-3 rounded-full bg-[#00875A] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Lifetime Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Billing
                  </h2>
                  <button
                    type="button"
                    onClick={() => setBillingSubView('choose-plan')}
                    className="px-4 py-1.5 rounded-full bg-[#00875A] text-white text-xs font-bold shadow-xs hover:bg-[#007048] transition-colors cursor-pointer"
                  >
                    Choose Plan
                  </button>
                </div>

                {/* Your Plan */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Your Plan</h3>
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#252528] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center">
                        <Star className="w-5 h-5 fill-[#007AFF] text-[#007AFF]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Lifetime plan</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Full access to all premium features forever</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBillingSubView('choose-plan')}
                        className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        Change Plan
                      </button>
                      <span className="px-4 py-1.5 rounded-full bg-[#00875A] text-white text-xs font-bold shadow-xs">
                        Lifetime Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Receipts */}
                <div className="pt-4 space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Receipts</h3>
                  <p className="text-xs text-slate-400">There are no data yet</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB: PERSONAL DATA & PRIVACY (Screenshot 1 - No review docs) */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'privacy' && (
          <div className="space-y-6 animate-fade-in max-w-4xl text-slate-800 dark:text-slate-100">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
              Personal data & privacy
            </h2>

            {/* (Note: User explicitly requested: "Documents to review ta add korba na" -> Omitted!) */}

            {/* Emails & messages */}
            <div className="pb-6 border-b border-slate-100 dark:border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Emails & messages</h3>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    emailNotifications ? 'bg-[#00875A]' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Emails & messages
                </span>
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                You can turn off all promotional and commercial content using the button above. This will not affect service messages like password change alerts.
              </p>
            </div>

            {/* Data portability */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Data portability</h3>
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  You have right to change your personal data by editing your profile information, change your transaction data for cash accounts by editing them. You can delete your transactions from linked accounts by deleting the whole set of transactions - this data is not editable.
                </p>
                <p>
                  You have right to be informed about the data we hold about you and you can transfer your data and you have right to be forgotten and delete all your data - all of which you can do by sending us an email to{' '}
                  <a href="mailto:saifullatanim.cse@gmail.com" className="text-[#007AFF] hover:underline font-semibold">
                    saifullatanim.cse@gmail.com
                  </a>.
                </p>
                <p>
                  In case you have any specific issues or request, please contact our Data Protection Officer on email:{' '}
                  <a href="mailto:saifullatanim.cse@gmail.com" className="text-[#007AFF] hover:underline font-semibold">
                    saifullatanim.cse@gmail.com
                  </a>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete all transaction data?')) {
                      clearToFreshDashboard();
                      setStatusMsg({ text: 'All transaction data deleted.', type: 'success' });
                      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
                    }
                  }}
                  className="px-6 py-2 rounded-full border border-[#FF3B30] text-[#FF3B30] hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-all cursor-pointer active:scale-95"
                >
                  Delete all user data
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete profile and all data completely? This cannot be undone.')) {
                      clearToFreshDashboard();
                      setStatusMsg({ text: 'Profile and all data deleted.', type: 'success' });
                      setTimeout(() => setStatusMsg({ text: '', type: '' }), 3000);
                    }
                  }}
                  className="px-6 py-2 rounded-full bg-[#FF3B30] hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Delete profile and all data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SettingsView;
