import {
  register,
  login,
  logout,
  UpdatePassword,
  refreshToken,
} from "../controllers/auth_controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { me } from "../controllers/user_controller.js";
import express from "express";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", requireAuth, logout);
router.post("/update", UpdatePassword);
router.get("/me", requireAuth, me);
router.post("/refresh", refreshToken);

export default router;