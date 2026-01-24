import { createSlice } from '@reduxjs/toolkit';

// 获取当前用户 ID（从 localStorage 的 token 中解析）
const getCurrentUserId = () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    // 解析 JWT token 获取用户信息
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.id || payload.sub;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

// 获取购物车存储的 key
const getCartStorageKey = () => {
  const userId = getCurrentUserId();
  return userId ? `cart_user_${userId}` : 'cart_guest';
};

// 从 localStorage 加载购物车
const loadCartFromStorage = () => {
  try {
    const key = getCartStorageKey();
    const savedCart = localStorage.getItem(key);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

// 保存购物车到 localStorage
const saveCartToStorage = (cartItems) => {
  try {
    const key = getCartStorageKey();
    localStorage.setItem(key, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// 合并两个购物车（用于登录时合并访客购物车）
const mergeCarts = (guestCart, userCart) => {
  const merged = [...userCart];
  
  guestCart.forEach(guestItem => {
    const existingIndex = merged.findIndex(item => item.id === guestItem.id);
    
    if (existingIndex >= 0) {
      // 商品已存在，合并数量
      merged[existingIndex].quantity += guestItem.quantity;
    } else {
      // 新商品，添加到购物车
      merged.push(guestItem);
    }
  });
  
  return merged;
};

const initialState = {
  items: loadCartFromStorage(),
  userId: getCurrentUserId(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 添加商品到购物车
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        // 如果商品已存在，增加数量
        existingItem.quantity += quantity;
      } else {
        // 如果是新商品，添加到购物车
        state.items.push({ ...product, quantity });
      }

      // 保存到 localStorage
      saveCartToStorage(state.items);
    },

    // 更新商品数量
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        // 如果数量为 0 或负数，移除商品
        state.items = state.items.filter((item) => item.id !== productId);
      } else {
        const item = state.items.find((item) => item.id === productId);
        if (item) {
          item.quantity = quantity;
        }
      }

      saveCartToStorage(state.items);
    },

    // 从购物车移除商品
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      saveCartToStorage(state.items);
    },

    // 清空购物车
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },

    // 用户登录时同步购物车
    syncCartOnLogin: (state) => {
      const newUserId = getCurrentUserId();
      
      if (newUserId && newUserId !== state.userId) {
        // 用户刚登录，需要合并购物车
        const guestCart = [...state.items]; // 当前访客购物车
        
        // 加载用户的购物车
        const userCartKey = `cart_user_${newUserId}`;
        let userCart = [];
        try {
          const savedUserCart = localStorage.getItem(userCartKey);
          userCart = savedUserCart ? JSON.parse(savedUserCart) : [];
        } catch (error) {
          console.error('Error loading user cart:', error);
        }
        
        // 合并购物车
        state.items = mergeCarts(guestCart, userCart);
        state.userId = newUserId;
        
        // 保存合并后的购物车
        saveCartToStorage(state.items);
        
        // 清除访客购物车
        try {
          localStorage.removeItem('cart_guest');
        } catch (error) {
          console.error('Error removing guest cart:', error);
        }
      }
    },

    // 用户登出时切换到访客购物车
    syncCartOnLogout: (state) => {
      // 清空当前购物车
      state.items = [];
      state.userId = null;
      
      // 加载访客购物车
      try {
        const guestCart = localStorage.getItem('cart_guest');
        state.items = guestCart ? JSON.parse(guestCart) : [];
      } catch (error) {
        console.error('Error loading guest cart:', error);
      }
    },
  },
});

// 导出 actions
export const { 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart,
  syncCartOnLogin,
  syncCartOnLogout,
} = cartSlice.actions;

// Selectors - 用于从 state 中获取数据
export const selectCartItems = (state) => state.cart.items;

export const selectCartTotalItems = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartTotalPrice = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export const selectItemQuantity = (productId) => (state) => {
  const item = state.cart.items.find((item) => item.id === productId);
  return item ? item.quantity : 0;
};

export const selectCartUserId = (state) => state.cart.userId;

// 导出 reducer
export default cartSlice.reducer;
