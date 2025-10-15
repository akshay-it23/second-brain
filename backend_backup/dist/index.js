"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db"); // will connect automatically
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const cors_1 = __importDefault(require("cors"));
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const db_2 = require("./db");
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // allow frontend
    credentials: true, // allow cookies/auth headers if used
}));
app.post("/api/v1/signup", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "username and password are required" });
        return;
    }
    try {
        await db_1.UserModel.create({ username, password });
        res.status(201).json({ message: "user signed up" });
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(409).json({ message: "username already exists" });
            return;
        }
        res.status(500).json({ message: "internal server error" });
    }
});
app.post("/api/v1/signin", async (req, res) => {
    const username = req.body?.username;
    const password = req.body?.password;
    if (!username || !password) {
        res.status(400).json({ message: "username and password are required" });
        return;
    }
    try {
        const existingUser = await db_1.UserModel.findOne({ username, password });
        if (!existingUser) {
            res.status(403).json({ message: "incorrect credential" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: existingUser.id }, config_1.JWT_PASSWORD);
        res.json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "internal server error" });
    }
});
app.post("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.link;
    const userId = new mongoose_1.default.Types.ObjectId(req.userId);
    console.log("before saving ,userId:", typeof userId, userId);
    await db_1.ContentModel.create({
        link,
        type,
        title: req.body.title,
        userId: req.userId,
        tags: []
    });
    res.json({
        message: "content added"
    });
});
app.get("/api/v1/content", middleware_1.userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await db_1.ContentModel.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    });
});
app.delete("/api/v1/content/:id", middleware_1.userMiddleware, async (req, res) => {
    const contentId = req.params.id;
    const userId = req.userId;
    try {
        // Cast userId to ObjectId to avoid type mismatches (middleware usually sets string id)
        const userObjectId = userId ? new mongoose_1.default.Types.ObjectId(userId) : undefined;
        const deletedContent = await db_1.ContentModel.findOneAndDelete({
            _id: contentId,
            // @ts-ignore - allow matching by ObjectId or string depending on schema
            userId: userObjectId ?? userId,
        });
        if (!deletedContent) {
            res.status(404).json({ message: "Content not found or unauthorized" });
            return;
        }
        res.json({ message: "content deleted" });
        return;
    }
    catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({ message: "internal server error" });
        return;
    }
});
app.post("/api/v1/brain/share", middleware_1.userMiddleware, async (req, res) => {
    const share = req.body.share;
    if (share) {
        const existingLink = await db_2.LinkModel.findOne({
            userId: req.userId,
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash,
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        await db_2.LinkModel.create({
            userId: req.userId,
            hash: hash,
        });
        res.json({
            message: "/share/" + hash,
        });
    }
    else {
        await db_2.LinkModel.deleteOne({
            userId: req.userId,
        });
        res.json({
            message: "Removed link",
        });
    }
});
exports.default = app;
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await db_2.LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "sorry incorrect input"
        });
        return;
    }
    //userid
    const content = await db_1.ContentModel.find({
        userId: link.userId
    });
    console.log(link);
    const user = await db_1.UserModel.findOne({
        _id: link.userId
    });
    res.json({
        //?optional username can be null
        username: user?.username,
        content: content
    });
});
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
