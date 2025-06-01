"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProgramByIdController = exports.getProgramAnalyticsController = exports.updateProgramByIdController = exports.getProgramByIdController = exports.getAllProgramsController = exports.createProgramController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const http_config_1 = require("../config/http.config");
const common_validation_1 = require("../validation/common.validation");
const member_service_1 = require("../services/member.service");
const roleGuard_1 = require("../utils/roleGuard");
const roles_enums_1 = require("../enums/roles.enums");
const program_validation_1 = require("../validation/program.validation");
const program_service_1 = require("../services/program.service");
exports.createProgramController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = String(req.params.orgId);
    const body = program_validation_1.createProgramSchema.parse({ ...req.body });
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.CREATE_PROGRAM]);
    const { program } = await (0, program_service_1.createProgramService)(userId, orgId, body);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Program created.",
        program,
    });
});
exports.getAllProgramsController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = String(req.params.orgId);
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.VIEW_ONLY]);
    const pageSize = parseInt(req.query.pageSize) || 10;
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const { programs, totalCount, totalPages, skip } = await (0, program_service_1.getAllProgramsService)(orgId, pageSize, pageNumber);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "fetch all programs successfully.",
        programs,
        pagination: {
            totalCount,
            pageSize,
            pageNumber,
            totalPages,
            skip,
            limit: pageSize,
        }
    });
});
exports.getProgramByIdController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.orgId);
    const programId = common_validation_1.objectIdSchema.parse(req.params.id);
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.VIEW_ONLY]);
    const { program } = await (0, program_service_1.getProgramByIdService)(orgId, programId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Program fetch successfully.",
        program
    });
});
exports.updateProgramByIdController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.orgId);
    const programId = common_validation_1.objectIdSchema.parse(req.params.id);
    const body = program_validation_1.updateProgramSchema.parse({ ...req.body });
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.EDIT_PROGRAM]);
    const { program } = await (0, program_service_1.updateProgramByIdService)(orgId, programId, body);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Program updated.",
        program
    });
});
exports.getProgramAnalyticsController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.orgId);
    const programId = common_validation_1.objectIdSchema.parse(req.params.id);
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.VIEW_ONLY]);
    const { analysis } = await (0, program_service_1.getProgramAnalyticsService)(orgId, programId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "fetch analysis successfully.",
        analysis
    });
});
exports.deleteProgramByIdController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.orgId);
    const programId = common_validation_1.objectIdSchema.parse(req.params.id);
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.DELETE_PROGRAM]);
    const { program } = await (0, program_service_1.deleteProgramByIdService)(orgId, programId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Program deleted.",
        program
    });
});
