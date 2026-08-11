import React from 'react';
import { RotateCcw, ArrowRight, Wallet, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CashCalculator({
  grandTotal,
  amountReceived,
  setAmountReceived,
  onNewCustomer,
  hasItems
}) {
  const parsedReceived = parseFloat(amountReceived) || 0;
  const isPaidEnough = parsedReceived >= grandTotal;
  const difference = Math.abs(parsedReceived - grandTotal);
  const formattedDifference = difference.toFixed(2).replace(/\.00$/, '');

  // Common tender currency presets in India
  const quickCashPresets = [50, 100, 200, 500];

  const handleQuickAddCash = (amount) => {
    setAmountReceived(amount.toString());
  };

  const handleExactCash = () => {
    setAmountReceived(grandTotal.toString());
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-5 space-y-5">
      
      {/* 1. GRAND TOTAL DISPLAY */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-4 sm:p-5 shadow-inner relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none">
          <Wallet className="w-40 h-40 text-white" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-blue-400">
              Grand Total
            </span>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-0.5">
              ₹{grandTotal.toFixed(2).replace(/\.00$/, '')}
            </div>
          </div>
          {hasItems && (
            <button
              onClick={handleExactCash}
              type="button"
              className="px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-xs font-bold rounded-xl border border-blue-400/30 transition-colors shadow-sm"
            >
              Exact Cash
            </button>
          )}
        </div>
      </div>

      {/* 2. AMOUNT RECEIVED INPUT & QUICK TENDER BUTTONS */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Amount Received (₹)
        </label>
        
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">
            ₹
          </span>
          <input
            type="number"
            min="0"
            step="any"
            value={amountReceived}
            onChange={(e) => setAmountReceived(e.target.value)}
            placeholder="0"
            className="w-full pl-9 pr-12 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-xl font-black text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
          />
          {amountReceived && (
            <button
              onClick={() => setAmountReceived('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-200 px-2 py-1 rounded-md"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Cash Tender Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {quickCashPresets.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handleQuickAddCash(amount)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold rounded-lg border border-slate-300 transition-colors active:scale-95"
            >
              ₹{amount}
            </button>
          ))}
        </div>
      </div>

      {/* 3. RETURN / REMAINING DISPLAY */}
      {grandTotal > 0 && amountReceived !== '' && (
        <div className="pt-2">
          {isPaidEnough ? (
            /* RETURN AMOUNT BADGE (GREEN) */
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-emerald-500 flex items-center justify-between animate-pulse-subtle">
              <div>
                <div className="flex items-center space-x-1 text-emerald-200 text-xs uppercase font-extrabold tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Return to Customer</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black mt-1 text-white tracking-tight">
                  RETURN ₹{formattedDifference}
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-xs bg-emerald-800/80 px-2.5 py-1 rounded-lg font-bold border border-emerald-400/30">
                  Change Complete
                </span>
              </div>
            </div>
          ) : (
            /* REMAINING AMOUNT BADGE (ORANGE) */
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-amber-400 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-1 text-amber-100 text-xs uppercase font-extrabold tracking-wider">
                  <AlertCircle className="w-4 h-4" />
                  <span>Customer Pays Less</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black mt-1 text-white tracking-tight">
                  REMAINING ₹{formattedDifference}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs bg-amber-700/80 px-2.5 py-1 rounded-lg font-bold border border-amber-300/30">
                  Pending ₹{formattedDifference}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. NEW CUSTOMER BUTTON */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNewCustomer}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 touch-active border-2 border-emerald-500"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          <span className="tracking-wide">NEW CUSTOMER</span>
        </button>
      </div>

    </div>
  );
}
