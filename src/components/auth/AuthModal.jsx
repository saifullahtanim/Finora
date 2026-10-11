import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CURRENCIES } from '../../utils/constants';
import {
  LogIn,
  UserPlus,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Mail,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import Modal from '../common/Modal';

export const AuthModal = ({ isOpen, onClose }) => {
  const {
    login,
    requestRegistrationCode,
    verifyAndRegister,
    loginGuest,
    pendingVerification,
    cancelVerification,
  } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    currency: 'BDT',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [sentOtpCode, setSentOtpCode] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isVerifyingStep, setIsVerifyingStep] = useState(false);

  const handleStartSignup = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!formData.password || formData.password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    try {
      const otp = requestRegistrationCode(formData);
      setSentOtpCode(otp);
      setIsVerifyingStep(true);
      setSuccessMsg(`A 6-digit security verification code has been dispatched to ${formData.email}.`);
    } catch (err) {
      setError(err.message || 'Failed to send verification code.');
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');

    try {
      verifyAndRegister(verificationCode);
      onClose();
      setIsVerifyingStep(false);
      setVerificationCode('');
    } catch (err) {
      setError(err.message || 'Verification failed.');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      login(formData.email, formData.password);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    }
  };

  const handleResendOtp = () => {
    try {
      const newOtp = requestRegistrationCode(formData);
      setSentOtpCode(newOtp);
      setSuccessMsg(`New security code generated for ${formData.email}!`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBackToSignupForm = () => {
    cancelVerification();
    setIsVerifyingStep(false);
    setError('');
  };

  const handleGuestLogin = () => {
    loginGuest();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isVerifyingStep
          ? 'Verify Your Email Address'
          : mode === 'login'
          ? 'Sign In to Wallet'
          : 'Create Your Verified Account'
      }
    >
      <div className="space-y-5">
        {/* Tab switcher (only when not in OTP step) */}
        {!isVerifyingStep && (
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Sign Up & Verify
              </span>
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {error && (
          <div className="p-3.5 text-xs font-semibold rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 text-xs font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300">
            {successMsg}
          </div>
        )}

        {/* STEP 2: Email Verification OTP Screen */}
        {isVerifyingStep ? (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-md shadow-emerald-500/25">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Email Verification Code
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                We sent a 6-digit confirmation code to:
                <br />
                <strong className="text-slate-800 dark:text-slate-200">{formData.email}</strong>
              </p>

              {/* Simulation notification display */}
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2 shadow-inner">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Simulated Inbox Code: {sentOtpCode}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 text-center">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                required
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[0.4em] text-2xl font-black font-mono px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Complete Registration</span>
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleBackToSignupForm}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ← Back to Details
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resend Code</span>
              </button>
            </div>
          </form>
        ) : mode === 'login' ? (
          /* Sign In Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        ) : (
          /* Sign Up Form (Initiates verification) */
          <form onSubmit={handleStartSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Saifulla Tanim"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Primary Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Send Verification Code</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}

        {/* Guest Mode Shortcut */}
        {!isVerifyingStep && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium text-xs transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-tight">Explore as Guest (No Login)</p>
                  <p className="text-[11px] text-slate-400">Pre-filled with BDT ৳ Wallets & bKash</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Continue →
              </span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;
