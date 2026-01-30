import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API Base URL
const API_BASE = '/api/cart';

// Get token
const getAuthToken = () => localStorage.getItem('accessToken');

// Async Thunks for backend sync
// Load cart from backend
export const loadCartFromBackend = createAsyncThunk(
  'cart/loadFromBackend',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return [];

      const response = await fetch(API_BASE, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load cart');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add item to backend cart
export const addToCartBackend = createAsyncThunk(
  'cart/addToBackend',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity })
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update item quantity in backend cart
export const updateCartBackend = createAsyncThunk(
  'cart/updateBackend',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await fetch(`${API_BASE}/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        throw new Error('Failed to update cart');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove item from backend cart
export const removeFromCartBackend = createAsyncThunk(
  'cart/removeFromBackend',
  async (productId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await fetch(`${API_BASE}/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Clear backend cart
export const clearCartBackend = createAsyncThunk(
  'cart/clearBackend',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await fetch(API_BASE, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Sync local cart to backend (after login)
export const syncCartToBackend = createAsyncThunk(
  'cart/syncToBackend',
  async (cartItems, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return null;

      const response = await fetch(`${API_BASE}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cartItems })
      });

      if (!response.ok) {
        throw new Error('Failed to sync cart');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Get current User ID (parsed from JWT token in localStorage)
const getCurrentUserId = () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    // Parse JWT token to get user info
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.id || payload.sub;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

// Get storage key for cart
const getCartStorageKey = () => {
  const userId = getCurrentUserId();
  return userId ? `cart_user_${userId}` : 'cart_guest';
};

// Load cart from localStorage
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

// Save cart to localStorage
const saveCartToStorage = (cartItems) => {
  try {
    const key = getCartStorageKey();
    localStorage.setItem(key, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Merge two carts (used for merging guest cart on login)
const mergeCarts = (guestCart, userCart) => {
  const merged = [...userCart];
  
  guestCart.forEach(guestItem => {
    const existingIndex = merged.findIndex(item => item.id === guestItem.id);
    const stock = Number(guestItem.stock ?? Infinity);
    
    if (existingIndex >= 0) {
      // Item already exists, merge quantity
      const currentQty = merged[existingIndex].quantity;
      const newQty = currentQty + guestItem.quantity;
      
      // Check if stock is exceeded
      if (stock !== Infinity && newQty > stock) {
         merged[existingIndex].quantity = stock;
      } else {
         merged[existingIndex].quantity = newQty;
      }
    } else {
      // New item, add to cart. Also check if initial quantity exceeds stock (safety check)
      let initialQty = guestItem.quantity;
      if (stock !== Infinity && initialQty > stock) {
          initialQty = stock;
      }
      merged.push({ ...guestItem, quantity: initialQty });
    }
  });
  
  return merged;
};

const initialState = {
  items: loadCartFromStorage(),
  userId: getCurrentUserId(),
  appliedPromo: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Set applied promo code
    setAppliedPromo: (state, action) => {
      state.appliedPromo = action.payload;
    },

    // Remove promo code
    removeAppliedPromo: (state) => {
      state.appliedPromo = null;
    },

    // Add item to cart
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);
      const stock = Number(product.stock ?? Infinity);

      if (existingItem) {
        // If item exists, check stock before increasing quantity
        const newQuantity = existingItem.quantity + quantity;
        
        // Check if stock is exceeded
        if (stock !== Infinity && newQuantity > stock) {
          // Exceeds stock, set to max stock
          existingItem.quantity = stock;
        } else {
          existingItem.quantity = newQuantity;
        }
        
        // Update other properties that might have changed
        if (product.stock !== undefined) existingItem.stock = product.stock;
        if (product.price !== undefined) existingItem.price = product.price;
        if (product.name !== undefined) existingItem.name = product.name;
        if (product.img_url !== undefined) existingItem.img_url = product.img_url;
      } else {
        // If new item, check stock before adding
        const initialQuantity = stock !== Infinity && quantity > stock ? stock : quantity;
        state.items.push({ ...product, quantity: initialQuantity });
      }

      // save cart to localStorage
      saveCartToStorage(state.items);
    },

    // Update item quantity
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      if (quantity <= 0) {
        // If quantity is 0 or negative, remove item
        state.items = state.items.filter((item) => item.id !== productId);
      } else {
        const item = state.items.find((item) => item.id === productId);
        if (item) {
          const stock = Number(item.stock ?? Infinity);
          
          // Check if stock is exceeded
          if (stock !== Infinity && quantity > stock) {
            // Exceeds stock, set to max stock
            item.quantity = stock;
          } else {
            item.quantity = quantity;
          }
        }
      }

      saveCartToStorage(state.items);
    },

    // Remove item from cart
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      saveCartToStorage(state.items);
    },

    // Clear cart
    clearCart: (state) => {
      state.items = [];
      state.appliedPromo = null; // Clear promo on cart clear? Usually yes.
      saveCartToStorage(state.items);
    },

    // Sync cart on user login
    syncCartOnLogin: (state) => {
      const newUserId = getCurrentUserId();
      
      if (newUserId && newUserId !== state.userId) {
        // User just logged in, need to merge carts
        const guestCart = [...state.items]; // Current guest cart
        
        // Load user's cart
        const userCartKey = `cart_user_${newUserId}`;
        let userCart = [];
        try {
          const savedUserCart = localStorage.getItem(userCartKey);
          userCart = savedUserCart ? JSON.parse(savedUserCart) : [];
        } catch (error) {
          console.error('Error loading user cart:', error);
        }
        
        // Merge carts
        state.items = mergeCarts(guestCart, userCart);
        state.userId = newUserId;
        
        // Save merged cart
        saveCartToStorage(state.items);
        
        // Clear guest cart
        try {
          localStorage.removeItem('cart_guest');
        } catch (error) {
          console.error('Error removing guest cart:', error);
        }
      }
    },

    // Switch to guest cart on logout
    syncCartOnLogout: (state) => {
      // Clear current cart
      state.items = [];
      state.userId = null;
      state.appliedPromo = null; // Reset promo on logout
      
      // Load guest cart
      try {
        const guestCart = localStorage.getItem('cart_guest');
        state.items = guestCart ? JSON.parse(guestCart) : [];
      } catch (error) {
        console.error('Error loading guest cart:', error);
      }
    },

    // Update product details in cart (e.g. price change)
    updateProductInCart: (state, action) => {
       const { id, updates } = action.payload;
       const item = state.items.find(item => item.id === id);
       if (item) {
           // Merge updates keys into item
           Object.assign(item, updates);
           saveCartToStorage(state.items);
       }
    },
  },
  extraReducers: (builder) => {
    builder
      // Load cart from backend
      .addCase(loadCartFromBackend.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload;
          saveCartToStorage(action.payload);
        }
      })
      // Add to backend cart
      .addCase(addToCartBackend.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload;
          saveCartToStorage(action.payload);
        }
      })
      // Update backend cart
      .addCase(updateCartBackend.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload;
          saveCartToStorage(action.payload);
        }
      })
      // Remove from backend cart
      .addCase(removeFromCartBackend.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload;
          saveCartToStorage(action.payload);
        }
      })
      // Clear backend cart
      .addCase(clearCartBackend.fulfilled, (state, action) => {
        state.items = [];
        saveCartToStorage([]);
      })
      // Sync to backend
      .addCase(syncCartToBackend.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload;
          saveCartToStorage(action.payload);
        }
      });
  },
});

// Export actions
export const { 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart,
  syncCartOnLogin,
  syncCartOnLogout,
  setAppliedPromo,
  removeAppliedPromo,
  updateProductInCart
} = cartSlice.actions;

// Selectors - Get data from state
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

export const selectAppliedPromo = (state) => state.cart.appliedPromo;

// Export reducer
export default cartSlice.reducer;