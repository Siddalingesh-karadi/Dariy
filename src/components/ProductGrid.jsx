import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Search, X, PlusCircle, LayoutGrid, Calculator, Tag } from 'lucide-react';
import { CATEGORIES } from '../data/initialProducts';

// Icons & styles for category section headers
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

export default function ProductGrid({ 
  products, 
  cartItems, 
  onAddToCart,
  onOpenAddModal,
  onAddCustomAmount,
  onOpenCalculator 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Custom amount quick input state
  const [customPrice, setCustomPrice] = useState('');
  const [customName, setCustomName] = useState('');

  // Map of product quantities in cart
  const cartQtyMap = useMemo(() => {
    const map = {};
    cartItems.forEach(item => {
      map[item.id] = item.quantity;
    });
    return map;
  }, [cartItems]);

  // Filter products based on search & category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Group products by Category for section display
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
      onAddCustomAmount(amount, customName.trim() || 'Custom Item');
    }
    setCustomPrice('');
    setCustomName('');
  };

  return (
    <div className="space-y-4">
      
      {/* Search & Mobile Optimized Category Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Milk, Curd, Ghee, Paneer..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Actions (Add Custom & Calculator) */}
          <div className="flex items-center space-x-2 shrink-0">
            {onOpenCalculator && (
              <button
                type="button"
                onClick={onOpenCalculator}
                className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-sm min-h-[44px]"
                title="Open Counter Calculator"
              >
                <Calculator className="w-4 h-4 text-blue-400" />
                <span>Calc</span>
              </button>
            )}

            {onOpenAddModal && (
              <button
                type="button"
                onClick={onOpenAddModal}
                className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-3.5 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs sm:text-sm font-bold transition-colors min-h-[44px]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Product</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Horizontal Scrollable Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none touch-pan-x">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all min-h-[38px] flex items-center space-x-1 ${
                selectedCategory === category
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              <span>{CATEGORY_META[category]?.icon || '📋'}</span>
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* QUICK ADDITIONAL AMOUNT (UNLISTED MOBILE FRIENDLY WIDGET) */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-3 sm:p-4 rounded-2xl text-white shadow-md border border-blue-900/40">
        <form onSubmit={handleQuickAddCustom} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-blue-300">
              <Tag className="w-4 h-4 text-blue-400" />
              <span>Unlisted / Additional Amount:</span>
            </div>
            <span className="text-[10px] text-blue-300/80 font-medium">Quick add to bill</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Item name (optional)"
              className="flex-1 px-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="relative w-28 sm:w-36 shrink-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                placeholder="Price"
                className="w-full pl-7 pr-2 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm font-black text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 sm:px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95 shrink-0 flex items-center justify-center space-x-1 min-h-[42px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </form>
      </div>

      {/* SEPARATE CATEGORY SECTIONS GRID */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedProducts).map(([catName, catProducts]) => {
            if (catProducts.length === 0) return null;

            const meta = CATEGORY_META[catName] || { icon: '📦', color: 'from-slate-700 to-slate-800', badgeBg: 'bg-slate-100 text-slate-800' };

            return (
              <section key={catName} className="space-y-3">
                {/* Category Section Header */}
                <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-sm sticky top-[68px] z-20 backdrop-blur-md bg-white/95">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{meta.icon}</span>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                      {catName}
                    </h3>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${meta.badgeBg}`}>
                    {catProducts.length} {catProducts.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Mobile Responsive Grid: 2 columns on mobile, 3-4 on tablet/desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                  {catProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      inCartQty={cartQtyMap[product.id] || 0}
                      onAddToCart={onAddToCart}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <LayoutGrid className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {products.length === 0 ? 'No products added yet' : 'No matching products found'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {products.length === 0
                ? 'Your product catalog is empty. Add items to start calculating.'
                : `No products matching "${searchTerm}" in category "${selectedCategory}".`}
            </p>
          </div>

          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-md transition-colors text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
