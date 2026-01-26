import User from '../models/User.js';
import Product from '../models/Products.js';

// 获取用户购物车
export const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const user = await User.findById(userId).populate({
            path: 'cart.productId',
            select: 'name price img_url stock category description'
        });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // 过滤掉已删除的商品
        const validCart = user.cart.filter(item => item.productId !== null);
        
        // 如果购物车有变化，更新数据库
        if (validCart.length !== user.cart.length) {
            user.cart = validCart;
            await user.save();
        }

        // 格式化购物车数据
        const cartItems = validCart.map(item => ({
            id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            img_url: item.productId.img_url,
            stock: item.productId.stock,
            category: item.productId.category,
            description: item.productId.description,
            quantity: item.quantity,
            addedAt: item.addedAt
        }));

        res.status(200).json({
            success: true,
            data: cartItems
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to get cart',
            error: error.message 
        });
    }
};

// 添加商品到购物车
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Product ID is required' 
            });
        }

        // 验证商品是否存在
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        // 检查库存
        if (product.stock < quantity) {
            return res.status(400).json({ 
                success: false, 
                message: `Only ${product.stock} items available in stock` 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // 检查商品是否已在购物车中
        const existingItemIndex = user.cart.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            // 商品已存在，更新数量
            const newQuantity = user.cart[existingItemIndex].quantity + quantity;
            
            // 检查新数量是否超过库存
            if (newQuantity > product.stock) {
                user.cart[existingItemIndex].quantity = product.stock;
            } else {
                user.cart[existingItemIndex].quantity = newQuantity;
            }
        } else {
            // 新商品，添加到购物车
            user.cart.push({
                productId,
                quantity: Math.min(quantity, product.stock),
                addedAt: new Date()
            });
        }

        await user.save();

        // 返回更新后的购物车
        const updatedUser = await User.findById(userId).populate({
            path: 'cart.productId',
            select: 'name price img_url stock category description'
        });

        const cartItems = updatedUser.cart
            .filter(item => item.productId !== null)
            .map(item => ({
                id: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                img_url: item.productId.img_url,
                stock: item.productId.stock,
                category: item.productId.category,
                description: item.productId.description,
                quantity: item.quantity,
                addedAt: item.addedAt
            }));

        res.status(200).json({
            success: true,
            message: 'Product added to cart',
            data: cartItems
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add to cart',
            error: error.message 
        });
    }
};

// 更新购物车商品数量
export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || quantity < 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Valid quantity is required' 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const itemIndex = user.cart.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found in cart' 
            });
        }

        // 如果数量为 0，删除商品
        if (quantity === 0) {
            user.cart.splice(itemIndex, 1);
        } else {
            // 验证库存
            const product = await Product.findById(productId);
            if (product && quantity > product.stock) {
                user.cart[itemIndex].quantity = product.stock;
            } else {
                user.cart[itemIndex].quantity = quantity;
            }
        }

        await user.save();

        // 返回更新后的购物车
        const updatedUser = await User.findById(userId).populate({
            path: 'cart.productId',
            select: 'name price img_url stock category description'
        });

        const cartItems = updatedUser.cart
            .filter(item => item.productId !== null)
            .map(item => ({
                id: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                img_url: item.productId.img_url,
                stock: item.productId.stock,
                category: item.productId.category,
                description: item.productId.description,
                quantity: item.quantity,
                addedAt: item.addedAt
            }));

        res.status(200).json({
            success: true,
            message: 'Cart updated',
            data: cartItems
        });
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update cart',
            error: error.message 
        });
    }
};

// 从购物车删除商品
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        user.cart = user.cart.filter(
            item => item.productId.toString() !== productId
        );

        await user.save();

        // 返回更新后的购物车
        const updatedUser = await User.findById(userId).populate({
            path: 'cart.productId',
            select: 'name price img_url stock category description'
        });

        const cartItems = updatedUser.cart
            .filter(item => item.productId !== null)
            .map(item => ({
                id: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                img_url: item.productId.img_url,
                stock: item.productId.stock,
                category: item.productId.category,
                description: item.productId.description,
                quantity: item.quantity,
                addedAt: item.addedAt
            }));

        res.status(200).json({
            success: true,
            message: 'Product removed from cart',
            data: cartItems
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to remove from cart',
            error: error.message 
        });
    }
};

// 清空购物车
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        user.cart = [];
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Cart cleared',
            data: []
        });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to clear cart',
            error: error.message 
        });
    }
};

// 同步本地购物车到服务器（用于登录后合并）
export const syncCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { cartItems } = req.body; // 前端传来的本地购物车

        if (!Array.isArray(cartItems)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cart items must be an array' 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // 合并本地购物车和服务器购物车
        for (const localItem of cartItems) {
            const { id, quantity } = localItem;
            
            // 验证商品是否存在
            const product = await Product.findById(id);
            if (!product) continue;

            const existingItemIndex = user.cart.findIndex(
                item => item.productId.toString() === id
            );

            if (existingItemIndex > -1) {
                // 商品已存在，合并数量
                const newQuantity = user.cart[existingItemIndex].quantity + quantity;
                user.cart[existingItemIndex].quantity = Math.min(newQuantity, product.stock);
            } else {
                // 新商品，添加到购物车
                user.cart.push({
                    productId: id,
                    quantity: Math.min(quantity, product.stock),
                    addedAt: new Date()
                });
            }
        }

        await user.save();

        // 返回合并后的购物车
        const updatedUser = await User.findById(userId).populate({
            path: 'cart.productId',
            select: 'name price img_url stock category description'
        });

        const mergedCart = updatedUser.cart
            .filter(item => item.productId !== null)
            .map(item => ({
                id: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                img_url: item.productId.img_url,
                stock: item.productId.stock,
                category: item.productId.category,
                description: item.productId.description,
                quantity: item.quantity,
                addedAt: item.addedAt
            }));

        res.status(200).json({
            success: true,
            message: 'Cart synced successfully',
            data: mergedCart
        });
    } catch (error) {
        console.error('Sync cart error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to sync cart',
            error: error.message 
        });
    }
};
