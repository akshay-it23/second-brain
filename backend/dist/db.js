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
exports.ContentModel = exports.LinkModel = exports.UserModel = void 0;
exports.connectToDatabase = connectToDatabase;
const mongoose_1 = __importStar(require("mongoose"));
// Export a function to connect to MongoDB so the server only starts after DB is ready.
function getMongoUri() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error("MONGODB_URI environment variable is required");
    }
    return mongoUri;
}
// Retry configuration
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second
// Sleep utility for retry delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function connectToDatabase() {
    const mongoUri = getMongoUri();
    console.log("Using MongoDB URI:", mongoUri.startsWith("mongodb+srv") ? "<atlas_uri>" : mongoUri);
    let lastError;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`🔄 MongoDB connection attempt ${attempt}/${MAX_RETRIES}...`);
            // Mongoose 7.x connection options
            await mongoose_1.default.connect(mongoUri, {
                // Connection pool settings
                minPoolSize: 5,
                maxPoolSize: 10,
                // Timeout settings
                serverSelectionTimeoutMS: 10000, // 10 seconds to select a server
                socketTimeoutMS: 45000, // 45 seconds socket timeout
                connectTimeoutMS: 30000, // 30 seconds connection timeout
                // Retry settings
                retryWrites: true,
                retryReads: true,
            });
            console.log("✅ MongoDB connected successfully");
            // Set up connection event listeners
            mongoose_1.default.connection.on('error', (err) => {
                console.error('❌ MongoDB connection error:', err);
            });
            mongoose_1.default.connection.on('disconnected', () => {
                console.warn('⚠️ MongoDB disconnected');
            });
            mongoose_1.default.connection.on('reconnected', () => {
                console.log('🔄 MongoDB reconnected');
            });
            return; // Success, exit function
        }
        catch (err) {
            lastError = err;
            console.error(`❌ MongoDB connection attempt ${attempt} failed:`, err.message);
            if (attempt < MAX_RETRIES) {
                const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
                console.log(`⏳ Retrying in ${delay}ms...`);
                await sleep(delay);
            }
        }
    }
    // All retries failed
    console.error("❌ Failed to connect to MongoDB after", MAX_RETRIES, "attempts");
    console.error("Last error:", lastError);
    throw lastError;
}
// User schema
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
// User model
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
// Content schema
const ContentSchema = new mongoose_1.Schema({
    title: String,
    link: String,
    type: String,
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true }
});
// Link schema
const LinkSchema = new mongoose_1.Schema({
    hash: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true, unique: true },
});
exports.LinkModel = (0, mongoose_1.model)("Link", LinkSchema);
exports.ContentModel = (0, mongoose_1.model)("Content", ContentSchema);
