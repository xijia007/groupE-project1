import db from "../routers/database.js";
import { ObjectId } from "mongodb";
import buildErrorResponse from "../utils/errorResponse.js";

// 获取用户购物车
export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    // 使用原生 MongoDB 驱动查询用户
    const user = await db.collection("Users").findOne({ 
      _id: new ObjectId(userId) 
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 如果购物车为空，直接返回
    if (!user.cart || user.cart.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // 获取购物车中所有产品的详细信息
    const productIds = user.cart.map(item => new ObjectId(item.productId));
    const products = await db.collection("Products").find({
      _id: { $in: productIds }
    }).toArray();

    // 创建产品 ID 到产品对象的映射
    const productMap = {};
    products.forEach(product => {
      productMap[product._id.toString()] = product;
    });

    // 过滤掉已删除的商品，并格式化购物车数据
    const validCart = [];
    const cartItems = [];

    user.cart.forEach((item) => {
      const product = productMap[item.productId.toString()];
      
      if (product) {
        // 产品存在，添加到有效购物车
        validCart.push(item);
        
        cartItems.push({
          id: product._id,
          name: product.name,
          price: product.price,
          img_url: product.img_url,
          stock: product.stock,
          category: product.category,
          description: product.description,
          quantity: item.quantity,
          addedAt: item.addedAt,
        });
      }
    });

    // 如果购物车有变化（有商品被删除），更新数据库
    if (validCart.length !== user.cart.length) {
      await db.collection("Users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: { cart: validCart } }
      );
    }

    res.status(200).json({
      success: true,
      data: cartItems,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get cart",
      error: error.message,
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
        message: "Product ID is required",
      });
    }

    // 验证商品是否存在
    const product = await db.collection("Products").findOne({
      _id: new ObjectId(productId)
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 检查库存
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    const user = await db.collection("Users").findOne({
      _id: new ObjectId(userId)
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 初始化购物车（如果不存在）
    const cart = user.cart || [];

    // 检查商品是否已在购物车中
    const existingItemIndex = cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // 商品已存在，更新数量
      const newQuantity = cart[existingItemIndex].quantity + quantity;

      // 检查新数量是否超过库存
      if (newQuantity > product.stock) {
        cart[existingItemIndex].quantity = product.stock;
      } else {
        cart[existingItemIndex].quantity = newQuantity;
      }
    } else {
      // 新商品，添加到购物车
      cart.push({
        productId: new ObjectId(productId),
        quantity: Math.min(quantity, product.stock),
        addedAt: new Date(),
      });
    }

    // 更新用户购物车
    await db.collection("Users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { cart: cart } }
    );

    // 获取更新后的购物车（包含产品详情）
    const productIds = cart.map(item => new ObjectId(item.productId));
    const products = await db.collection("Products").find({
      _id: { $in: productIds }
    }).toArray();

    const productMap = {};
    products.forEach(p => {
      productMap[p._id.toString()] = p;
    });

    const cartItems = cart
      .filter(item => productMap[item.productId.toString()])
      .map((item) => {
        const p = productMap[item.productId.toString()];
        return {
          id: p._id,
          name: p.name,
          price: p.price,
          img_url: p.img_url,
          stock: p.stock,
          category: p.category,
          description: p.description,
          quantity: item.quantity,
          addedAt: item.addedAt,
        };
      });

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: cartItems,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add to cart",
      error: error.message,
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
        message: "Valid quantity is required",
      });
    }

    const user = await db.collection("Users").findOne({
      _id: new ObjectId(userId)
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cart = user.cart || [];
    const itemIndex = cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // 如果数量为 0，删除商品
    if (quantity === 0) {
      cart.splice(itemIndex, 1);
    } else {
      // 验证库存
      const product = await db.collection("Products").findOne({
        _id: new ObjectId(productId)
      });

      if (product && quantity > product.stock) {
        cart[itemIndex].quantity = product.stock;
      } else {
        cart[itemIndex].quantity = quantity;
      }
    }

    // 更新购物车
    await db.collection("Users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { cart: cart } }
    );

    // 获取更新后的购物车（包含产品详情）
    if (cart.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Cart updated",
        data: [],
      });
    }

    const productIds = cart.map(item => new ObjectId(item.productId));
    const products = await db.collection("Products").find({
      _id: { $in: productIds }
    }).toArray();

    const productMap = {};
    products.forEach(p => {
      productMap[p._id.toString()] = p;
    });

    const cartItems = cart
      .filter(item => productMap[item.productId.toString()])
      .map((item) => {
        const p = productMap[item.productId.toString()];
        return {
          id: p._id,
          name: p.name,
          price: p.price,
          img_url: p.img_url,
          stock: p.stock,
          category: p.category,
          description: p.description,
          quantity: item.quantity,
          addedAt: item.addedAt,
        };
      });

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: cartItems,
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message,
    });
  }
};

// 从购物车删除商品
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const user = await db.collection("Users").findOne({
      _id: new ObjectId(userId)
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cart = (user.cart || []).filter(
      (item) => item.productId.toString() !== productId
    );

    // 更新购物车
    await db.collection("Users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { cart: cart } }
    );

    // 获取更新后的购物车（包含产品详情）
    if (cart.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Product removed from cart",
        data: [],
      });
    }

    const productIds = cart.map(item => new ObjectId(item.productId));
    const products = await db.collection("Products").find({
      _id: { $in: productIds }
    }).toArray();

    const productMap = {};
    products.forEach(p => {
      productMap[p._id.toString()] = p;
    });

    const cartItems = cart
      .filter(item => productMap[item.productId.toString()])
      .map((item) => {
        const p = productMap[item.productId.toString()];
        return {
          id: p._id,
          name: p.name,
          price: p.price,
          img_url: p.img_url,
          stock: p.stock,
          category: p.category,
          description: p.description,
          quantity: item.quantity,
          addedAt: item.addedAt,
        };
      });

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      data: cartItems,
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove from cart",
      error: error.message,
    });
  }
};

// 清空购物车
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await db.collection("Users").findOne({
      _id: new ObjectId(userId)
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 清空购物车
    await db.collection("Users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { cart: [] } }
    );

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: [],
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
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
        message: "Cart items must be an array",
      });
    }

    const user = await db.collection("Users").findOne({
      _id: new ObjectId(userId)
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 初始化购物车
    const cart = user.cart || [];

    // 合并本地购物车和服务器购物车
    for (const localItem of cartItems) {
      const { id, quantity } = localItem;

      // 验证商品是否存在
      const product = await db.collection("Products").findOne({
        _id: new ObjectId(id)
      });

      if (!product) continue;

      const existingItemIndex = cart.findIndex(
        (item) => item.productId.toString() === id
      );

      if (existingItemIndex > -1) {
        // 商品已存在，合并数量
        const newQuantity = cart[existingItemIndex].quantity + quantity;
        cart[existingItemIndex].quantity = Math.min(
          newQuantity,
          product.stock
        );
      } else {
        // 新商品，添加到购物车
        cart.push({
          productId: new ObjectId(id),
          quantity: Math.min(quantity, product.stock),
          addedAt: new Date(),
        });
      }
    }

    // 更新购物车
    await db.collection("Users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { cart: cart } }
    );

    // 获取合并后的购物车（包含产品详情）
    if (cart.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Cart synced successfully",
        data: [],
      });
    }

    const productIds = cart.map(item => new ObjectId(item.productId));
    const products = await db.collection("Products").find({
      _id: { $in: productIds }
    }).toArray();

    const productMap = {};
    products.forEach(p => {
      productMap[p._id.toString()] = p;
    });

    const mergedCart = cart
      .filter(item => productMap[item.productId.toString()])
      .map((item) => {
        const p = productMap[item.productId.toString()];
        return {
          id: p._id,
          name: p.name,
          price: p.price,
          img_url: p.img_url,
          stock: p.stock,
          category: p.category,
          description: p.description,
          quantity: item.quantity,
          addedAt: item.addedAt,
        };
      });

    res.status(200).json({
      success: true,
      message: "Cart synced successfully",
      data: mergedCart,
    });
  } catch (error) {
    console.error("Sync cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to sync cart",
      error: error.message,
    });
  }
};
