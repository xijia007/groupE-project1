import {
  register,
  login,
  logout,
  UpdatePassword,
  refreshToken,
  changePassword,
} from "../controllers/auth_controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { me, updateProfile } from "../controllers/user_controller.js";
import express from "express";
const router = express.Router();

// Debug middleware for auth routes
router.use((req, res, next) => {
  console.log(`➡️ [Auth Router] Hit: ${req.method} ${req.path}`);
  next();
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", requireAuth, logout);
router.post("/update", UpdatePassword); // Forgot Password (no auth, no old pass)
router.post("/change-password", requireAuth, changePassword); // Update Password (auth + old pass)
router.get("/me", requireAuth, me);
router.post("/refresh", refreshToken);
router.put("/profile", requireAuth, updateProfile);

export default router;