import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Menu,
  Lock,
  Edit2,
  Trash2,
  ArrowRightLeft,
  Receipt,
  MoreVertical,
  Check,
  Archive,
  X,
  ArrowLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import {
  RealisticWallet,
  RealisticCoins,
  RealisticBank,
  RealisticMobile,
} from '../common/RealisticIcons';

export const AccountsView = ({
  onOpenAddAccount,
  onEditAccount,
  onOpenTransfer,
  onOpenAddTx,
}) => {
  const {
    accounts,
    transactions,
    deleteAccount,
    updateAccount,
    currentCurrency,
    formatMoney,
  } = useFinance();

  const [showArchived, setShowArchived] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Delete Flow states (matching Images 2, 3, 4)
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'deleting' | 'success', title: string, message: string }
  const toastTimeoutRef = useRef(null);

  // Cleanup toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Request deletion (triggers Image 2 Delete Confirmation Modal)
  const handleRequestDelete = (acc, e) => {
    e?.stopPropagation();
    setActiveMenuId(null);
    if (accounts.length <= 1) {
      alert('You must have at least one account in your wallet.');
      return;
    }
    setAccountToDelete(acc);
  };

  // Confirm delete (triggers Image 4 deleting state & Image 3 success toast)
  const handleConfirmDelete = () => {
    if (!accountToDelete) return;
    const target = accountToDelete;
    setAccountToDelete(null);

    // 1. Image 4 Deleting State: Center spinner + Bottom-right toast
    setIsDeleting(true);
    setToast({
      type: 'deleting',
      title: 'Account is being deleted...',
      message: 'Please wait while the account is being deleted...',
    });

    // 2. Perform deletion after short realistic delay
    setTimeout(() => {
      deleteAccount(target.id);
      setIsDeleting(false);

      if (selectedAccount?.id === target.id) {
        setSelectedAccount(null);
      }

      // 3. Image 3 Success State: Green accent bar + Success message
      setToast({
        type: 'success',
        title: 'Account deleted!',
        message: 'Account was successfully deleted.',
      });

      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
      }, 4000);
    }, 850);
  };

  const handleToggleArchive = (acc, e) => {
    e?.stopPropagation();
    setActiveMenuId(null);
    updateAccount(acc.id, { isArchived: !acc.isArchived });
  };

  // Filter accounts based on archived toggle
  const displayedAccounts = accounts.filter((acc) => {
    if (showArchived) return true;
    return !acc.isArchived;
  });

  const formatAccountBalance = (balance, currencyCode = 'BDT') => {
    const num = Number(balance || 0);
    const absFormatted = Math.abs(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (num < 0) {
      return `-${currencyCode} ${absFormatted}`;
    }
    return `${currencyCode} ${absFormatted}`;
  };

  // Get account specific icon
  const getAccountIcon = (acc) => {
    if (acc.type === 'cash') return RealisticCoins;
    if (acc.type === 'bank') return RealisticBank;
    if (acc.type === 'mobile_banking') return RealisticMobile;
    return RealisticWallet;
  };

  // Keep selectedAccount synced if updated
  const activeSelected = selectedAccount
    ? accounts.find((a) => a.id === selectedAccount.id) || selectedAccount
    : null;

  return (
    <div className="w-full pb-12 animate-fade-in">
      {/* ============================================================= */}
      {/* VIEW A: ACCOUNT DETAIL VIEW (Matching Image 2 Background)      */}
      {/* ============================================================= */}
      {activeSelected ? (
        <div className="space-y-6 animate-fade-in">
          {/* Top Bar: Back to accounts on left, Edit & Delete buttons on right */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedAccount(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Back to accounts list"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Detail
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onEditAccount && onEditAccount(activeSelected)}
                className="px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1E1E20] text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer shadow-2xs"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={(e) => handleRequestDelete(activeSelected, e)}
                className="px-4 py-1.5 rounded-full border border-rose-300 dark:border-rose-800/80 bg-white dark:bg-[#1E1E20] text-[#FE3B2C] hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Account Detail Card */}
          <div className="bg-white dark:bg-[#1E1E20] rounded-2xl p-6 sm:p-7 border border-slate-100 dark:border-white/[0.06] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                style={{ backgroundColor: activeSelected.color || '#007AFF' }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-md relative"
              >
                {React.createElement(getAccountIcon(activeSelected), {
                  className: 'w-7 h-7 text-white drop-shadow-xs',
                })}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {activeSelected.name}
                </h3>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                  Type: {activeSelected.typeLabel || activeSelected.type || 'General'}
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium block">
                Current Balance
              </span>
              <span
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  Number(activeSelected.balance) < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {formatAccountBalance(
                  activeSelected.balance,
                  activeSelected.currency || currentCurrency?.code || 'BDT'
                )}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => onOpenAddTx && onOpenAddTx('expense', activeSelected.id)}
              className="p-3.5 rounded-xl bg-white dark:bg-[#1E1E20] border border-slate-100 dark:border-white/[0.06] hover:border-emerald-300 dark:hover:border-emerald-600 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer"
            >
              <Receipt className="w-4 h-4 stroke-[2.2]" />
              <span>Add Record</span>
            </button>
            <button
              type="button"
              onClick={onOpenTransfer}
              className="p-3.5 rounded-xl bg-white dark:bg-[#1E1E20] border border-slate-100 dark:border-white/[0.06] hover:border-blue-300 dark:hover:border-blue-600 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4 stroke-[2.2]" />
              <span>Transfer</span>
            </button>
            <button
              type="button"
              onClick={() => onEditAccount && onEditAccount(activeSelected)}
              className="p-3.5 rounded-xl bg-white dark:bg-[#1E1E20] border border-slate-100 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-slate-600 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <Edit2 className="w-4 h-4 stroke-[2]" />
              <span>Edit Account</span>
            </button>
            <button
              type="button"
              onClick={(e) => handleRequestDelete(activeSelected, e)}
              className="p-3.5 rounded-xl bg-white dark:bg-[#1E1E20] border border-slate-100 dark:border-white/[0.06] hover:border-rose-300 dark:hover:border-rose-600 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 stroke-[2]" />
              <span>Delete Account</span>
            </button>
          </div>

          {/* Account Transaction History */}
          <div className="bg-white dark:bg-[#1E1E20] rounded-2xl p-6 border border-slate-100 dark:border-white/[0.06] shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Records for {activeSelected.name}
            </h4>
            {transactions.filter((t) => t.accountId === activeSelected.id).length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No transactions recorded for this account yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {transactions
                  .filter((t) => t.accountId === activeSelected.id)
                  .slice(0, 10)
                  .map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {tx.category || tx.note || 'Record'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {tx.date ? new Date(tx.date).toLocaleDateString() : 'Recent'}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          tx.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {formatMoney(tx.amount)}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ============================================================= */
        /* VIEW B: ACCOUNTS LIST VIEW (Matching Image 3)                 */
        /* ============================================================= */
        <div className="flex flex-col md:flex-row items-start gap-6 lg:gap-8">
          {/* Left Sidebar Panel */}
          <div className="w-full md:w-64 lg:w-72 flex-shrink-0 bg-white dark:bg-[#1E1E20] rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-white/[0.06] shadow-xs flex flex-col gap-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Accounts
            </h2>

            <button
              type="button"
              onClick={onOpenAddAccount}
              className="w-full py-2.5 px-5 rounded-full bg-[#00A86B] hover:bg-[#00875A] text-white font-bold text-sm shadow-md shadow-[#00A86B]/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add</span>
            </button>

            <label className="flex items-center gap-3 cursor-pointer select-none pt-1">
              <div className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00A86B]"></div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                Show Archived
              </span>
            </label>
          </div>

          {/* Right Main Section: Clean Horizontal List of Account Cards (Image 3) */}
          <div className="flex-1 w-full space-y-3">
            {displayedAccounts.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-[#1E1E20] rounded-2xl border border-slate-100 dark:border-white/[0.06] text-slate-400">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No accounts found.
                </p>
                <button
                  type="button"
                  onClick={onOpenAddAccount}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#00A86B] text-white text-xs font-bold shadow-xs hover:bg-[#00875A] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Add First Account</span>
                </button>
              </div>
            ) : (
              displayedAccounts.map((acc) => {
                const isCash = acc.type === 'cash';
                const isBkash = acc.type === 'mobile_banking';
                const isBank = acc.type === 'bank';
                const isLoan =
                  acc.type === 'loan' ||
                  acc.name.toLowerCase().includes('loan') ||
                  acc.name.toLowerCase().includes('debt') ||
                  Number(acc.balance) < 0;

                const hasLock = Boolean(acc.isLocked || isLoan);
                const AccountIcon = getAccountIcon(acc);
                const typeLabel = isCash ? 'Cash' : acc.typeLabel || 'General';
                const isMenuOpen = activeMenuId === acc.id;

                return (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAccount(acc)}
                    className="bg-white dark:bg-[#1E1E20] rounded-xl sm:rounded-2xl p-4 sm:px-6 sm:py-4.5 border border-slate-100 dark:border-white/[0.06] shadow-2xs hover:shadow-xs hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:border-slate-200/80 dark:hover:border-white/10 transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer group relative"
                  >
                    {/* Left: Account Icon & Name */}
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      <div
                        style={{ backgroundColor: acc.color || '#007AFF' }}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 relative shadow-2xs text-white"
                      >
                        <AccountIcon className="w-5 h-5 text-white drop-shadow-2xs" />

                        {hasLock && (
                          <span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-slate-700 dark:bg-slate-800 text-white flex items-center justify-center text-[9px] shadow-xs border border-white dark:border-slate-900">
                            <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                        {acc.name}
                      </h3>
                    </div>

                    {/* Middle Column: Type Label */}
                    <div className="hidden sm:block text-center min-w-[100px]">
                      <span className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-medium">
                        {typeLabel}
                      </span>
                    </div>

                    {/* Right Side: Formatted Balance & Menu Hamburger Icon */}
                    <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                      <span
                        className={`text-sm sm:text-base font-bold tracking-tight ${
                          Number(acc.balance) < 0
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {formatAccountBalance(
                          acc.balance,
                          acc.currency || currentCurrency?.code || 'BDT'
                        )}
                      </span>

                      {/* Menu Button / Dropdown Toggle */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(isMenuOpen ? null : acc.id);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                          title="Account options"
                        >
                          <Menu className="w-5 h-5 stroke-[2]" />
                        </button>

                        {/* Action Dropdown Menu */}
                        {isMenuOpen && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-8 w-44 rounded-2xl bg-white dark:bg-[#2C2C2E] border border-slate-200 dark:border-white/10 shadow-xl py-1.5 z-30 animate-fade-in"
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                setSelectedAccount(acc);
                              }}
                              className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                            >
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                              <span>View Detail</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                onEditAccount && onEditAccount(acc);
                              }}
                              className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                              <span>Edit Account</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                onOpenTransfer && onOpenTransfer();
                              }}
                              className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500" />
                              <span>Transfer Funds</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                if (onOpenAddTx) onOpenAddTx('expense', acc.id);
                              }}
                              className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                            >
                              <Receipt className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Add Record</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleToggleArchive(acc, e)}
                              className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                            >
                              <Archive className="w-3.5 h-3.5 text-amber-500" />
                              <span>{acc.isArchived ? 'Unarchive' : 'Archive'}</span>
                            </button>

                            <div className="my-1 border-t border-slate-100 dark:border-white/10" />

                            <button
                              type="button"
                              onClick={(e) => handleRequestDelete(acc, e)}
                              className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: DELETE CONFIRMATION MODAL (Matching Image 2)            */}
      {/* ============================================================= */}
      {accountToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in select-none"
          onClick={() => setAccountToDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] bg-white dark:bg-[#1E1E20] rounded-2xl p-6 shadow-2xl border border-slate-100 dark:border-white/10 flex flex-col animate-scale-in"
          >
            {/* Header: Delete account with X */}
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete account
              </h3>
              <button
                type="button"
                onClick={() => setAccountToDelete(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            {/* Body */}
            <div className="py-2 text-[13.5px] leading-relaxed text-slate-700 dark:text-slate-300">
              Sure you really want to delete the account{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                {accountToDelete.name}
              </span>{' '}
              ? The account will be removed from your budgets. All account transactions, standing
              orders and debts will be irrevocably lost.
            </div>

            {/* Action Buttons: No and Delete */}
            <div className="flex items-center justify-end gap-3 pt-5">
              <button
                type="button"
                onClick={() => setAccountToDelete(null)}
                className="px-6 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2 rounded-lg bg-[#FE3B2C] hover:bg-[#E02E20] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SCREEN OVERLAY: CENTER ROTATING SPINNER (Matching Image 4)    */}
      {/* ============================================================= */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 dark:bg-black/20 backdrop-blur-[0.5px] pointer-events-none animate-fade-in">
          <svg
            className="w-12 h-12 text-[#00A86B] animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-100"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}

      {/* ============================================================= */}
      {/* FLOATING TOAST NOTIFICATION (Matching Images 3 & 4)           */}
      {/* ============================================================= */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up select-none">
          {toast.type === 'deleting' ? (
            /* Image 4 Toast: Spinning loader icon */
            <div className="bg-white dark:bg-[#1E1E20] rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 p-4 flex items-center gap-3.5 min-w-[320px] sm:min-w-[360px] max-w-md">
              <svg
                className="w-5 h-5 text-[#00A86B] animate-spin flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="opacity-100"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {toast.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setToast(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Image 3 Toast: Green vertical accent bar */
            <div className="bg-white dark:bg-[#1E1E20] rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex items-stretch min-w-[320px] sm:min-w-[360px] max-w-md">
              <div className="w-1.5 bg-[#00A86B] flex-shrink-0 self-stretch" />
              <div className="p-3.5 pl-4 pr-3 flex-1 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {toast.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {toast.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer flex-shrink-0"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountsView;
