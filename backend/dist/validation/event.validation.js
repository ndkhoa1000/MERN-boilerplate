"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventSchema = exports.createEventSchema = void 0;
const zod_1 = require("zod");
const common_validation_1 = require("./common.validation");
const event_enums_1 = require("../enums/event.enums");
const eventCategories_enums_1 = require("../enums/eventCategories.enums");
exports.createEventSchema = zod_1.z.object({
    title: common_validation_1.nameSchema,
    description: common_validation_1.descriptionSchema.optional(),
    program: common_validation_1.objectIdSchema.optional(),
    category: zod_1.z.array(zod_1.z.nativeEnum(eventCategories_enums_1.eventCategories)).optional(),
    location: zod_1.z.string().trim().min(1),
    status: zod_1.z.nativeEnum(event_enums_1.EventStatusEnum).optional(),
    priority: zod_1.z.nativeEnum(event_enums_1.EventPriorityEnum).optional(),
    assignedTo: zod_1.z.array(common_validation_1.objectIdSchema).optional(),
    cohost: zod_1.z.array(common_validation_1.objectIdSchema).optional(),
    requiredVolunteer: zod_1.z.number().int().nonnegative(),
    registrationDeadline: common_validation_1.dateSchema.optional(),
    startTime: common_validation_1.dateSchema,
    endTime: common_validation_1.dateSchema,
    documents: common_validation_1.stringArraySchema.optional(),
    needTraining: zod_1.z.boolean().default(false)
});
exports.updateEventSchema = exports.createEventSchema.partial();
