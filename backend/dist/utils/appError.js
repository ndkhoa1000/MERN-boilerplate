"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayTimeoutException = exports.ServiceUnavailableException = exports.BadGatewayException = exports.NotImplementedException = exports.ConflictException = exports.MethodNotAllowedException = exports.NotFoundException = exports.ForbiddenException = exports.UnauthorizedException = exports.BadRequestException = exports.InternalServerException = exports.HttpException = exports.AppError = void 0;
const http_config_1 = require("../config/http.config");
const error_code_enums_1 = require("../enums/error-code.enums");
class AppError extends Error {
    statusCode;
    errorCode;
    constructor(message, statusCode = http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class HttpException extends AppError {
    constructor(message = "HTTP exception Error", statusCode, errorCode) {
        super(message, statusCode, errorCode);
    }
}
exports.HttpException = HttpException;
class InternalServerException extends AppError {
    constructor(message = "Internal Server Error", errorCode) {
        super(message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode || error_code_enums_1.ErrorCodeEnum.INTERNAL_SERVER_ERROR);
    }
}
exports.InternalServerException = InternalServerException;
class BadRequestException extends AppError {
    constructor(message = "Bad Request", errorCode) {
        super(message, http_config_1.HTTPSTATUS.BAD_REQUEST, errorCode || error_code_enums_1.ErrorCodeEnum.VALIDATION_ERROR);
    }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends AppError {
    constructor(message = "Unauthorized", errorCode) {
        super(message, http_config_1.HTTPSTATUS.UNAUTHORIZED, errorCode || error_code_enums_1.ErrorCodeEnum.ACCESS_UNAUTHORIZED);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends AppError {
    constructor(message = "Forbidden", errorCode) {
        super(message, http_config_1.HTTPSTATUS.FORBIDDEN, errorCode || error_code_enums_1.ErrorCodeEnum.ACCESS_UNAUTHORIZED);
    }
}
exports.ForbiddenException = ForbiddenException;
class NotFoundException extends AppError {
    constructor(message = "Not Found", errorCode) {
        super(message, http_config_1.HTTPSTATUS.NOT_FOUND, errorCode || error_code_enums_1.ErrorCodeEnum.RESOURCE_NOT_FOUND);
    }
}
exports.NotFoundException = NotFoundException;
class MethodNotAllowedException extends AppError {
    constructor(message = "Method Not Allowed", errorCode) {
        super(message, http_config_1.HTTPSTATUS.METHOD_NOT_ALLOWED, errorCode || error_code_enums_1.ErrorCodeEnum.METHOD_NOT_ALLOWED);
    }
}
exports.MethodNotAllowedException = MethodNotAllowedException;
class ConflictException extends AppError {
    constructor(message = "Conflict", errorCode) {
        super(message, http_config_1.HTTPSTATUS.CONFLICT, errorCode || error_code_enums_1.ErrorCodeEnum.CONFLICT);
    }
}
exports.ConflictException = ConflictException;
class NotImplementedException extends AppError {
    constructor(message = "Not Implemented", errorCode) {
        super(message, http_config_1.HTTPSTATUS.NOT_IMPLEMENTED, errorCode || error_code_enums_1.ErrorCodeEnum.NOT_IMPLEMENTED);
    }
}
exports.NotImplementedException = NotImplementedException;
class BadGatewayException extends AppError {
    constructor(message = "Bad Gateway", errorCode) {
        super(message, http_config_1.HTTPSTATUS.BAD_GATEWAY, errorCode || error_code_enums_1.ErrorCodeEnum.BAD_GATEWAY);
    }
}
exports.BadGatewayException = BadGatewayException;
class ServiceUnavailableException extends AppError {
    constructor(message = "Service Unavailable", errorCode) {
        super(message, http_config_1.HTTPSTATUS.SERVICE_UNAVAILABLE, errorCode || error_code_enums_1.ErrorCodeEnum.SERVICE_UNAVAILABLE);
    }
}
exports.ServiceUnavailableException = ServiceUnavailableException;
class GatewayTimeoutException extends AppError {
    constructor(message = "Gateway Timeout", errorCode) {
        super(message, http_config_1.HTTPSTATUS.GATEWAY_TIMEOUT, errorCode || error_code_enums_1.ErrorCodeEnum.GATEWAY_TIMEOUT);
    }
}
exports.GatewayTimeoutException = GatewayTimeoutException;
