import React, { useState, useEffect } from 'react';
import {
  FileText,
  Shield,
  CheckCircle2,
  Lock,
  X,
  CreditCard,
  Wallet,
  Smartphone,
  Eye,
  KeyRound,
  Download,
  AlertTriangle,
  Scale,
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

export const LegalCenterModal = ({
  isOpen,
  onClose,
  initialDoc = 'terms', // 'terms' | 'privacy'
}) => {
  const [activeDoc, setActiveDoc] = useState(initialDoc || 'terms');

  // Synchronize active document whenever initialDoc changes
  useEffect(() => {
    if (initialDoc === 'privacy' || initialDoc === 'terms') {
      setActiveDoc(initialDoc);
    } else {
      setActiveDoc('terms');
    }
  }, [initialDoc]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose && onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in font-sans select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[92vh] bg-white dark:bg-[#151922] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-scale-up"
      >
        {/* Top Navbar */}
        <header className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#151922] sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>
        </header>

        {/* Main Content Layout: Sidebar + Document View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Navigation Sidebar */}
          <aside className="w-full md:w-60 lg:w-64 border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#12161F] p-5 overflow-y-auto flex-shrink-0">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Legal Center
            </h3>

            {/* Category 1: TERMS & CONDITIONS */}
            <div className="mb-5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2 px-2">
                TERMS OF SERVICE
              </span>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveDoc('terms')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2.5 ${
                    activeDoc === 'terms'
                      ? 'bg-[#E3F7EE] dark:bg-emerald-950/70 text-[#00875A] dark:text-emerald-300 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Scale className="w-4 h-4 stroke-[2]" />
                  <span>Terms & Conditions</span>
                </button>
              </div>
            </div>

            {/* Category 2: PRIVACY & DATA */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2 px-2">
                PRIVACY & SECURITY
              </span>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveDoc('privacy')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2.5 ${
                    activeDoc === 'privacy'
                      ? 'bg-[#E3F7EE] dark:bg-emerald-950/70 text-[#00875A] dark:text-emerald-300 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Shield className="w-4 h-4 stroke-[2]" />
                  <span>Privacy Policy</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Right Main Legal Reader */}
          <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-[82vh] space-y-6 select-text bg-white dark:bg-[#151922]">
            {/* ======================================================== */}
            {/* DOCUMENT 1: Finora Terms & Conditions                     */}
            {/* ======================================================== */}
            {activeDoc === 'terms' && (
              <>
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Terms & Conditions
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Finora — Manage money smarter. Personal Finance & Multi-Account Ledger.
                  </p>
                </div>

                <div className="space-y-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    Welcome to <strong>Finora</strong>. These Terms & Conditions govern your access to and use of Finora’s web applications, mobile interfaces, and digital ledger services. By creating an account, recording transactions, or using our features, you acknowledge and agree to these terms.
                  </p>

                  {/* Section 1: About Finora */}
                  <section className="space-y-2 pt-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-300 flex items-center justify-center text-xs font-bold">1</span>
                      About Finora Application & Scope
                    </h2>
                    <p>
                      Finora is an all-in-one personal finance, budget tracking, and cash flow analysis platform. It enables you to:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 pt-1 text-slate-600 dark:text-slate-300">
                      <li>Track daily income and expenses across customized visual categories with emojis.</li>
                      <li>Manage multiple wallets and accounts including <strong>Cash in Hand</strong>, <strong>Mobile Banking</strong> (bKash, Nagad, Rocket), and <strong>Commercial Bank Accounts</strong>.</li>
                      <li>Monitor financial health using real-time speedometer gauges for <strong>Total Balance</strong>, <strong>Cash Flow</strong>, and <strong>Spending Rates</strong>.</li>
                      <li>View historical balance trends, analyze monthly distributions, and schedule recurring planned commitments.</li>
                    </ul>
                  </section>

                  {/* Section 2: Financial Disclaimer */}
                  <section className="space-y-2 pt-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-300 flex items-center justify-center text-xs font-bold">2</span>
                      Informational Nature & Financial Advice Disclaimer
                    </h2>
                    <p>
                      Finora is a record-keeping and mathematical analysis utility. <strong>Finora is not a bank, licensed broker, credit institution, or financial advisory firm.</strong> The calculations, speedometer indicators, and cash flow projections serve as organizational aids. Finora does not execute actual financial transactions or bank transfers in the real banking world, nor does it provide tax, investment, or legal advice. All financial decisions made by you remain solely your own responsibility.
                    </p>
                  </section>

                  {/* Section 3: Account Ownership & Security */}
                  <section className="space-y-2 pt-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-300 flex items-center justify-center text-xs font-bold">3</span>
                      User Accounts, Passwords & PIN Protection
                    </h2>
                    <p>
                      To protect your personal data, you are responsible for maintaining the confidentiality of your login password and your personal <strong>Security PIN</strong>. Finora provides built-in client PIN Lock, Privacy Mode (to mask sensitive account balances), and immediate lock features. You are accountable for all activities performed under your credentials.
                    </p>
                  </section>

                  {/* Section 4: Data Accuracy & Currencies */}
                  <section className="space-y-2 pt-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-300 flex items-center justify-center text-xs font-bold">4</span>
                      Data Accuracy & Currency Management
                    </h2>
                    <p>
                      Finora is tailored with primary support for <strong>Bangladeshi Taka (৳ BDT)</strong> alongside international currencies. You have full discretion over your manual entries, planned bill commitments, and balance adjustments. Finora does not independently verify the real-world accuracy of account values you input.
                    </p>
                  </section>

                  {/* Section 5: Permitted & Fair Use */}
                  <section className="space-y-2 pt-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-300 flex items-center justify-center text-xs font-bold">5</span>
                      Permitted Use & User Obligations
                    </h2>
                    <p>
                      The application is intended for lawful personal or family money management. You agree not to reverse engineer, disrupt network infrastructure, inject malicious code, or use Finora for illegal, fraudulent, or unauthorized activities.
                    </p>
                  </section>

                  {/* Section 6: Data Ownership & Service Reliability */}
                  <section className="space-y-2 pt-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-300 flex items-center justify-center text-xs font-bold">6</span>
                      Data Ownership, Availability & Service Continuity
                    </h2>
                    <p>
                      All transaction records and custom categories created in Finora belong entirely to you. You may export your financial data at any time via CSV statement exports. While we strive to maintain uninterrupted service and offline-first availability, Finora is provided on an "as is" and "as available" basis without express warranties against unforeseen device failures.
                    </p>
                  </section>

                  {/* Section 7: Updates & Contact */}
                  <section className="space-y-2 pt-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-300 flex items-center justify-center text-xs font-bold">7</span>
                      Modifications & Contact
                    </h2>
                    <p>
                      We may periodically update Finora features to improve performance, add new integrations, or update these terms. For inquiries regarding these Terms & Conditions, please contact us at <a href="mailto:support@finora.app" className="text-[#00875A] dark:text-emerald-400 font-semibold hover:underline">support@finora.app</a> or <a href="mailto:saifullatanim.cse@gmail.com" className="text-[#00875A] dark:text-emerald-400 font-semibold hover:underline">saifullatanim.cse@gmail.com</a>.
                    </p>
                  </section>
                </div>
              </>
            )}

            {/* ======================================================== */}
            {/* DOCUMENT 2: Finora Privacy Policy                         */}
            {/* ======================================================== */}
            {activeDoc === 'privacy' && (
              <>
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Privacy Policy
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                    How Finora collects, secures, and handles your personal financial records.
                  </p>
                </div>

                <div className="space-y-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    Your personal financial privacy is our highest priority at <strong>Finora</strong>. We believe that what you spend, earn, or save belongs strictly to you. We do not sell your personal data, track your location, or monetize your financial habits.
                  </p>

                  {/* Section 1: Core Privacy Principles */}
                  <section className="space-y-2 pt-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-300 flex items-center justify-center text-xs font-bold">1</span>
                      Core Principles & Zero Third-Party Selling
                    </h2>
                    <ul className="list-disc pl-5 space-y-1 pt-1 text-slate-600 dark:text-slate-300">
                      <li><strong>No Data Brokering:</strong> We never sell, rent, or trade your personal information or financial records to data brokers, advertising networks, or credit agencies.</li>
                      <li><strong>Zero Advertising Profiling:</strong> We do not track your financial habits across other websites or apps to serve targeted ads.</li>
                      <li><strong>User Sovereignty:</strong> You have complete authority over your records with full export (CSV / Excel) and account wipe options.</li>
                    </ul>
                  </section>

                  {/* Section 2: Information We Collect */}
                  <section className="space-y-2 pt-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-300 flex items-center justify-center text-xs font-bold">2</span>
                      Information We Collect & Store
                    </h2>
                    <p>To provide personal budgeting services, Finora processes the following:</p>
                    <ul className="list-disc pl-5 space-y-1 pt-1 text-slate-600 dark:text-slate-300">
                      <li><strong>Account Information:</strong> Name, email address, password hash, and optional profile avatar.</li>
                      <li><strong>Financial Records:</strong> Transaction amounts, transaction types (Expense, Income, Transfer), dates, custom emojis/icons, category names, and memo notes entered by you.</li>
                      <li><strong>Account Structure:</strong> Names of your wallets/accounts (e.g. Cash in Hand, bKash, Uttara Bank, City Bank) and current balances.</li>
                      <li><strong>Security & Preference Settings:</strong> Salted PIN hashes, selected currency (BDT ৳, USD, EUR), theme preferences (Light/Dark mode), and privacy mask settings.</li>
                    </ul>
                  </section>

                  {/* Section 3: How We Use Your Data */}
                  <section className="space-y-2 pt-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-300 flex items-center justify-center text-xs font-bold">3</span>
                      How We Use Your Information
                    </h2>
                    <p>Your data is used exclusively to operate Finora’s internal capabilities:</p>
                    <ul className="list-disc pl-5 space-y-1 pt-1 text-slate-600 dark:text-slate-300">
                      <li>Generating your live financial dashboard, net balance calculations, and monthly trend graphs.</li>
                      <li>Calculating speedometer analytics (Balance, Cash Flow, Spending rate).</li>
                      <li>Enabling quick search, filtering, and category breakdown reports.</li>
                      <li>Synchronizing your data securely across authenticated devices when logged in.</li>
                    </ul>
                  </section>

                  {/* Section 4: Security & Encryption */}
                  <section className="space-y-2 pt-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-300 flex items-center justify-center text-xs font-bold">4</span>
                      Security, PIN Protection & Encryption
                    </h2>
                    <p>
                      All network communication between your device and Finora cloud services is encrypted using <strong>SSL / TLS 1.3 cryptographic protocols</strong>. Security PINs are stored with one-way salted hashing. Finora provides <strong>Privacy Mode</strong>, which allows you to mask sensitive balance figures with asterisks in public settings with a single click.
                    </p>
                  </section>

                  {/* Section 5: Offline Storage & Data Retention */}
                  <section className="space-y-2 pt-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-300 flex items-center justify-center text-xs font-bold">5</span>
                      Offline-First Storage & Data Retention
                    </h2>
                    <p>
                      Finora utilizes local browser storage and client-side database caching so you can access your ledger even without an active internet connection. Your financial data is retained only for as long as your account remains active.
                    </p>
                  </section>

                  {/* Section 6: Data Portability & Right to Deletion */}
                  <section className="space-y-2 pt-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-300 flex items-center justify-center text-xs font-bold">6</span>
                      Your Rights: Export & Permanent Deletion
                    </h2>
                    <p>
                      You retain full rights to your data:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 pt-1 text-slate-600 dark:text-slate-300">
                      <li><strong>Export:</strong> Download your entire transaction ledger and statements in CSV format at any time.</li>
                      <li><strong>Correction:</strong> Update, modify, or recalculate any transaction or account balance instantly.</li>
                      <li><strong>Right to be Forgotten:</strong> You can completely wipe your records or request full account termination.</li>
                    </ul>
                  </section>

                  {/* Section 7: Contact Us */}
                  <section className="space-y-2 pt-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#00875A] dark:text-emerald-300 flex items-center justify-center text-xs font-bold">7</span>
                      Privacy Contact & Support
                    </h2>
                    <p>
                      If you have questions, feedback, or requests concerning your privacy rights, please contact our support team at:
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 pt-1">
                      Finora Privacy Support: <a href="mailto:support@finora.app" className="text-[#00875A] dark:text-emerald-400 hover:underline">support@finora.app</a> &bull; <a href="mailto:saifullatanim.cse@gmail.com" className="text-[#00875A] dark:text-emerald-400 hover:underline">saifullatanim.cse@gmail.com</a>
                    </p>
                  </section>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default LegalCenterModal;
