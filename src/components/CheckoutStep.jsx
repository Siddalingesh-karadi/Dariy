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
  Wallet, 
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
  const [customAmount, setCustomAmount] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);

  const parsedReceived = parseFloat(amountReceived) || 0;
  const isPaidEnough = parsedReceived >= grandTotal;
  const difference = Math.abs(parsedReceived - grandTotal);
  const formattedDifference = difference.toFixed(2).replace(/\.00$/, '');

  const quickCashPresets = [50, 100, 200, 500];

  const handleAddCustom = (e) => {
    e.preventDefault();
    const val = parseFloat(customAmount);
    if (!val || val <= 0) return;
    if (onAddCustomAmount) {
      onAddCustomAmount(val, customTitle.trim() || 'Custom Item');
    }
    setCustomAmount('');
    setCustomTitle('');
    setShowAddCustom(false);
  };

  const handleQuickAddCash = (amount) => {
    setAmountReceived(amount.toString());
  };

  const handleExactCash = () => {
    setAmountReceived(grandTotal.toString());
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-20">
      
      {/* Top Navigation & Title Bar */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={onBackToSelection}
          className="flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Add More Items</span>
        </button>

        <div className="text-right">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            Step 2 of 2
          </span>
          <h2 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight mt-0.5">
            Bill Review & Cash Return
          </h2>
        </div>
      </div>

      {/* 1. ITEMIZED BILL SUMMARY CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm sm:text-base">Items in Bill</h3>
            <span className="bg-blue-600 text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowAddCustom(!showAddCustom)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-blue-300 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center space-x-1 font-bold transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Extra Item</span>
            </button>

            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-rose-300 hover:text-white flex items-center space-x-1 font-bold px-2 py-1 rounded hover:bg-rose-900/50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Add Extra Item Form inside Checkout */}
        {showAddCustom && (
          <form onSubmit={handleAddCustom} className="p-3 bg-blue-50 border-b border-blue-100 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Add Extra Unlisted Item</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAddCustom(false)}
                className="text-[11px] text-blue-600 hover:text-blue-900 font-bold"
              >
                Cancel
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Item name (optional)"
                className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="relative w-28">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-full pl-6 pr-2 py-2 bg-white border border-blue-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shrink-0"
              >
                Add
              </button>
            </div>
          </form>
        )}

        {/* Item List */}
        <div className="p-3 sm:p-4 divide-y divide-slate-100 space-y-3 max-h-[320px] overflow-y-auto">
          {cartItems.length > 0 ? (
            cartItems.map((item) => {
              const itemTotal = parseFloat((item.price * item.quantity).toFixed(2));

              return (
                <div
                  key={item.id}
                  className="pt-3 first:pt-0 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200 relative">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <Milk className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
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

                  <div className="text-right shrink-0 min-w-[65px]">
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
            <div className="py-8 text-center text-slate-400 text-xs font-semibold">
              No items in current bill. Go back to select items.
            </div>
          )}
        </div>

        {/* Grand Total Footer Banner */}
        <div className="p-4 bg-slate-900 text-white border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
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
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-bold rounded-xl text-white transition-all shadow-sm"
            >
              Exact Cash
            </button>
          )}
        </div>

      </div>

      {/* 2. CASH RECEIVED & CHANGE CALCULATOR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-5 space-y-4">
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
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
              placeholder="Enter cash given by customer..."
              className="w-full pl-9 pr-14 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-2xl font-black text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
            />
            {amountReceived && (
              <button
                onClick={() => setAmountReceived('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-200 px-2.5 py-1 rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Cash Tender Presets */}
          <div className="flex flex-wrap gap-2 pt-1">
            {quickCashPresets.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleQuickAddCash(amount)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black rounded-xl border border-slate-300 transition-all active:scale-95"
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>

        {/* 3. RETURN CHANGE / REMAINING DISPLAY BANNER */}
        {grandTotal > 0 && amountReceived !== '' && (
          <div className="pt-2">
            {isPaidEnough ? (
              /* GREEN RETURN CHANGE BADGE */
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
                  <span className="text-xs bg-emerald-800/80 px-3 py-1.5 rounded-xl font-bold border border-emerald-400/30">
                    Payment Complete
                  </span>
                </div>
              </div>
            ) : (
              /* ORANGE REMAINING BADGE */
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
      </div>

      {/* 4. NEW CUSTOMER RESET BUTTON */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNewCustomer}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2 touch-active border-2 border-emerald-500"
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          <span className="tracking-wide">FINISH & START NEW CUSTOMER 🔄</span>
        </button>
      </div>

    </div>
  );
}
