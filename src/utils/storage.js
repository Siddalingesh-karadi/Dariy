import { INITIAL_PRODUCTS } from '../data/initialProducts';

const PRODUCTS_KEY = 'dairy_calculator_products_v1';
const SHOP_INFO_KEY = 'dairy_calculator_shop_info_v1';

export const getStoredProducts = () => {
  try {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Clean up legacy categories if present
        const sanitized = parsed.map((p) => {
          let cat = p.category;
          if (cat === 'Milk & Dahi' || cat === 'Milk & Curd' || cat === 'Milk and Curd') {
            const nameLower = (p.name || '').toLowerCase();
            cat = (nameLower.includes('curd') || nameLower.includes('dahi')) ? 'Curd' : 'Milk';
          }
          let img = p.image;
          // Fix legacy broken Unsplash URLs
          if (img && img.includes('photo-1571217865189-d99bc4d28341')) {
            img = 'https://images.unsplash.com/photo-1570560258879-af7f8e1447ac?w=400&auto=format&fit=crop&q=80';
          } else if (img && img.includes('photo-1560008515-d72b220c5717')) {
            img = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop&q=80';
          }
          return { ...p, category: cat || 'Milk', image: img };
        });
        return sanitized;
      }
    }
  } catch (err) {
    console.error('Error reading from localStorage:', err);
  }
  // Fallback to initial products preset
  saveProducts(INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
};

export const saveProducts = (products) => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
};

export const resetProductsToDefault = () => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  } catch (err) {
    console.error('Error resetting products:', err);
    return INITIAL_PRODUCTS;
  }
};

export const getStoredShopInfo = () => {
  try {
    const saved = localStorage.getItem(SHOP_INFO_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Error reading shop info:', err);
  }
  return {
    shopName: 'Dodla Dairy Outlet',
    subHeader: 'Visual Price Calculator'
  };
};

export const saveShopInfo = (info) => {
  try {
    localStorage.setItem(SHOP_INFO_KEY, JSON.stringify(info));
  } catch (err) {
    console.error('Error saving shop info:', err);
  }
};
