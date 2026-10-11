import React, { useState, useRef } from 'react';
import {
  RotateCw,
  Check,
  ChevronsUpDown,
  Upload,
  Lock,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import {
  RealisticWallet,
  RealisticCoins,
  RealisticBank,
  RealisticMobile,
} from '../common/RealisticIcons';
import LearnImportModal from './LearnImportModal';

export const ImportsView = ({ onOpenAddAccount, setActiveTab }) => {
  const { accounts, addTransaction, formatMoney, currentCurrency } = useFinance();

  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts[0]?.id || ''
  );
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [isLearnModalOpen, setIsLearnModalOpen] = useState(false);
  const [importHistory, setImportHistory] = useState([]);
  const [importStatus, setImportStatus] = useState(null);

  const fileInputRef = useRef(null);

  // Active selected account object
  const selectedAccount =
    accounts.find((a) => a.id === selectedAccountId) || accounts[0] || null;

  // Handle file import
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        let count = 0;

        if (file.name.endsWith('.json')) {
          const json = JSON.parse(text);
          const txs = Array.isArray(json) ? json : json.transactions || [];
          txs.forEach((t) => {
            addTransaction({
              ...t,
              accountId: selectedAccount?.id || accounts[0]?.id,
            });
            count++;
          });
        } else {
          // Parse CSV
          const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
          const headers = lines[0]?.toLowerCase();
          const dataRows = lines.slice(1);

          dataRows.forEach((line) => {
            const cols = line.split(',');
            if (cols.length >= 2) {
              const dateVal = cols[0]?.trim() || new Date().toISOString().split('T')[0];
              const amtVal = parseFloat(cols[1]?.replace(/[^0-9.-]/g, '')) || 100;
              const payeeVal = cols[2]?.trim().replace(/^"|"$/g, '') || 'Imported Transaction';

              addTransaction({
                date: dateVal,
                amount: Math.abs(amtVal),
                type: amtVal < 0 ? 'expense' : 'income',
                category: amtVal < 0 ? 'other_expense' : 'other_income',
                payee: payeeVal,
                accountId: selectedAccount?.id || accounts[0]?.id,
                status: 'cleared',
              });
              count++;
            }
          });
        }

        const newImportItem = {
          id: 'imp-' + Date.now(),
          filename: file.name,
          date: new Date().toLocaleString(),
          accountName: selectedAccount?.name || 'General Account',
          count: count > 0 ? count : 1,
        };

        setImportHistory((prev) => [newImportItem, ...prev]);
        setImportStatus({
          type: 'success',
          message: `Successfully imported ${newImportItem.count} records from ${file.name}!`,
        });
      } catch (err) {
        console.error('Import error', err);
        setImportStatus({
          type: 'error',
          message: 'Failed to parse file. Make sure it is in valid CSV or JSON format.',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const getAccountIcon = (acc) => {
    if (!acc) return RealisticWallet;
    if (acc.type === 'cash') return RealisticCoins;
    if (acc.type === 'bank') return RealisticBank;
    if (acc.type === 'mobile_banking') return RealisticMobile;
    return RealisticWallet;
  };

  return (
    <div className="w-full pb-12 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start gap-6 lg:gap-8">
        {/* ============================================================= */}
        {/* LEFT SIDEBAR: Exact Replica of Image 1 & Image 2              */}
        {/* ============================================================= */}
        <div className="w-full md:w-64 lg:w-72 flex-shrink-0 bg-white dark:bg-[#1E1E20] rounded-2xl sm:rounded-3xl p-6 border border-slate-100 dark:border-white/[0.06] shadow-xs flex flex-col justify-between min-h-[520px]">
          <div>
            {/* Title */}
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight border-b border-slate-100 dark:border-white/[0.06] pb-3 mb-4">
              Imports
            </h2>

            {/* Label */}
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">
              Account
            </label>

            {/* Account Selector Dropdown (Shown expanded in Image 2!) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-slate-900 dark:text-white text-xs font-semibold hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  {selectedAccount ? (
                    <>
                      <div
                        style={{ backgroundColor: selectedAccount.color || '#E2136E' }}
                        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-2xs"
                      >
                        {React.createElement(getAccountIcon(selectedAccount), {
                          className: 'w-3.5 h-3.5 text-white',
                        })}
                      </div>
                      <span className="truncate">{selectedAccount.name}</span>
                    </>
                  ) : (
                    <span>Select an account</span>
                  )}
                </div>
                <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-1" />
              </button>

              {/* Dropdown Menu (Exact Replica of Image 2) */}
              {accountDropdownOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 top-11 w-full rounded-2xl bg-white dark:bg-[#1E1E20] border border-slate-200 dark:border-white/10 shadow-xl py-1.5 z-30 animate-fade-in max-h-60 overflow-y-auto"
                >
                  {accounts.map((acc) => {
                    const isSelected = (selectedAccount?.id || '') === acc.id;
                    const AccIcon = getAccountIcon(acc);
                    const isLoan =
                      acc.name.toLowerCase().includes('loan') ||
                      acc.name.toLowerCase().includes('debt') ||
                      Number(acc.balance) < 0;

                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          setSelectedAccountId(acc.id);
                          setAccountDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-slate-50 dark:bg-white/[0.05] text-slate-900 dark:text-white'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div
                            style={{ backgroundColor: acc.color || '#E2136E' }}
                            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-white relative shadow-2xs"
                          >
                            <AccIcon className="w-3.5 h-3.5 text-white" />
                            {isLoan && (
                              <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-slate-700 text-white flex items-center justify-center text-[7px]">
                                <Lock className="w-2 h-2" />
                              </span>
                            )}
                          </div>
                          <span className="truncate">{acc.name}</span>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 stroke-[2.5] text-slate-800 dark:text-white flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}

                  {/* Add New Account shortcut inside dropdown */}
                  <button
                    type="button"
                    onClick={() => {
                      setAccountDropdownOpen(false);
                      if (onOpenAddAccount) onOpenAddAccount();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-[#00875A] dark:text-[#34C759] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-t border-slate-100 dark:border-slate-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>+ Add New Account</span>
                  </button>
                </div>
              )}
            </div>

            {/* File Upload Box (Dashed box from Image 1) */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-white/[0.02] rounded-xl p-5 text-center mt-5 transition-colors hover:border-[#00875A]">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xls, .xlsx, .json"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-4 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
              >
                Choose file
              </button>

              <span className="block text-[11px] text-slate-400 mt-2">or</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                drag and drop it here
              </p>
            </div>
          </div>

          {/* Bottom Refresh List Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => {
                setImportStatus({
                  type: 'success',
                  message: 'Imports list refreshed.',
                });
                setTimeout(() => setImportStatus(null), 2500);
              }}
              className="w-full py-2 px-4 rounded-xl border border-emerald-500 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Refresh list</span>
            </button>
          </div>
        </div>

        {/* ============================================================= */}
        {/* RIGHT MAIN VIEW: Exact Replica of Image 1                     */}
        {/* ============================================================= */}
        <div className="flex-1 w-full bg-white dark:bg-[#1E1E20] rounded-2xl sm:rounded-3xl p-8 sm:p-14 border border-slate-100 dark:border-white/[0.06] shadow-xs min-h-[520px] flex flex-col items-center justify-center text-center relative">
          {importStatus && (
            <div
              className={`absolute top-6 left-6 right-6 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                importStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
              }`}
            >
              {importStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}

          {importHistory.length === 0 ? (
            /* EXACT Empty State from Image 1 */
            <div className="flex flex-col items-center justify-center max-w-md select-none animate-fade-in">
              {/* Overlapping Document Icons: Grey CSV + Green XLS */}
              <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
                {/* Back / Left: Grey CSV Document */}
                <div className="absolute -left-1 top-2 w-14 h-16 rounded-xl bg-slate-200/90 dark:bg-slate-700 shadow-md flex flex-col items-center justify-center rotate-[-8deg] border border-white/60 dark:border-white/10">
                  <span className="text-[11px] font-black tracking-tight text-slate-600 dark:text-slate-200">
                    CSV
                  </span>
                </div>

                {/* Front / Right: Green XLS Spreadsheet Document */}
                <div className="absolute right-0 top-0 w-15 h-17 rounded-xl bg-[#34C759] shadow-lg flex flex-col items-center justify-center rotate-[6deg] text-white border border-white/40">
                  <div className="grid grid-cols-2 gap-0.5 mb-1 opacity-90">
                    <div className="w-2.5 h-1.5 bg-white rounded-2xs" />
                    <div className="w-2.5 h-1.5 bg-white rounded-2xs" />
                    <div className="w-2.5 h-1.5 bg-white rounded-2xs" />
                    <div className="w-2.5 h-1.5 bg-white rounded-2xs" />
                  </div>
                  <span className="text-[11px] font-black tracking-tight">XLS</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                You have no imports yet.
              </h3>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">
                Once you import, your Records will appear here.
              </p>

              {/* Learn how to import Button */}
              <button
                type="button"
                onClick={() => setIsLearnModalOpen(true)}
                className="mt-6 px-6 py-2.5 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
              >
                Learn how to import
              </button>
            </div>
          ) : (
            /* Imported History List */
            <div className="w-full space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Imported Files ({importHistory.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setIsLearnModalOpen(true)}
                  className="text-xs font-semibold text-emerald-600 hover:underline"
                >
                  Learn how to import
                </button>
              </div>

              <div className="space-y-3">
                {importHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                        CSV
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {item.filename}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {item.date} • {item.accountName} • {item.count} records
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab && setActiveTab('transactions')}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      View in Records
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Learn How to Import Modal (Image 3) */}
      <LearnImportModal
        isOpen={isLearnModalOpen}
        onClose={() => setIsLearnModalOpen(false)}
      />
    </div>
  );
};

export default ImportsView;
