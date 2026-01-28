import express from "express";
import {
  createCoupon,
  verifyCoupon,
} from "../controllers/Coupon_controller.js";

const router = express.Router();

router.post("/create", createCoupon);
router.get("/verify", verifyCoupon);

export default router;
