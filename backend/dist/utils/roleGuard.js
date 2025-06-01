"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleGuard = void 0;
const appError_1 = require("./appError");
const role_permissions_1 = require("./role-permissions");
const roleGuard = (userRole, requiredPermission) => {
    const userPermissions = role_permissions_1.RolePermissions[userRole];
    const hasPermission = requiredPermission.every((permission) => userPermissions.includes(permission));
    if (!hasPermission)
        throw new appError_1.UnauthorizedException("You do not have the necessary permissions to perform this action");
};
exports.roleGuard = roleGuard;
