import jwt from "jsonwebtoken";
import errorHandler from "../utils/errorResponse.js";
import config from "../config.js";

export const adminCheck = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [schema, token] = authHeader.split(" ");
    if (schema !== "Bearer" || !token) {
      return res.status(401).json(
        errorHandler({
          code: "UNAUTHORIZED",
          message: "No token provided",
        }),
      );
    }
    const payload = jwt.verify(token, config.JWT_Acess_Secret);
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };
    if (req.user.role !== "admin") {
      return res.status(403).json(
        errorHandler({
          code: "FORBIDDEN",
          message: "Access denied",
        }),
      );
    }
    return next();
  } catch (err) {
    return res.status(401).json(
      errorHandler({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      }),
    );
  }
};
