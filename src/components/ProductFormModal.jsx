import React, { useState, useEffect } from 'react';
import { X, Upload, Milk, Check, Image as ImageIcon } from 'lucide-react';
import { CATEGORIES, UNITS } from '../data/initialProducts';

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  editingProduct
}) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('Packet');
  const [category, setCategory] = useState('Milk & Dahi');
  const [badge, setBadge] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setPrice(editingProduct.price ? editingProduct.price.toString() : '');
      setUnit(editingProduct.unit || 'Packet');
      setCategory(editingProduct.category || 'Milk & Dahi');
      setBadge(editingProduct.badge || '');
      setImageUrl(editingProduct.image || '');
    } else {
      setName('');
      setPrice('');
      setUnit('Packet');
      setCategory('Milk & Dahi');
      setBadge('');
      setImageUrl('');
    }
    setErrors({});
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  // Handle local image file upload & convert to Base64 Data URL
  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Image size should be less than 2MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
        setErrors((prev) => ({ ...prev, image: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      newErrors.price = 'Please enter a valid price (>= 0)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: name.trim(),
      price: numPrice,
      unit,
      category,
      badge: badge.trim(),
      image: imageUrl.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-pulse-subtle">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Milk className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-bold">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dodla Toned Milk"
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.name ? 'border-rose-500' : 'border-slate-300'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-500 font-medium mt-1">{errors.name}</p>}
          </div>

          {/* Price & Unit Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="30"
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.price ? 'border-rose-500' : 'border-slate-300'
                }`}
              />
              {errors.price && <p className="text-xs text-rose-500 font-medium mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Unit *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Badge */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {CATEGORIES.filter(c => c !== 'All').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Size / Badge (Optional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. 500 ml, 200 g"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Product Image Option (URL or File Upload) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Product Image
            </label>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste Image URL or upload file..."
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              
              <label className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-semibold cursor-pointer flex items-center space-x-1 shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            {errors.image && <p className="text-xs text-rose-500 font-medium">{errors.image}</p>}

            {/* Image Preview */}
            {imageUrl && (
              <div className="mt-2 w-full h-24 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setErrors((prev) => ({ ...prev, image: 'Invalid image URL' }))}
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-slate-900/80 text-white p-1 rounded-full text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors text-sm flex items-center space-x-1"
            >
              <Check className="w-4 h-4" />
              <span>{editingProduct ? 'Update Product' : 'Save Product'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
