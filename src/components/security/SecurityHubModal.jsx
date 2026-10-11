import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useSecurity } from '../../context/SecurityContext';
import { useFinance } from '../../context/FinanceContext';

export const SecurityHubModal = ({ isOpen, onClose }) => {
  const {
    isPrivacyMode,
    togglePrivacyMode,
  } = useSecurity();

  const { exportDataJSON, importDataJSON } = useFinance();

  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const restoreFileRef = useRef(null);

  if (!isOpen) return null;

  // Handle restore file upload
  const handleFileRestore = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const success = importDataJSON(parsed);
        if (success) {
          setStatusMsg({ text: 'Data restored successfully!', type: 'success' });
        } else {
          setStatusMsg({ text: 'Invalid backup file format.', type: 'error' });
        }
      } catch (err) {
        setStatusMsg({ text: 'Failed to read file. Must be a valid JSON backup.', type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in font-sans">
      {/* Modal Dialog Card - Perfectly Centered with Generous Breathing Room */}
      <div className="w-full max-w-[560px] my-auto bg-[#F8F9FA] dark:bg-[#1C1C1E] rounded-3xl sm:rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-slate-200/90 dark:border-white/[0.1] overflow-hidden text-slate-900 dark:text-white flex flex-col animate-scale-up">
        {/* Apple iOS Modal Header */}
        <div className="px-6 py-5 bg-white dark:bg-[#252528] border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-[14px] bg-[#007AFF] text-white flex items-center justify-center shadow-md shadow-[#007AFF]/25 flex-shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Security & Privacy
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Manage privacy shield and data backups
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-sm font-bold text-[#007AFF] hover:text-blue-700 px-3.5 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 max-h-[80vh]">
          {/* Status Message Notification Pill */}
          {statusMsg.text && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-fade-in ${
                statusMsg.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-[#FF3B30] border border-rose-200/70 dark:border-rose-900/50'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00875A] dark:text-[#34C759] border border-emerald-200/70 dark:border-emerald-900/50'
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

          {/* Group 1: Privacy Protection */}
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 px-1 pb-2 block">
              PRIVACY
            </span>
            <div className="bg-white dark:bg-[#252528] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-[14px] bg-sky-50 dark:bg-sky-950/40 text-[#007AFF] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  {isPrivacyMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    Mask Balances
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-400 font-medium truncate mt-0.5">
                    {isPrivacyMode ? 'Amounts are hidden with ••••' : 'Visible everywhere'}
                  </p>
                </div>
              </div>

              {/* iOS Toggle Switch */}
              <button
                type="button"
                onClick={togglePrivacyMode}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer flex-shrink-0 ml-3 ${
                  isPrivacyMode ? 'bg-[#34C759]' : 'bg-slate-300 dark:bg-slate-600'
                }`}
                aria-label="Toggle Mask Balances"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-xs ${
                    isPrivacyMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Group 2: Data Vault & Backup */}
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 px-1 pb-2 block">
              DATA & BACKUP
            </span>
            <div className="bg-white dark:bg-[#252528] rounded-2xl sm:rounded-3xl shadow-xs border border-slate-200/70 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              {/* Row 1: Export */}
              <div className="p-5 sm:p-6 flex items-center justify-between">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-[14px] bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Download className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      Export Backup
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-400 font-medium truncate mt-0.5">
                      Save accounts and records as JSON
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={exportDataJSON}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer flex-shrink-0 ml-3"
                >
                  Download
                </button>
              </div>

              {/* Row 2: Restore */}
              <div className="p-5 sm:p-6 flex items-center justify-between">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-[14px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center flex-shrink-0 shadow-2xs">
                    <Upload className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      Restore Data
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-400 font-medium truncate mt-0.5">
                      Load a previous JSON backup file
                    </p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={restoreFileRef}
                  accept=".json"
                  onChange={handleFileRestore}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => restoreFileRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer flex-shrink-0 ml-3"
                >
                  Upload File
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityHubModal;
