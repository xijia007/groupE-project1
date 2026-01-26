import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  syncCartOnLogin, 
  syncCartOnLogout, 
  syncCartToBackend,
  loadCartFromBackend,
  selectCartItems 
} from '../store/cartSlice';
import { useAuth } from '../context/AuthContext';

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
        // 用户登录，先合并本地购物车
        dispatch(syncCartOnLogin());
        
        // 获取合并后的本地购物车
        const localCart = JSON.parse(localStorage.getItem(`cart_user_${getCurrentUserId()}`) || '[]');
        
        // 如果本地有购物车数据，同步到后端
        if (localCart.length > 0) {
          await dispatch(syncCartToBackend(localCart));
        } else {
          // 如果本地没有数据，从后端加载
          await dispatch(loadCartFromBackend());
        }
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
