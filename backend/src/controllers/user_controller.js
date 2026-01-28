import { ObjectId } from "mongodb";
import db from "../routers/database.js";
import buildErrorResponse from "../utils/errorResponse.js";
import { success } from "zod";

export const me = async (req, res) => {
  try {
    const { userId } = req.user || {};
    if (!userId) {
      return res.status(401).json(
        buildErrorResponse({
          code: "UNAUTHORIZED",
          message: "Missing user context",
        }),
      );
    }

    const user = await db
      .collection("Users")
      .findOne(
        { _id: new ObjectId(userId) },
        { projection: { name: 1, email: 1, role: 1, createdAt: 1 } },
      );
    if (!user) {
      return res.status(404).json(
        buildErrorResponse({
          code: "USER_NOT_FOUND",
          message: "User not found",
        }),
      );
    }
    return res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
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

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    const result = await db.collection("Users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { name }}
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    };

    res.json({
      success: true,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
