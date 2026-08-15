import React, { useState } from 'react';
import QuantityControl from './QuantityControl';
import { 
  ArrowLeft, 
  RotateCcw, 
  ShoppingCart, 
  Trash2, 
  Milk, 
  PlusCircle, 
  Tag, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function CheckoutStep({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddCustomAmount,
  grandTotal,
  amountReceived,
  setAmountReceived,
  onNewCustomer,
  onBackToSelection
}) {
  // Extra amount quick input state (ONLY AMOUNT, NO ITEM NAME)
  const [extraAmount, setExtraAmount] = useState('');

  const parsedReceived = parseFloat(amountReceived) || 0;
  const isPaidEnough = parsedReceived >= grandTotal;
  const difference = Math.abs(parsedReceived - grandTotal);
  const formattedDifference = difference.toFixed(2).replace(/\.00$/, '');

  const quickCashPresets = [50, 100, 200, 500];

  const handleAddExtraAmount = (e) => {
    e.preventDefault();
    const val = parseFloat(extraAmount);
    if (!val || val <= 0) return;
    if (onAddCustomAmount) {
      onAddCustomAmount(val, 'Extra Amount');
    }
    setExtraAmount('');
  };

  const handlePresetExtra = (presetVal) => {
    if (onAddCustomAmount) {
      onAddCustomAmount(presetVal, 'Extra Amount');
    }
  };

  const handleQuickAddCash = (amount) => {
    setAmountReceived(amount.toString());
  };

  const handleExactCash = () => {
    setAmountReceived(grandTotal.toString());
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3.5 pb-20">
      
      {/* Top Navigation & Title Bar */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={onBackToSelection}
          className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-extrabold transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          <span>Add More Items</span>
        </button>

        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            Step 2 of 2
          </span>
          <h2 className="font-black text-xs sm:text-base text-slate-900 leading-tight mt-0.5">
            Bill Review & Cash Change
          </h2>
        </div>
      </div>

      {/* 1. INSTANT EXTRA AMOUNT WIDGET (REQUEST 4) */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-3 sm:p-4 rounded-2xl text-white shadow-md border border-blue-900/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs font-black uppercase tracking-wider text-blue-300">
            <Tag className="w-4 h-4 text-blue-400" />
            <span>Add Extra Amount to Bill</span>
          </div>
          <span className="text-[10px] text-blue-300/80 font-medium">Add extra item/charge</span>
        </div>

        <form onSubmit={handleAddExtraAmount} className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">₹</span>
            <input
              type="number"
              min="1"
              step="any"
              required
              value={extraAmount}
              onChange={(e) => setExtraAmount(e.target.value)}
              placeholder="Enter extra amount (e.g. 20)..."
              className="w-full pl-7 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-sm font-black text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95 shrink-0 flex items-center justify-center space-x-1"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add to Bill</span>
          </button>
        </form>

        {/* 1-Tap Quick Extra Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[10px] font-bold text-slate-400 mr-1">Quick:</span>
          {[10, 15, 20, 30, 50, 100].map(val => (
            <button
              key={val}
              type="button"
              onClick={() => handlePresetExtra(val)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 text-blue-200 hover:text-white rounded-lg text-xs font-extrabold border border-slate-700 transition-all active:scale-95"
            >
              +₹{val}
            </button>
          ))}
        </div>
      </div>

      {/* 2. ITEMIZED BILL SUMMARY CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-xs sm:text-sm">Items in Bill</h3>
            <span className="bg-blue-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              className="text-xs text-rose-300 hover:text-white flex items-center space-x-1 font-bold px-2 py-1 rounded hover:bg-rose-900/50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Bill</span>
            </button>
          )}
        </div>

        {/* Item List */}
        <div className="p-3 sm:p-4 divide-y divide-slate-100 space-y-2.5 max-h-[300px] overflow-y-auto">
          {cartItems.length > 0 ? (
            cartItems.map((item) => {
              const itemTotal = parseFloat((item.price * item.quantity).toFixed(2));

              return (
                <div
                  key={item.id}
                  className="pt-2.5 first:pt-0 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200 relative">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full flex items-center justify-center bg-blue-50/50"
                        style={{ display: item.image ? 'none' : 'flex' }}
                      >
                        <Milk className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        ₹{item.price} / {item.unit.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <QuantityControl
                      quantity={item.quantity}
                      unit={item.unit}
                      onUpdateQuantity={(newQty) => onUpdateQuantity(item.id, newQty)}
                      onRemove={() => onRemoveItem(item.id)}
                    />
                  </div>

                  <div className="text-right shrink-0 min-w-[60px]">
                    <div className="text-xs sm:text-sm font-black text-slate-900">
                      ₹{itemTotal}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      ({item.quantity} {item.unit})
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-slate-400 text-xs font-bold">
              No items in current bill. Go back to select items.
            </div>
          )}
        </div>

        {/* Grand Total Footer Banner */}
        <div className="p-3.5 bg-slate-900 text-white border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
              Total Amount Payable
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ₹{grandTotal.toFixed(2).replace(/\.00$/, '')}
            </div>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={handleExactCash}
              type="button"
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-black rounded-xl text-white transition-all shadow-sm active:scale-95 border border-blue-400/30"
            >
              Exact Cash
            </button>
          )}
        </div>

      </div>

      {/* 3. CASH RECEIVED & CHANGE CALCULATOR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-3.5 sm:p-5 space-y-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
            Amount Received from Customer (₹)
          </label>
          
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-black text-slate-400">
              ₹
            </span>
            <input
              type="number"
              min="0"
              step="any"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
              placeholder="Enter cash given..."
              className="w-full pl-9 pr-14 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl text-xl sm:text-2xl font-black text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
            />
            {amountReceived && (
              <button
                onClick={() => setAmountReceived('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-200 px-2 py-1 rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Cash Tender Presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {quickCashPresets.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleQuickAddCash(amount)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black rounded-xl border border-slate-300 transition-all active:scale-95"
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>

        {/* 4. RETURN CHANGE / REMAINING DISPLAY BANNER */}
        {grandTotal > 0 && amountReceived !== '' && (
          <div className="pt-1">
            {isPaidEnough ? (
              /* GREEN RETURN CHANGE BADGE */
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-3.5 sm:p-4 shadow-lg border border-emerald-500 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-1 text-emerald-200 text-[11px] uppercase font-black tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Return to Customer</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black mt-0.5 text-white tracking-tight">
                    RETURN ₹{formattedDifference}
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-xs bg-emerald-800/80 px-3 py-1 rounded-xl font-black border border-emerald-400/30">
                    Payment Complete
                  </span>
                </div>
              </div>
            ) : (
              /* ORANGE REMAINING BADGE */
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-3.5 sm:p-4 shadow-md border border-amber-400 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-1 text-amber-100 text-[11px] uppercase font-black tracking-wider">
                    <AlertCircle className="w-4 h-4" />
                    <span>Customer Pays Less</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black mt-0.5 text-white tracking-tight">
                    REMAINING ₹{formattedDifference}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-amber-700/80 px-2.5 py-1 rounded-lg font-black border border-amber-300/30">
                    Pending ₹{formattedDifference}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. NEW CUSTOMER RESET BUTTON */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onNewCustomer}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2 touch-active border-2 border-emerald-500"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          <span className="tracking-wide">FINISH & START NEW CUSTOMER 🔄</span>
        </button>
      </div>

    </div>
  );
}
