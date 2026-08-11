import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import CashCalculator from './components/CashCalculator';
import ProductManager from './components/ProductManager';
import ProductFormModal from './components/ProductFormModal';
import ConfirmModal from './components/ConfirmModal';
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

  // Modals state
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
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
            quantity: 1
          }
        ];
      }
    });
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

  // Clear Cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Grand Total Calculation
  const grandTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
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
    // Sync active cart item price / unit / name if present
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
      title: 'Reset Catalog to Dodla Presets?',
      message: 'This will restore default reference products (Milk, Curd, Sweets, Ice Cream). Any custom products will be replaced.',
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
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        productCount={products.length}
        cartCount={cart.reduce((sum, i) => sum + Math.ceil(i.quantity), 0)}
        shopInfo={shopInfo}
        onResetDefaults={handleResetDefaults}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeTab === 'calculator' ? (
          /* CALCULATOR VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left Column: Visual Product Cards Grid (Cols 7 on Desktop) */}
            <div className="lg:col-span-7 space-y-4">
              <ProductGrid
                products={products}
                cartItems={cart}
                onAddToCart={handleAddToCart}
                onOpenAddModal={() => setIsQuickAddModalOpen(true)}
              />
            </div>

            {/* Right Column: Active Cart & Cash Return Calculator (Cols 5 on Desktop) */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              <Cart
                cartItems={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                onClearCart={() => setCart([])}
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

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-300">{shopInfo.shopName}</span> • Visual Price Calculator
          </div>
          <div className="text-[11px] text-slate-500">
            Client-Side LocalStorage Operations • Instant Counter Calculation
          </div>
        </div>
      </footer>

      {/* Quick Add Modal */}
      <ProductFormModal
        isOpen={isQuickAddModalOpen}
        onClose={() => setIsQuickAddModalOpen(false)}
        onSave={(newProd) => {
          handleAddProduct(newProd);
          handleAddToCart(newProd);
        }}
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
