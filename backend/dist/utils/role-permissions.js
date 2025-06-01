"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissions = void 0;
const roles_enums_1 = require("../enums/roles.enums");
exports.RolePermissions = {
    OWNER: [
        roles_enums_1.Permissions.CREATE_ORGANIZATION,
        roles_enums_1.Permissions.EDIT_ORGANIZATION,
        roles_enums_1.Permissions.DELETE_ORGANIZATION,
        roles_enums_1.Permissions.MANAGE_ORGANIZATION_SETTINGS,
        roles_enums_1.Permissions.ADD_MEMBER,
        roles_enums_1.Permissions.CHANGE_MEMBER_ROLE,
        roles_enums_1.Permissions.REMOVE_MEMBER,
        roles_enums_1.Permissions.CREATE_PROGRAM,
        roles_enums_1.Permissions.EDIT_PROGRAM,
        roles_enums_1.Permissions.DELETE_PROGRAM,
        roles_enums_1.Permissions.CREATE_EVENT,
        roles_enums_1.Permissions.EDIT_EVENT,
        roles_enums_1.Permissions.DELETE_EVENT,
        roles_enums_1.Permissions.MANAGE_EVENT,
        roles_enums_1.Permissions.VIEW_ONLY,
    ],
    ADMIN: [
        roles_enums_1.Permissions.ADD_MEMBER,
        roles_enums_1.Permissions.CREATE_PROGRAM,
        roles_enums_1.Permissions.EDIT_PROGRAM,
        roles_enums_1.Permissions.DELETE_PROGRAM,
        roles_enums_1.Permissions.CREATE_EVENT,
        roles_enums_1.Permissions.EDIT_EVENT,
        roles_enums_1.Permissions.DELETE_EVENT,
        roles_enums_1.Permissions.MANAGE_EVENT,
        roles_enums_1.Permissions.MANAGE_ORGANIZATION_SETTINGS,
        roles_enums_1.Permissions.LEAVE_ORGANIZATION,
        roles_enums_1.Permissions.VIEW_ONLY,
    ],
    MEMBER: [
        roles_enums_1.Permissions.CREATE_EVENT,
        roles_enums_1.Permissions.EDIT_EVENT,
        roles_enums_1.Permissions.LEAVE_ORGANIZATION,
        roles_enums_1.Permissions.VIEW_ONLY,
    ],
};
