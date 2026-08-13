import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { 
  Search, 
  X, 
  PlusCircle, 
  LayoutGrid, 
  List, 
  Calculator, 
  Tag, 
  ArrowRight, 
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Milk,
  Edit2,
  Trash2
} from 'lucide-react';
import { CATEGORIES } from '../data/initialProducts';

const CATEGORY_META = {
  'Milk': { icon: '🥛', color: 'from-blue-600 to-indigo-600', badgeBg: 'bg-blue-100 text-blue-800' },
  'Curd': { icon: '🥣', color: 'from-emerald-600 to-teal-600', badgeBg: 'bg-emerald-100 text-emerald-800' },
  'Ghee': { icon: '🧈', color: 'from-amber-500 to-amber-700', badgeBg: 'bg-amber-100 text-amber-900' },
  'Paneer': { icon: '🧀', color: 'from-orange-500 to-yellow-600', badgeBg: 'bg-orange-100 text-orange-900' },
  'Beverages & Lassi': { icon: '🥤', color: 'from-cyan-600 to-teal-600', badgeBg: 'bg-cyan-100 text-cyan-800' },
  'Sweets': { icon: '🍬', color: 'from-purple-600 to-pink-600', badgeBg: 'bg-purple-100 text-purple-800' },
  'Ice Cream': { icon: '🍦', color: 'from-rose-500 to-pink-600', badgeBg: 'bg-rose-100 text-rose-800' },
  'Others': { icon: '📦', color: 'from-slate-700 to-slate-900', badgeBg: 'bg-slate-100 text-slate-800' }
};

export default function ProductSelectionStep({
  products,
  cartItems,
  onAddToCart,
  onDecreaseFromCart,
  onOpenAddModal,
  onEditProduct,
  onDeleteProduct,
  onAddCustomAmount,
  onOpenCalculator,
  onGoToCheckout,
  grandTotal
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  
  // Custom amount quick input state (ONLY AMOUNT, NO ITEM NAME)
  const [customPrice, setCustomPrice] = useState('');

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((sum, i) => sum + Math.ceil(i.quantity), 0);
  }, [cartItems]);

  const cartQtyMap = useMemo(() => {
    const map = {};
    cartItems.forEach(item => {
      map[item.id] = item.quantity;
    });
    return map;
  }, [cartItems]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const groupedProducts = useMemo(() => {
    const groups = {};

    CATEGORIES.filter(cat => cat !== 'All').forEach(cat => {
      groups[cat] = [];
    });

    filteredProducts.forEach(product => {
      const cat = product.category || 'Others';
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(product);
    });

    return groups;
  }, [filteredProducts]);

  const handleQuickAddCustom = (e) => {
    e.preventDefault();
    const amount = parseFloat(customPrice);
    if (!amount || amount <= 0) return;
    if (onAddCustomAmount) {
      onAddCustomAmount(amount, 'Unlisted Item');
    }
    setCustomPrice('');
  };

  const handlePresetAmount = (preset) => {
    if (onAddCustomAmount) {
      onAddCustomAmount(preset, 'Unlisted Item');
    }
  };

  return (
    <div className="space-y-3.5 pb-24">
      
      {/* 1. SEARCH, VIEW TOGGLE & CATEGORY SELECTOR */}
      <div className="bg-white p-2.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Grid vs List View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Compact List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions (Calculator & Add Custom Product Modal) */}
          <div className="flex items-center space-x-1.5 shrink-0">
            {onOpenCalculator && (
              <button
                type="button"
                onClick={onOpenCalculator}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1"
                title="Open Counter Calculator"
              >
                <Calculator className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline">Calc</span>
              </button>
            )}

            {onOpenAddModal && (
              <button
                type="button"
                onClick={onOpenAddModal}
                className="px-2.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden xs:inline">+ Catalog</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Touch-Optimized Category Horizontal Scroll Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center space-x-1 active:scale-95 ${
                selectedCategory === category
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
              }`}
            >
              <span>{CATEGORY_META[category]?.icon || '📋'}</span>
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. UNLISTED / MANUAL CUSTOM AMOUNT WIDGET (ONLY AMOUNT INPUT) */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-3 rounded-2xl text-white shadow-md border border-blue-900/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-[11px] font-black uppercase tracking-wider text-blue-300">
            <Tag className="w-3.5 h-3.5 text-blue-400" />
            <span>Quick Unlisted Amount</span>
          </div>
          <span className="text-[10px] text-blue-300/80 font-medium">Enter loose price (₹)</span>
        </div>

        <form onSubmit={handleQuickAddCustom} className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">₹</span>
            <input
              type="number"
              min="1"
              step="any"
              required
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              placeholder="Enter amount (e.g. 50)..."
              className="w-full pl-7 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-sm font-black text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95 shrink-0 flex items-center justify-center space-x-1"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add to Bill</span>
          </button>
        </form>

        {/* 1-Tap Quick Amount Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[10px] font-bold text-slate-400 mr-1">Quick:</span>
          {[10, 20, 30, 50, 100, 200, 500].map(amt => (
            <button
              key={amt}
              type="button"
              onClick={() => handlePresetAmount(amt)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 text-blue-200 hover:text-white rounded-lg text-xs font-extrabold border border-slate-700 transition-all active:scale-95"
            >
              +₹{amt}
            </button>
          ))}
        </div>
      </div>

      {/* 3. VISUAL PRODUCT DISPLAY (GRID OR COMPACT LIST VIEW) */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedProducts).map(([catName, catProducts]) => {
            if (catProducts.length === 0) return null;

            const meta = CATEGORY_META[catName] || { icon: '📦', color: 'from-slate-700 to-slate-800', badgeBg: 'bg-slate-100 text-slate-800' };

            return (
              <section key={catName} className="space-y-2">
                {/* Category Header */}
                <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm sticky top-[60px] z-20 backdrop-blur-md bg-white/95">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{meta.icon}</span>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight">
                      {catName}
                    </h3>
                  </div>
                  <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${meta.badgeBg}`}>
                    {catProducts.length} {catProducts.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* VIEW MODE 1: GRID VIEW */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                    {catProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        inCartQty={cartQtyMap[product.id] || 0}
                        onAddToCart={onAddToCart}
                        onDecrease={onDecreaseFromCart}
                        onEdit={onEditProduct}
                        onDelete={onDeleteProduct}
                      />
                    ))}
                  </div>
                ) : (
                  /* VIEW MODE 2: COMPACT LIST VIEW FOR HIGH DENSITY MOBILE COUNTER USE */
                  <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
                    {catProducts.map(product => {
                      const qty = cartQtyMap[product.id] || 0;
                      return (
                        <div
                          key={product.id}
                          className={`p-2.5 flex items-center justify-between gap-2 transition-colors ${
                            qty > 0 ? 'bg-blue-50/40' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200 relative">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <Milk className="w-4 h-4 text-blue-500" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                                {product.name}
                              </h4>
                              <p className="text-[11px] font-black text-blue-700">
                                ₹{product.price} <span className="text-[10px] text-slate-400 font-normal">/ {product.unit.toLowerCase()}</span>
                              </p>
                            </div>
                          </div>

                          {/* Quick Edit/Delete & + / - Controls in List View */}
                          <div className="flex items-center space-x-1.5 shrink-0">
                            {onEditProduct && (
                              <button
                                type="button"
                                onClick={() => onEditProduct(product)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit item amount & details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onDeleteProduct && (
                              <button
                                type="button"
                                onClick={() => onDeleteProduct(product.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {qty > 0 ? (
                              <div className="flex items-center space-x-1.5 bg-blue-100 p-0.5 rounded-xl border border-blue-200">
                                <button
                                  type="button"
                                  onClick={() => onDecreaseFromCart(product)}
                                  className="w-7 h-7 rounded-lg bg-white text-blue-700 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
                                >
                                  <Minus className="w-3.5 h-3.5 stroke-[3]" />
                                </button>
                                <span className="w-5 text-center font-black text-xs text-blue-900">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onAddToCart(product)}
                                  className="w-7 h-7 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
                                >
                                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onAddToCart(product)}
                                className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 hover:bg-blue-600 hover:text-white font-extrabold text-xs flex items-center space-x-1 transition-all active:scale-95 border border-slate-200"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                <span>Add</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">No matching products</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              No products found matching "{searchTerm}".
            </p>
          </div>
        </div>
      )}

      {/* 4. STICKY MOBILE BOTTOM ACTION BAR (NEXT: SEE BILL) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 text-white border-t border-slate-800 p-2.5 shadow-2xl backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center space-x-2.5">
            <div className="relative bg-blue-600/30 p-2 rounded-xl border border-blue-500/40">
              <ShoppingCart className="w-5 h-5 text-blue-400" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </div>
            <div>
              <div className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">Total</div>
              <div className="text-lg sm:text-xl font-black text-white leading-none">
                ₹{grandTotal.toFixed(2).replace(/\.00$/, '')}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onGoToCheckout}
            disabled={cartItems.length === 0}
            className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center space-x-1.5 shadow-lg transition-all active:scale-95 shrink-0 ${
              cartItems.length > 0
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 border-2 border-emerald-400'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>NEXT: SEE BILL</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

        </div>
      </div>

    </div>
  );
}
