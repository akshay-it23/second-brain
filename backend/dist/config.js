"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_PASSWORD = void 0;
// Prefer environment variable for secrets in production
exports.JWT_PASSWORD = process.env.JWT_PASSWORD || "secret";
