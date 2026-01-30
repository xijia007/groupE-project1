import db from "../routers/database.js";
import { ObjectId } from "mongodb";
import buildErrorResponse from "../utils/errorResponse.js";

// Get user cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Query user using native MongoDB driver
    const user = await db.collection("Users").findOne({ 
      _id: new ObjectId(userId) 
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If cart is empty, return immediately
    if (!user.cart || user.cart.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // Get details for all products in the cart
    const productIds = user.cart.map(item => new ObjectId(item.productId));
    const products = await db.collection("Products").find({
      _id: { $in: productIds }
    }).toArray();

    // Create mapping from product ID to product object
    const productMap = {};
    products.forEach(product => {
      productMap[product._id.toString()] = product;
    });

    // Filter out deleted items and format cart data
    const validCart = [];
    const cartItems = [];

    user.cart.forEach((item) => {
      const product = productMap[item.productId.toString()];
      
      if (product) {
        // Product exists, add to valid cart
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

    // If cart has changed (items deleted), update database
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

// Add item to cart
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

    // Verify product exists
    const product = await db.collection("Products").findOne({
      _id: new ObjectId(productId)
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock
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

    // Initialize cart (if not exists)
    const cart = user.cart || [];

    // Check if item is already in cart
    const existingItemIndex = cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Item exists, update quantity
      const newQuantity = cart[existingItemIndex].quantity + quantity;

      // Check if new quantity exceeds stock
      if (newQuantity > product.stock) {
        cart[existingItemIndex].quantity = product.stock;
      } else {
        cart[existingItemIndex].quantity = newQuantity;
      }
    } else {
      // New item, add to cart
      cart.push({
        productId: new ObjectId(productId),
        quantity: Math.min(quantity, product.stock),
        addedAt: new Date(),
      });
    }

    // Update user cart
    await db.collection("Users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { cart: cart } }
    );

    // Get updated cart (with product details)
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

// Update cart item quantity
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

    // If quantity is 0, delete item
    if (quantity === 0) {
      cart.splice(itemIndex, 1);
    } else {
      // Validate stock
      const product = await db.collection("Products").findOne({
        _id: new ObjectId(productId)
      });

      if (product && quantity > product.stock) {
        cart[itemIndex].quantity = product.stock;
      } else {
        cart[itemIndex].quantity = quantity;
      }
    }

    // Update cart
    await db.collection("Users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { cart: cart } }
    );

    // Get updated cart (with product details)
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

// Remove item from cart
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

    // Update cart
    await db.collection("Users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { cart: cart } }
    );

    // Get updated cart (with product details)
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

// Clear cart
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

    // Clear cart
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

// Sync local cart to server (merge after login)
export const syncCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cartItems } = req.body; // Local cart from frontend

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

    // Initialize cart
    const cart = user.cart || [];

    // Merge local cart and server cart
    for (const localItem of cartItems) {
      const { id, quantity } = localItem;

      // Verify product exists
      const product = await db.collection("Products").findOne({
        _id: new ObjectId(id)
      });

      if (!product) continue;

      const existingItemIndex = cart.findIndex(
        (item) => item.productId.toString() === id
      );

      if (existingItemIndex > -1) {
        // Item exists, merge quantity
        const newQuantity = cart[existingItemIndex].quantity + quantity;
        cart[existingItemIndex].quantity = Math.min(
          newQuantity,
          product.stock
        );
      } else {
        // New item, add to cart
        cart.push({
          productId: new ObjectId(id),
          quantity: Math.min(quantity, product.stock),
          addedAt: new Date(),
        });
      }
    }

    // Update cart
    await db.collection("Users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { cart: cart } }
    );

    // Get merged cart (with product details)
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
