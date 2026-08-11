import React from 'react';
import QuantityControl from './QuantityControl';
import { ShoppingCart, Trash2, Milk } from 'lucide-react';

export default function Cart({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      
      {/* Cart Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5 text-blue-400" />
          <h2 className="font-bold text-base tracking-tight">Current Cart</h2>
          <span className="bg-blue-600 text-white text-xs font-extrabold px-2 py-0.5 rounded-full">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-xs text-rose-300 hover:text-white flex items-center space-x-1 font-semibold px-2 py-1 rounded hover:bg-rose-900/50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Items</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="p-3 sm:p-4 flex-1 overflow-y-auto max-h-[380px] divide-y divide-slate-100 space-y-3">
        {cartItems.length > 0 ? (
          cartItems.map((item) => {
            const itemTotal = parseFloat((item.price * item.quantity).toFixed(2));

            return (
              <div
                key={item.id}
                className="pt-3 first:pt-0 flex items-center justify-between gap-2 group"
              >
                {/* Product Thumbnail & Info */}
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
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

                {/* Quantity Controls */}
                <div className="shrink-0">
                  <QuantityControl
                    quantity={item.quantity}
                    unit={item.unit}
                    onUpdateQuantity={(newQty) => onUpdateQuantity(item.id, newQty)}
                    onRemove={() => onRemoveItem(item.id)}
                  />
                </div>

                {/* Item Total Price */}
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
          /* Empty Cart State */
          <div className="py-12 px-4 text-center space-y-3">
            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Current Cart is Empty
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-[220px] mx-auto">
                Select a product card to start calculating.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
