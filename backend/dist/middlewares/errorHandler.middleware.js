"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_config_1 = require("../config/http.config");
const zod_1 = require("zod");
const error_code_enums_1 = require("../enums/error-code.enums");
const appError_1 = require("../utils/appError");
const formatZodError = (error) => {
    const errors = error.issues.map((error) => ({
        field: error.path.join("."),
        message: error.message,
    }));
    return errors;
};
const errorHandler = (error, req, res, next) => {
    console.error(`Error occurred on PATH: ${req.path} `, error);
    if (error instanceof SyntaxError) {
        return res.status(http_config_1.HTTPSTATUS.BAD_REQUEST).json({
            message: "Invalid JSON format. Please check your request"
        });
    }
    ;
    if (error instanceof zod_1.ZodError) {
        return res.status(http_config_1.HTTPSTATUS.BAD_REQUEST).json({
            message: "validation failed",
            errors: formatZodError(error),
            errorCode: error_code_enums_1.ErrorCodeEnum.VALIDATION_ERROR,
        });
    }
    if (error instanceof appError_1.AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.errorCode,
        });
    }
    return res.status(http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error?.message || "Unknown error occurred."
    });
};
exports.errorHandler = errorHandler;
