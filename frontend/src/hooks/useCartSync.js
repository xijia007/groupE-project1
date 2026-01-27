import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { syncCartOnLogin, syncCartOnLogout } from '../store/cartSlice';
import { useAuth } from '../context/AuthContext';

/**
 * 自定义 Hook：监听用户登录/登出状态，自动同步购物车
 * 
 * 功能：
 * 1. 用户登录时：合并访客购物车到用户购物车
 * 2. 用户登出时：切换到访客购物车
 */
export function useCartSync() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      // 用户登录，同步购物车
      dispatch(syncCartOnLogin());
    } else {
      // 用户登出，切换到访客购物车
      dispatch(syncCartOnLogout());
    }
  }, [isLoggedIn, dispatch]);
}
