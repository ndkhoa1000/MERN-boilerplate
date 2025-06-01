"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const database_config_1 = __importDefault(require("../config/database.config"));
const mongoose_1 = __importDefault(require("mongoose"));
const roles_permission_model_1 = __importDefault(require("../models/roles-permission.model"));
const role_permissions_1 = require("../utils/role-permissions");
const seedRoles = async () => {
    console.log("Start seeding roles...");
    try {
        await (0, database_config_1.default)();
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        console.log("delete existing roles...");
        await roles_permission_model_1.default.deleteMany({}).session(session);
        for (const roleName in role_permissions_1.RolePermissions) {
            const role = roleName;
            const permission = role_permissions_1.RolePermissions[role];
            const existingRole = await roles_permission_model_1.default.findOne({ name: role }).session(session);
            if (!existingRole) {
                const newRole = new roles_permission_model_1.default({
                    name: role,
                    permission: permission,
                });
                await newRole.save({ session: session });
                console.log(`Added role ${role} with permission.`);
            }
            else {
                console.log(`Role ${role} already exists.`);
            }
        }
        await session.commitTransaction();
        console.log('Transaction committed.');
        session.endSession();
        console.log('End session.');
    }
    catch (error) {
        console.log('error seeding roles: \n', error);
    }
};
seedRoles().catch((error) => {
    console.log('error running seedRoles script:', error);
});
