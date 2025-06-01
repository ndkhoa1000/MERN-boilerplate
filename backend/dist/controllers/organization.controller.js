"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrganizationByIdController = exports.getOrganizationAnalyticsController = exports.updateOrganizationByIdController = exports.getOrganizationMembersController = exports.getOrganizationByIdController = exports.getAllOrganizationsUserIsMemberController = exports.createOrganizationController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const http_config_1 = require("../config/http.config");
const organization_validation_1 = require("../validation/organization.validation");
const organization_service_1 = require("../services/organization.service");
const member_service_1 = require("../services/member.service");
const common_validation_1 = require("../validation/common.validation");
const roleGuard_1 = require("../utils/roleGuard");
const roles_enums_1 = require("../enums/roles.enums");
exports.createOrganizationController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const body = organization_validation_1.createOrganizationSchema.parse({ ...req.body });
    const userId = String(req.user?._id);
    const { organization } = await (0, organization_service_1.createOrganizationService)(userId, body);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Organization created.",
        organization,
    });
});
exports.getAllOrganizationsUserIsMemberController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const { organizations } = await (0, organization_service_1.getAllOrganizationsUserIsMemberService)(userId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "All organization of current user.",
        organizations
    });
});
exports.getOrganizationByIdController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.id);
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.VIEW_ONLY]);
    const { organization } = await (0, organization_service_1.getOrganizationByIdService)(orgId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Organization fetch successfully.",
        organization
    });
});
exports.getOrganizationMembersController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.id);
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.VIEW_ONLY]);
    const { members, roles } = await (0, organization_service_1.getOrganizationMembersService)(orgId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Organization members fetched successfully",
        members,
        roles,
    });
});
exports.updateOrganizationByIdController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.id);
    const body = organization_validation_1.updateOrganizationSchema.parse({ ...req.body });
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.EDIT_ORGANIZATION]);
    const { organization } = await (0, organization_service_1.updateOrganizationByIdService)(userId, orgId, body);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Organization updated.",
        organization
    });
});
exports.getOrganizationAnalyticsController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.id);
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.VIEW_ONLY]);
    const { analysis } = await (0, organization_service_1.getOrganizationAnalyticsService)(userId, orgId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "fetch analysis successfully.",
        analysis
    });
});
// REVIEW: delete Org will delete everything related to Org, finish other models to perform fully delete.
exports.deleteOrganizationByIdController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.id);
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.DELETE_ORGANIZATION]);
    const { currentOrgId } = await (0, organization_service_1.deleteOrganizationByIdService)(userId, orgId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Organization deleted.",
        currentOrgId
    });
});
