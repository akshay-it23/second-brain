"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db"); // your mongoose models
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const config_1 = require("./config");
const app = (0, express_1.default)();
// Environment variables
const PORT = Number(process.env.PORT || 3000);
// warn if default secret is used in non-local environment
if (!process.env.JWT_PASSWORD && process.env.NODE_ENV === "production") {
    console.warn("⚠️ JWT_PASSWORD is not set in environment. Using default secret — set JWT_PASSWORD in env for security.");
}
// Remove trailing slash from frontend URLs
const FRONTEND_URLS = (process.env.FRONTEND_URLS || "http://localhost:5173,https://frontend-i2zbjmw86-akshays-projects-34a7e62a.vercel.app")
    .split(",")
    .map(url => url.replace(/\/$/, "")); // remove trailing slash
app.use((req, res, next) => {
    // Ensure caches vary by request values that affect CORS
    res.setHeader("Vary", "Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
    const origin = req.headers.origin;
    const requestedMethods = req.headers["access-control-request-method"] || "GET,POST,PUT,PATCH,DELETE,OPTIONS";
    const requestedHeaders = req.headers["access-control-request-headers"] || "Content-Type,Authorization";
    // allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) {
        // still set some CORS response headers for non-browser clients
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", requestedMethods);
        res.setHeader("Access-Control-Allow-Headers", requestedHeaders);
        if (req.method === "OPTIONS") {
            res.sendStatus(204);
            return;
        }
        next();
        return;
    }
    const normalized = origin.replace(/\/$/, "");
    let allowed = FRONTEND_URLS.includes(normalized);
    // allow any vercel.app preview/app domain
    if (!allowed) {
        try {
            const u = new URL(origin);
            if (u.hostname.endsWith(".vercel.app"))
                allowed = true;
        }
        catch (e) {
            // ignore
        }
    }
    if (allowed) {
        // echo the incoming origin exactly so the browser accepts the response
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", requestedMethods);
        res.setHeader("Access-Control-Allow-Headers", requestedHeaders);
        if (req.method === "OPTIONS") {
            res.sendStatus(204);
            return;
        }
        next();
        return;
    }
    // not allowed
    res.status(403).json({ message: "CORS not allowed" });
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Database connection check middleware (only for routes that need DB)
const dbCheckMiddleware = (req, res, next) => {
    const readyState = mongoose_1.default.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (readyState !== 1) {
        console.error(`Database not connected. ReadyState: ${readyState} (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)`);
        res.status(503).json({
            message: "Database not available. Please try again later.",
            readyState: readyState
        });
        return;
    }
    next();
};
// ------------------ Routes ------------------
// Health check endpoint
app.get("/api/v1/health", (req, res) => {
    const dbState = mongoose_1.default.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    res.json({
        status: dbState === 1 ? 'healthy' : 'unhealthy',
        database: states[dbState] || 'unknown',
        readyState: dbState,
        timestamp: new Date().toISOString()
    });
});
// Signup
app.post("/api/v1/signup", dbCheckMiddleware, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "username and password are required" });
        return;
    }
    try {
        // Validate input
        if (typeof username !== 'string' || username.trim().length === 0) {
            res.status(400).json({ message: "username must be a non-empty string" });
            return;
        }
        if (typeof password !== 'string' || password.length < 3) {
            res.status(400).json({ message: "password must be at least 3 characters" });
            return;
        }
        const saltRounds = 10;
        const hashed = await bcrypt_1.default.hash(password, saltRounds);
        // Check if UserModel is properly initialized
        if (!db_1.UserModel) {
            console.error("UserModel is not defined!");
            res.status(500).json({ message: "Database model not initialized" });
            return;
        }
        const newUser = await db_1.UserModel.create({ username: username.trim(), password: hashed });
        console.log("User created successfully:", newUser.username);
        res.status(201).json({ message: "user signed up" });
    }
    catch (error) {
        console.error("Signup error:", error);
        console.error("Error details:", {
            message: error.message,
            code: error.code,
            name: error.name,
            errors: error.errors,
            keyPattern: error.keyPattern,
            keyValue: error.keyValue,
            stack: error.stack?.substring(0, 500)
        });
        // Handle duplicate key error (MongoDB)
        if (error.code === 11000 || error.name === 'MongoServerError') {
            const field = error.keyPattern ? Object.keys(error.keyPattern)[0] : 'field';
            res.status(409).json({ message: `${field} already exists` });
            return;
        }
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors || {}).map((e) => e.message);
            res.status(400).json({ message: messages.join(', ') });
            return;
        }
        // Include error details in response for debugging
        res.status(500).json({
            message: "internal server error",
            error: error.message || "Unknown error",
            code: error.code || error.name || "NO_CODE",
            type: error.name || "Unknown"
        });
    }
});
// Signin
app.post("/api/v1/signin", dbCheckMiddleware, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "username and password are required" });
        return;
    }
    try {
        const existingUser = await db_1.UserModel.findOne({ username });
        if (!existingUser) {
            res.status(403).json({ message: "incorrect credential" });
            return;
        }
        let match = false;
        try {
            match = await bcrypt_1.default.compare(password, existingUser.password);
        }
        catch (err) {
            console.error("Error comparing password for user:", username, err);
            // Treat as password mismatch
            res.status(403).json({ message: "incorrect credential (error)" });
            return;
        }
        if (!match) {
            res.status(403).json({ message: "incorrect credential" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: existingUser.id }, config_1.JWT_PASSWORD);
        res.json({ token });
    }
    catch (error) {
        console.error("Signin error:", error);
        // Log more details if available
        if (error instanceof Error) {
            console.error("Stack:", error.stack);
        }
        res.status(500).json({
            message: "internal server error",
            error: error.message
        });
    }
});
// Add content
app.post("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const { link, type, title } = req.body;
    let contentType = type;
    if (!contentType && typeof link === "string") {
        const l = link.toLowerCase();
        if (l.includes("youtube.com") || l.includes("youtu.be"))
            contentType = "youtube";
        else if (l.includes("twitter.com") || l.includes("x.com"))
            contentType = "twitter";
        else if (l.includes("instagram.com"))
            contentType = "instagram";
        else if (l.includes("spotify.com"))
            contentType = "spotify";
        else if (l.includes("linkedin.com"))
            contentType = "linkedin";
        else
            contentType = "link";
    }
    const userObjectId = req.userId ? new mongoose_1.default.Types.ObjectId(req.userId) : undefined;
    try {
        await db_1.ContentModel.create({
            link,
            type: contentType,
            title,
            userId: userObjectId ?? req.userId,
            tags: [],
        });
        res.json({ message: "content added" });
    }
    catch (error) {
        console.error("Error creating content:", error);
        res.status(500).json({ message: "internal server error" });
    }
});
// Get user content
app.get("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const userId = req.userId;
    const content = await db_1.ContentModel.find({ userId }).populate("userId", "username");
    res.json({ content });
});
// Delete content
app.delete("/api/v1/content/:id", middleware_1.userMiddleware, async (req, res) => {
    const contentId = req.params.id;
    const userId = req.userId;
    try {
        const userObjectId = userId ? new mongoose_1.default.Types.ObjectId(userId) : undefined;
        const deletedContent = await db_1.ContentModel.findOneAndDelete({
            _id: contentId,
            userId: userObjectId ?? userId,
        });
        if (!deletedContent) {
            res.status(404).json({ message: "Content not found or unauthorized" });
            return;
        }
        res.json({ message: "content deleted" });
    }
    catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({ message: "internal server error" });
    }
});
// Share brain
app.post("/api/v1/brain/share", middleware_1.userMiddleware, async (req, res) => {
    const { share } = req.body;
    try {
        if (share) {
            const existingLink = await db_1.LinkModel.findOne({ userId: req.userId });
            if (existingLink) {
                res.json({ hash: existingLink.hash });
                return;
            }
            const hash = (0, utils_1.random)(10);
            await db_1.LinkModel.create({ userId: req.userId, hash });
            res.json({ hash });
            return;
        }
        else {
            await db_1.LinkModel.deleteOne({ userId: req.userId });
            res.json({ message: "Removed link" });
            return;
        }
    }
    catch (error) {
        console.error("Error in share brain:", error);
        res.status(500).json({ message: "internal server error" });
    }
});
// Get shared brain
app.get("/api/v1/brain/:shareLink", dbCheckMiddleware, async (req, res) => {
    const hash = req.params.shareLink;
    try {
        const link = await db_1.LinkModel.findOne({ hash });
        if (!link) {
            res.status(404).json({ message: "sorry incorrect input" });
            return;
        }
        const content = await db_1.ContentModel.find({ userId: link.userId });
        const user = await db_1.UserModel.findOne({ _id: link.userId });
        res.json({
            username: user?.username,
            content
        });
    }
    catch (error) {
        console.error("Error fetching shared brain:", error);
        res.status(500).json({ message: "internal server error" });
    }
});
// ------------------ Start Server ------------------
// Start server only after DB is connected
const db_2 = require("./db");
async function start() {
    try {
        await (0, db_2.connectToDatabase)();
    }
    catch (err) {
        console.error("Failed to connect to DB, exiting.");
        process.exit(1);
    }
    const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error(`Port ${PORT} in use, retrying in 1s...`);
            setTimeout(() => {
                server.close();
                start();
            }, 1000);
        }
        else {
            console.error("Server error:", err);
        }
    });
    // Graceful shutdown handling
    const gracefulShutdown = async (signal) => {
        console.log(`\n${signal} received. Starting graceful shutdown...`);
        server.close(async () => {
            console.log("HTTP server closed.");
            try {
                await mongoose_1.default.connection.close();
                console.log("MongoDB connection closed.");
                process.exit(0);
            }
            catch (err) {
                console.error("Error closing MongoDB connection:", err);
                process.exit(1);
            }
        });
        // Force shutdown after 10 seconds
        setTimeout(() => {
            console.error("Forced shutdown after timeout");
            process.exit(1);
        }, 10000);
    };
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}
start();
