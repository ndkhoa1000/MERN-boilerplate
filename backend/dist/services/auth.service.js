"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserService = exports.registerService = exports.loginOrCreateAccountService = void 0;
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const account_model_1 = __importDefault(require("../models/account.model"));
const appError_1 = require("../utils/appError");
const account_provider_enums_1 = require("../enums/account-provider.enums");
const loginOrCreateAccountService = async (data) => {
    const { provider, displayName, providerId, picture, email } = data;
    // create an account -> create user -> create account (ref: user)
    const session = await mongoose_1.default.startSession();
    console.log('start Session...');
    try {
        session.startTransaction();
        // check if user exist
        let user = await user_model_1.default.findOne({ email }).session(session);
        if (!user) {
            user = new user_model_1.default({
                email,
                name: displayName,
                profilePicture: picture || null,
                // random pwd to pass userModel validation for Oath user
                password: `oauth-${Math.random().toString(36).substring(2)}`
            });
            await user.save({ session });
            const account = new account_model_1.default({
                userId: user._id,
                provider: provider,
                providerId: providerId,
            });
            await account.save({ session });
            await session.commitTransaction();
            console.log('commit transaction...');
            session.endSession();
            console.log('session end. Finish.');
        }
        return { user };
    }
    catch (error) {
        console.log("Error during session...", error);
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.loginOrCreateAccountService = loginOrCreateAccountService;
//register new local user
const registerService = async (body) => {
    const { email, name, password } = body;
    const session = await mongoose_1.default.startSession();
    console.log('start Session...');
    try {
        session.startTransaction();
        // check if user exist
        let user = await user_model_1.default.findOne({ email }).session(session);
        if (!user) {
            user = new user_model_1.default({
                email,
                name,
                password
            });
        }
        await user.save({ session });
        const account = new account_model_1.default({
            userId: user._id,
            provider: account_provider_enums_1.ProviderEnum.EMAIL,
            providerId: email,
        });
        await account.save({ session });
        await session.commitTransaction();
        console.log('commit transaction...');
        session.endSession();
        console.log('session end. Finish.');
        return { user };
    }
    catch (error) {
        console.log("Error during session...", error);
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.registerService = registerService;
const verifyUserService = async ({ email, password, provider = account_provider_enums_1.ProviderEnum.EMAIL, }) => {
    const account = await account_model_1.default.findOne({ provider, providerId: email });
    if (!account) {
        throw new appError_1.NotFoundException("Invalid email or password");
    }
    ;
    const user = await user_model_1.default.findById(account.userId);
    if (!user) {
        throw new appError_1.NotFoundException("User not found for giving account");
    }
    const PasswordIsMatch = await user.comparePassword(password);
    if (!PasswordIsMatch) {
        throw new appError_1.UnauthorizedException("Invalid email or password");
    }
    ;
    return user.omitPassword();
};
exports.verifyUserService = verifyUserService;
