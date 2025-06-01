"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const common_validation_1 = require("./common.validation");
exports.registerSchema = zod_1.z.object({
    name: common_validation_1.nameSchema,
    email: common_validation_1.emailSchema,
    password: common_validation_1.passwordSchema
});
exports.loginSchema = zod_1.z.object({
    email: common_validation_1.emailSchema,
    password: common_validation_1.passwordSchema
});
