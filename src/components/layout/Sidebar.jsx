import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  PieChart,
  LineChart,
  CalendarClock,
  Target,
  Scale,
  User,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import BrandLogo from '../common/BrandLogo';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'accounts', label: 'Wallets & Accounts', icon: Wallet },
  { id: 'analytics', label: 'Reports & Calendar', icon: LineChart },
  { id: 'debts', label: 'Loans & Debts (EMI)', icon: Scale },
  { id: 'planned', label: 'Subscriptions & Bills', icon: CalendarClock },
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'settings', label: 'Settings & Backup', icon: Settings },
];

export const Sidebar = ({ activeTab, setActiveTab, onOpenAuth, onOpenBillSplitter }) => {
  const { currentUser, logout, isAuthenticated, isGuest, getInitialsAvatar } = useAuth();
  const { totalBalance, formatMoney, accounts, netWorth } = useFinance();

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-white/95 dark:bg-slate-900/95 border-r border-slate-200/80 dark:border-slate-800/80 p-5 select-none z-20 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="px-2 py-3 mb-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
        <BrandLogo size="lg" />
      </div>

      {/* Net Worth Quick Card */}
      <div className="mx-1 mb-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-500/5 border border-emerald-500/20 dark:border-emerald-500/10">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-semibold uppercase tracking-wider text-[11px]">Real Net Worth</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
            <TrendingUp className="w-3 h-3" />
            {accounts.length} Wallets
          </span>
        </div>
        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {formatMoney(netWorth)}
        </p>
        <span className="text-[10px] text-slate-400 block mt-0.5">
          Assets: {formatMoney(totalBalance)}
        </span>
      </div>

      {/* Bill Splitter Quick Tool Button */}
      <button
        type="button"
        onClick={onOpenBillSplitter}
        className="mx-1 mb-3 py-2 px-3 rounded-xl border border-dashed border-emerald-500/40 hover:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-500" />
          <span>Group Bill Splitter</span>
        </div>
        <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-mono">
          Calc
        </span>
      </button>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Main Menu
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
            </button>
          );
        })}
      </nav>

      {/* User Session Footer (Clickable to open profile) */}
      <div className="pt-3 mt-auto border-t border-slate-200/80 dark:border-slate-800/80">
        {isAuthenticated && !isGuest ? (
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer hover:opacity-80 transition-opacity flex-1"
            >
              <img
                src={currentUser?.avatar || getInitialsAvatar(currentUser?.name)}
                alt={currentUser?.name || 'User'}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  if (getInitialsAvatar) {
                    e.currentTarget.src = getInitialsAvatar(currentUser?.name || 'User');
                  }
                }}
                className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                  {currentUser?.name}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                  View Profile →
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
              <span>Verify & Sign Up</span>
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Demo Preview Mode Active
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
