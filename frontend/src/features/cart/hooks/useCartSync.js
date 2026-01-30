import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  syncCartOnLogin, 
  syncCartOnLogout, 
  syncCartToBackend,
  loadCartFromBackend,
  selectCartItems 
} from '../slices/cartSlice';
import { useAuth } from '../../auth/contexts/AuthContext';

/**
Custom Hook: Monitors user login/logout status and automatically synchronizes the shopping cart.

Features:
1. When the user logs in:
    - Merges the guest shopping cart into the user's shopping cart (localStorage)
    - Synchronizes the local shopping cart with the backend
    - Loads the shopping cart from the backend
2. When the user logs out: Switches to the guest shopping cart
 */
export function useCartSync() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useAuth();
  const cartItems = useSelector(selectCartItems);

  useEffect(() => {
    const syncCart = async () => {
      if (isLoggedIn) {
        // Check if there is any visitor shopping cart data.
        const guestCartJson = localStorage.getItem('cart_guest');
        const guestCart = guestCartJson ? JSON.parse(guestCartJson) : [];

        if (guestCart.length > 0) {
          // Regardless of whether it has been synchronized or not, 
          // the latest complete state will ultimately be retrieved from the backend.
          await dispatch(syncCartToBackend(guestCart));
          
          // If there is visitor data, synchronize (merge) it with the backend first.
          localStorage.removeItem('cart_guest');
        } 
        
        // 
        await dispatch(loadCartFromBackend());

        // Note: syncCartOnLogin is primarily used to merge the local Redux state, but since we have decided
        // to prioritize the backend data and only handle guest data, the Redux state will ultimately be overwritten by loadCartFromBackend.
        // Therefore, calling syncCartOnLogin here is actually unnecessary, or it only needs to be used to clear the local state.
      } else {
        // The user has logged out and switched to the guest shopping cart.
        dispatch(syncCartOnLogout());
      }
    };

    syncCart();
  }, [isLoggedIn, dispatch]);
}

// Helper function: Get the current user ID
const getCurrentUserId = () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.id || payload.sub;
  } catch (error) {
    return null;
  }
};