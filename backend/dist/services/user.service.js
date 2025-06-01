"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserProfileService = exports.updateCurrentProfileService = exports.getUserProfileByIdService = exports.getCurrentUserService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const appError_1 = require("../utils/appError");
const member_model_1 = __importDefault(require("../models/member.model"));
const attendance_model_1 = __importDefault(require("../models/attendance.model"));
const account_model_1 = __importDefault(require("../models/account.model"));
const getCurrentUserService = async (userId) => {
    const user = await user_model_1.default.findById(userId)
        .populate("currentOrganization")
        .select("-password");
    if (!user) {
        throw new appError_1.BadRequestException("User not found.");
    }
    return { user };
};
exports.getCurrentUserService = getCurrentUserService;
const getUserProfileByIdService = async (userId, profileId) => {
    // Check if the requester is trying to access their own profile or has permission
    if (userId !== profileId) {
        // In a real app, check if user has admin permission
        // For simplicity, everyone can access everyone profile.
    }
    const user = await user_model_1.default.findById(profileId)
        .populate("currentOrganization")
        .select("-password");
    if (!user) {
        throw new appError_1.NotFoundException("User profile not found.");
    }
    return { userProfile: user };
};
exports.getUserProfileByIdService = getUserProfileByIdService;
const updateCurrentProfileService = async (userId, updateData) => {
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        throw new appError_1.NotFoundException("User not found.");
    }
    // Update the fields
    if (updateData.name)
        user.name = updateData.name;
    if (updateData.profilePicture !== undefined)
        user.profilePicture = updateData.profilePicture;
    if (updateData.DateOfBirth)
        user.DateOfBirth = updateData.DateOfBirth;
    if (updateData.phoneNumber)
        user.phoneNumber = updateData.phoneNumber;
    if (updateData.Address)
        user.Address = updateData.Address;
    if (updateData.Skills)
        user.Skills = updateData.Skills;
    if (updateData.EmergencyContact)
        user.EmergencyContact = updateData.EmergencyContact;
    await user.save();
    return { updatedProfile: user.omitPassword() };
};
exports.updateCurrentProfileService = updateCurrentProfileService;
const deleteUserProfileService = async (userId) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Find and validate user
        const user = await user_model_1.default.findById(userId).session(session);
        if (!user) {
            throw new appError_1.NotFoundException("User not found.");
        }
        // Delete associated data
        await member_model_1.default.deleteMany({ userId }).session(session);
        await attendance_model_1.default.deleteMany({ userId }).session(session);
        await account_model_1.default.deleteMany({ userId }).session(session);
        // Delete the user
        await user.deleteOne({ session });
        await session.commitTransaction();
        return { message: "User profile deleted successfully" };
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.deleteUserProfileService = deleteUserProfileService;
