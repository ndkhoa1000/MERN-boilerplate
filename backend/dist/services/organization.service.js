"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrganizationByIdService = exports.getOrganizationAnalyticsService = exports.updateOrganizationByIdService = exports.getOrganizationMembersService = exports.getOrganizationByIdService = exports.getAllOrganizationsUserIsMemberService = exports.createOrganizationService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const organization_model_1 = __importDefault(require("../models/organization.model"));
const appError_1 = require("../utils/appError");
const user_model_1 = __importDefault(require("../models/user.model"));
const roles_permission_model_1 = __importDefault(require("../models/roles-permission.model"));
const roles_enums_1 = require("../enums/roles.enums");
const member_model_1 = __importDefault(require("../models/member.model"));
const program_model_1 = __importDefault(require("../models/program.model"));
const event_model_1 = __importDefault(require("../models/event.model"));
const attendance_model_1 = __importDefault(require("../models/attendance.model"));
const event_enums_1 = require("../enums/event.enums");
// NOTE: may not need transaction for simple service.
const createOrganizationService = async (userId, body) => {
    const { name, address, phoneNumber, description, mission, logo, email, website, socialMediaLink, establishedDate } = body;
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    console.log('[createOrganizationService]: Start session...');
    try {
        let user = await user_model_1.default.findById(userId).session(session);
        if (!user)
            throw new appError_1.NotFoundException("User not found.");
        let ownerRole = await roles_permission_model_1.default.findOne({ name: roles_enums_1.Roles.OWNER });
        if (!ownerRole)
            throw new appError_1.NotFoundException("OWNER role not found.");
        let organization = await organization_model_1.default.findOne({ name }).session(session);
        if (!organization) {
            organization = new organization_model_1.default({
                name,
                address,
                phoneNumber,
                description,
                mission,
                logo,
                email,
                website,
                socialMediaLink,
                isVerified: true, //NOTE: only for simplify Web App, need Verify feature
                establishedDate,
                owner: userId
            });
            await organization.save({ session });
            let member = new member_model_1.default({
                userId,
                orgId: organization._id,
                role: ownerRole,
            });
            await member.save({ session });
            // update user's current org
            user.currentOrganization = organization ?
                organization._id : user.currentOrganization;
            await user.save({ session });
            await session.commitTransaction();
            console.log('[createOrganizationService]: commit transaction...');
            session.endSession();
            console.log('[createOrganizationService]: session end. Finish.');
            return { organization };
        }
        else {
            throw new appError_1.ConflictException("Organization name has been taken. Please try another name!");
        }
    }
    catch (error) {
        console.log("Error during session...", error);
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.createOrganizationService = createOrganizationService;
const getAllOrganizationsUserIsMemberService = async (userId) => {
    const memberships = await member_model_1.default.find({ userId })
        .populate("orgId")
        .select("-password")
        .exec();
    // extract org from member 
    const organizations = memberships.map((membership) => membership.orgId);
    return { organizations };
};
exports.getAllOrganizationsUserIsMemberService = getAllOrganizationsUserIsMemberService;
const getOrganizationByIdService = async (orgId) => {
    try {
        const organization = await organization_model_1.default.findById(orgId);
        if (!organization)
            throw new appError_1.NotFoundException("Organization not found.");
        //NOTE: return org and its member
        const members = await member_model_1.default.find({ orgId })
            .populate("userId", "name email profilePicture")
            .populate("role")
            .exec();
        const organizationWithMember = { ...organization.toObject(), members };
        return { organization: organizationWithMember };
    }
    catch (err) {
        throw new appError_1.BadRequestException("Invalid organization Id.");
    }
};
exports.getOrganizationByIdService = getOrganizationByIdService;
const getOrganizationMembersService = async (orgId) => {
    //NOTE: fetch all member from the organization
    const members = await member_model_1.default.find({ orgId })
        .populate("userId", "name email profilePicture")
        .populate("role", "name")
        .lean();
    const roles = await roles_permission_model_1.default.find({}, { name: 1, _id: 1 })
        .select("-permission")
        .lean();
    return { members, roles };
};
exports.getOrganizationMembersService = getOrganizationMembersService;
const updateOrganizationByIdService = async (userId, orgId, body) => {
    const { name, address, phoneNumber, description, mission, logo, email, website, socialMediaLink, establishedDate } = body;
    const organization = await organization_model_1.default.findOne({ _id: orgId });
    if (!organization)
        throw new appError_1.NotFoundException("Organization not found.");
    organization.name = name || organization.name;
    organization.address = address || organization.address;
    organization.phoneNumber = phoneNumber || organization.phoneNumber;
    organization.description = description || organization.description;
    organization.mission = mission || organization.mission;
    organization.logo = logo || organization.logo;
    organization.email = email || organization.email;
    organization.website = website || organization.website;
    organization.socialMediaLink = socialMediaLink || organization.socialMediaLink;
    organization.establishedDate = establishedDate || organization.establishedDate;
    await organization.save();
    console.log(`Update organization ${organization._id} successfully`);
    return { organization };
};
exports.updateOrganizationByIdService = updateOrganizationByIdService;
// NOTE: need program and event for data analysis.
// ideas for analysis:: 
// member: totals members, roles distribution, new members
// event: total events, event status, avg volunteer participation
// program: total programs, program engagement.
const getOrganizationAnalyticsService = async (userId, orgId) => {
    const currentDate = new Date();
    const totalProgram = await program_model_1.default.countDocuments({ organization: orgId });
    const totalEvent = await event_model_1.default.countDocuments({ organization: orgId });
    const totalPendingEvent = await event_model_1.default.countDocuments({
        organization: orgId,
        startTime: { $lt: currentDate },
        status: event_enums_1.EventStatusEnum.PENDING
    });
    const totalActiveEvent = await event_model_1.default.countDocuments({
        organization: orgId,
        startTime: { $lt: currentDate },
        status: event_enums_1.EventStatusEnum.ACTIVE
    });
    const totalCompleteEvent = await event_model_1.default.countDocuments({
        organization: orgId,
        startTime: { $lt: currentDate },
        status: event_enums_1.EventStatusEnum.COMPLETED
    });
    const totalPostponedEvent = await event_model_1.default.countDocuments({
        organization: orgId,
        startTime: { $lt: currentDate },
        status: event_enums_1.EventStatusEnum.POSTPONED
    });
    const analysis = {
        totalProgram,
        totalEvent,
        totalPendingEvent,
        totalActiveEvent,
        totalCompleteEvent,
        totalPostponedEvent,
    };
    return { analysis };
};
exports.getOrganizationAnalyticsService = getOrganizationAnalyticsService;
const deleteOrganizationByIdService = async (userId, orgId) => {
    // NOTE: (transaction) check user is owner -> delete attendance -> delete event 
    // NOTE:  delete project-> delete member -> update user.currentOrg -> delete Org
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    console.log('[deleteOrganizationService]: Start session...');
    try {
        const organization = await organization_model_1.default.findById(orgId).session(session);
        if (!organization)
            throw new appError_1.NotFoundException("Organization not found.");
        // check user is owner
        if (organization.owner.toString() != userId)
            throw new appError_1.BadRequestException("Yo are not authorized to delete this organization.");
        const events = await event_model_1.default.find({ organization: orgId }).session(session);
        events.every(async (event) => await attendance_model_1.default.deleteMany({ eventId: event._id }).session(session));
        await event_model_1.default.deleteMany({ organization: orgId }).session(session);
        await program_model_1.default.deleteMany({ organization: orgId }).session(session);
        await member_model_1.default.deleteMany({ orgId }).session(session);
        const user = await user_model_1.default.findById(userId).session(session);
        if (!user)
            throw new appError_1.NotFoundException("User not found.");
        if (user?.currentOrganization?.equals(orgId)) {
            // find all one org that user is a part of (this org has been deleted)
            const MemberOrg = await member_model_1.default.findOne({ userId }).session(session);
            user.currentOrganization = MemberOrg ? MemberOrg.orgId : null;
            await user.save({ session });
        }
        await organization_model_1.default.deleteOne({ _id: orgId }).session(session);
        await session.commitTransaction();
        session.endSession();
        console.log('[deleteOrganizationService]: End session.');
        return { currentOrgId: user.currentOrganization };
    }
    catch (error) {
        console.log("Error during session...", error);
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.deleteOrganizationByIdService = deleteOrganizationByIdService;
