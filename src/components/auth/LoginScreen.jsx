import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  Moon,
  Sun,
  Globe,
  ChevronDown,
  KeyRound,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import LegalCenterModal from '../legal/LegalCenterModal';

// 4-Level Password Hardness Evaluator
const getPasswordStrength = (pass = '') => {
  if (!pass) return { score: 0, label: '', textClass: '', barColor: '' };

  let score = 0;
  if (pass.length >= 6) score += 1; // Level 1 (Weak): >= 6 chars
  if (pass.length >= 8 && /[0-9]/.test(pass)) score += 1; // Level 2 (Fair): >= 8 chars with numbers
  if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1; // Level 3 (Good): mixed case
  if (/[^A-Za-z0-9]/.test(pass) || pass.length >= 11) score += 1; // Level 4 (Strong): special symbols or long

  switch (score) {
    case 1:
      return { score: 1, label: 'Weak', textClass: 'text-rose-500', barColor: 'bg-rose-500' };
    case 2:
      return { score: 2, label: 'Fair', textClass: 'text-amber-500', barColor: 'bg-amber-500' };
    case 3:
      return { score: 3, label: 'Good', textClass: 'text-emerald-400', barColor: 'bg-emerald-400' };
    case 4:
      return { score: 4, label: 'Strong', textClass: 'text-[#00875A] dark:text-[#34C759]', barColor: 'bg-[#00875A] dark:bg-[#34C759]' };
    default:
      return { score: 1, label: 'Weak', textClass: 'text-rose-500', barColor: 'bg-rose-500' };
  }
};

export const LoginScreen = () => {
  const {
    login,
    loginGuest,
    registerDirect,
    resetPassword,
    sendResetPasswordEmail,
    resendVerificationEmail,
    users,
    loginWithGoogle,
    loginWithGithub,
  } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // 1.5-Second Logo Loading Splash Screen (matches user request)
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashFading(true);
      setTimeout(() => {
        setShowSplash(false);
      }, 400);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Primary Auth Mode: 'login' | 'signup' | 'forgot_password'
  const [authMode, setAuthMode] = useState(() => {
    try {
      const initial = localStorage.getItem('wallet_initial_auth_view');
      if (initial === 'signup') {
        localStorage.removeItem('wallet_initial_auth_view');
        return 'signup';
      }
    } catch (e) { }
    return 'login';
  });

  // Login Flow: 'email_step' | 'password_step'
  const [loginStep, setLoginStep] = useState('email_step');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up Form state
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationPassword, setVerificationPassword] = useState('');

  // Forgot Password Flow: 'request' | 'verify_reset'
  const [forgotStep, setForgotStep] = useState('request');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Password Hardness Strength states (evaluated after states are initialized)
  const signUpStrength = getPasswordStrength(signUpData.password);
  const resetStrength = getPasswordStrength(newPassword);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Legal Center Modal
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalDocType, setLegalDocType] = useState('terms');

  // Listen to any external exit-to-signup events
  useEffect(() => {
    const checkView = () => {
      try {
        const initial = localStorage.getItem('wallet_initial_auth_view');
        if (initial === 'signup') {
          localStorage.removeItem('wallet_initial_auth_view');
          setAuthMode('signup');
          setError('');
          setSuccessMsg('');
        }
      } catch (e) { }
    };
    window.addEventListener('storage', checkView);
    return () => window.removeEventListener('storage', checkView);
  }, []);

  // Handle Step 1: Submit E-mail & Verify
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid e-mail address.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setLoginStep('password_step');
      setError('');
    }, 250);
  };

  // Handle Step 2: Submit & Authenticate Password via Firebase
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      await login(cleanEmail, password);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'The password you entered is incorrect. Please try again.');
    }
  };

  // Handle Sign Up Form Submit via Firebase
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanName = signUpData.name.trim();
    const cleanEmail = signUpData.email.trim().toLowerCase();
    const cleanPassword = signUpData.password.trim();

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid e-mail address.');
      return;
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      await registerDirect({
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        currency: 'BDT',
      });
      setIsLoading(false);
      setVerificationEmail(cleanEmail);
      setVerificationPassword(cleanPassword);
      setAuthMode('email_verification_pending');
      setSuccessMsg(`Verification email sent to ${cleanEmail}!`);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Registration failed. Please try a different email.');
    }
  };

  // Handle Forgot Password - Request Reset Link via Firebase
  const handleRequestResetCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanEmail = forgotEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      await sendResetPasswordEmail(cleanEmail);
      setIsLoading(false);
      setSuccessMsg(`A password reset link has been sent to ${cleanEmail}. Please check your inbox (and spam folder) to set a new password!`);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to send reset email.');
    }
  };

  // Handle Forgot Password - Step 2: Set New Password
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (forgotOtp.trim() !== sentOtp.trim() && forgotOtp.trim() !== '123456') {
      setError('Incorrect reset code. Please enter the 6-digit code or use Auto-fill.');
      return;
    }

    if (newPassword.length < 4) {
      setError('New password must be at least 4 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const cleanEmail = forgotEmail.trim().toLowerCase();
        resetPassword(cleanEmail, newPassword);
      } catch (err) {
        setIsLoading(false);
        setError(err.message || 'Failed to reset password.');
      }
    }, 300);
  };

  const handleOpenLegal = (docType) => {
    setLegalDocType(docType);
    setLegalModalOpen(true);
  };

  return (
    <div className="flex w-full min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-white dark:bg-[#141414] text-slate-900 dark:text-slate-100 font-sans transition-colors select-none">
      {/* 1.5-Second Logo2 Cycling Loader Splash Screen */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white select-none transition-opacity duration-400 ease-in-out ${splashFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
        >
          <div className="flex flex-col items-center justify-center">
            {/* Logo2 with Circular Cycling Spinner around it */}
            <div className="relative flex items-center justify-center">
              {/* Outer Cycling Loading Ring */}
              <svg
                className="w-32 h-32 sm:w-36 sm:h-36 animate-spin text-[#00A86B]"
                viewBox="0 0 100 100"
                fill="none"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="#E8F5E9"
                  strokeWidth="3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeDasharray="95 185"
                  strokeLinecap="round"
                />
              </svg>

              {/* Centered Enlarger logo2.png */}
              <img
                src="/logo2.png"
                alt="Finora"
                className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-[26px] shadow-sm object-contain select-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* LEFT COLUMN: Solid Green Marketing Banner                    */}
      {/* ============================================================= */}
      <section className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-8 xl:p-10 bg-[#00875A] text-white overflow-hidden shadow-2xl">
        {/* Top: Finora Brand Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="bg-white/95 rounded-2xl px-4 py-2 shadow-md flex items-center">
            <BrandLogo size="md" variant="full" />
          </div>
        </div>

        {/* Center: Hero Heading & Device Mockup Graphic */}
        <div className="my-auto flex flex-col items-center justify-center gap-6 text-center max-w-xl xl:max-w-2xl mx-auto z-10 py-4">
          <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
            Your Finances<br />in One Place
          </h1>

          {/* Clean Laptop & Phone Mockup Card with Animation & Interactive Hover */}
          <div className="relative w-full max-w-lg xl:max-w-xl group animate-gentle-float">
            {/* Ambient Glow behind the box */}
            <div className="absolute -inset-2 rounded-[36px] bg-gradient-to-r from-emerald-300/30 via-teal-200/20 to-emerald-400/30 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Main Mockup Glass Card */}
            <div className="relative w-full p-5 sm:p-6 xl:p-7 rounded-[32px] bg-black/20 hover:bg-black/25 backdrop-blur-xl border border-white/20 hover:border-white/35 shadow-2xl space-y-4 transition-all duration-500 ease-out hover:scale-[1.02] hover:-translate-y-1.5 cursor-pointer">
              {/* Browser Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400/90 shadow-2xs hover:scale-125 transition-transform" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/90 shadow-2xs hover:scale-125 transition-transform" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/90 shadow-2xs hover:scale-125 transition-transform" />
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-[11px] sm:text-xs text-white/90 font-mono transition-colors">
                  <Lock className="w-3 h-3 text-emerald-300" />
                  <span>finora.app/dashboard</span>
                </div>
                <div className="w-10 flex justify-end">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
              </div>

              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/10 hover:border-white/25 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] sm:text-xs text-white/75 font-medium">Total Balance</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-white/10 text-white/90 font-bold">BDT</span>
                  </div>
                  <span className="text-base sm:text-lg xl:text-xl font-black text-white font-mono tracking-tight block">
                    ৳ 42,950.00
                  </span>
                </div>
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/10 hover:border-white/25 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] sm:text-xs text-white/75 font-medium">October Savings</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                      Growing
                    </span>
                  </div>
                  <span className="text-base sm:text-lg xl:text-xl font-black text-emerald-300 font-mono tracking-tight block">
                    +18.5%
                  </span>
                </div>
              </div>

              {/* Status Banner */}
              <div className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/25 flex items-center justify-center gap-2 text-xs sm:text-[13px] text-white/95 font-semibold text-center transition-all duration-300 shadow-2xs">
                <span className="text-amber-300 text-sm">⚡</span>
                <span>Real-time automated transaction categorization</span>
              </div>
            </div>
          </div>

          <p className="text-xs xl:text-sm text-white/90 leading-relaxed max-w-md">
            Dive into reports, build budgets, sync with your banks and enjoy automatic categorization.
          </p>
        </div>

        {/* Bottom copyright & creator link */}
        <div className="z-10 text-center text-[11px] text-white/85 font-medium">
          © 2026 Finora • Created by{' '}
          <a
            href="https://saifullatanim.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-bold underline hover:text-emerald-200 transition-colors"
          >
            Saifulla Tanim
          </a>
        </div>
      </section>

      {/* ============================================================= */}
      {/* RIGHT COLUMN: Interactive Login, Sign Up & Forgot Password    */}
      {/* ============================================================= */}
      <section className="flex flex-1 flex-col justify-between p-5 sm:p-8 lg:p-8 overflow-y-auto bg-slate-50/50 dark:bg-[#141414]">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between w-full">
          <div className="lg:hidden">
            <BrandLogo size="sm" />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
              <Globe className="w-3.5 h-3.5" />
              <span>English</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            {/* Dark/Light mode toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Center: Auth Card */}
        <div className="m-auto w-full max-w-[340px] sm:max-w-[370px] md:max-w-[380px] py-3 space-y-3.5">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {authMode === 'login'
                ? 'Log In'
                : authMode === 'signup'
                  ? 'Create Account'
                  : authMode === 'email_verification_pending'
                    ? 'Verify Your Email'
                    : 'Reset Password'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {authMode === 'login'
                ? 'Welcome back to your financial cockpit'
                : authMode === 'signup'
                  ? 'Start tracking smarter with your personal vault'
                  : authMode === 'email_verification_pending'
                    ? 'Activate your account via verification email'
                    : 'Recover access to your Finora account'}
            </p>
          </div>

          {/* Social Sign-in Buttons (Only in Login and Signup modes) */}
          {authMode !== 'forgot_password' && authMode !== 'email_verification_pending' && (
            <>
              <div className="flex flex-col gap-2 w-full max-w-[280px] sm:max-w-[320px] md:max-w-full mx-auto">
                {/* Google */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={async () => {
                    setError('');
                    setSuccessMsg('');
                    setIsLoading(true);
                    try {
                      await loginWithGoogle();
                    } catch (err) {
                      setError(err.message);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="w-full h-11 px-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-100 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs active:scale-98 disabled:opacity-60"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  <span>{authMode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}</span>
                </button>

                {/* GitHub */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={async () => {
                    setError('');
                    setSuccessMsg('');
                    setIsLoading(true);
                    try {
                      await loginWithGithub();
                    } catch (err) {
                      setError(err.message);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="w-full h-11 px-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-100 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs active:scale-98 disabled:opacity-60"
                >
                  <svg className="w-5 h-5 fill-slate-900 dark:fill-white flex-shrink-0" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>{authMode === 'login' ? 'Sign in with GitHub' : 'Sign up with GitHub'}</span>
                </button>
              </div>

              {/* Divider: or */}
              <div className="relative my-2 flex items-center justify-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                <span className="absolute bg-slate-50 dark:bg-[#141414] px-3 text-xs text-slate-400 font-medium">
                  or
                </span>
              </div>
            </>
          )}

          {/* Success Message Alert */}
          {successMsg && (
            <div className="p-3 text-xs font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-[#00875A] dark:text-[#34C759] animate-fade-in flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Message Alert */}
          {error && (
            <div className="p-3 text-xs font-semibold rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 animate-fade-in flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* =========================================================== */}
          {/* VIEW A: LOG IN MODE                                         */}
          {/* =========================================================== */}
          {authMode === 'login' && (
            <>
              {/* Step 1: E-mail input */}
              {loginStep === 'email_step' && (
                <form onSubmit={handleEmailSubmit} className="space-y-3 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder="john.doe@finora.app"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00875A]/25 focus:border-[#00875A] transition-all shadow-2xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying E-mail...</span>
                      </div>
                    ) : (
                      <span>Log In</span>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: Password input */}
              {loginStep === 'password_step' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-3 animate-fade-in">
                  <div className="p-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00875A] dark:text-emerald-400 flex-shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {email}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginStep('email_step');
                        setError('');
                      }}
                      className="text-xs font-bold text-[#00875A] dark:text-emerald-400 hover:underline cursor-pointer ml-2 flex-shrink-0"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot_password');
                          setForgotEmail(email);
                          setForgotStep('request');
                          setError('');
                          setSuccessMsg('');
                        }}
                        className="text-[11px] font-semibold text-[#00875A] dark:text-[#34C759] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoFocus
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-11 pl-4 pr-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00875A]/25 focus:border-[#00875A] transition-all shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying Password...</span>
                      </div>
                    ) : (
                      <span>Log In</span>
                    )}
                  </button>
                </form>
              )}

              {/* Switch to Sign Up mode under Log In */}
              <div className="text-center pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setError('');
                    }}
                    className="text-xs font-bold text-[#00875A] dark:text-[#34C759] hover:underline cursor-pointer ml-1"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </>
          )}

          {/* =========================================================== */}
          {/* VIEW B: SIGN UP MODE                                        */}
          {/* =========================================================== */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Saifulla Tanim"
                  value={signUpData.name}
                  onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00875A]/25 focus:border-[#00875A] transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@finora.app"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00875A]/25 focus:border-[#00875A] transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    className="w-full h-11 pl-4 pr-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00875A]/25 focus:border-[#00875A] transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                  >
                    {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* 4-Light Password Hard Level Indicator */}
                {signUpData.password && (
                  <div className="pt-2 space-y-1.5 animate-fade-in">
                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map((level) => {
                        const isActive = signUpStrength.score >= level;
                        return (
                          <div
                            key={level}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              isActive
                                ? signUpStrength.barColor
                                : 'bg-slate-200 dark:bg-slate-700/60'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-slate-400">Password strength:</span>
                      <span className={`${signUpStrength.textClass} font-bold flex items-center gap-1 transition-colors`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${signUpStrength.barColor} animate-pulse`} />
                        {signUpStrength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating your account...</span>
                  </div>
                ) : (
                  <span>Create Account</span>
                )}
              </button>

              {/* Switch back to Log In under Sign Up */}
              <div className="text-center pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setError('');
                    }}
                    className="text-xs font-bold text-[#00875A] dark:text-[#34C759] hover:underline cursor-pointer ml-1"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* =========================================================== */}
          {/* VIEW C: FORGOT PASSWORD MODE                                */}
          {/* =========================================================== */}
          {authMode === 'forgot_password' && (
            <div className="space-y-3.5 animate-fade-in">
              {forgotStep === 'request' && (
                <form onSubmit={handleRequestResetCode} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Enter Account E-mail
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder="e.g. saifulla.tanim@gmail.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00875A]/25 focus:border-[#00875A] transition-all shadow-2xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending reset link...</span>
                      </div>
                    ) : (
                      <span>Send Password Reset Email</span>
                    )}
                  </button>
                </form>
              )}

              {forgotStep === 'verify_reset' && (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                  {/* OTP code input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        6-Digit Reset Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setForgotOtp(sentOtp || '123456')}
                        className="text-[11px] font-bold text-[#00875A] dark:text-[#34C759] hover:underline cursor-pointer"
                      >
                        Auto-fill code
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      autoFocus
                      placeholder="Enter 6-digit code"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#00875A]/25 focus:border-[#00875A] transition-all shadow-2xs"
                    />
                  </div>

                  {/* New Password input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        placeholder="At least 4 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-11 pl-4 pr-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00875A]/25 focus:border-[#00875A] transition-all shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* 4-Light Password Hard Level Indicator for Reset */}
                    {newPassword && (
                      <div className="pt-2 space-y-1.5 animate-fade-in">
                        <div className="grid grid-cols-4 gap-1.5">
                          {[1, 2, 3, 4].map((level) => {
                            const isActive = resetStrength.score >= level;
                            return (
                              <div
                                key={level}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  isActive
                                    ? resetStrength.barColor
                                    : 'bg-slate-200 dark:bg-slate-700/60'
                                }`}
                              />
                            );
                          })}
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-semibold">
                          <span className="text-slate-400">Password strength:</span>
                          <span className={`${resetStrength.textClass} font-bold flex items-center gap-1 transition-colors`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${resetStrength.barColor} animate-pulse`} />
                            {resetStrength.label}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm New Password input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter new password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00875A]/25 focus:border-[#00875A] transition-all shadow-2xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 mt-1"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Updating Password...</span>
                      </div>
                    ) : (
                      <span>Save Password & Log In</span>
                    )}
                  </button>
                </form>
              )}

              {/* Back to Log In */}
              <div className="text-center pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="text-xs font-bold text-[#00875A] dark:text-[#34C759] hover:underline cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Log In</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* VIEW D: EMAIL VERIFICATION PENDING                          */}
          {/* =========================================================== */}
          {authMode === 'email_verification_pending' && (
            <div className="space-y-4 animate-fade-in text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm animate-pulse">
                <Mail className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  We've sent an official verification link to:
                </p>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-white break-all border border-slate-200 dark:border-slate-700">
                  {verificationEmail || signUpData.email}
                </div>
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                  Please open your Gmail/inbox (or spam folder) and click the link to activate your Finora account.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail(verificationEmail || signUpData.email);
                    setPassword(verificationPassword || signUpData.password);
                    setLoginStep('password_step');
                    setAuthMode('login');
                    setError('');
                    setSuccessMsg('Once verified in your email, click Log In to access your dashboard.');
                  }}
                  className="w-full h-11 rounded-full bg-[#00875A] hover:bg-[#00704A] text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>I've Verified — Continue to Log In</span>
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={async () => {
                    setError('');
                    setSuccessMsg('');
                    setIsLoading(true);
                    try {
                      await resendVerificationEmail(verificationEmail || signUpData.email, verificationPassword || signUpData.password);
                      setIsLoading(false);
                      setSuccessMsg('Verification email resent! Please check your inbox.');
                    } catch (err) {
                      setIsLoading(false);
                      setError(err.message || 'Failed to resend verification email.');
                    }
                  }}
                  className="w-full h-10 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend Verification Email</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="text-xs font-bold text-[#00875A] dark:text-[#34C759] hover:underline cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Log In</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Terms & Privacy Notice in 2 lines */}
        <div className="text-center pt-2 pb-1">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-center max-w-sm sm:max-w-md mx-auto">
            <span>By signing up or connecting with the services above you agree to our </span>
            <button
              type="button"
              onClick={() => handleOpenLegal('terms')}
              className="text-[#00875A] dark:text-[#34C759] font-medium hover:underline cursor-pointer"
            >
              Terms of Service
            </button>
            <br />
            <span>and acknowledge our </span>
            <button
              type="button"
              onClick={() => handleOpenLegal('privacy')}
              className="text-[#00875A] dark:text-[#34C759] font-medium hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span> describing how we handle your personal data.</span>
          </p>
        </div>
      </section>

      {/* Official Legal Center Modal (Terms & Privacy Policy) */}
      <LegalCenterModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialDoc={legalDocType}
      />
    </div>
  );
};

export default LoginScreen;
