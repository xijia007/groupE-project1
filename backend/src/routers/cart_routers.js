import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
} from "../controllers/cart_controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

// All cart routes require authentication
router.use(requireAuth);

// Get cart
router.get("/", getCart);

// Add item to cart
router.post("/", addToCart);

// Sync local cart (merge after login)
router.post("/sync", syncCart);

// Update cart item quantity
router.put("/:productId", updateCartItem);

// Remove item from cart
router.delete("/:productId", removeFromCart);

// Clear cart
router.delete("/", clearCart);

export default router;