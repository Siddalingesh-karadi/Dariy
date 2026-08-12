import React from 'react';
import { ShoppingBag, Settings, Store, Calculator, CheckCircle2 } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  productCount, 
  cartCount,
  shopInfo,
  onOpenCalculator,
  step,
  setStep
}) {
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-30 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand & Shop Context */}
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
              <Store className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-white truncate max-w-[140px] sm:max-w-none">
                  {shopInfo.shopName}
                </h1>
              </div>
              
              {/* Step indicator on mobile header */}
              {activeTab === 'calculator' && (
                <div className="flex items-center space-x-1 mt-0.5">
                  <button
                    onClick={() => setStep(1)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                      step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    1. Select
                  </button>
                  <span className="text-slate-600 text-[10px]">➔</span>
                  <button
                    onClick={() => setStep(2)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                      step === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    2. Bill ({cartCount})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation & Quick Calculator Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Direct Quick Calculator Button */}
            {onOpenCalculator && (
              <button
                type="button"
                onClick={onOpenCalculator}
                className="flex items-center space-x-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 border border-blue-400/30"
                title="Open Counter Calculator"
              >
                <Calculator className="w-4 h-4 text-blue-200" />
                <span className="hidden sm:inline">Calc</span>
              </button>
            )}

            {/* Mode Switcher */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'calculator'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden xs:inline">Counter</span>
              </button>

              <button
                onClick={() => setActiveTab('manage')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'manage'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Manage</span>
                <span className="text-xs px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded-full">
                  {productCount}
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
