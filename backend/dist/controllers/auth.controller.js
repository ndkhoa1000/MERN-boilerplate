"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = exports.loginController = exports.registerController = exports.googleLoginCallback = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const app_config_1 = require("../config/app.config");
const auth_validation_1 = require("../validation/auth.validation");
const http_config_1 = require("../config/http.config");
const auth_service_1 = require("../services/auth.service");
const passport_1 = __importDefault(require("passport"));
// OAuth
exports.googleLoginCallback = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const currentOrganization = req.user?.currentOrganization;
    if (currentOrganization) {
        return res.redirect(`${app_config_1.config.FRONTEND_ORIGIN}/organization/${currentOrganization}`);
    }
    return res.redirect(`${app_config_1.config.FRONTEND_ORIGIN}/organization/_`);
});
// register new local user
exports.registerController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const body = auth_validation_1.registerSchema.parse({
        ...req.body,
    });
    await (0, auth_service_1.registerService)(body);
    return res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "User created successfully.",
    });
});
//local login
exports.loginController = (0, asyncHandler_middleware_1.asyncHandler)((async (req, res, next) => {
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(http_config_1.HTTPSTATUS.UNAUTHORIZED).json({
                message: info?.message || "Invalid email or password."
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(http_config_1.HTTPSTATUS.OK).json({
                message: "Logged in successfully.",
                user,
            });
        });
    })(req, res, next);
}));
//logout
exports.logoutController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    req.logOut((err) => {
        if (err) {
            console.log("logout failed:" + err.message);
            return res.status(http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR)
                .json({ error: "Cannot logout, please try again later." });
        }
        ;
        req.session.destroy((err) => {
            if (err) {
                console.log('Session destruction failed:', err);
                return res.status(http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR)
                    .json({ error: "Cannot complete logout, please try again later." });
            }
            res.clearCookie('connect.sid'); //test clear cookies
            return res.status(http_config_1.HTTPSTATUS.OK).json("logout successfully.");
        });
    });
});
// get current user profile
