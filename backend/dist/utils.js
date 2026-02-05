"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = random;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generate a cryptographically secure random string
 * @param len - Length of the random string
 * @returns Random alphanumeric string
 */
function random(len) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charsetLength = charset.length;
    let result = "";
    const randomBytes = crypto_1.default.randomBytes(len);
    for (let i = 0; i < len; i++) {
        result += charset[randomBytes[i] % charsetLength];
    }
    return result;
}
