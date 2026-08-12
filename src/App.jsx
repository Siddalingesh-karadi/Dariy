import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import CashCalculator from './components/CashCalculator';
import ProductManager from './components/ProductManager';
import ProductFormModal from './components/ProductFormModal';
import ConfirmModal from './components/ConfirmModal';
import CalculatorModal from './components/CalculatorModal';
import { Calculator, ShoppingCart, ArrowDown } from 'lucide-react';
import { 
  getStoredProducts, 
  saveProducts, 
  resetProductsToDefault,
  getStoredShopInfo,
  saveShopInfo 
} from './utils/storage';

export default function App() {
  const [products, setProducts] = useState(getStoredProducts);
  const [shopInfo, setShopInfo] = useState(getStoredShopInfo);
  const [cart, setCart] = useState([]);
  const [amountReceived, setAmountReceived] = useState('');
  const [activeTab, setActiveTab] = useState('calculator'); // 'calculator' | 'manage'

  // Ref to cart & cash calculator column for mobile scroll jump
  const cartRef = useRef(null);

  // Modals state
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmStyle: 'danger',
    onConfirm: () => {}
  });

  // Sync products to LocalStorage
  useEffect(() => {
    saveProducts(products);
  }, [products]);

  // Sync shop header info to LocalStorage
  useEffect(() => {
    saveShopInfo(shopInfo);
  }, [shopInfo]);

  // Add Product to Cart
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        const isDecimal = product.unit.toLowerCase() === 'kg' || product.unit.toLowerCase() === 'litre';
        const addStep = isDecimal ? 0.25 : 1;
        const newQty = parseFloat((existing.quantity + addStep).toFixed(2));
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            unit: product.unit,
            image: product.image,
            quantity: 1,
            isCustom: product.isCustom || false
          }
        ];
      }
    });
  };

  // Add Quick Custom Amount / Unlisted Item to Cart
  const handleAddCustomAmount = (amount, name = 'Custom Item') => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;
    const customItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim() || 'Custom Item',
      price: parsed,
      unit: 'Item',
      quantity: 1,
      isCustom: true
    };
    setCart((prevCart) => [...prevCart, customItem]);
  };

  // Update Item Quantity in Cart
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Grand Total Calculation
  const grandTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }, [cart]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, i) => sum + Math.ceil(i.quantity), 0);
  }, [cart]);

  // New Customer Reset Action
  const handleNewCustomerClick = () => {
    if (cart.length > 0) {
      setConfirmConfig({
        isOpen: true,
        title: 'Start New Customer?',
        message: 'This will clear the active cart and money received. The product catalog will remain saved.',
        confirmText: 'Clear & Start New',
        confirmStyle: 'primary',
        onConfirm: () => {
          setCart([]);
          setAmountReceived('');
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        }
      });
    } else {
      setCart([]);
      setAmountReceived('');
    }
  };

  // Product CRUD Handlers
  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setCart((prev) =>
      prev.map((item) =>
        item.id === updatedProduct.id
          ? {
              ...item,
              name: updatedProduct.name,
              price: updatedProduct.price,
              unit: updatedProduct.unit,
              image: updatedProduct.image
            }
          : item
      )
    );
  };

  const handleDeleteProduct = (productId) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Product?',
      message: 'Are you sure you want to remove this product from the shop catalog?',
      confirmText: 'Delete',
      confirmStyle: 'danger',
      onConfirm: () => {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        handleRemoveFromCart(productId);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleResetDefaults = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Reset Catalog to Presets?',
      message: 'This will restore default reference products (Milk, Curd, Ghee, Paneer, Sweets, Ice Cream). Any custom catalog changes will be reset.',
      confirmText: 'Reset Catalog',
      confirmStyle: 'danger',
      onConfirm: () => {
        const defaults = resetProductsToDefault();
        setProducts(defaults);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const scrollToCartMobile = () => {
    if (cartRef.current) {
      cartRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between relative pb-20 lg:pb-0">
      
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        productCount={products.length}
        cartCount={totalCartCount}
        shopInfo={shopInfo}
        onOpenCalculator={() => setIsCalculatorModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-6">
        {activeTab === 'calculator' ? (
          /* CALCULATOR VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
            
            {/* Left Column: Visual Product Cards Grid by Categories (Cols 7 on Desktop) */}
            <div className="lg:col-span-7 space-y-4">
              <ProductGrid
                products={products}
                cartItems={cart}
                onAddToCart={handleAddToCart}
                onOpenAddModal={() => setIsQuickAddModalOpen(true)}
                onAddCustomAmount={handleAddCustomAmount}
                onOpenCalculator={() => setIsCalculatorModalOpen(true)}
              />
            </div>

            {/* Right Column: Active Cart & Cash Return Calculator (Cols 5 on Desktop) */}
            <div ref={cartRef} className="lg:col-span-5 space-y-4 lg:sticky lg:top-24 scroll-mt-20">
              <Cart
                cartItems={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                onClearCart={() => setCart([])}
                onAddCustomAmount={handleAddCustomAmount}
              />

              <CashCalculator
                grandTotal={grandTotal}
                amountReceived={amountReceived}
                setAmountReceived={setAmountReceived}
                onNewCustomer={handleNewCustomerClick}
                hasItems={cart.length > 0}
              />
            </div>

          </div>
        ) : (
          /* MANAGE PRODUCTS VIEW */
          <ProductManager
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onResetDefaults={handleResetDefaults}
            shopInfo={shopInfo}
            onUpdateShopInfo={setShopInfo}
            onBackToCalculator={() => setActiveTab('calculator')}
          />
        )}
      </main>

      {/* MOBILE STICKY BOTTOM QUICK BILL BAR (VISIBLE ON MOBILE SCREENS WHEN CART HAS ITEMS) */}
      {activeTab === 'calculator' && cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900 text-white border-t border-slate-800 p-2.5 shadow-2xl backdrop-blur-md bg-slate-900/95 animate-slide-up">
          <div className="max-w-md mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-blue-400" />
                <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Bill</div>
                <div className="text-xl font-black text-white leading-tight">₹{grandTotal.toFixed(2).replace(/\.00$/, '')}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsCalculatorModalOpen(true)}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-xl border border-slate-700 active:scale-95"
                title="Calculator"
              >
                <Calculator className="w-5 h-5" />
              </button>

              <button
                onClick={scrollToCartMobile}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 shadow-md active:scale-95"
              >
                <span>View Bill / Pay</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Calculator Icon Button (Always Accessible) */}
      <button
        onClick={() => setIsCalculatorModalOpen(true)}
        className="fixed bottom-16 lg:bottom-6 right-4 lg:right-6 z-40 p-3.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-slate-900 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center border-2 border-white/30"
        title="Open Calculator Pad"
      >
        <Calculator className="w-6 h-6" />
      </button>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-300">{shopInfo.shopName}</span> • Mobile Visual Dairy Calculator
          </div>
          <div className="text-[11px] text-slate-500">
            Categorized Dairy Counter • Instant Change & Custom Amounts
          </div>
        </div>
      </footer>

      {/* Quick Add Product Modal */}
      <ProductFormModal
        isOpen={isQuickAddModalOpen}
        onClose={() => setIsQuickAddModalOpen(false)}
        onSave={(newProd) => {
          handleAddProduct(newProd);
          handleAddToCart(newProd);
        }}
      />

      {/* On-Screen Calculator Pad Modal */}
      <CalculatorModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
        onAddCustomAmount={handleAddCustomAmount}
        onSetAmountReceived={setAmountReceived}
      />

      {/* Confirmation Dialog */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        confirmStyle={confirmConfig.confirmStyle}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
