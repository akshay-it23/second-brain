import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel } from "./db.js"; // will connect automatically
const JWT_PASSWORD="!123123";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/api/v1/signup", async (req, res) => { 
  const username = req.body?.username;
  const password = req.body?.password;
  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required" });
  }
  try {
    await UserModel.create({ username, password }); 
    return res.status(201).json({ message: "user signed up" });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "username already exists" });
    }
    return res.status(500).json({ message: "internal server error" });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body?.username;
  const password = req.body?.password;

  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required" });
  }

  try {
    const existingUser = await UserModel.findOne({ username, password });
    if (!existingUser) {
      return res.status(403).json({ message: "incorrect credential" });
    }

    const token = jwt.sign({ id: existingUser.id }, JWT_PASSWORD);
    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
});



app.post("/api/v1/content", userMiddleware,(req, res) => {
  
const link=req.body.link;
const type=req.body.link;





});
app.post("/api/v1/content", userMiddleware,(req, res) => {
  
const link=req.body.link;
const type=req.body.link;





});

app.delete("/api/v1/share", (req, res) => {
 
});

app.post("/api/v1/aisgnup", (req, res) => {
  
});

app.get("/api/v1/:shareLink", (req, res) => {
 
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
