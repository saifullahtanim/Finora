import React from 'react';
import {
  X,
  Home,
  Wallet,
  List,
  LineChart,
  FileSpreadsheet,
  SlidersHorizontal,
  HelpCircle,
  Star,
  LogOut,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const MobileSideNav = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  onOpenAddTx,
  onOpenAddAccount,
  onOpenSecurity,
}) => {
  const { currentUser, isGuest, logout } = useAuth();
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    onClose();
  };

  const MENU_ITEMS = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      color: '#00A86B',
      onClick: () => handleSelectTab('dashboard'),
    },
    {
      id: 'accounts',
      label: 'Accounts',
      icon: Wallet,
      color: '#0284C7',
      onClick: () => handleSelectTab('accounts'),
    },
    {
      id: 'transactions',
      label: 'Records',
      icon: List,
      color: '#F97316',
      onClick: () => handleSelectTab('transactions'),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: LineChart,
      color: '#8B5CF6',
      onClick: () => handleSelectTab('analytics'),
    },
    {
      id: 'imports',
      label: 'Imports',
      icon: FileSpreadsheet,
      color: '#06B6D4',
      onClick: () => handleSelectTab('imports'),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-out Drawer (Matching Image 3) */}
      <div className="relative w-[82%] max-w-[320px] h-full bg-white dark:bg-[#1C1C1E] text-slate-800 dark:text-slate-100 shadow-2xl flex flex-col z-10 animate-slide-right overflow-hidden">
        {/* Top Header Banner: Solid Green (#00A86B) matching Image 3 */}
        <div className="bg-[#00A86B] text-white p-5 pt-8 pb-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Circular Avatar with white border */}
            <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/60 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-xs">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name || 'User'}
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
                <div className="w-full h-full bg-slate-300 flex items-center justify-center">
                  <User className="w-7 h-7 text-slate-500 fill-slate-500" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-bold text-white tracking-tight leading-tight truncate">
                {currentUser?.name || 'Saifulla Tanim'}
              </h3>
              <p className="text-xs text-white/80 font-medium truncate mt-0.5">
                Finora Personal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Menu Items List matching Image 3 */}
        <div className="flex-1 overflow-y-auto py-2 px-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-100/80 dark:bg-slate-800/60 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 font-medium'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    style={{ color: item.color }}
                    className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[13.5px] text-slate-800 dark:text-slate-100 truncate">
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span className="bg-[#00A86B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                    {item.badge}
                  </span>
                )}

                {item.hasDropdown && (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </button>
            );
          })}

          <div className="border-t border-slate-100 dark:border-slate-800 my-2" />

          {/* Upgrade Shortcut */}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenSecurity) onOpenSecurity();
            }}
            className="w-full flex items-center gap-4 px-5 py-2.5 text-left text-[#007AFF] hover:bg-blue-50/70 dark:hover:bg-blue-950/30 transition-colors cursor-pointer group"
          >
            <Star className="w-5 h-5 fill-[#007AFF] text-[#007AFF] group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="text-[13px] font-semibold">Upgrade</span>
          </button>

          {/* Settings Shortcut */}
          <button
            type="button"
            onClick={() => handleSelectTab('settings')}
            className="w-full flex items-center gap-4 px-5 py-2.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-5 h-5 text-slate-400 stroke-[2] flex-shrink-0" />
            <span className="text-[13px] font-medium">Settings</span>
          </button>

          {/* Help Shortcut */}
          <button
            type="button"
            onClick={() => handleSelectTab('help')}
            className="w-full flex items-center gap-4 px-5 py-2.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-5 h-5 text-slate-400 stroke-[2] flex-shrink-0" />
            <span className="text-[13px] font-medium">Help</span>
          </button>

          {/* Log Out */}
          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center gap-4 px-5 py-2.5 text-left text-[#FF4D4F] dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer group"
          >
            <LogOut className="w-5 h-5 stroke-[2] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            <span className="text-[13px] font-medium">Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSideNav;
