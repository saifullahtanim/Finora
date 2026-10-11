import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Plus,
  Menu,
  Wallet,
} from 'lucide-react';

export const MobileNav = ({ activeTab, setActiveTab, onOpenAddTx, onOpenSideNav }) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 ios-glass border-t border-black/[0.08] dark:border-white/[0.08] px-3 pt-2 pb-5 shadow-lg flex flex-col">
      <div className="flex items-center justify-around w-full">
        {/* Dashboard Tab */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-1 transition-all active:scale-90 ${
            activeTab === 'dashboard'
              ? 'text-[#007AFF] font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Transactions Tab */}
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center gap-1 p-1 transition-all active:scale-90 ${
            activeTab === 'transactions'
              ? 'text-[#007AFF] font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
          }`}
        >
          <Receipt className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight">Records</span>
        </button>

        {/* Center Floating iOS Action Squircle */}
        <button
          onClick={onOpenAddTx}
          className="w-12 h-12 -mt-5 rounded-[18px] bg-[#34C759] hover:bg-[#2EB84F] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(52,199,89,0.4)] active:scale-90 transition-all cursor-pointer"
          aria-label="Add transaction"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Wallets Tab */}
        <button
          onClick={() => setActiveTab('accounts')}
          className={`flex flex-col items-center gap-1 p-1 transition-all active:scale-90 ${
            activeTab === 'accounts'
              ? 'text-[#007AFF] font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium'
          }`}
        >
          <Wallet className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight">Wallets</span>
        </button>

        {/* Site Nav Menu Button */}
        <button
          onClick={onOpenSideNav}
          className="flex flex-col items-center gap-1 p-1 transition-all active:scale-90 text-slate-400 hover:text-[#007AFF] font-medium"
          title="Open Full Site Navigation"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight">Menu</span>
        </button>
      </div>

      {/* iPhone Home Indicator Line */}
      <div className="w-32 h-1 bg-black/20 dark:bg-white/25 rounded-full mx-auto mt-2 pointer-events-none select-none" />
    </div>
  );
};

export default MobileNav;
