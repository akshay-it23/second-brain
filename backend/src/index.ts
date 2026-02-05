import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import { ContentModel, UserModel, LinkModel, /* connectToDatabase will be imported below */ } from "./db"; // your mongoose models
import { AuthRequest, userMiddleware } from "./middleware";
import { random } from "./utils";
import { JWT_PASSWORD } from "./config";

const app = express();

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

// Database connection check middleware (only for routes that need DB)
const dbCheckMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const readyState = mongoose.connection.readyState;
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
app.get("/api/v1/health", (req: Request, res: Response): void => {
  const dbState = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: dbState === 1 ? 'healthy' : 'unhealthy',
    database: states[dbState] || 'unknown',
    readyState: dbState,
    timestamp: new Date().toISOString()
  });
});

// Signup
app.post("/api/v1/signup", dbCheckMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) { res.status(400).json({ message: "username and password are required" }); return; }

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
    const hashed = await bcrypt.hash(password, saltRounds);

    // Check if UserModel is properly initialized
    if (!UserModel) {
      console.error("UserModel is not defined!");
      res.status(500).json({ message: "Database model not initialized" });
      return;
    }

    const newUser = await UserModel.create({ username: username.trim(), password: hashed });
    console.log("User created successfully:", newUser.username);
    res.status(201).json({ message: "user signed up" });
  } catch (error: any) {
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
      const messages = Object.values(error.errors || {}).map((e: any) => e.message);
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
app.post("/api/v1/signin", dbCheckMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  if (!username || !password) { res.status(400).json({ message: "username and password are required" }); return; }

  try {
    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) { res.status(403).json({ message: "incorrect credential" }); return; }

    let match = false;
    try {
      match = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
      console.error("Error comparing password for user:", username, err);
      // Treat as password mismatch
      res.status(403).json({ message: "incorrect credential (error)" });
      return;
    }

    if (!match) { res.status(403).json({ message: "incorrect credential" }); return; }

    const token = jwt.sign({ id: existingUser.id }, JWT_PASSWORD);
    res.json({ token });
  } catch (error: any) {
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
  try {
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
  } catch (error) {
    console.error("Error in share brain:", error);
    res.status(500).json({ message: "internal server error" });
  }
});

// Get shared brain
app.get("/api/v1/brain/:shareLink", dbCheckMiddleware, async (req: Request, res: Response): Promise<void> => {
  const hash = req.params.shareLink;
  try {
    const link = await LinkModel.findOne({ hash });
    if (!link) { res.status(404).json({ message: "sorry incorrect input" }); return; }

    const content = await ContentModel.find({ userId: link.userId });
    const user = await UserModel.findOne({ _id: link.userId });

    res.json({
      username: user?.username,
      content
    });
  } catch (error) {
    console.error("Error fetching shared brain:", error);
    res.status(500).json({ message: "internal server error" });
  }
});

// ------------------ Start Server ------------------
// Start server only after DB is connected
import { connectToDatabase } from "./db";

async function start() {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error("Failed to connect to DB, exiting.");
    process.exit(1);
  }

  const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} in use, retrying in 1s...`);
      setTimeout(() => {
        server.close();
        start();
      }, 1000);
    } else {
      console.error("Server error:", err);
    }
  });

  // Graceful shutdown handling
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);

    server.close(async () => {
      console.log("HTTP server closed.");

      try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
        process.exit(0);
      } catch (err) {
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
