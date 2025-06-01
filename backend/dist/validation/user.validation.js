"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const zod_1 = require("zod");
const common_validation_1 = require("./common.validation");
exports.updateUserSchema = zod_1.z.object({
    name: common_validation_1.nameSchema.optional(),
    profilePicture: zod_1.z.string().trim().nullable().optional(),
    DateOfBirth: common_validation_1.dateSchema,
    phoneNumber: common_validation_1.phoneSchema,
    Address: common_validation_1.addressSchema,
    Skills: zod_1.z.string().trim().optional(),
    EmergencyContact: zod_1.z.string().trim().optional(),
}).partial();
