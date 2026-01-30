import db from "../routers/database.js";
import { ObjectId } from "mongodb";
import buildErrorResponse from "../utils/errorResponse.js";
import { success, z } from "zod";

const newProductSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().min(0).optional().default(1),
  img_url: z.string().url().optional(),
  category: z.string().min(2).max(100).optional(),
  PromotionCode: z.string().optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
});
export const createProduct = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json(
      buildErrorResponse({
        code: "FORBIDDEN",
        message: "Access denied",
      }),
    );
  }
  try {
    const parsed = newProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(
        buildErrorResponse({
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          details: parsed.error.issues,
        }),
      );
    }
    const {
      name,
      description,
      price,
      stock,
      img_url,
      category,
      PromotionCode,
      discountPercentage,
    } = parsed.data;
    const newProduct = {
      name,
      description,
      price,
      stock,
      img_url,
      category,
      PromotionCode,
      discountPercentage,
      createdBy: new ObjectId(req.user.userId),
    };
    if (await db.collection("Products").findOne({ name })) {
      return res.status(409).json(
        buildErrorResponse({
          code: "PRODUCT_ALREADY_EXISTS",
          message: "Product with this name already exists",
        }),
      );
    }

    const result = await db.collection("Products").insertOne(newProduct);
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      productId: result.insertedId.toString(),
    });
  } catch (error) {
    return res.status(500).json(
      buildErrorResponse({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      }),
    );
  }
};
export const DeleteProduct = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json(
      buildErrorResponse({
        code: "FORBIDDEN",
        message: "Access denied",
      }),
    );
  }
  try {
    const { productId } = req.params;
    const result = await db
      .collection("Products")
      .deleteOne({ _id: new ObjectId(productId) });
    if (result.deletedCount === 0) {
      return res.status(404).json(
        buildErrorResponse({
          code: "PRODUCT_NOT_FOUND",
          message: "Product not found",
        }),
      );
    }
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json(
      buildErrorResponse({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      }),
    );
  }
};

export const EditProduct = async (req, res) => {
  if (req.user.role !== "admin" && req.user.userId !== req.body.createdBy) {
    return res.status(403).json(
      buildErrorResponse({
        code: "FORBIDDEN",
        message: "Access denied",
      }),
    );
  }
  try {
    const { productId } = req.params;
    const parsed = newProductSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(
        buildErrorResponse({
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          details: parsed.error.issues,
        }),
      );
    }
    const updateData = parsed.data;
    const result = await db
      .collection("Products")
      .updateOne({ _id: new ObjectId(productId) }, { $set: updateData });
    if (result.matchedCount === 0) {
      return res.status(404).json(
        buildErrorResponse({
          code: "PRODUCT_NOT_FOUND",
          message: "Product not found",
        }),
      );
    }
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    return res.status(500).json(
      buildErrorResponse({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      }),
    );
  }
};

// get products list
export const GetProducts = async (req, res) => {
  try {
    const products = await db.collection("Products").find({}).toArray();
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json(
      buildErrorResponse({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      }),
    );
  }
};
export const SearchProducts = async (req, res) => {
  try {
    const queryRaw = (req.query.name ?? "").trim();
    if (queryRaw.length < 1) {
      return res.status(200).json({ success: true, data: [] });
    }
    const escaped = queryRaw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp("^" + escaped, "i");
    const products = await db
      .collection("Products")
      .find({ name: regex })
      .toArray();
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json(
      buildErrorResponse({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      }),
    );
  }
};

// get product by Id
export const GetProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await db
      .collection("Products")
      .findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return res.status(404).json(
        buildErrorResponse({
          code: "PRODUCT_NOT_FOUND",
          message: "Product not found",
        }),
      );
    }
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json(
      buildErrorResponse({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      }),
    );
  }
};
