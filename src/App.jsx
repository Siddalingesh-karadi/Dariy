import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ProductSelectionStep from './components/ProductSelectionStep';
import CheckoutStep from './components/CheckoutStep';
import ProductManager from './components/ProductManager';
import ProductFormModal from './components/ProductFormModal';
import ConfirmModal from './components/ConfirmModal';
import CalculatorModal from './components/CalculatorModal';
import { Calculator } from 'lucide-react';
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
  const [cartHistory, setCartHistory] = useState([]);
  const [amountReceived, setAmountReceived] = useState('');
  const [activeTab, setActiveTab] = useState('calculator'); // 'calculator' | 'manage'
  const [step, setStep] = useState(1); // 1: Select Items, 2: Checkout & Return

  // Helper to record cart snapshot for Undo
  const saveCartSnapshot = (currentCart) => {
    setCartHistory((prev) => [...prev.slice(-20), currentCart]);
  };

  const handleUndoCart = () => {
    if (cartHistory.length === 0) return;
    const previousCart = cartHistory[cartHistory.length - 1];
    setCartHistory((prev) => prev.slice(0, prev.length - 1));
    setCart(previousCart);
  };

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingModalProduct, setEditingModalProduct] = useState(null);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmStyle: 'danger',
    onConfirm: () => {}
  });

  const handleOpenAddModal = () => {
    setEditingModalProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingModalProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSaveModalProduct = (productData) => {
    if (editingModalProduct) {
      handleUpdateProduct(productData);
    } else {
      handleAddProduct(productData);
      handleAddToCart(productData);
    }
  };

  // Sync products to LocalStorage
  useEffect(() => {
    saveProducts(products);
  }, [products]);

  // Sync shop header info to LocalStorage
  useEffect(() => {
    saveShopInfo(shopInfo);
  }, [shopInfo]);

  // Scroll to top when changing steps
  const handleSetStep = (newStep) => {
    setStep(newStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Product to Cart
  const handleAddToCart = (product) => {
    saveCartSnapshot(cart);
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

  // Decrease Product Quantity from Cart
  const handleDecreaseFromCart = (product) => {
    saveCartSnapshot(cart);
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (!existing) return prevCart;

      const isDecimal = product.unit.toLowerCase() === 'kg' || product.unit.toLowerCase() === 'litre';
      const stepVal = isDecimal ? 0.25 : 1;
      const newQty = parseFloat((existing.quantity - stepVal).toFixed(2));

      if (newQty <= 0) {
        return prevCart.filter((item) => item.id !== product.id);
      } else {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
    });
  };

  // Add Quick Custom Amount / Unlisted Item to Cart
  const handleAddCustomAmount = (amount, name = 'Custom Item') => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;
    saveCartSnapshot(cart);
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
    saveCartSnapshot(cart);
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
    saveCartSnapshot(cart);
    setCart((prevCart) => {
      const nextCart = prevCart.filter((item) => item.id !== productId);
      if (nextCart.length === 0 && step === 2) {
        setStep(1);
      }
      return nextCart;
    });
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
        confirmText: 'Finish & Reset',
        confirmStyle: 'primary',
        onConfirm: () => {
          setCart([]);
          setAmountReceived('');
          setStep(1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        }
      });
    } else {
      setCart([]);
      setAmountReceived('');
      setStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between relative">
      
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        productCount={products.length}
        cartCount={totalCartCount}
        shopInfo={shopInfo}
        onOpenCalculator={() => setIsCalculatorModalOpen(true)}
        step={step}
        setStep={handleSetStep}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-6">
        {activeTab === 'calculator' ? (
          /* STEP 1 vs STEP 2 VIEWS */
          step === 1 ? (
            /* STEP 1: ITEM SELECTION & CUSTOM ENTRY */
            <ProductSelectionStep
              products={products}
              cartItems={cart}
              onAddToCart={handleAddToCart}
              onDecreaseFromCart={handleDecreaseFromCart}
              onOpenAddModal={handleOpenAddModal}
              onAddCustomAmount={handleAddCustomAmount}
              onOpenCalculator={() => setIsCalculatorModalOpen(true)}
              onGoToCheckout={() => handleSetStep(2)}
              onUndoCart={handleUndoCart}
              canUndo={cartHistory.length > 0}
              grandTotal={grandTotal}
            />
          ) : (
            /* STEP 2: CHECKOUT & CASH RETURN CALCULATOR */
            <CheckoutStep
              cartItems={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveFromCart}
              onClearCart={() => {
                setCart([]);
                handleSetStep(1);
              }}
              onAddCustomAmount={handleAddCustomAmount}
              grandTotal={grandTotal}
              amountReceived={amountReceived}
              setAmountReceived={setAmountReceived}
              onNewCustomer={handleNewCustomerClick}
              onBackToSelection={() => handleSetStep(1)}
            />
          )
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

      {/* Floating Counter Calculator Button */}
      <button
        onClick={() => setIsCalculatorModalOpen(true)}
        className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40 p-3.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-slate-900 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center border-2 border-white/30"
        title="Open Calculator Pad"
      >
        <Calculator className="w-6 h-6" />
      </button>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-300">{shopInfo.shopName}</span> • Mobile Dairy Counter Workflow
          </div>
          <div className="text-[11px] text-slate-500">
            2-Step Mobile Counter • Item Selection & Cash Change Return
          </div>
        </div>
      </footer>

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingModalProduct(null);
        }}
        onSave={handleSaveModalProduct}
        editingProduct={editingModalProduct}
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
