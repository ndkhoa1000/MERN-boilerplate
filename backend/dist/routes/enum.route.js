"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enum_controller_1 = require("../controllers/enum.controller");
const enumRoutes = (0, express_1.Router)();
enumRoutes.get("/event-status", enum_controller_1.getEventStatusEnumsController);
enumRoutes.get("/event-priority", enum_controller_1.getEventPriorityEnumsController);
enumRoutes.get("/event-categories", enum_controller_1.getEventCategoriesEnumsController);
exports.default = enumRoutes;
