import React, { useState } from 'react';
import { Plus, Check, Milk } from 'lucide-react';

export default function ProductCard({ product, inCartQty, onAddToCart }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => onAddToCart(product)}
      className={`group relative bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between select-none touch-active shadow-sm hover:shadow-md ${
        inCartQty > 0
          ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20'
          : 'border-slate-200 hover:border-blue-400'
      }`}
    >
      {/* Active Quantity Badge */}
      {inCartQty > 0 && (
        <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-lg flex items-center space-x-1 border border-white">
          <Check className="w-3 h-3" />
          <span>{inCartQty} in cart</span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full h-36 sm:h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
            <Milk className="w-12 h-12 text-blue-500 mb-1" />
            <span className="text-xs font-semibold text-slate-500">{product.name}</span>
          </div>
        )}

        {/* Category Pill */}
        {product.category && (
          <span className="absolute bottom-2 left-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-900/75 text-white backdrop-blur-sm">
            {product.category}
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          {product.badge && (
            <span className="inline-block mt-0.5 text-xs text-slate-500 font-medium">
              {product.badge}
            </span>
          )}
        </div>

        {/* Price & Unit & Quick Add Button */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-blue-700 leading-tight">
              ₹{product.price}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              per {product.unit.toLowerCase()}
            </div>
          </div>

          <button
            type="button"
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              inCartQty > 0
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white'
            }`}
            title="Add to calculation"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
