"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProgramSchema = exports.createProgramSchema = void 0;
const zod_1 = require("zod");
const common_validation_1 = require("./common.validation");
exports.createProgramSchema = zod_1.z.object({
    name: common_validation_1.nameSchema,
    description: common_validation_1.descriptionSchema.optional(),
    startDate: common_validation_1.dateSchema,
    endDate: common_validation_1.dateSchema,
    sponsors: common_validation_1.stringArraySchema.optional(),
    documents: common_validation_1.stringArraySchema.optional(),
});
exports.updateProgramSchema = exports.createProgramSchema.partial();
