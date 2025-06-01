"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventCategoriesEnumsController = exports.getEventPriorityEnumsController = exports.getEventStatusEnumsController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const http_config_1 = require("../config/http.config");
const event_enums_1 = require("../enums/event.enums");
const eventCategories_enums_1 = require("../enums/eventCategories.enums");
exports.getEventStatusEnumsController = (0, asyncHandler_middleware_1.asyncHandler)(async (_req, res) => {
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Event status enums fetched successfully",
        eventStatuses: Object.values(event_enums_1.EventStatusEnum)
    });
});
exports.getEventPriorityEnumsController = (0, asyncHandler_middleware_1.asyncHandler)(async (_req, res) => {
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Event priority enums fetched successfully",
        eventPriorities: Object.values(event_enums_1.EventPriorityEnum)
    });
});
exports.getEventCategoriesEnumsController = (0, asyncHandler_middleware_1.asyncHandler)(async (_req, res) => {
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Event category enums fetched successfully",
        eventCategories: Object.values(eventCategories_enums_1.eventCategories)
    });
});
