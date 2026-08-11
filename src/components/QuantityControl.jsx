import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

export default function QuantityControl({
  quantity,
  unit,
  onUpdateQuantity,
  onRemove
}) {
  const isDecimalUnit = unit.toLowerCase() === 'kg' || unit.toLowerCase() === 'litre';

  const handleDecrease = () => {
    if (isDecimalUnit) {
      const next = Math.max(0, parseFloat((quantity - 0.25).toFixed(2)));
      if (next === 0) {
        onRemove();
      } else {
        onUpdateQuantity(next);
      }
    } else {
      const next = quantity - 1;
      if (next <= 0) {
        onRemove();
      } else {
        onUpdateQuantity(next);
      }
    }
  };

  const handleIncrease = () => {
    if (isDecimalUnit) {
      const next = parseFloat((quantity + 0.25).toFixed(2));
      onUpdateQuantity(next);
    } else {
      onUpdateQuantity(quantity + 1);
    }
  };

  const handleDirectInputChange = (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val) || val <= 0) {
      // allow empty temporarily or handle 0
      if (e.target.value === '' || e.target.value === '0') {
        onUpdateQuantity(0);
      }
    } else {
      onUpdateQuantity(parseFloat(val.toFixed(2)));
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-1 sm:space-x-1.5">
        {/* Decrease / Remove Button */}
        <button
          type="button"
          onClick={handleDecrease}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors touch-active ${
            quantity <= (isDecimalUnit ? 0.25 : 1)
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          title={quantity <= (isDecimalUnit ? 0.25 : 1) ? 'Remove item' : 'Decrease'}
        >
          {quantity <= (isDecimalUnit ? 0.25 : 1) ? (
            <Trash2 className="w-3.5 h-3.5" />
          ) : (
            <Minus className="w-3.5 h-3.5 stroke-[3]" />
          )}
        </button>

        {/* Input / Display */}
        <div className="relative">
          <input
            type="number"
            step={isDecimalUnit ? "0.05" : "1"}
            min="0"
            value={quantity === 0 ? '' : quantity}
            onChange={handleDirectInputChange}
            className="w-14 sm:w-16 h-7 sm:h-8 bg-slate-50 border border-slate-300 rounded-lg text-center font-bold text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Increase Button */}
        <button
          type="button"
          onClick={handleIncrease}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors touch-active"
          title="Increase"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      {/* Decimal Quick Preset Chips for Kg / Litre */}
      {isDecimalUnit && (
        <div className="flex items-center space-x-1 pt-0.5">
          {[0.25, 0.5, 0.75, 1].map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => onUpdateQuantity(parseFloat((quantity + step).toFixed(2)))}
              className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded border border-blue-200"
            >
              +{step}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
