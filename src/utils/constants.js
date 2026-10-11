// Financial Categories for Finora
export const TRANSACTION_TYPES = {
  EXPENSE: 'expense',
  INCOME: 'income',
  TRANSFER: 'transfer',
};

export const ACCOUNT_TYPES = [
  { id: 'mobile_banking', label: 'bKash / Nagad / Rocket', icon: 'Smartphone', color: '#E2136E' },
  { id: 'bank', label: 'Bank Account (Checking)', icon: 'Building2', color: '#3B82F6' },
  { id: 'cash', label: 'Cash / Wallet', icon: 'Banknote', color: '#10B981' },
  { id: 'savings', label: 'DPS / Fixed Deposit / Savings', icon: 'PiggyBank', color: '#8B5CF6' },
  { id: 'credit_card', label: 'Credit Card', icon: 'CreditCard', color: '#F43F5E' },
  { id: 'investment', label: 'Investment / Stocks / Share', icon: 'TrendingUp', color: '#06B6D4' },
  { id: 'crypto', label: 'Crypto & Assets', icon: 'Coins', color: '#F59E0B' },
];

export const EXPENSE_CATEGORIES = [
  { id: 'groceries', name: 'Bazar & Groceries', icon: 'ShoppingCart', color: '#10B981', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  { id: 'food_dining', name: 'Food & Restaurants', icon: 'Utensils', color: '#F97316', bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  { id: 'housing', name: 'House Rent & Service', icon: 'Home', color: '#8B5CF6', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  { id: 'utilities', name: 'Electricity, Gas & WASA', icon: 'Zap', color: '#EAB308', bg: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
  { id: 'transportation', name: 'Transport, Fuel & Ride', icon: 'Car', color: '#3B82F6', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { id: 'mobile_internet', name: 'Internet & Mobile Recharge', icon: 'Wifi', color: '#06B6D4', bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
  { id: 'shopping', name: 'Shopping & Clothing', icon: 'ShoppingBag', color: '#EC4899', bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
  { id: 'health', name: 'Healthcare & Medicine', icon: 'HeartPulse', color: '#EF4444', bg: 'bg-red-500/10 text-red-600 dark:text-red-400' },
  { id: 'education', name: 'Education & Tuition', icon: 'GraduationCap', color: '#6366F1', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
  { id: 'family_gift', name: 'Family Support & Gifts', icon: 'Gift', color: '#A855F7', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  { id: 'zakat_charity', name: 'Zakat & Sadakah / Charity', icon: 'HandHeart', color: '#14B8A6', bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
  { id: 'entertainment', name: 'Entertainment & Outing', icon: 'Film', color: '#F43F5E', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  { id: 'other_expense', name: 'Other Expenses', icon: 'MoreHorizontal', color: '#64748B', bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' },
];

export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Monthly Salary', icon: 'Briefcase', color: '#10B981', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  { id: 'freelance', name: 'Freelance & Remittance', icon: 'Laptop', color: '#06B6D4', bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
  { id: 'business', name: 'Business Profits', icon: 'Building', color: '#3B82F6', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { id: 'investments_income', name: 'DPS Profit & Dividends', icon: 'TrendingUp', color: '#8B5CF6', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  { id: 'rental', name: 'Rental Income', icon: 'Key', color: '#F97316', bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  { id: 'bonus', name: 'Festival / Eid Bonus', icon: 'Gift', color: '#EC4899', bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
  { id: 'other_income', name: 'Other Income', icon: 'PlusCircle', color: '#64748B', bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' },
];

// Defaulting BDT (৳) as primary currency!
export const CURRENCIES = [
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', rate: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.0083 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.0076 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0065 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 0.72 },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', rate: 0.031 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 0.030 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rate: 0.011 },
];
