import React, { useState } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, Milk, Store, Search, ArrowLeft } from 'lucide-react';
import ProductFormModal from './ProductFormModal';

export default function ProductManager({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetDefaults,
  shopInfo,
  onUpdateShopInfo,
  onBackToCalculator
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingShopName, setEditingShopName] = useState(shopInfo.shopName);
  const [isEditingShopInfo, setIsEditingShopInfo] = useState(false);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      onUpdateProduct(productData);
    } else {
      onAddProduct(productData);
    }
  };

  const handleSaveShopHeader = () => {
    if (editingShopName.trim()) {
      onUpdateShopInfo({ ...shopInfo, shopName: editingShopName.trim() });
    }
    setIsEditingShopInfo(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button
            onClick={onBackToCalculator}
            className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Calculator</span>
          </button>
          
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Manage Products & Prices
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, update prices, change units, or remove shop catalog items.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center space-x-2 touch-active"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Product</span>
          </button>

          <button
            onClick={onResetDefaults}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-colors flex items-center space-x-1.5"
            title="Reset catalog to Dodla reference presets"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Presets</span>
          </button>
        </div>
      </div>

      {/* Shop Name Settings Card */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Store className="w-6 h-6 text-blue-400" />
          <div>
            <span className="text-[11px] text-blue-300 uppercase font-bold tracking-wider">Shop Name Header</span>
            {isEditingShopInfo ? (
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="text"
                  value={editingShopName}
                  onChange={(e) => setEditingShopName(e.target.value)}
                  className="px-3 py-1 bg-slate-800 border border-blue-500 rounded-lg text-sm text-white font-bold focus:outline-none"
                />
                <button
                  onClick={handleSaveShopHeader}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-lg"
                >
                  Save
                </button>
              </div>
            ) : (
              <h3 className="font-extrabold text-lg text-white">{shopInfo.shopName}</h3>
            )}
          </div>
        </div>

        {!isEditingShopInfo && (
          <button
            onClick={() => setIsEditingShopInfo(true)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-blue-300 px-3 py-1.5 rounded-lg border border-slate-700 font-semibold"
          >
            Edit Header
          </button>
        )}
      </div>

      {/* Product List Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-4">
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products to edit..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price (₹)</th>
                <th className="p-3">Unit</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filtered.length > 0 ? (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 relative">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className="w-full h-full flex items-center justify-center bg-blue-50/50"
                          style={{ display: product.image ? 'none' : 'flex' }}
                        >
                          <Milk className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{product.name}</div>
                        {product.badge && (
                          <span className="text-[10px] text-slate-500">{product.badge}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px]">
                        {product.category || 'General'}
                      </span>
                    </td>
                    <td className="p-3 font-extrabold text-blue-700 text-sm">
                      ₹{product.price}
                    </td>
                    <td className="p-3 text-slate-600 font-semibold">
                      per {product.unit.toLowerCase()}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />
    </div>
  );
}
