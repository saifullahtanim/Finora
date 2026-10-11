import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import Modal from '../common/Modal';

export const LearnImportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-[#1E1E20] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 dark:border-white/[0.08] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-white/[0.06]">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Learn how to import
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content: 3 Steps matching Image 3 */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* STEP 1: Select an account */}
          <div className="flex items-start gap-5">
            {/* Left Mockup Graphic 1 */}
            <div className="w-28 sm:w-32 h-24 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 p-2 flex items-center justify-center flex-shrink-0 relative overflow-hidden border border-slate-200/60 dark:border-white/[0.04]">
              <div className="w-full bg-white dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600 shadow-2xs text-[9px] font-sans">
                <div className="px-1.5 py-0.5 border-b border-slate-100 dark:border-slate-600 text-slate-400 text-[8px]">
                  Account
                </div>
                <div className="px-1.5 py-0.5 text-slate-500">My Account</div>
                <div className="px-1.5 py-0.5 bg-blue-500 text-white font-semibold flex items-center justify-between">
                  <span>My Account 2</span>
                </div>
                <div className="px-1.5 py-0.5 text-slate-500">My Account 3</div>
              </div>
              {/* Hand Clicker Icon */}
              <div className="absolute right-3 bottom-2 text-slate-800 dark:text-white pointer-events-none drop-shadow-sm text-sm">
                👆
              </div>
            </div>

            {/* Right Step 1 Text */}
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                1. Select an account
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                You can choose an existing account from the dropdown menu, or create a new account for your Import.
              </p>
            </div>
          </div>

          {/* STEP 2: Upload the file */}
          <div className="flex items-start gap-5">
            {/* Left Mockup Graphic 2 */}
            <div className="w-28 sm:w-32 h-24 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 p-2 flex items-center justify-center flex-shrink-0 relative border border-dashed border-blue-400/80 dark:border-blue-500/60">
              <div className="w-10 h-13 rounded-lg bg-emerald-500 text-white flex flex-col items-center justify-center shadow-xs">
                <div className="grid grid-cols-2 gap-0.5 p-1">
                  <div className="w-2 h-1.5 bg-white/80 rounded-2xs" />
                  <div className="w-2 h-1.5 bg-white/80 rounded-2xs" />
                  <div className="w-2 h-1.5 bg-white/80 rounded-2xs" />
                  <div className="w-2 h-1.5 bg-white/80 rounded-2xs" />
                </div>
                <span className="text-[7px] font-bold mt-0.5">XLS</span>
              </div>
              {/* Hand Clicker Icon */}
              <div className="absolute right-3 bottom-2 text-slate-800 dark:text-white pointer-events-none drop-shadow-sm text-sm">
                👆
              </div>
            </div>

            {/* Right Step 2 Text */}
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                2. Upload the file
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Drag and drop your file, or upload it from your computer. Make sure your file is in a CSV, XLS, XLSX, or OFX format.
              </p>
            </div>
          </div>

          {/* STEP 3: Set import rules */}
          <div className="flex items-start gap-5">
            {/* Left Mockup Graphic 3 */}
            <div className="w-28 sm:w-32 h-24 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 p-2 flex items-center justify-center gap-2 flex-shrink-0 border border-slate-200/60 dark:border-white/[0.04]">
              {/* Green Spreadsheet Doc */}
              <div className="w-8 h-10 rounded-md bg-emerald-500 text-white flex flex-col items-center justify-center shadow-xs">
                <div className="grid grid-cols-2 gap-0.5 p-0.5">
                  <div className="w-1.5 h-1 bg-white/80 rounded-2xs" />
                  <div className="w-1.5 h-1 bg-white/80 rounded-2xs" />
                  <div className="w-1.5 h-1 bg-white/80 rounded-2xs" />
                  <div className="w-1.5 h-1 bg-white/80 rounded-2xs" />
                </div>
              </div>

              {/* Arrow */}
              <span className="text-emerald-500 font-bold text-base">➔</span>

              {/* Finora Squircle Wallet */}
              <div className="w-8 h-8 rounded-lg bg-[#34C759] flex items-center justify-center text-white shadow-xs relative">
                <div className="w-4 h-3 rounded-xs border border-white flex items-center justify-end pr-0.5">
                  <div className="w-1 h-1 rounded-full bg-white" />
                </div>
              </div>
            </div>

            {/* Right Step 3 Text */}
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                3. Set import rules
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Set rules on how Finora should read data from your file. To create Records, Finora needs at least the date and amount for every transaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnImportModal;
