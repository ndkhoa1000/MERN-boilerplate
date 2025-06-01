"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAttendanceService = exports.updateAttendanceService = exports.getAttendancesByUserService = exports.getAttendancesByEventService = exports.getAttendanceByIdService = exports.createAttendanceService = void 0;
const attendance_model_1 = __importDefault(require("../models/attendance.model"));
const event_model_1 = __importDefault(require("../models/event.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const appError_1 = require("../utils/appError");
const createAttendanceService = async (eventId, userId, body) => {
    // Check if event exists
    const event = await event_model_1.default.findById(eventId);
    if (!event) {
        throw new appError_1.NotFoundException("Event not found");
    }
    // Check if user exists
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        throw new appError_1.NotFoundException("User not found");
    }
    // Check if attendance already exists
    const existingAttendance = await attendance_model_1.default.findOne({ eventId, userId });
    if (existingAttendance) {
        throw new appError_1.BadRequestException("User is already registered for this event");
    }
    // Calculate hours if check-in and check-out times are provided
    let hours = body.hoursContributed || 0;
    if (body.checkInTime && body.checkOutTime) {
        const checkIn = new Date(body.checkInTime);
        const checkOut = new Date(body.checkOutTime);
        hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    }
    const attendance = new attendance_model_1.default({
        eventId,
        userId,
        isPresent: body.isPresent !== undefined ? body.isPresent : true,
        checkInTime: body.checkInTime || new Date(),
        checkOutTime: body.checkOutTime || null,
        hoursContributed: hours,
        feedback: body.feedback || null
    });
    await attendance.save();
    // Update event registration count
    event.registeredVolunteer += 1;
    await event.save();
    // Update user's total volunteer hours
    user.totalVolunteerHours += hours;
    await user.save();
    return { attendance };
};
exports.createAttendanceService = createAttendanceService;
const getAttendanceByIdService = async (attendanceId) => {
    const attendance = await attendance_model_1.default.findById(attendanceId)
        .populate("userId", "name email profilePicture")
        .populate("eventId", "title startTime endTime");
    if (!attendance) {
        throw new appError_1.NotFoundException("Attendance record not found");
    }
    return { attendance };
};
exports.getAttendanceByIdService = getAttendanceByIdService;
const getAttendancesByEventService = async (eventId) => {
    const event = await event_model_1.default.findById(eventId);
    if (!event) {
        throw new appError_1.NotFoundException("Event not found");
    }
    const attendances = await attendance_model_1.default.find({ eventId })
        .populate("userId", "name email profilePicture")
        .sort({ checkInTime: -1 });
    return { attendances };
};
exports.getAttendancesByEventService = getAttendancesByEventService;
const getAttendancesByUserService = async (userId) => {
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        throw new appError_1.NotFoundException("User not found");
    }
    const attendances = await attendance_model_1.default.find({ userId })
        .populate("eventId", "title startTime endTime organization")
        .sort({ checkInTime: -1 });
    return { attendances };
};
exports.getAttendancesByUserService = getAttendancesByUserService;
const updateAttendanceService = async (attendanceId, body) => {
    const attendance = await attendance_model_1.default.findById(attendanceId);
    if (!attendance) {
        throw new appError_1.NotFoundException("Attendance record not found");
    }
    const previousHours = attendance.hoursContributed || 0;
    let newHours = body.hoursContributed;
    if (body.checkInTime && body.checkOutTime) {
        const checkIn = new Date(body.checkInTime);
        const checkOut = new Date(body.checkOutTime);
        newHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    }
    else if (body.checkOutTime && attendance.checkInTime) {
        const checkIn = new Date(attendance.checkInTime);
        const checkOut = new Date(body.checkOutTime);
        newHours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
    }
    // Update attendance fields
    if (body.isPresent !== undefined)
        attendance.isPresent = body.isPresent;
    if (body.checkInTime)
        attendance.checkInTime = body.checkInTime;
    if (body.checkOutTime)
        attendance.checkOutTime = body.checkOutTime;
    if (newHours !== undefined)
        attendance.hoursContributed = newHours;
    if (body.feedback !== undefined)
        attendance.feedback = body.feedback;
    await attendance.save();
    // Update user's total volunteer hours
    if (newHours !== undefined && newHours !== previousHours) {
        const user = await user_model_1.default.findById(attendance.userId);
        if (user) {
            user.totalVolunteerHours = user.totalVolunteerHours - previousHours + newHours;
            await user.save();
        }
    }
    return { attendance };
};
exports.updateAttendanceService = updateAttendanceService;
const deleteAttendanceService = async (attendanceId) => {
    const attendance = await attendance_model_1.default.findById(attendanceId);
    if (!attendance) {
        throw new appError_1.NotFoundException("Attendance record not found");
    }
    const hours = attendance.hoursContributed || 0;
    await attendance.deleteOne();
    // Update event registration count
    const event = await event_model_1.default.findById(attendance.eventId);
    if (event) {
        event.registeredVolunteer = Math.max(0, event.registeredVolunteer - 1);
        await event.save();
    }
    // Update user's total volunteer hours
    const user = await user_model_1.default.findById(attendance.userId);
    if (user) {
        user.totalVolunteerHours = Math.max(0, user.totalVolunteerHours - hours);
        await user.save();
    }
    return { attendance };
};
exports.deleteAttendanceService = deleteAttendanceService;
