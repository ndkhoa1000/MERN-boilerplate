"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProgramByIdService = exports.getProgramAnalyticsService = exports.updateProgramByIdService = exports.getProgramByIdService = exports.getAllProgramsService = exports.createProgramService = void 0;
const appError_1 = require("../utils/appError");
const program_model_1 = __importDefault(require("../models/program.model"));
const event_model_1 = __importDefault(require("../models/event.model"));
const event_enums_1 = require("../enums/event.enums");
const createProgramService = async (userId, orgId, body) => {
    const { name, description, startDate, endDate, sponsors, documents } = body;
    const program = new program_model_1.default({
        name,
        description,
        organization: orgId,
        startDate,
        endDate,
        sponsors,
        documents,
        createBy: userId,
    });
    await program.save();
    return { program };
};
exports.createProgramService = createProgramService;
const getAllProgramsService = async (orgId, pageSize, pageNumber) => {
    const totalCount = await program_model_1.default.countDocuments({ organization: orgId });
    const skip = (pageNumber - 1) * pageSize;
    const programs = await program_model_1.default.find({ organization: orgId })
        .skip(skip)
        .limit(pageSize)
        .populate("createBy", "_id name profilePicture")
        .sort({ createAt: -1 });
    const totalPages = Math.ceil(totalCount / pageSize);
    return { programs, totalCount, totalPages, skip };
};
exports.getAllProgramsService = getAllProgramsService;
const getProgramByIdService = async (orgId, programId) => {
    const program = await program_model_1.default.findOne({
        _id: programId,
        organization: orgId
    }).populate("createBy", "_id name profilePicture");
    if (!program)
        throw new appError_1.NotFoundException("Program not found.");
    return { program };
};
exports.getProgramByIdService = getProgramByIdService;
const updateProgramByIdService = async (orgId, programId, body) => {
    const { name, description, startDate, endDate, sponsors, documents } = body;
    const program = await program_model_1.default.findOne({ _id: programId, organization: orgId });
    if (!program)
        throw new appError_1.NotFoundException("Program not found.");
    if (name)
        program.name = name;
    if (description)
        program.description = description;
    if (startDate)
        program.startDate = startDate;
    if (endDate)
        program.endDate = endDate;
    if (sponsors)
        program.sponsors = sponsors;
    if (documents)
        program.documents = documents;
    await program.save();
    return { program };
};
exports.updateProgramByIdService = updateProgramByIdService;
const getProgramAnalyticsService = async (orgId, programId) => {
    const currentDate = new Date();
    const totalEvent = await event_model_1.default.countDocuments({ organization: orgId, program: programId });
    const totalPendingEvent = await event_model_1.default.countDocuments({
        organization: orgId,
        program: programId,
        startTime: { $lt: currentDate },
        status: event_enums_1.EventStatusEnum.PENDING
    });
    const totalActiveEvent = await event_model_1.default.countDocuments({
        organization: orgId,
        program: programId,
        startTime: { $lt: currentDate },
        status: event_enums_1.EventStatusEnum.ACTIVE
    });
    const totalCompleteEvent = await event_model_1.default.countDocuments({
        organization: orgId,
        program: programId,
        startTime: { $lt: currentDate },
        status: event_enums_1.EventStatusEnum.COMPLETED
    });
    const totalPostponedEvent = await event_model_1.default.countDocuments({
        organization: orgId,
        program: programId,
        startTime: { $lt: currentDate },
        status: event_enums_1.EventStatusEnum.POSTPONED
    });
    const analysis = {
        totalEvent,
        totalPendingEvent,
        totalActiveEvent,
        totalCompleteEvent,
        totalPostponedEvent,
    };
    return { analysis };
};
exports.getProgramAnalyticsService = getProgramAnalyticsService;
const deleteProgramByIdService = async (orgId, programId) => {
    const program = await program_model_1.default.findOne({ organization: orgId, _id: programId });
    if (!program) {
        throw new appError_1.NotFoundException("Program not found or not belongs to this organization.");
    }
    await program.deleteOne();
    await event_model_1.default.deleteMany({ program: program._id });
    return { program };
};
exports.deleteProgramByIdService = deleteProgramByIdService;
