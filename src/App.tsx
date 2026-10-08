import React, { useState } from 'react';
import {
  Wallet,
  Utensils,
  Bus,
  BookOpen,
  PartyPopper,
  Package,
  Lightbulb,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  History,
  Trash2,
  ShieldAlert,
  Loader2,
  Tag
} from 'lucide-react';
import { analyzeExpense as localAnalyzeExpense, ExpenseAnalysis, Category } from './utils/expenseAnalyzer';

const CATEGORY_CONFIG: Record<
  Category,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    activeRing: string;
    activeBg: string;
    badgeBg: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
  }
> = {
  Food: {
    label: 'Food',
    bg: 'bg-emerald-50/80',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    activeRing: 'ring-2 ring-emerald-500 shadow-md shadow-emerald-100',
    activeBg: 'bg-emerald-100/90 border-emerald-400',
    badgeBg: 'bg-emerald-600 text-white',
    icon: Utensils,
    description: 'Meals, snacks & drinks',
  },
  Travel: {
    label: 'Travel',
    bg: 'bg-sky-50/80',
    text: 'text-sky-800',
    border: 'border-sky-200',
    activeRing: 'ring-2 ring-sky-500 shadow-md shadow-sky-100',
    activeBg: 'bg-sky-100/90 border-sky-400',
    badgeBg: 'bg-sky-600 text-white',
    icon: Bus,
    description: 'Bus, metro & commute',
  },
  Study: {
    label: 'Study',
    bg: 'bg-indigo-50/80',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    activeRing: 'ring-2 ring-indigo-500 shadow-md shadow-indigo-100',
    activeBg: 'bg-indigo-100/90 border-indigo-400',
    badgeBg: 'bg-indigo-600 text-white',
    icon: BookOpen,
    description: 'Books, stationery & Xerox',
  },
  Fun: {
    label: 'Fun',
    bg: 'bg-rose-50/80',
    text: 'text-rose-800',
    border: 'border-rose-200',
    activeRing: 'ring-2 ring-rose-500 shadow-md shadow-rose-100',
    activeBg: 'bg-rose-100/90 border-rose-400',
    badgeBg: 'bg-rose-600 text-white',
    icon: PartyPopper,
    description: 'Movies, gaming & outings',
  },
  Other: {
    label: 'Other',
    bg: 'bg-amber-50/80',
    text: 'text-amber-800',
    border: 'border-amber-200',
    activeRing: 'ring-2 ring-amber-500 shadow-md shadow-amber-100',
    activeBg: 'bg-amber-100/90 border-amber-400',
    badgeBg: 'bg-amber-600 text-white',
    icon: Package,
    description: 'Rent, recharges & bills',
  },
};

const SAMPLE_EXPENSES = [
  'Movie ticket 250',
  'Samosa ₹20',
  'Bus ticket 15',
  'Notebook ₹45',
  'Chai ₹10',
  'Hello world',
];

interface LoggedExpense {
  id: string;
  itemName: string;
  formattedAmount: string;
  category: Category;
  savingTip: string;
  time: string;
}

export default function App() {
  const [inputVal, setInputVal] = useState('');
  const [currentResult, setCurrentResult] = useState<ExpenseAnalysis | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedTip, setCopiedTip] = useState(false);
  const [expenseHistory, setExpenseHistory] = useState<LoggedExpense[]>([]);

  const handleAnalyze = async (valueToAnalyze?: string) => {
    const text = typeof valueToAnalyze === 'string' ? valueToAnalyze : inputVal;
    const trimmed = text.trim();

    if (!trimmed) {
      setCurrentResult({
        isValid: false,
        rawInput: text,
        error: 'Please enter an expense',
      });
      setHasSubmitted(true);
      return;
    }

    setIsLoading(true);
    setHasSubmitted(true);

    try {
      // Call backend endpoint utilizing Gemini API
      const res = await fetch('/api/analyze-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: ExpenseAnalysis = await res.json();
      setCurrentResult(data);

      if (data.isValid && data.itemName && data.category && data.savingTip) {
        const newEntry: LoggedExpense = {
          id: Date.now().toString(),
          itemName: data.itemName,
          formattedAmount: data.formattedAmount || '',
          category: data.category,
          savingTip: data.savingTip,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setExpenseHistory((prev) => [newEntry, ...prev.slice(0, 9)]);
      }
    } catch (err) {
      console.warn('Backend Gemini API call error, falling back locally:', err);
      // Fallback to updated rule analyzer
      const fallbackResult = localAnalyzeExpense(trimmed);
      setCurrentResult(fallbackResult);

      if (fallbackResult.isValid && fallbackResult.itemName && fallbackResult.category && fallbackResult.savingTip) {
        const newEntry: LoggedExpense = {
          id: Date.now().toString(),
          itemName: fallbackResult.itemName,
          formattedAmount: fallbackResult.formattedAmount || '',
          category: fallbackResult.category,
          savingTip: fallbackResult.savingTip,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setExpenseHistory((prev) => [newEntry, ...prev.slice(0, 9)]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const handleSampleClick = (sample: string) => {
    setInputVal(sample);
    handleAnalyze(sample);
  };

  const copyTipToClipboard = (tip: string) => {
    navigator.clipboard.writeText(tip);
    setCopiedTip(true);
    setTimeout(() => setCopiedTip(false), 2000);
  };

  const clearHistory = () => {
    setExpenseHistory([]);
  };

  const activeCategory = currentResult?.isValid ? currentResult.category : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-zinc-100 text-slate-900 flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900 font-sans">
      {/* Top Banner / Navigation */}
      <header className="border-b border-slate-200/90 bg-white/90 backdrop-blur-md sticky top-0 z-20 shadow-xs">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-sm shadow-teal-200">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  Student Money Buddy
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  Gemini Powered
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Smart expense categorizer & saving tips</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-6">
        {/* Intro */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Track smart. Save more.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-1.5 leading-relaxed">
            Type an expense like{' '}
            <button
              onClick={() => handleSampleClick('Movie ticket 250')}
              className="font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200 transition inline-flex items-center gap-1 cursor-pointer"
            >
              Movie ticket 250
            </button>{' '}
            or{' '}
            <button
              onClick={() => handleSampleClick('Samosa ₹20')}
              className="font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition inline-flex items-center gap-1 cursor-pointer"
            >
              Samosa ₹20
            </button>
            . We extract the item, classify its category, and highlight the matching box with an actionable student saving tip.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm hover:shadow-md transition">
          <label htmlFor="expense-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Your Expense
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                id="expense-input"
                type="text"
                value={inputVal}
                disabled={isLoading}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  if (hasSubmitted && !e.target.value) {
                    setHasSubmitted(false);
                    setCurrentResult(null);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Movie ticket 250, Samosa ₹20, Bus ticket 15"
                className="w-full px-4 py-3 sm:py-3.5 text-base rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-3 focus:ring-teal-100 outline-none transition placeholder:text-slate-400 bg-slate-50/60 font-medium disabled:opacity-60"
              />
              {inputVal && !isLoading && (
                <button
                  type="button"
                  onClick={() => {
                    setInputVal('');
                    setCurrentResult(null);
                    setHasSubmitted(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition"
                  title="Clear input"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleAnalyze()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-98 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Quick Sample Buttons */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Try sample:</span>
            {SAMPLE_EXPENSES.map((sample) => (
              <button
                key={sample}
                type="button"
                disabled={isLoading}
                onClick={() => handleSampleClick(sample)}
                className={`px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                  inputVal === sample
                    ? 'bg-teal-50 border-teal-300 text-teal-800 font-semibold ring-1 ring-teal-400'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Output Section */}
        {hasSubmitted && currentResult && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            {!currentResult.isValid ? (
              /* Invalid input message */
              <div className="bg-rose-50/90 border-2 border-rose-200 rounded-2xl p-5 sm:p-6 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-rose-900">
                    {currentResult.error || 'Please enter an expense'}
                  </h3>
                  <p className="text-sm text-rose-700 mt-1 leading-relaxed">
                    An expense needs both an item name and a cost. Try examples like{' '}
                    <span className="font-semibold underline">Movie ticket 250</span>,{' '}
                    <span className="font-semibold underline">Samosa ₹20</span>, or{' '}
                    <span className="font-semibold underline">Bus ticket 15</span>.
                  </p>
                </div>
              </div>
            ) : (
              /* Valid Expense Result Card */
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
                {/* Header with Item Name (without price) & Category */}
                <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/40">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Item Name
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          (without price)
                        </span>
                      </div>
                      {/* Strictly shows the item name WITHOUT the price */}
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                        {currentResult.itemName}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* Detected price tag as helpful reference */}
                      {currentResult.formattedAmount && (
                        <span className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold font-mono">
                          {currentResult.formattedAmount}
                        </span>
                      )}

                      {/* Category Badge */}
                      {currentResult.category && (
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-bold shadow-xs ${
                            CATEGORY_CONFIG[currentResult.category].bg
                          } ${CATEGORY_CONFIG[currentResult.category].text} ${
                            CATEGORY_CONFIG[currentResult.category].border
                          }`}
                        >
                          {(() => {
                            const IconComponent = CATEGORY_CONFIG[currentResult.category].icon;
                            return <IconComponent className="w-4 h-4" />;
                          })()}
                          <span>{currentResult.category}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Saving Tip Card */}
                <div className="p-5 sm:p-6 bg-gradient-to-b from-slate-50/50 to-white flex flex-col gap-4">
                  <div className="flex items-start gap-3.5 bg-amber-50/90 border border-amber-200 rounded-xl p-4 sm:p-4.5 shadow-xs">
                    <div className="w-9 h-9 rounded-xl bg-amber-200/70 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Lightbulb className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                          Saving Tip
                        </span>
                        <button
                          type="button"
                          onClick={() => currentResult.savingTip && copyTipToClipboard(currentResult.savingTip)}
                          className="inline-flex items-center gap-1 text-xs text-amber-900 hover:text-amber-950 font-semibold px-2 py-1 rounded-md bg-amber-100/70 hover:bg-amber-200/80 transition cursor-pointer"
                          title="Copy tip"
                        >
                          {copiedTip ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-slate-800 text-sm sm:text-base font-medium mt-1 leading-relaxed">
                        {currentResult.savingTip}
                      </p>
                    </div>
                  </div>

                  {/* Safety / Risk Note */}
                  <div className="flex items-start gap-3 bg-blue-50/70 border border-blue-200/80 rounded-xl px-4 py-3 text-xs text-blue-900">
                    <ShieldAlert className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <span className="font-bold text-blue-950">Safety & Risk Note:</span> Tips are general, not financial advice. Every student’s personal budget and campus expenses differ—plan according to your personal financial needs.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Supported Categories Grid (Focus element: div 4) */}
        {/* Here we highlight the matching box to which category it fits! */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Expense Categories
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeCategory ? (
                  <span>
                    Current expense fits into{' '}
                    <strong className="text-slate-900">{activeCategory}</strong> (highlighted below)
                  </span>
                ) : (
                  <span>The matched category box will highlight automatically</span>
                )}
              </p>
            </div>
            {activeCategory && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                <Check className="w-3.5 h-3.5 text-teal-600" />
                Category Matched
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => {
              const cfg = CATEGORY_CONFIG[cat];
              const IconComp = cfg.icon;
              const isSelected = activeCategory === cat;

              return (
                <div
                  key={cat}
                  className={`relative flex flex-col justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? `${cfg.activeBg} ${cfg.activeRing} scale-[1.03] z-10`
                      : `${cfg.bg} ${cfg.border} ${
                          activeCategory ? 'opacity-55 hover:opacity-100' : 'opacity-100'
                        } hover:border-slate-300`
                  }`}
                >
                  {/* Top row with icon & match indicator */}
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? cfg.badgeBg : `${cfg.bg} border ${cfg.border}`
                      }`}
                    >
                      <IconComp
                        className={`w-4 h-4 ${isSelected ? 'text-white' : cfg.text}`}
                      />
                    </div>

                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-slate-900 shadow-xs border border-slate-200">
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                        Fits
                      </span>
                    )}
                  </div>

                  <div>
                    <h5 className={`text-sm font-bold ${cfg.text}`}>{cat}</h5>
                    <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                      {cfg.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center gap-1 text-[11px] font-semibold text-slate-800">
                      <Tag className="w-3 h-3 text-slate-500" />
                      <span>Active Match</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Session Log */}
        {expenseHistory.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recent Expenses ({expenseHistory.length})
                </h4>
              </div>
              <button
                type="button"
                onClick={clearHistory}
                className="text-xs text-slate-400 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer font-medium"
                title="Clear history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {expenseHistory.map((item) => {
                const cfg = CATEGORY_CONFIG[item.category];
                return (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.badgeBg}`} />
                      <span className="font-bold text-slate-900 truncate">{item.itemName}</span>
                      <span className="text-xs text-slate-400 font-mono font-medium shrink-0">
                        {item.formattedAmount}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                      >
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400 hidden sm:inline">{item.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer with Mandatory Disclaimer & Risk Note */}
      <footer className="border-t border-slate-200/90 bg-white py-6 mt-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-1">
          <p className="text-xs font-medium text-slate-600">
            Tips are general, not financial advice.
          </p>
          <p className="text-[11px] text-slate-400">
            Student Money Buddy • Powered by Gemini API • Risk note: Tips are informative guidelines only
          </p>
        </div>
      </footer>
    </div>
  );
}
