"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOwnAttendanceController = exports.deleteAttendanceController = exports.updateAttendanceController = exports.getCurrentUserAttendancesController = exports.getAttendancesByUserController = exports.getAttendancesByEventController = exports.getAttendanceByIdController = exports.createAttendanceController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const http_config_1 = require("../config/http.config");
const common_validation_1 = require("../validation/common.validation");
const attendance_validation_1 = require("../validation/attendance.validation");
const attendance_service_1 = require("../services/attendance.service");
const member_service_1 = require("../services/member.service");
const roleGuard_1 = require("../utils/roleGuard");
const roles_enums_1 = require("../enums/roles.enums");
exports.createAttendanceController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const eventId = common_validation_1.objectIdSchema.parse(req.params.eventId);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.orgId);
    const body = attendance_validation_1.createAttendanceSchema.parse({ ...req.body });
    const { attendance } = await (0, attendance_service_1.createAttendanceService)(eventId, userId, body);
    return res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "Attendance created successfully",
        attendance
    });
});
exports.getAttendanceByIdController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const attendanceId = common_validation_1.objectIdSchema.parse(req.params.id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.orgId);
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(String(req.user?._id), orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.VIEW_ONLY]);
    const { attendance } = await (0, attendance_service_1.getAttendanceByIdService)(attendanceId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Attendance fetched successfully",
        attendance
    });
});
exports.getAttendancesByEventController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const eventId = common_validation_1.objectIdSchema.parse(req.params.eventId);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.orgId);
    const { attendances } = await (0, attendance_service_1.getAttendancesByEventService)(eventId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Attendances for event fetched successfully",
        attendances
    });
});
exports.getAttendancesByUserController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const targetUserId = req.params.userId;
    // If trying to view someone else's attendances, need to have proper permissions
    // for simplicity, everyone can see other's attendance on their profile
    // if (targetUserId !== String(req.user?._id)) {
    // const orgId = objectIdSchema.parse(req.params.orgId);
    // const { role } = await getMemberRoleInWorkspaceService(String(req.user?._id), orgId);
    //     roleGuard(role, [Permissions.MANAGE_EVENT]);
    // }
    const { attendances } = await (0, attendance_service_1.getAttendancesByUserService)(targetUserId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Attendances for user fetched successfully",
        attendances
    });
});
exports.getCurrentUserAttendancesController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const { attendances } = await (0, attendance_service_1.getAttendancesByUserService)(userId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Your attendances fetched successfully",
        attendances
    });
});
exports.updateAttendanceController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const attendanceId = common_validation_1.objectIdSchema.parse(req.params.id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.orgId);
    const body = attendance_validation_1.updateAttendanceSchema.parse(req.body);
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(String(req.user?._id), orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.MANAGE_EVENT]);
    const { attendance } = await (0, attendance_service_1.updateAttendanceService)(attendanceId, body);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Attendance updated successfully",
        attendance
    });
});
exports.deleteAttendanceController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const attendanceId = common_validation_1.objectIdSchema.parse(req.params.id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.orgId);
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(String(req.user?._id), orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.MANAGE_EVENT]);
    const { attendance } = await (0, attendance_service_1.deleteAttendanceService)(attendanceId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Attendance deleted successfully",
        attendance
    });
});
exports.deleteOwnAttendanceController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const attendanceId = common_validation_1.objectIdSchema.parse(req.params.id);
    const userId = String(req.user?._id);
    // Get the attendance to verify ownership
    const { attendance: existingAttendance } = await (0, attendance_service_1.getAttendanceByIdService)(attendanceId);
    // Check if the attendance belongs to the current user
    if (String(existingAttendance.userId._id) !== userId) {
        return res.status(http_config_1.HTTPSTATUS.FORBIDDEN).json({
            message: "You can only delete your own attendance records"
        });
    }
    const { attendance } = await (0, attendance_service_1.deleteAttendanceService)(attendanceId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Your attendance was successfully canceled",
        attendance
    });
});
