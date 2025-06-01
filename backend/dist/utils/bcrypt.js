"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareValue = exports.hashValue = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashValue = async (value, saltRounds = 10) => {
    const hash = await bcrypt_1.default.hash(value, saltRounds);
    return hash;
};
exports.hashValue = hashValue;
const compareValue = async (value, hashValue) => {
    return await bcrypt_1.default.compare(value, hashValue);
};
exports.compareValue = compareValue;
