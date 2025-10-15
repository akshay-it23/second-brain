import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import { ContentModel, UserModel, LinkModel } from "./db"; // your mongoose models
import { AuthRequest, userMiddleware } from "./middleware";
import { random } from "./utils";

const app = express();

// Environment variables
const PORT = process.env.PORT || 3000;
const JWT_PASSWORD = process.env.JWT_PASSWORD || "secret";

// Remove trailing slash from frontend URLs
const FRONTEND_URLS = (process.env.FRONTEND_URLS || "http://localhost:5173,https://frontend-i2zbjmw86-akshays-projects-34a7e62a.vercel.app")
  .split(",")
  .map(url => url.replace(/\/$/, "")); // remove trailing slash

// CORS configuration: custom middleware that echoes the incoming Origin when allowed.
// This prevents Access-Control-Allow-Origin from being set to a static value that
// doesn't match the actual request origin (which causes the browser error you saw).
import { NextFunction } from "express";

app.use((req: Request, res: Response, next: NextFunction) => {
  // Ensure caches vary by request values that affect CORS
  res.setHeader("Vary", "Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
  const origin = req.headers.origin as string | undefined;
  const requestedMethods = (req.headers["access-control-request-method"] as string | undefined) || "GET,POST,PUT,PATCH,DELETE,OPTIONS";
  const requestedHeaders = (req.headers["access-control-request-headers"] as string | undefined) || "Content-Type,Authorization";
  // allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) {
      // still set some CORS response headers for non-browser clients
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", requestedMethods);
    res.setHeader("Access-Control-Allow-Headers", requestedHeaders);
      if (req.method === "OPTIONS") { res.sendStatus(204); return; }
      next();
      return;
    }

  const normalized = origin.replace(/\/$/, "");
  let allowed = FRONTEND_URLS.includes(normalized);

  // allow any vercel.app preview/app domain
  if (!allowed) {
    try {
      const u = new URL(origin);
      if (u.hostname.endsWith(".vercel.app")) allowed = true;
    } catch (e) {
      // ignore
    }
  }

  if (allowed) {
    // echo the incoming origin exactly so the browser accepts the response
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", requestedMethods);
    res.setHeader("Access-Control-Allow-Headers", requestedHeaders);
    if (req.method === "OPTIONS") { res.sendStatus(204); return; }
    next();
    return;
  }

  // not allowed
  res.status(403).json({ message: "CORS not allowed" });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------ Routes ------------------

// Signup
app.post("/api/v1/signup", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) { res.status(400).json({ message: "username and password are required" }); return; }

  try {
    await UserModel.create({ username, password });
    res.status(201).json({ message: "user signed up" });
  } catch (error: any) {
    if (error.code === 11000) { res.status(409).json({ message: "username already exists" }); return; }
    res.status(500).json({ message: "internal server error" });
  }
});

// Signin
app.post("/api/v1/signin", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) { res.status(400).json({ message: "username and password are required" }); return; }

  try {
    const existingUser = await UserModel.findOne({ username, password });
    if (!existingUser) { res.status(403).json({ message: "incorrect credential" }); return; }

    const token = jwt.sign({ id: existingUser.id }, JWT_PASSWORD);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
});

// Add content
app.post("/api/v1/content", userMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { link, type, title } = req.body;
  let contentType = type;

  if (!contentType && typeof link === "string") {
    const l = link.toLowerCase();
    if (l.includes("youtube.com") || l.includes("youtu.be")) contentType = "youtube";
    else if (l.includes("twitter.com") || l.includes("x.com")) contentType = "twitter";
    else if (l.includes("instagram.com")) contentType = "instagram";
    else if (l.includes("spotify.com")) contentType = "spotify";
    else if (l.includes("linkedin.com")) contentType = "linkedin";
    else contentType = "link";
  }

  const userObjectId = req.userId ? new mongoose.Types.ObjectId(req.userId) : undefined;

  try {
    await ContentModel.create({
      link,
      type: contentType,
      title,
      userId: userObjectId ?? req.userId,
      tags: [],
    });
    res.json({ message: "content added" });
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ message: "internal server error" });
  }
});

// Get user content
app.get("/api/v1/content", userMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;
  const content = await ContentModel.find({ userId }).populate("userId", "username");
  res.json({ content });
});

// Delete content
app.delete("/api/v1/content/:id", userMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const contentId = req.params.id;
  const userId = req.userId;
  try {
    const userObjectId = userId ? new mongoose.Types.ObjectId(userId) : undefined;
    const deletedContent = await ContentModel.findOneAndDelete({
      _id: contentId,
      userId: userObjectId ?? userId,
    });
    if (!deletedContent) { res.status(404).json({ message: "Content not found or unauthorized" }); return; }
    res.json({ message: "content deleted" });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({ message: "internal server error" });
  }
});

// Share brain
app.post("/api/v1/brain/share", userMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const { share } = req.body;
  if (share) {
    const existingLink = await LinkModel.findOne({ userId: req.userId });
  if (existingLink) { res.json({ hash: existingLink.hash }); return; }

    const hash = random(10);
  await LinkModel.create({ userId: req.userId, hash });
  res.json({ hash });
  return;
  } else {
  await LinkModel.deleteOne({ userId: req.userId });
  res.json({ message: "Removed link" });
  return;
  }
});

// Get shared brain
app.get("/api/v1/brain/:shareLink", async (req: Request, res: Response): Promise<void> => {
  const hash = req.params.shareLink;
  const link = await LinkModel.findOne({ hash });
  if (!link) { res.status(404).json({ message: "sorry incorrect input" }); return; }

  const content = await ContentModel.find({ userId: link.userId });
  const user = await UserModel.findOne({ _id: link.userId });

  res.json({
    username: user?.username,
    content
  });
});

// ------------------ Start Server ------------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
