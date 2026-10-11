import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Check, Calendar, ArrowRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import Modal from '../common/Modal';

export const ExportStatementModal = ({ isOpen, onClose }) => {
  const { transactions, accounts, formatMoney, currentCurrency } = useFinance();
  const [timeframe, setTimeframe] = useState('all');
  const [formatType, setFormatType] = useState('csv');
  const [isExported, setIsExported] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    // 1. Filter by timeframe
    let filtered = [...transactions];
    const now = new Date();

    if (timeframe === 'this_month') {
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      filtered = filtered.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      });
    } else if (timeframe === 'last_3_months') {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      filtered = filtered.filter((t) => new Date(t.date) >= threeMonthsAgo);
    }

    if (formatType === 'csv') {
      // Build CSV
      const headers = ['ID', 'Date', 'Type', 'Amount', 'Currency', 'Category', 'Account', 'Payee', 'Note', 'Status'];
      const rows = filtered.map((t) => {
        const acc = accounts.find((a) => a.id === t.accountId);
        return [
          t.id,
          t.date,
          t.type,
          t.amount,
          currentCurrency.code,
          t.category,
          acc ? `"${acc.name}"` : 'N/A',
          `"${t.payee || ''}"`,
          `"${(t.note || '').replace(/"/g, '""')}"`,
          t.status || 'cleared',
        ].join(',');
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `financial_statement_${timeframe}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (formatType === 'json') {
      const jsonContent =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify({ exportedAt: new Date().toISOString(), currency: currentCurrency.code, transactions: filtered }, null, 2));
      const link = document.createElement('a');
      link.setAttribute('href', jsonContent);
      link.setAttribute('download', `financial_backup_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (formatType === 'print') {
      window.print();
    }

    setIsExported(true);
    setTimeout(() => {
      setIsExported(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Financial Statement">
      <div className="space-y-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Download your complete financial records, expenses, and account statements for auditing or record keeping.
        </p>

        {/* Timeframe Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Select Statement Period
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'this_month', label: 'This Month' },
              { id: 'last_3_months', label: 'Last 90 Days' },
              { id: 'all', label: `All Records (${transactions.length})` },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTimeframe(item.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                  timeframe === item.id
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            File Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFormatType('csv')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                formatType === 'csv'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              <span className="text-xs font-bold">CSV Excel</span>
              <span className="text-[10px] text-slate-400">Spreadsheet</span>
            </button>

            <button
              type="button"
              onClick={() => setFormatType('json')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                formatType === 'json'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="text-xs font-bold">JSON Data</span>
              <span className="text-[10px] text-slate-400">Raw Backup</span>
            </button>

            <button
              type="button"
              onClick={() => setFormatType('print')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                formatType === 'print'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Download className="w-5 h-5 text-purple-500" />
              <span className="text-xs font-bold">Print View</span>
              <span className="text-[10px] text-slate-400">Paper/PDF</span>
            </button>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            {isExported ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Statement</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportStatementModal;
