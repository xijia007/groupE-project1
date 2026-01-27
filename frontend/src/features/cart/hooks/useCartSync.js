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
 * 自定义 Hook：监听用户登录/登出状态，自动同步购物车
 * 
 * 功能：
 * 1. 用户登录时：
 *    - 合并访客购物车到用户购物车（localStorage）
 *    - 同步本地购物车到后端
 *    - 从后端加载购物车
 * 2. 用户登出时：切换到访客购物车
 */
export function useCartSync() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useAuth();
  const cartItems = useSelector(selectCartItems);

  useEffect(() => {
    const syncCart = async () => {
      if (isLoggedIn) {
        // 检查是否有访客购物车数据
        const guestCartJson = localStorage.getItem('cart_guest');
        const guestCart = guestCartJson ? JSON.parse(guestCartJson) : [];

        if (guestCart.length > 0) {
          // 如果有访客数据，先同步（合并）到后端
          await dispatch(syncCartToBackend(guestCart));
          
          // 同步成功后，清除访客数据，避免重复同步
          localStorage.removeItem('cart_guest');
        } 
        
        // 无论是否同步过，最后都从后端拉取最新完全状态
        await dispatch(loadCartFromBackend());

        // 注意：syncCartOnLogin 主要是用于合并本地 Redux State，但既然我们已经决定
        // 以后端为准，并只处理访客数据，那么 Redux State 最终会被 loadCartFromBackend 覆盖。
        // 所以这里其实不需要再调用 syncCartOnLogin 了，或者只需要它来清理本地状态。
      } else {
        // 用户登出，切换到访客购物车
        dispatch(syncCartOnLogout());
      }
    };

    syncCart();
  }, [isLoggedIn, dispatch]);
}

// 辅助函数：获取当前用户 ID
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