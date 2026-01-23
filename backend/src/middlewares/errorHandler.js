import buildErrorResponse from "../utils/errorResponse.js";
import { ERROR_CODES } from "../constants/errorCodes.js";

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || 500;
  const code = err.code || ERROR_CODES.INTERNAL_ERROR;

  const response = buildErrorResponse({
    code,
    message: err.message,
    details: err.details,
    traceId: req.id,
  });

  return res.status(status).json(response);
}

export { errorHandler };
