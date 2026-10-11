import React from 'react';

export const LoadingSpinner = ({ label = 'Loading your wallet...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F0F2F5] dark:bg-slate-950 transition-colors">
      {/* Centered green circular spinner matching Screenshot 1 */}
      <div className="w-10 h-10 border-3 border-slate-200 dark:border-slate-800 border-t-[#00875A] rounded-full animate-spin" />
      {label && (
        <p className="mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
          {label}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
