import buildErrorResponse from "../utils/errorResponse";

function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    const code = err.code || ERROR_CODES.INTERNAL_ERROR;

    const response = buildErrorResponse ({
        code,
        message: err.message,
        details: err.details,
        traceId: req.id
    });

    res.status(status).json(response);
}

export default errorHandler;