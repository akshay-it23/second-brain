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
const db_1 = require("./db"); // your mongoose models
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const app = (0, express_1.default)();
// Environment variables
const PORT = process.env.PORT || 3000;
const JWT_PASSWORD = process.env.JWT_PASSWORD || "secret";
// Remove trailing slash from frontend URLs
const FRONTEND_URLS = (process.env.FRONTEND_URLS || "http://localhost:5173,https://frontend-i2zbjmw86-akshays-projects-34a7e62a.vercel.app")
    .split(",")
    .map(url => url.replace(/\/$/, "")); // remove trailing slash
app.use((req, res, next) => {
    const origin = req.headers.origin;
    // allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) {
        // still set some CORS response headers for non-browser clients
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
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
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
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
// ------------------ Routes ------------------
// Signup
app.post("/api/v1/signup", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: "username and password are required" });
    try {
        await db_1.UserModel.create({ username, password });
        res.status(201).json({ message: "user signed up" });
    }
    catch (error) {
        if (error.code === 11000)
            return res.status(409).json({ message: "username already exists" });
        res.status(500).json({ message: "internal server error" });
    }
});
// Signin
app.post("/api/v1/signin", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ message: "username and password are required" });
    try {
        const existingUser = await db_1.UserModel.findOne({ username, password });
        if (!existingUser)
            return res.status(403).json({ message: "incorrect credential" });
        const token = jsonwebtoken_1.default.sign({ id: existingUser.id }, JWT_PASSWORD);
        res.json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "internal server error" });
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
        if (!deletedContent)
            return res.status(404).json({ message: "Content not found or unauthorized" });
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
});
// Get shared brain
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await db_1.LinkModel.findOne({ hash });
    if (!link)
        return res.status(404).json({ message: "sorry incorrect input" });
    const content = await db_1.ContentModel.find({ userId: link.userId });
    const user = await db_1.UserModel.findOne({ _id: link.userId });
    res.json({
        username: user?.username,
        content
    });
});
// ------------------ Start Server ------------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
