"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInviteCode = void 0;
const uuid_1 = require("uuid");
const generateInviteCode = () => {
    return (0, uuid_1.v4)().replace(/-/g, "").substring(0, 8);
};
exports.generateInviteCode = generateInviteCode;
