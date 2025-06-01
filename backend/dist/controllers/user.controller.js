"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserProfileController = exports.updateCurrentProfileController = exports.getUserProfileByIdController = exports.getCurrentUserController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const http_config_1 = require("../config/http.config");
const user_service_1 = require("../services/user.service");
const user_validation_1 = require("../validation/user.validation");
const appError_1 = require("../utils/appError");
exports.getCurrentUserController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = (String)(req.user?._id);
    const { user } = await (0, user_service_1.getCurrentUserService)(userId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "User fetched successfully.",
        user,
    });
});
exports.getUserProfileByIdController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const profileId = String(req.params.id);
    const { userProfile } = await (0, user_service_1.getUserProfileByIdService)(userId, profileId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "User profile fetched successfully.",
        userProfile,
    });
});
exports.updateCurrentProfileController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = (String)(req.user?._id);
    const updateData = user_validation_1.updateUserSchema.parse(req.body);
    const { updatedProfile } = await (0, user_service_1.updateCurrentProfileService)(userId, updateData);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Profile updated successfully.",
        user: updatedProfile,
    });
});
exports.deleteUserProfileController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = (String)(req.user?._id);
    // For safety, require confirmation in the request body
    if (!req.body.confirmation || req.body.confirmation !== "DELETE MY ACCOUNT") {
        throw new appError_1.BadRequestException("Please confirm account deletion by including 'confirmation: DELETE_MY_ACCOUNT' in the request body.");
    }
    await (0, user_service_1.deleteUserProfileService)(userId);
    // Clear session
    req.logout((err) => {
        if (err) {
            console.error("Error during logout after account deletion:", err);
        }
    });
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Your account has been permanently deleted.",
    });
});
