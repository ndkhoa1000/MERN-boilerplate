"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveOrganizationController = exports.banMemberController = exports.changeOrganizationMemberRoleController = exports.joinOrganizationController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const http_config_1 = require("../config/http.config");
const member_validation_1 = require("../validation/member.validation");
const common_validation_1 = require("../validation/common.validation");
const member_service_1 = require("../services/member.service");
const roleGuard_1 = require("../utils/roleGuard");
const roles_enums_1 = require("../enums/roles.enums");
const organization_validation_1 = require("../validation/organization.validation");
exports.joinOrganizationController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const { inviteCode } = member_validation_1.inviteCodeSchema.parse(req.body);
    const { member, organization } = await (0, member_service_1.joinOrganizationWithInviteCodeService)(userId, inviteCode);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: `You have successfully joined ${organization.name}`,
        member
    });
});
exports.changeOrganizationMemberRoleController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.id);
    // memberId is USER_ID of this member
    const { memberId, roleId } = organization_validation_1.changeRoleSchema.parse(req.body);
    const { role } = await (0, member_service_1.getMemberRoleInWorkspaceService)(userId, orgId);
    (0, roleGuard_1.roleGuard)(role, [roles_enums_1.Permissions.CHANGE_MEMBER_ROLE]);
    const { member } = await (0, member_service_1.changeOrganizationMemberRoleService)(orgId, memberId, roleId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Member's role updated successfully",
        member
    });
});
exports.banMemberController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.orgId);
    const memberId = common_validation_1.objectIdSchema.parse(req.params.id);
    const result = await (0, member_service_1.banMemberFromOrganizationService)(userId, orgId, memberId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Member banned successfully",
        bannedMember: result.member
    });
});
exports.leaveOrganizationController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = String(req.user?._id);
    const orgId = common_validation_1.objectIdSchema.parse(req.params.orgId);
    const result = await (0, member_service_1.leaveOrganizationService)(userId, orgId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: `You have successfully left the organization: ${result.organization}`,
        result
    });
});
