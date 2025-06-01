"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventByIdService = exports.updateEventByIdService = exports.getEventByIdService = exports.getAllEventsInOrgService = exports.getAllEventsService = exports.createEventService = void 0;
const event_model_1 = __importDefault(require("../models/event.model"));
const program_model_1 = __importDefault(require("../models/program.model"));
const organization_model_1 = __importDefault(require("../models/organization.model"));
const appError_1 = require("../utils/appError");
const event_enums_1 = require("../enums/event.enums");
const member_model_1 = __importDefault(require("../models/member.model"));
const attendance_model_1 = __importDefault(require("../models/attendance.model"));
const createEventService = async (userId, orgId, body) => {
    // Check if program exists and belongs to the organization
    if (body.program) {
        const programIsExist = await program_model_1.default.findOne({ _id: body.program, organization: orgId });
        if (programIsExist?.organization.toString() != orgId) {
            throw new appError_1.NotFoundException("Program not found or not associated with this organization");
        }
    }
    if (body.assignedTo) {
        const isAssignedUserMember = await member_model_1.default.exists({
            userId: body.assignedTo,
            orgId,
        });
        if (!isAssignedUserMember) {
            throw new Error("Assigned user is not a member of this workspace.");
        }
    }
    // Create the event
    const event = new event_model_1.default({
        ...body,
        program: body.program,
        organization: orgId,
        status: body.status || event_enums_1.EventStatusEnum.PENDING,
        priority: body.priority || event_enums_1.EventPriorityEnum.MEDIUM,
        registeredVolunteer: 0,
        createBy: userId
    });
    await event.save();
    return { event };
};
exports.createEventService = createEventService;
const getAllEventsService = async (pagination) => {
    //Pagination Setup
    const { pageSize, pageNumber } = pagination;
    const skip = (pageNumber - 1) * pageSize;
    const [events, totalCount] = await Promise.all([
        event_model_1.default.find({})
            .skip(skip)
            .limit(pageSize)
            .sort({ createAt: -1 }),
        event_model_1.default.countDocuments({}),
    ]);
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
        events,
        pagination: {
            pageSize,
            pageNumber,
            totalCount,
            totalPages,
            skip,
        },
    };
};
exports.getAllEventsService = getAllEventsService;
const getAllEventsInOrgService = async (orgId, filters, pagination) => {
    const query = {
        organization: orgId,
    };
    if (filters.programId) {
        query.program = filters.programId;
    }
    if (filters.status && filters.status?.length > 0) {
        query.status = { $in: filters.status };
    }
    if (filters.priority && filters.priority?.length > 0) {
        query.priority = { $in: filters.priority };
    }
    if (filters.assignedTo && filters.assignedTo?.length > 0) {
        query.assignedTo = { $in: filters.assignedTo };
    }
    if (filters.keyword && filters.keyword !== undefined) {
        query.title = { $regex: filters.keyword, $options: "i" };
    }
    if (filters.registrationDeadline) {
        query.registrationDeadline = {
            $eq: new Date(filters.registrationDeadline),
        };
    }
    if (filters.startTime) {
        query.startTime = {
            $eq: new Date(filters.startTime),
        };
    }
    if (filters.endTime) {
        query.endTime = {
            $eq: new Date(filters.endTime),
        };
    }
    //Pagination Setup
    const { pageSize, pageNumber } = pagination;
    const skip = (pageNumber - 1) * pageSize;
    const [events, totalCount] = await Promise.all([
        event_model_1.default.find(query)
            .skip(skip)
            .limit(pageSize)
            .sort({ createAt: -1 })
            .populate("assignedTo", "_id name profilePicture")
            .populate("createBy", "_id name profilePicture"),
        event_model_1.default.countDocuments(query),
    ]);
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
        events,
        pagination: {
            pageSize,
            pageNumber,
            totalCount,
            totalPages,
            skip,
        },
    };
};
exports.getAllEventsInOrgService = getAllEventsInOrgService;
const getEventByIdService = async (orgId, eventId) => {
    const event = await event_model_1.default.findOne({ _id: eventId, organization: orgId })
        .populate("assignedTo", "name profilePicture")
        .populate("program", "name")
        .populate("createBy", "name profilePicture");
    if (!event) {
        throw new appError_1.NotFoundException("Event not found");
    }
    return { event };
};
exports.getEventByIdService = getEventByIdService;
const updateEventByIdService = async (orgId, eventId, body) => {
    const { program, assignedTo, cohost } = body;
    const event = await event_model_1.default.findOne({ _id: eventId, organization: orgId });
    if (!event) {
        throw new appError_1.NotFoundException("Event not found");
    }
    if (program) {
        const programIsExist = await program_model_1.default.findOne({
            _id: program,
            organization: orgId
        });
        if (!programIsExist)
            throw new appError_1.NotFoundException("Program not found.");
    }
    if (cohost && cohost.length > 0) {
        // Use map + Promise.all pattern instead of forEach
        await Promise.all(cohost.map(async (hostId) => {
            const hostIsExist = await organization_model_1.default.findOne({ _id: hostId });
            if (!hostIsExist)
                throw new appError_1.NotFoundException(`Host organization with ID ${hostId} not found.`);
        }));
    }
    if (assignedTo && assignedTo.length > 0) {
        await Promise.all(assignedTo.map(async (userId) => {
            const userIsExist = await member_model_1.default.findOne({ orgId, userId });
            if (!userIsExist)
                throw new appError_1.NotFoundException(`User with ID ${userId} not found or not a member of this organization.`);
        }));
    }
    // Update event fields
    Object.assign(event, body);
    await event.save();
    return { event };
};
exports.updateEventByIdService = updateEventByIdService;
const deleteEventByIdService = async (orgId, eventId) => {
    const event = await event_model_1.default.findOne({ _id: eventId, organization: orgId });
    if (!event) {
        throw new appError_1.NotFoundException("Event not found");
    }
    await event.deleteOne();
    await attendance_model_1.default.deleteMany({ eventId });
    return { event };
};
exports.deleteEventByIdService = deleteEventByIdService;
