import bcrpyt from "bcryptjs";
import jwt from "jsonwebtoken";
import { email, z } from "zod";
import User from "../models/User.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import buildErrorResponse from "../utils/errorResponse.js";
import db from "../routers/database.js";
import { ObjectId } from "mongodb";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: z.enum(["regular", "admin"]).default("regular"),
});
export const register = async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(
        buildErrorResponse({
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          details: parsed.error.errors,
        }),
      );
    }
    const { name, email, password, role } = parsed.data;
    const existing = await db.collection("Users").findOne({ email });
    if (existing) {
      return res.status(409).json(
        buildErrorResponse({
          code: "EMAIL_ALREADY_REGISTERED",
          message: "Email is already registered",
        }),
      );
    }
    const hashedPassword = await bcrpyt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await db.collection("Users").insertOne(newUser);
    const payload = { userId: newUser._id.toString(), role: newUser.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      samesite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
    });
  } catch (err) {
    return res.status(500).json(
      buildErrorResponse({
        code: err.code || "INTERNAL_SERVER_ERROR",
        message: err.message,
      }),
    );
  }
};
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});
export const login = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(
        buildErrorResponse({
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          details: parsed.error.errors,
        }),
      );
    }
    const { email, password } = parsed.data;
    const user = await db.collection("Users").findOne({ email });
    if (!user) {
      return res.status(401).json(
        buildErrorResponse({
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        }),
      );
    }
    const isPasswordValid = await bcrpyt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json(
        buildErrorResponse({
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        }),
      );
    }
    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      samesite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
    });
  } catch (err) {
    return res.status(500).json(
      buildErrorResponse({
        code: err.code || "INTERNAL_SERVER_ERROR",
        message: err.message,
      }),
    );
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      samesite: "lax",
      secure: false,
    });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    return res.status(500).json(
      buildErrorResponse({
        code: err.code || "INTERNAL_SERVER_ERROR",
        message: err.message,
      }),
    );
  }
};

const updatePasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const UpdatePassword = async (req, res) => {
  try {
    const parsed = updatePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(
        buildErrorResponse({
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          details: parsed.error.errors,
        }),
      );
    }
    const { email, password: newPassword } = parsed.data;
    const user = await db.collection("Users").findOne({ email });
    if (!user) {
      return res.status(404).json(
        buildErrorResponse({
          code: "USER_NOT_FOUND",
          message: "User not found",
        }),
      );
    }
    const hashedNewPassword = await bcrpyt.hash(newPassword, 10);
    await db
      .collection("Users")
      .updateOne(
        { _id: new ObjectId(user._id) },
        { $set: { password: hashedNewPassword } },
      );
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    return res.status(500).json(
      buildErrorResponse({
        code: err.code || "INTERNAL_SERVER_ERROR",
        message: err.message,
      }),
    );
  }
};
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json(
        buildErrorResponse({
          code: "UNAUTHORIZED",
          message: "No token provided",
        }),
      );
    }
    const payload = jwt.verify(token, config.JWT_Refresh_Secret);
    const newAccessToken = signAccessToken({
      userId: payload.userId,
      role: payload.role,
    });
    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res.status(401).json(
      buildErrorResponse({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      }),
    );
  }
};
