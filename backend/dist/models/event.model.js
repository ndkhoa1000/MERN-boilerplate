"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const event_enums_1 = require("../enums/event.enums");
const eventCategories_enums_1 = require("../enums/eventCategories.enums");
const eventSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: false, default: null },
    program: { type: mongoose_1.Schema.Types.ObjectId, ref: "Program", required: false },
    organization: { type: mongoose_1.Schema.Types.ObjectId, ref: "Organization", required: true },
    category: { type: [String], enums: Object.values(eventCategories_enums_1.eventCategories), required: false, default: [] },
    location: { type: String, required: true, trim: true },
    requiredVolunteer: { type: Number, required: true, default: 0 },
    registeredVolunteer: { type: Number, required: true, default: 0,
        validate: function (value) {
            return value <= this.requiredVolunteer;
        }, message: 'Full! Registered volunteer cannot be greater than required volunteer.' },
    registrationDeadline: { type: Date, required: false, default: null },
    startTime: { type: Date, required: false, default: null },
    endTime: { type: Date, required: false, default: null,
        validate: function (value) {
            return !this.endTime || !value || (this.startTime && value >= this.startTime);
        }, message: 'Star time must be before end time.' },
    documents: { type: [String], required: false, default: [] },
    needTraining: { type: Boolean, required: false, default: false },
    status: {
        type: String,
        required: true,
        enum: Object.values(event_enums_1.EventStatusEnum),
        default: event_enums_1.EventStatusEnum.PENDING,
    },
    priority: {
        type: String,
        required: true,
        enum: Object.values(event_enums_1.EventPriorityEnum),
        default: event_enums_1.EventPriorityEnum.MEDIUM
    },
    cohost: { type: [mongoose_1.Schema.Types.ObjectId], ref: "Organization", required: false, default: [] },
    assignedTo: { type: [mongoose_1.Schema.Types.ObjectId], ref: "User", required: false, default: [] },
    createBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: {
        createdAt: "createAt",
        updatedAt: "updateAt",
    },
});
const EventModel = mongoose_1.default.model("Event", eventSchema);
exports.default = EventModel;
