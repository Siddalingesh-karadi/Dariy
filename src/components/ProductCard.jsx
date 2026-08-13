import React, { useState } from 'react';
import { Plus, Minus, Check, Milk } from 'lucide-react';

export default function ProductCard({
  product,
  inCartQty = 0,
  onAddToCart,
  onDecrease
}) {
  const [imageError, setImageError] = useState(false);
  const isDecimalUnit = product.unit?.toLowerCase() === 'kg' || product.unit?.toLowerCase() === 'litre';

  const handleCardClick = (e) => {
    // If clicking on quantity buttons, don't trigger full card click
    if (e.target.closest('.qty-btn')) return;
    onAddToCart(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between select-none touch-active shadow-sm hover:shadow-md ${
        inCartQty > 0
          ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/30'
          : 'border-slate-200 hover:border-blue-400'
      }`}
    >
      {/* Active Quantity Badge Header */}
      {inCartQty > 0 && (
        <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white font-black text-[11px] px-2 py-0.5 rounded-full shadow-md flex items-center space-x-1 border border-white">
          <Check className="w-3 h-3 stroke-[3]" />
          <span>{inCartQty} {product.unit}</span>
        </div>
      )}

      {/* Product Image / Icon Area - Compact height for mobile */}
      <div className="relative w-full h-28 sm:h-36 bg-slate-100 flex items-center justify-center overflow-hidden">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
            <Milk className="w-10 h-10 text-blue-500 mb-1" />
            <span className="text-[11px] font-semibold text-slate-500 line-clamp-1">{product.name}</span>
          </div>
        )}

        {/* Category Badge */}
        {product.category && (
          <span className="absolute bottom-1.5 left-1.5 text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-sm">
            {product.category}
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          {product.badge && (
            <span className="inline-block mt-0.5 text-[10px] text-slate-500 font-semibold">
              {product.badge}
            </span>
          )}
        </div>

        {/* Price & Touch-Friendly Quantity Controls */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
          <div>
            <div className="text-base sm:text-lg font-black text-blue-700 leading-none">
              ₹{product.price}
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
              per {product.unit.toLowerCase()}
            </div>
          </div>

          {/* Quick Add / Minus Controls */}
          {inCartQty > 0 ? (
            <div className="flex items-center space-x-1 bg-blue-100/80 p-0.5 rounded-xl border border-blue-200">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDecrease) onDecrease(product);
                }}
                className="qty-btn w-8 h-8 rounded-lg bg-white text-blue-700 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95 border border-blue-200"
                title="Decrease quantity"
              >
                <Minus className="w-4 h-4 stroke-[3]" />
              </button>
              <span className="w-5 text-center font-black text-xs text-blue-900">
                {inCartQty}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="qty-btn w-8 h-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
                title="Add 1 more"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="qty-btn px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-blue-600 hover:text-white font-extrabold text-xs flex items-center space-x-1 transition-all active:scale-95 shadow-sm border border-slate-200"
              title="Add to bill"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
