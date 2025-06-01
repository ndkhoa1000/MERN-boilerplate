"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const organization_controller_1 = require("../controllers/organization.controller");
const member_controller_1 = require("../controllers/member.controller");
const organizationRoutes = (0, express_1.Router)();
// Core organization routes
organizationRoutes.post("/create/new", organization_controller_1.createOrganizationController);
organizationRoutes.get("/all", organization_controller_1.getAllOrganizationsUserIsMemberController);
organizationRoutes.get("/:id", organization_controller_1.getOrganizationByIdController);
organizationRoutes.get("/analytics/:id", organization_controller_1.getOrganizationAnalyticsController);
organizationRoutes.put("/update/:id", organization_controller_1.updateOrganizationByIdController);
organizationRoutes.delete("/delete/:id", organization_controller_1.deleteOrganizationByIdController);
// Member-related routes
organizationRoutes.post("/join", member_controller_1.joinOrganizationController); // via invite code
organizationRoutes.get("/:id/member/all", organization_controller_1.getOrganizationMembersController);
organizationRoutes.put("/:id/member/role/change", member_controller_1.changeOrganizationMemberRoleController);
organizationRoutes.delete("/:orgId/member/:id/ban", member_controller_1.banMemberController);
organizationRoutes.delete("/:orgId/leave", member_controller_1.leaveOrganizationController);
//NOTE: define public routes for search and join org, search and join event later
//NOTE: all the route for org now must be authorized to access.
exports.default = organizationRoutes;
