"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const userRoutes = (0, express_1.Router)();
// Get current user
userRoutes.get("/current", user_controller_1.getCurrentUserController);
// Get user profile by ID
userRoutes.get("/profile/:id", user_controller_1.getUserProfileByIdController);
// Update current user profile
userRoutes.put("/profile/update", user_controller_1.updateCurrentProfileController);
// Delete user account
userRoutes.delete("/profile/delete", user_controller_1.deleteUserProfileController);
exports.default = userRoutes;
