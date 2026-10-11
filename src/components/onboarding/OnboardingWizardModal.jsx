import React, { useState } from 'react';
import { Check, Coins, Sparkles, ArrowRight, Wallet, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { CURRENCIES } from '../../utils/constants';

export const OnboardingWizardModal = ({ isOpen, onClose }) => {
  const { currentCurrency, setCurrencyCode, accounts, updateAccount, addAccount, formatMoney } = useFinance();
  const { currentUser } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency?.code || 'BDT');
  const [cashBalance, setCashBalance] = useState('0.00');
  const [bkashBalance, setBkashBalance] = useState('0.00');
  const [bankBalance, setBankBalance] = useState('0.00');

  if (!isOpen) return null;

  const handleConfirmCurrency = (e) => {
    e.preventDefault();
    setCurrencyCode(selectedCurrency);
    setStep(2);
  };

  const handleSaveBalances = (e) => {
    e.preventDefault();
    const cashVal = parseFloat(cashBalance) || 0;
    const bkashVal = parseFloat(bkashBalance) || 0;
    const bankVal = parseFloat(bankBalance) || 0;

    // Update Cash account
    const cashAcc = accounts.find((a) => a.type === 'cash' || a.name.toLowerCase().includes('cash'));
    if (cashAcc) {
      updateAccount(cashAcc.id, { balance: cashVal, currency: selectedCurrency });
    }

    // Update or add bKash account
    const bkashAcc = accounts.find((a) => a.type === 'mobile_banking' || a.name.toLowerCase().includes('bkash'));
    if (bkashAcc) {
      updateAccount(bkashAcc.id, { balance: bkashVal, currency: selectedCurrency });
    }

    // Update or add Bank account
    const bankAcc = accounts.find((a) => a.type === 'bank' || a.name.toLowerCase().includes('bank'));
    if (bankAcc) {
      updateAccount(bankAcc.id, { balance: bankVal, currency: selectedCurrency });
    }

    setStep(3);
  };

  const handleFinish = () => {
    if (currentUser) {
      localStorage.setItem(`onboarding_completed_${currentUser.id}`, 'true');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Top Step Progress Stepper */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex items-center justify-between max-w-lg mx-auto relative">
            {/* Step 1 */}
            <div className="flex items-center gap-2.5 z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  step >= 1
                    ? 'border-[#00875A] bg-[#00875A] text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500'
                }`}
              >
                {step > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
              </div>
              <span
                className={`text-xs font-bold ${
                  step === 1 ? 'text-slate-900 dark:text-white' : 'text-slate-500'
                }`}
              >
                Select Base currency
              </span>
            </div>

            {/* Connecting line 1 */}
            <div
              className={`flex-1 h-0.5 mx-3 ${
                step > 1 ? 'bg-[#00875A]' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />

            {/* Step 2 */}
            <div className="flex items-center gap-2.5 z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  step >= 2
                    ? 'border-[#00875A] bg-[#00875A] text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500'
                }`}
              >
                {step > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
              </div>
              <span
                className={`text-xs font-bold ${
                  step === 2 ? 'text-slate-900 dark:text-white' : 'text-slate-500'
                }`}
              >
                Set up your cash balance
              </span>
            </div>

            {/* Connecting line 2 */}
            <div
              className={`flex-1 h-0.5 mx-3 ${
                step > 2 ? 'bg-[#00875A]' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />

            {/* Step 3 */}
            <div className="flex items-center gap-2.5 z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  step >= 3
                    ? 'border-[#00875A] bg-[#00875A] text-white'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500'
                }`}
              >
                3
              </div>
              <span
                className={`text-xs font-bold ${
                  step === 3 ? 'text-slate-900 dark:text-white' : 'text-slate-500'
                }`}
              >
                Success!
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Select Base Currency */}
        {step === 1 && (
          <form onSubmit={handleConfirmCurrency} className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#E6F4EA] dark:bg-[#00875A]/20 text-[#00875A] flex items-center justify-center mx-auto shadow-sm">
              <Coins className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Base currency
                </label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#00875A] bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#00875A]/20"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 text-left leading-relaxed">
                Your base currency should ideally be the one you use most often. All transactions in other currencies will be calculated based on this one.
              </p>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white font-bold text-sm shadow-md transition-all cursor-pointer mt-4 active:scale-[0.99]"
              >
                Confirm Currency
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Set Starting Balances */}
        {step === 2 && (
          <form onSubmit={handleSaveBalances} className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#E6F4EA] dark:bg-[#00875A]/20 text-[#00875A] flex items-center justify-center mx-auto shadow-sm">
              <Wallet className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-4 text-left">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center">
                  Set Up Initial Wallet Balances
                </h3>
                <p className="text-xs text-slate-500 text-center mt-1">
                  Enter your current available balance in cash, mobile wallets, or bank accounts.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Cash in Hand ({selectedCurrency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={cashBalance}
                    onChange={(e) => setCashBalance(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00875A]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    bKash / Mobile Wallet ({selectedCurrency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={bkashBalance}
                    onChange={(e) => setBkashBalance(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00875A]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Main Bank Account ({selectedCurrency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={bankBalance}
                    onChange={(e) => setBankBalance(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00875A]/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white font-bold text-sm shadow-md transition-all cursor-pointer mt-4 active:scale-[0.99]"
              >
                Save Balances & Continue
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success Screen */}
        {step === 3 && (
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00875A] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="max-w-md mx-auto space-y-3">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                You're All Set!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your wallet accounts and base currency have been successfully initialized. You can now track your daily expenses, monitor cash flow, and manage your finances seamlessly.
              </p>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3.5 px-6 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white font-bold text-sm shadow-md transition-all cursor-pointer mt-6 active:scale-[0.99]"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizardModal;
