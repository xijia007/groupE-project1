import { DEFAULT_MESSAGES } from "../constants/errorCodes";

function buildErrorResponse({ code, message, details, traceId }) {
    return {
        success: false,
        error: {
            code,
            message: message || DEFAULT_MESSAGES[code] || "The system is busy, please try later",
            details: details || null,
            traceId: traceId || null
        },
        timestamp: new Date().toISOString()
    };
}

export default buildErrorResponse;