"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringArraySchema = exports.objectIdSchema = exports.dateSchema = exports.addressSchema = exports.phoneSchema = exports.urlSchema = exports.passwordSchema = exports.emailSchema = exports.descriptionSchema = exports.nameSchema = void 0;
const zod_1 = require("zod");
// Common string fields
exports.nameSchema = zod_1.z.string().trim().min(1, { message: "Name is required" }).max(255);
exports.descriptionSchema = zod_1.z.string().trim();
exports.emailSchema = zod_1.z.string().trim().email("Invalid email address").min(1).max(255);
exports.passwordSchema = zod_1.z.string().trim().min(8, { message: "Password must be at least 8 characters" }).max(255);
exports.urlSchema = zod_1.z.string().trim().url("Invalid URL").nullable();
exports.phoneSchema = zod_1.z.string().trim().min(10, { message: "Phone number must be valid" }).max(20);
exports.addressSchema = zod_1.z.string().trim().min(1, { message: "Address is required" }).max(500);
// Common date fields
exports.dateSchema = zod_1.z.coerce.date();
// Common ID fields
exports.objectIdSchema = zod_1.z.string().trim().min(1, { message: "ID is required" });
// Common array fields
exports.stringArraySchema = zod_1.z.array(zod_1.z.string()).default([]);
