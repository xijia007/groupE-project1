import jwt from "jsonwebtoken";
import buildErrorResponse from "../utils/errorResponse.js";
import config from "../config.js";

export const requireAuth = (req, res, next) => {
  console.log(`🔒 [Auth Middleware] Checking auth for: ${req.method} ${req.path}`);
  try {
    const authHeader = req.headers.authorization || "";
    const [schema, token] = authHeader.split(" ");
    if (schema !== "Bearer" || !token) {
      return res.status(401).json(
        buildErrorResponse({
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
    return next();
  } catch (err) {
    return res.status(401).json(
      buildErrorResponse({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      }),
    );
  }
};
