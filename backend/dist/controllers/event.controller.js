"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventByIdController = exports.updateEventByIdController = exports.getEventByIdController = exports.getAllEventsInOrganizationController = exports.getAllEventsController = exports.createEventController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const http_config_1 = require("../config/http.config");
const common_validation_1 = require("../validation/common.validation");
const member_service_1 = require("../services/member.service");
const roleGuard_1 = require("../utils/roleGuard");
const roles_enums_1 = require("../enums/roles.enums");
const event_validation_1 = require("../validation/event.validation");
const event_service_1 = require("../services/event.service");
exports.createEventController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.orgId);
    const body = event_validation_1.createEventSchema.parse({ ...req.body });
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.CREATE_EVENT]);
    const { event } = await (0, event_service_1.createEventService)(userId, orgId, body);
    return res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "Event created successfully.",
        event,
    });
});
exports.getAllEventsController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const { events, pagination } = await (0, event_service_1.getAllEventsService)({
        pageSize,
        pageNumber,
    });
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "All events fetched successfully.",
        events,
        pagination
    });
});
exports.getAllEventsInOrganizationController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.orgId);
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.VIEW_ONLY]);
    const programId = req.query.programId;
    const status = req.query.status;
    const priority = req.query.priority;
    const assignedTo = req.query.assignedTo;
    const keyword = req.query.keyword;
    const registrationDeadline = req.query.registrationDeadline;
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const { events, pagination } = await (0, event_service_1.getAllEventsInOrgService)(orgId, {
        programId,
        keyword,
        status,
        priority,
        assignedTo,
        registrationDeadline,
        startTime,
        endTime
    }, {
        pageSize,
        pageNumber
    });
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Events fetched successfully.",
        events,
        pagination
    });
});
exports.getEventByIdController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.orgId);
    const eventId = common_validation_1.objectIdSchema.parse(req.params.id);
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.VIEW_ONLY]);
    const { event } = await (0, event_service_1.getEventByIdService)(orgId, eventId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Event fetched successfully.",
        event
    });
});
exports.updateEventByIdController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.orgId);
    const eventId = common_validation_1.objectIdSchema.parse(req.params.id);
    const body = event_validation_1.updateEventSchema.parse({ ...req.body });
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.EDIT_EVENT]);
    const { event } = await (0, event_service_1.updateEventByIdService)(orgId, eventId, body);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Event updated successfully.",
        event
    });
});
exports.deleteEventByIdController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.orgId);
    const eventId = common_validation_1.objectIdSchema.parse(req.params.id);
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.DELETE_EVENT]);
    const { event } = await (0, event_service_1.deleteEventByIdService)(orgId, eventId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Event deleted successfully.",
        event
    });
});
