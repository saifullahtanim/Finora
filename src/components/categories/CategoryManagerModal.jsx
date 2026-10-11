import React, { useState, useMemo, useRef } from 'react';
import {
  X,
  Check,
  ArrowLeft,
  Search,
  Tag,
  Trash2,
  Pipette,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { searchWorldEmojis } from '../../utils/emojiData';

export const CategoryManagerModal = ({
  isOpen,
  onClose,
  onCategoryCreated,
  initialType = 'expense',
}) => {
  const { customCategories, addCustomCategory, deleteCustomCategory } = useFinance();

  const [activeTab, setActiveTab] = useState('create'); // 'create' | 'manage'
  const [type, setType] = useState(initialType);
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🍔');
  const [emojiSearchQuery, setEmojiSearchQuery] = useState('');
  const [selectedColor, setSelectedColor] = useState('#00A86B');
  const [error, setError] = useState('');
  const colorPickerInputRef = useRef(null);

  const displayedEmojis = useMemo(() => {
    return searchWorldEmojis(emojiSearchQuery);
  }, [emojiSearchQuery]);

  const handleCreate = (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a category name');
      return;
    }
    setError('');

    const newCat = addCustomCategory({
      name: name.trim(),
      icon: 'Tag',
      emoji: selectedEmoji || '🏷️',
      color: selectedColor || '#00A86B',
      type,
    });

    setName('');
    if (onCategoryCreated) {
      onCategoryCreated(newCat);
    }
    onClose();
  };

  const handleDelete = (id, catName) => {
    if (window.confirm(`Delete category "${catName}"?`)) {
      deleteCustomCategory(id);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in select-none font-sans overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[490px] sm:max-w-[510px] bg-white dark:bg-[#1C1C1E] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden animate-scale-in my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Clean Record Theme */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  {activeTab === 'create' ? 'Add Category' : 'Custom Categories'}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-[#00875A] dark:bg-emerald-950/50 dark:text-emerald-300">
                  Custom
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {activeTab === 'create' ? 'Create a personalized category with emoji & color' : `Manage your custom categories (${customCategories.length})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab(activeTab === 'create' ? 'manage' : 'create');
                setError('');
              }}
              className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {activeTab === 'create' ? `Manage (${customCategories.length})` : '+ New'}
            </button>
            {activeTab === 'create' && (
              <button
                type="button"
                onClick={handleCreate}
                className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                title="Save Category"
              >
                <Check className="w-4.5 h-4.5 stroke-[2.2]" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4.5 h-4.5 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* Tab 1: Create View (Modern Record Theme) */}
        {activeTab === 'create' && (
          <div className="p-5 sm:p-6 space-y-4 overflow-hidden">
            {/* Live Preview Hero Card (modeled after Record hero card) */}
            <div className="relative rounded-3xl p-3.5 sm:p-4 text-center border border-emerald-100/80 dark:border-emerald-900/30 bg-gradient-to-b from-emerald-50/70 via-slate-50/40 to-white dark:from-emerald-950/20 dark:via-[#161618] dark:to-[#18181B] shadow-xs">
              <input
                ref={colorPickerInputRef}
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => colorPickerInputRef.current?.click()}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md ring-4 ring-white dark:ring-[#202024] cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                style={{ backgroundColor: selectedColor }}
                title="Click to choose color"
              >
                {selectedEmoji ? (
                  <span className="text-[34px] sm:text-[38px] leading-none select-none flex items-center justify-center">
                    {selectedEmoji}
                  </span>
                ) : (
                  <Tag className="w-8 h-8 stroke-[2.2]" />
                )}
              </button>
              <div className="mt-2.5 flex items-center justify-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {name.trim() || 'Category Preview'}
                </span>
                <button
                  type="button"
                  onClick={() => colorPickerInputRef.current?.click()}
                  className="px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-white/10 border border-slate-200/80 dark:border-white/10 text-[11px] font-semibold text-[#00A86B] dark:text-emerald-400 hover:scale-105 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  title="Change color"
                >
                  <Pipette className="w-3 h-3" />
                  <span>Change color</span>
                </button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <p className="text-xs font-semibold text-rose-500 text-center animate-shake">
                {error}
              </p>
            )}

            {/* Name Input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Category Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Coffee, Gym, Eid Gifts, Freelance..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-4 py-2.5 sm:py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#151517] text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A86B]/30 focus:bg-white dark:focus:bg-[#1E1E20] transition-all"
                autoFocus
              />
            </div>

            {/* Type Switcher (Segmented Control matching Record modal) */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Category Type
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100/90 dark:bg-[#151517] rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    type === 'expense'
                      ? 'bg-white dark:bg-[#202024] text-rose-600 dark:text-rose-400 shadow-sm border border-rose-100/80 dark:border-rose-950/60 scale-[1.01]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Expense</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    type === 'income'
                      ? 'bg-white dark:bg-[#202024] text-[#00875A] dark:text-emerald-400 shadow-sm border border-emerald-100/80 dark:border-emerald-950/60 scale-[1.01]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Income</span>
                </button>
              </div>
            </div>

            {/* Emoji Selection (Search Option alongside Icon/Emoji label) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex-shrink-0">
                  Icon / Emoji
                </label>

                {/* Clean Search Input on the right of Icon/Emoji */}
                <div className="relative flex items-center flex-1 max-w-[240px] sm:max-w-[280px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={emojiSearchQuery}
                    onChange={(e) => setEmojiSearchQuery(e.target.value)}
                    placeholder="Search emoji (e.g. food, car)..."
                    className="w-full pl-8 pr-7 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#151517] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00A86B]"
                  />
                  {emojiSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setEmojiSearchQuery('')}
                      className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Emoji Grid: Scrollable with world system emojis */}
              <div className="h-28 sm:h-32 overflow-y-auto p-2 rounded-2xl bg-slate-50 dark:bg-[#151517] border border-slate-100 dark:border-slate-800 scrollbar-thin">
                {displayedEmojis.length === 0 ? (
                  <div className="py-4 text-center">
                    <p className="text-xs text-slate-400">
                      No emoji found for "{emojiSearchQuery}"
                    </p>
                    <button
                      type="button"
                      onClick={() => setEmojiSearchQuery('')}
                      className="mt-1 text-[11px] text-[#00A86B] font-semibold hover:underline cursor-pointer"
                    >
                      Show popular emojis
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
                    {displayedEmojis.map((em, idx) => (
                      <button
                        key={`${em}-${idx}`}
                        type="button"
                        onClick={() => setSelectedEmoji(em)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-lg sm:text-xl transition-all cursor-pointer ${
                          selectedEmoji === em
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 ring-2 ring-[#00A86B] scale-110 shadow-xs'
                            : 'hover:bg-slate-200/70 dark:hover:bg-slate-800'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manage View */}
        {activeTab === 'manage' && (
          <div className="flex-1 p-4 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {customCategories.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No custom categories created yet.
              </div>
            ) : (
              customCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between py-3 px-3 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 rounded-2xl transition-all duration-150 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-xs select-none"
                      style={{ backgroundColor: cat.color || '#00A86B' }}
                    >
                      <span className="text-[20px] leading-none select-none flex items-center justify-center">
                        {cat.emoji || '🏷️'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 block">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {cat.type}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagerModal;
