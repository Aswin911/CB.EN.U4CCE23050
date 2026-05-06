"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = Log;
const axios_1 = __importDefault(require("axios"));
const LOG_API = "http://20.207.122.201/evaluation-service/logs";
async function Log(stack, level, pkg, message) {
    try {
        const token = process.env.BEARER_TOKEN;
        await axios_1.default.post(LOG_API, { stack, level, package: pkg, message }, { headers: { Authorization: `Bearer ${token}` } });
    }
    catch (_a) {
        // silent fail — logger must never crash the app
    }
}
