import express from 'express';
import { 
    getCart, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart,
    syncCart 
} from '../controllers/cart_controller.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// 所有购物车路由都需要认证
router.use(authenticateToken);

// 获取购物车
router.get('/', getCart);

// 添加商品到购物车
router.post('/', addToCart);

// 同步本地购物车（登录后合并）
router.post('/sync', syncCart);

// 更新购物车商品数量
router.put('/:productId', updateCartItem);

// 从购物车删除商品
router.delete('/:productId', removeFromCart);

// 清空购物车
router.delete('/', clearCart);

export default router;
