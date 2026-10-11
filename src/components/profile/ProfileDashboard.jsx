import React, { useState, useRef } from 'react';
import {
  User,
  Camera,
  Upload,
  Trash2,
  Check,
  ShieldCheck,
  Wallet,
  Receipt,
  Sparkles,
  Globe,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { CURRENCIES } from '../../utils/constants';

export const ProfileDashboard = ({ onOpenSecurity }) => {
  const { currentUser, updateProfile, updateAvatar, getInitialsAvatar, isGuest } = useAuth();
  const {
    accounts,
    transactions,
    goals,
    budgets,
    currencyCode,
    setCurrencyCode,
    clearToFreshDashboard,
    loadSampleDemoData,
    formatMoney,
    totalBalance,
  } = useFinance();

  const fileInputRef = useRef(null);

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [location, setLocation] = useState(currentUser?.location || 'Dhaka, Bangladesh');
  const [bio, setBio] = useState(currentUser?.bio || 'Personal Wealth & Expense Tracker');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [cleanAlert, setCleanAlert] = useState('');

  // Handle uploading any real image file from PC / Mobile
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      updateAvatar(dataUrl);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleUseInitials = () => {
    const initialsUrl = getInitialsAvatar(name || currentUser?.name || 'T');
    updateAvatar(initialsUrl);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      location: location.trim(),
      bio: bio.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCleanStart = () => {
    if (
      confirm(
        'Are you sure you want to clean your dashboard to a fresh 100% clean state? All demo transactions and records will be cleared to 0.'
      )
    ) {
      clearToFreshDashboard();
      setCleanAlert('Dashboard cleaned! You now have a fresh clean start with 0 transactions.');
      setTimeout(() => setCleanAlert(''), 4000);
    }
  };

  const handleLoadDemo = () => {
    if (confirm('Load pre-filled sample Bangladeshi demo accounts & transactions?')) {
      loadSampleDemoData();
      setCleanAlert('Sample demo data loaded successfully!');
      setTimeout(() => setCleanAlert(''), 4000);
    }
  };

  return (
    <div className="w-full space-y-6 pb-12 animate-fade-in">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Profile Dashboard
        </h2>
        <p className="text-xs text-slate-400">
          Manage your personal identity, avatar photo, and account details
        </p>
      </div>

      {cleanAlert && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 animate-fade-in">
          {cleanAlert}
        </div>
      )}

      {/* 1. Profile Card & Custom Photo Upload */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with Camera upload overlay */}
          <div className="relative group flex-shrink-0">
            <img
              src={currentUser?.avatar || getInitialsAvatar(currentUser?.name)}
              alt={currentUser?.name || 'User'}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getInitialsAvatar(currentUser?.name || 'User');
              }}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl ring-2 ring-emerald-500/30"
            />

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg transition-transform active:scale-95 cursor-pointer"
              title="Upload your own picture"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Details & Photo Actions */}
          <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
                  {currentUser?.name || 'Tanim'}
                </h3>
                {currentUser?.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 w-fit mx-auto sm:mx-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified User
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{currentUser?.email}</p>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 italic max-w-md">
              "{bio}"
            </p>

            {/* Photo Action Buttons */}
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Photo</span>
              </button>

              <button
                type="button"
                onClick={handleUseInitials}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Clean Initials Avatar
              </button>

              <button
                type="button"
                onClick={onOpenSecurity}
                className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 hover:bg-emerald-100 text-[#00875A] dark:text-[#34D399] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Security Shield</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Lifetime Account Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Active Wallets
          </span>
          <p className="text-xl font-black text-slate-900 dark:text-white font-mono">
            {accounts.length}
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Records
          </span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {transactions.length}
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Active Currency
          </span>
          <p className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {currencyCode}
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shadow-card">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Net Assets
          </span>
          <p className="text-xl font-black text-slate-900 dark:text-white font-mono truncate">
            {formatMoney(totalBalance)}
          </p>
        </div>
      </div>

      {/* 3. Editable Profile Information Form */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Personal Information
        </h4>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Registered Email
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-400 text-xs sm:text-sm cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+880 1XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                City / Location
              </label>
              <input
                type="text"
                placeholder="Dhaka, Bangladesh"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Personal Bio / Note
            </label>
            <input
              type="text"
              placeholder="A short bio or personal note..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fade-in">
                Profile updated successfully!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* 4. Fresh Dashboard / Clean State Controls */}
      <div className="p-6 rounded-3xl glass-panel bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Dashboard Data Management
          </h4>
          <p className="text-xs text-slate-400">
            Start with a fresh clean empty wallet or reload demo records anytime.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleCleanStart}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Start Fresh (Clean to 0 Records)</span>
          </button>

          <button
            type="button"
            onClick={handleLoadDemo}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
            <span>Load Sample Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
