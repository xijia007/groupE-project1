import {
  createProduct,
  EditProduct,
  DeleteProduct,
  GetProductById,
  GetProducts,
  SearchProducts,
} from "../controllers/Product_controller.js";
import { adminCheck } from "../middlewares/adminCheck.js";
import express from "express";
const router = express.Router();

router.get("/", GetProducts);
router.get("/search", SearchProducts);
router.get("/:productId", GetProductById);
router.post("/add", adminCheck, createProduct);
router.put("/:productId/edit", adminCheck, EditProduct);
router.delete("/:productId/delete", adminCheck, DeleteProduct);
export default router;
