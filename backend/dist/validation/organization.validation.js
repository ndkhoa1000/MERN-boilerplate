"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeRoleSchema = exports.updateOrganizationSchema = exports.createOrganizationSchema = void 0;
const zod_1 = require("zod");
const common_validation_1 = require("./common.validation");
exports.createOrganizationSchema = zod_1.z.object({
    name: common_validation_1.nameSchema,
    address: common_validation_1.addressSchema,
    phoneNumber: common_validation_1.phoneSchema,
    description: common_validation_1.descriptionSchema.optional(),
    mission: zod_1.z.string().trim().optional(),
    logo: common_validation_1.urlSchema.optional(),
    email: common_validation_1.emailSchema.optional(),
    website: common_validation_1.urlSchema.optional(),
    socialMediaLink: common_validation_1.stringArraySchema.optional(),
    establishedDate: common_validation_1.dateSchema.optional(),
});
exports.updateOrganizationSchema = exports.createOrganizationSchema.partial();
exports.changeRoleSchema = zod_1.z.object({
    memberId: common_validation_1.objectIdSchema,
    roleId: common_validation_1.objectIdSchema,
});
