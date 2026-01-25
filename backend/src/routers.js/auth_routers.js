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
import { adminCheck } from "../middlewares/adminCheck.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", requireAuth, logout);
router.post("/update", requireAuth, UpdatePassword);
router.get("/me", requireAuth, me);
router.post("/refresh", refreshToken);
router.get("/check", adminCheck, (req, res) => {
  return res.status(200).json({ ok: true, role: req.user?.role });
});

export default router;
