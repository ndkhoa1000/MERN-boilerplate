"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteCodeSchema = exports.updateMemberSchema = exports.createMemberSchema = void 0;
const zod_1 = require("zod");
const common_validation_1 = require("./common.validation");
exports.createMemberSchema = zod_1.z.object({
    userId: common_validation_1.objectIdSchema,
    orgId: common_validation_1.objectIdSchema,
    role: common_validation_1.objectIdSchema
});
exports.updateMemberSchema = common_validation_1.objectIdSchema;
// Updated validation to be more specific
exports.inviteCodeSchema = zod_1.z.object({
    inviteCode: zod_1.z.string().trim().min(1, { message: "Invite code is required" })
});
