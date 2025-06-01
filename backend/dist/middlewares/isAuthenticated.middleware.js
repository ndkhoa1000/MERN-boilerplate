"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const appError_1 = require("../utils/appError");
const error_code_enums_1 = require("../enums/error-code.enums");
const isAuthenticated = (req, res, next) => {
    if (!req.user || !req.user._id) {
        throw new appError_1.UnauthorizedException("Unauthorized. Please log in!", error_code_enums_1.ErrorCodeEnum.ACCESS_UNAUTHORIZED);
    }
    next();
};
exports.isAuthenticated = isAuthenticated;
