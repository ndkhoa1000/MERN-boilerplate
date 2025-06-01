"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAttendanceSchema = exports.createAttendanceSchema = void 0;
const zod_1 = require("zod");
const common_validation_1 = require("./common.validation");
exports.createAttendanceSchema = zod_1.z.object({
    isPresent: zod_1.z.boolean().default(false),
    checkInTime: common_validation_1.dateSchema.default(() => new Date()).optional(),
    checkOutTime: common_validation_1.dateSchema.optional(),
    hoursContributed: zod_1.z.number().nonnegative().optional().default(0),
});
exports.updateAttendanceSchema = zod_1.z.object({
    isPresent: zod_1.z.boolean(),
    checkInTime: common_validation_1.dateSchema.default(() => new Date()),
    checkOutTime: common_validation_1.dateSchema,
    hoursContributed: zod_1.z.number().nonnegative(),
    feedback: zod_1.z.string().trim()
}).partial();
