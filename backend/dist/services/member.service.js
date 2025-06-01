"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveOrganizationService = exports.banMemberFromOrganizationService = exports.changeOrganizationMemberRoleService = exports.joinOrganizationWithInviteCodeService = exports.getMemberRoleInWorkspaceService = void 0;
const error_code_enums_1 = require("../enums/error-code.enums");
const member_model_1 = __importDefault(require("../models/member.model"));
const organization_model_1 = __importDefault(require("../models/organization.model"));
const roles_permission_model_1 = __importDefault(require("../models/roles-permission.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const appError_1 = require("../utils/appError");
const roles_enums_1 = require("../enums/roles.enums");
const getMemberRoleInWorkspaceService = async (userId, orgId) => {
    const organization = await organization_model_1.default.findById(orgId);
    if (!organization)
        throw new appError_1.NotFoundException("Organization not found.");
    const member = await member_model_1.default.findOne({ userId, orgId })
        .populate("role")
        .exec();
    if (!member)
        throw new appError_1.UnauthorizedException("You are not a member of this organization.", error_code_enums_1.ErrorCodeEnum.ACCESS_UNAUTHORIZED);
    const roleName = member.role?.name;
    return { role: roleName };
};
exports.getMemberRoleInWorkspaceService = getMemberRoleInWorkspaceService;
const joinOrganizationWithInviteCodeService = async (userId, inviteCode) => {
    // Find the organization with the invite code
    const organization = await organization_model_1.default.findOne({ inviteCode });
    if (!organization) {
        throw new appError_1.NotFoundException("Invalid invite code or organization not found.");
    }
    // Check if user is already a member
    const existingMembership = await member_model_1.default.findOne({
        userId,
        orgId: organization._id
    });
    if (existingMembership) {
        throw new appError_1.ConflictException("You are already a member of this organization.");
    }
    // Get the default member role
    const memberRole = await roles_permission_model_1.default.findOne({ name: roles_enums_1.Roles.MEMBER });
    if (!memberRole) {
        throw new appError_1.NotFoundException("Member role not found in the system.");
    }
    // Create the membership
    const newMember = new member_model_1.default({
        userId,
        orgId: organization._id,
        role: memberRole._id,
        isApproved: true, // Auto-approve when using invite code
        joinAt: new Date()
    });
    await newMember.save();
    // Update user's current organization if they don't have one set
    const user = await user_model_1.default.findById(userId);
    if (user && !user.currentOrganization) {
        user.currentOrganization = organization._id;
        await user.save();
    }
    return {
        member: newMember,
        organization
    };
};
exports.joinOrganizationWithInviteCodeService = joinOrganizationWithInviteCodeService;
// REVIEW: test changeMemberRole with Postman when finish joinOrg API(member)
const changeOrganizationMemberRoleService = async (orgId, memberId, roleId) => {
    const role = await roles_permission_model_1.default.findById(roleId);
    if (!role)
        throw new appError_1.NotFoundException("Role not found.");
    const member = await member_model_1.default.findOne({ userId: memberId, orgId: orgId });
    if (!member)
        throw new appError_1.NotFoundException("Member not found.");
    member.role = role || member.role;
    await member.save();
    return { member };
};
exports.changeOrganizationMemberRoleService = changeOrganizationMemberRoleService;
const banMemberFromOrganizationService = async (requesterId, orgId, memberId // This is now the userId of the member to ban
) => {
    // Check if organization exists
    const organization = await organization_model_1.default.findById(orgId);
    if (!organization) {
        throw new appError_1.NotFoundException("Organization not found.");
    }
    // Verify the requester is the owner
    if (organization.owner.toString() !== requesterId) {
        throw new appError_1.ForbiddenException("Only the organization owner can ban members.");
    }
    // Prevent banning yourself
    if (memberId === requesterId) {
        throw new appError_1.BadRequestException("You cannot ban yourself from your own organization.");
    }
    // Find the member to ban using userId and orgId
    const memberToBan = await member_model_1.default.findOne({
        userId: memberId,
        orgId: orgId
    })
        .populate("userId", "name email")
        .populate("role", "name");
    if (!memberToBan) {
        throw new appError_1.NotFoundException("Member not found in this organization.");
    }
    // If member's current organization is this one, set it to null
    const user = await user_model_1.default.findById(memberId);
    if (user && user.currentOrganization?.toString() === orgId) {
        user.currentOrganization = null;
        await user.save();
    }
    // Delete the membership
    await memberToBan.deleteOne();
    return {
        message: "Member banned successfully",
        member: memberToBan
    };
};
exports.banMemberFromOrganizationService = banMemberFromOrganizationService;
const leaveOrganizationService = async (userId, orgId) => {
    // Check if organization exists
    const organization = await organization_model_1.default.findById(orgId);
    if (!organization) {
        throw new appError_1.NotFoundException("Organization not found.");
    }
    // Check if user is a member of this organization
    const membership = await member_model_1.default.findOne({ userId, orgId })
        .populate("role", "name");
    if (!membership) {
        throw new appError_1.NotFoundException("You are not a member of this organization.");
    }
    // Check if user is the owner - owners can't leave their own organization
    if (organization.owner.toString() === userId) {
        throw new appError_1.BadRequestException("As the owner, you cannot leave your organization. You must either delete it or transfer ownership first.");
    }
    // If this is user's current organization, find another organization
    const user = await user_model_1.default.findById(userId);
    if (user && user.currentOrganization?.toString() === orgId) {
        // Find any other organization the user belongs to
        const otherMembership = await member_model_1.default.findOne({
            userId,
            orgId: { $ne: orgId }
        });
        user.currentOrganization = otherMembership ? otherMembership.orgId : null;
        await user.save();
    }
    // Delete the membership
    await membership.deleteOne();
    return {
        message: "You have successfully left the organization",
        organization: organization.name
    };
};
exports.leaveOrganizationService = leaveOrganizationService;
