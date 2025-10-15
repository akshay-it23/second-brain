import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, UserModel } from "./db"; // will connect automatically
import { JWT_PASSWORD } from "./config";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import cors from "cors"
import { AuthRequest, userMiddleware } from "./middleware";
import { random } from "./utils";

import {LinkModel} from "./db";
import  { Request, Response } from "express";
app.use(cors({
  origin: "http://localhost:5173", // allow frontend
  credentials: true,               // allow cookies/auth headers if used
}));
app.post("/api/v1/signup", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "username and password are required" });
    return;
  }

  try {
    await UserModel.create({ username, password });
    res.status(201).json({ message: "user signed up" });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ message: "username already exists" });
      return;
    }
    res.status(500).json({ message: "internal server error" });
  }
})

app.post("/api/v1/signin", async (req: Request, res: Response): Promise<void> => {
  const username = req.body?.username;
  const password = req.body?.password;

  if (!username || !password) {
    res.status(400).json({ message: "username and password are required" });
    return;
  }

  try {
    const existingUser = await UserModel.findOne({ username, password });
    if (!existingUser) {
      res.status(403).json({ message: "incorrect credential" });
      return;
    }

    const token = jwt.sign({ id: existingUser.id }, JWT_PASSWORD);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
});


app.post("/api/v1/content", userMiddleware,async(req: AuthRequest,res: Response) => {
  
const link=req.body.link;
const type=req.body.link;
const userId = new mongoose.Types.ObjectId(req.userId);


console.log("before saving ,userId:",typeof userId,userId);

  await ContentModel.create({
   link,
   type,

  title:req.body.title,

  userId:req.userId,

  tags:[]
})



    res.json({
        message:"content added"
    })


});
app.get("/api/v1/content", userMiddleware,async(req, res) => {
      //@ts-ignore
    const userId=req.userId
 const content=await ContentModel.find({
        userId:userId

    }).populate("userId","username")
    res.json({
        content
    })


});

app.delete("/api/v1/content/:id",userMiddleware,async(req: AuthRequest,res: Response)=>{
    const contentId = req.params.id;
    const userId = req.userId;

    try {
      // Cast userId to ObjectId to avoid type mismatches (middleware usually sets string id)
      const userObjectId = userId ? new mongoose.Types.ObjectId(userId) : undefined;

      const deletedContent = await ContentModel.findOneAndDelete({
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
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ message: "internal server error" });
      return;
    }

});



app.post("/api/v1/brain/share", userMiddleware, async (req: AuthRequest, res: Response) => {
  const share = req.body.share;

  if (share) {
    const existingLink = await LinkModel.findOne({
      userId: req.userId,
    });

    if (existingLink) {
      res.json({
        hash: existingLink.hash,
      });
      return;
    }

    const hash = random(10);
    await LinkModel.create({
      userId: req.userId,
      hash: hash,
    });

     res.json({
      message: "/share/" + hash,
    });
  } else {
    await LinkModel.deleteOne({
      userId: req.userId,
    });

    res.json({
      message: "Removed link",
    });
  }
});

export default app;


app.get("/api/v1/brain/:shareLink", async(req, res) => {
      const hash=req.params.shareLink;
    const link=await LinkModel.findOne({
        hash
    })

    if(!link){
        res.status(411).json({
            message:"sorry incorrect input"
        })
        return;
    }
    //userid
    const content=await ContentModel.find({
        userId:link.userId
    })
    console.log(link);
    const user=await UserModel.findOne({
        _id:link.userId
    })
    res.json({
      //?optional username can be null

        username:user?.username,
        content:content
    })

});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
