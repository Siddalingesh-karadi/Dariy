import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Search, X, PlusCircle, LayoutGrid } from 'lucide-react';
import { CATEGORIES } from '../data/initialProducts';

export default function ProductGrid({ 
  products, 
  cartItems, 
  onAddToCart,
  onOpenAddModal 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  return (
    <div className="space-y-4">
      {/* Search & Category Header */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Milk, Curd, Sweets, Ice Cream..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Add Product Button */}
          {onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-sm font-semibold transition-colors shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Custom Item</span>
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Product Cards */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              inCartQty={cartQtyMap[product.id] || 0}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        /* Empty Search / Catalog State */
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
                ? 'Your product catalog is empty. Add items so you can start calculating customer purchases.'
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
