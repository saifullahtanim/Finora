import React, { useState, useEffect, useRef } from 'react';
import {
  Wallet,
  Plus,
  ChevronDown,
  User,
  Moon,
  Sun,
  Globe,
  LogOut,
  Settings,
  Shield,
  Menu,
  X,
  Target,
  Sparkles,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  Star,
  SlidersHorizontal,
  HelpCircle,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { useSecurity } from '../../context/SecurityContext';
import BrandLogo from '../common/BrandLogo';
import MobileSideNav from './MobileSideNav';
import logo1 from '../../assets/logo1.png';
import logo2 from '../../assets/logo2.png';

export const Navbar = ({
  onOpenAddTx,
  onOpenAddAccount,
  onOpenAuth,
  activeTab,
  setActiveTab,
  onOpenTransfer,
  onOpenBillSplitter,
  onOpenSecurity,
  onOpenSideNav,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { currencyCode, setCurrencyCode, currentCurrency } = useFinance();
  const { currentUser, isGuest, logout, getInitialsAvatar } = useAuth();
  const { isPrivacyMode, togglePrivacyMode, isPinEnabled, lockApp, securityHealth } = useSecurity();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileSideNavOpen, setMobileSideNavOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close profile dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!profileDropdownOpen) return;

    const handleClickOutside = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileDropdownOpen]);

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'accounts', label: 'Accounts' },
    { id: 'transactions', label: 'Records' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'imports', label: 'Imports' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* ------------------------------------------------------------------ */}
      {/* MOBILE HEADER: Solid Green (#00A86B) exactly matching Image 1       */}
      {/* ------------------------------------------------------------------ */}
      <div className="md:hidden bg-[#00A86B] text-white px-4 py-2.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => (onOpenSideNav ? onOpenSideNav() : setMobileSideNavOpen(true))}
              className="p-1 -ml-1 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Open 3-line navigation menu"
            >
              <Menu className="w-7 h-7 stroke-[2.2]" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-white">
              {activeTab === 'dashboard' ? 'Home' :
               activeTab === 'accounts' ? 'Accounts' :
               activeTab === 'transactions' ? 'Records' :
               activeTab === 'imports' ? 'Imports' :
               activeTab === 'analytics' ? 'Analytics' :
               activeTab === 'settings' ? 'Settings' :
               activeTab === 'help' ? 'Help' : 'Home'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer flex items-center justify-center"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-white" />}
            </button>
            <button
              type="button"
              onClick={() => (onOpenSideNav ? onOpenSideNav() : setMobileSideNavOpen(true))}
              className="w-8 h-8 rounded-full overflow-hidden bg-white/20 border border-white/40 flex items-center justify-center p-0.5 shadow-2xs cursor-pointer hover:scale-105 active:scale-95 transition-transform ml-0.5"
              title="Finora Menu"
            >
              <img
                src={logo2}
                alt="Finora"
                className="w-full h-full object-contain rounded-full"
              />
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* ------------------------------------------------------------------ */}
      {/* DESKTOP HEADER: Translucent iOS Navigation Bar                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="hidden md:block ios-glass border-b border-black/[0.05] dark:border-white/[0.08] px-5 sm:px-7 lg:px-9 py-2 sm:py-2.5 shadow-xs">
        <div className="w-full flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Segmented Navigation */}
          <div className="flex items-center gap-5 lg:gap-6">
            <div
              onClick={() => setActiveTab('dashboard')}
              className="cursor-pointer flex-shrink-0 group hover:opacity-95 transition-opacity flex items-center"
            >
              <img
                src={logo1}
                alt="Finora"
                className="h-7 sm:h-8 w-auto max-w-[155px] object-contain transition-transform group-hover:scale-105"
              />
            </div>

            <nav className="hidden md:flex items-center gap-1.5 p-0.5">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[13px] sm:text-[13.5px] transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#D1F2E0] dark:bg-emerald-950/60 text-[#00693E] dark:text-emerald-300 font-bold shadow-2xs'
                        : 'text-slate-700 dark:text-slate-300 font-semibold hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Side: Lock, Day/Night Toggle, + Record Button, Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {isPinEnabled && (
              <button
                type="button"
                onClick={lockApp}
                title="Lock Screen Immediately (Alt+L)"
                className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4 stroke-[2.2]" />
              </button>
            )}

            {/* Dark / Light Mode Toggle (Right beside Record) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-4.5 h-4.5 text-amber-400 fill-amber-400/20" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-slate-600 dark:text-slate-300" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpenAddTx && onOpenAddTx('expense')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white text-[12.5px] sm:text-[13px] font-bold shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Record</span>
            </button>

            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-full hover:bg-slate-100/80 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 transition-colors duration-150 cursor-pointer active:scale-98"
              >
                <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-white flex-shrink-0 shadow-xs overflow-hidden">
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name || 'User'}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        if (getInitialsAvatar) {
                          e.currentTarget.src = getInitialsAvatar(currentUser?.name || 'U');
                        }
                      }}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="w-4.5 h-4.5 text-white" />
                  )}
                </div>
                <span className="text-[13px] sm:text-[13.5px] font-semibold text-slate-900 dark:text-slate-100">
                  {currentUser?.name || 'Saifulla Tanim'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 sm:w-48 rounded-2xl bg-white dark:bg-[#1C1C1E] shadow-2xl p-1.5 z-50 animate-fade-in text-[13px] border border-black/[0.08] dark:border-white/[0.1] space-y-0.5">
                  {/* Top-right pointer caret */}
                  <div className="absolute -top-1.5 right-5 w-3 h-3 bg-white dark:bg-[#1C1C1E] border-t border-l border-black/[0.08] dark:border-white/[0.1] rotate-45 pointer-events-none" />

                  {/* 1. Upgrade: Soft blue hover box matching Screenshot 2 */}
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSecurity && onOpenSecurity();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-[#007AFF] font-medium hover:bg-[#E0F2FE] dark:hover:bg-blue-950/60 transition-colors duration-150 cursor-pointer group active:scale-[0.98]"
                  >
                    <Star className="w-4 h-4 fill-[#007AFF] text-[#007AFF] transition-transform duration-150 group-hover:scale-110 flex-shrink-0" />
                    <span>Upgrade</span>
                  </button>

                  {/* 2. Settings: Soft gray hover box */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('settings');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 cursor-pointer active:scale-[0.98]"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                    <span>Settings</span>
                  </button>

                  {/* 3. Help: Soft gray hover box matching Screenshot 3 */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('help');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 cursor-pointer active:scale-[0.98]"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                    <span>Help</span>
                  </button>

                  {/* 4. Log out: Soft red hover box matching Screenshot 1 */}
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-2.5 text-[#FF4D4F] dark:text-rose-400 font-medium hover:bg-[#FEE2E2] dark:hover:bg-rose-950/60 transition-colors duration-150 cursor-pointer group active:scale-[0.98]"
                  >
                    <LogOut className="w-4 h-4 text-[#FF4D4F] dark:text-rose-400 group-hover:translate-x-0.5 transition-transform duration-150 flex-shrink-0" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Mobile Side Navigation Drawer */}
      <MobileSideNav
        isOpen={mobileSideNavOpen}
        onClose={() => setMobileSideNavOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddTx={onOpenAddTx}
        onOpenAddAccount={onOpenAddAccount}
        onOpenSecurity={onOpenSecurity}
      />
    </header>
  );
};

export default Navbar;
