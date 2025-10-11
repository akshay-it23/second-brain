import express from "express";
import jwt from "jsonwebtoken";
import { ContentModel, UserModel } from "./db.js"; // will connect automatically
import { JWT_PASSWORD } from "./config.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const userMiddleware = require('../middleware/userMiddleware');
import { LinkModel } from "./db.js";
app.post("/api/v1/signup", async (req, res) => {
    const username = req.body?.username;
    const password = req.body?.password;
    if (!username || !password) {
        return res.status(400).json({ message: "username and password are required" });
    }
    try {
        await UserModel.create({ username, password });
        return res.status(201).json({ message: "user signed up" });
    }
    catch (error) {
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "internal server error" });
    }
});
// app.post("/api/v1/content", userMiddleware,async(req, res) => {
// const link=req.body.link;
// const type=req.body.link;
// const userId = new mongoose.Types.ObjectId(req.userId);
// console.log("before saving ,userId:",typeof userId,userId);
//   await ContentModel.create({
//    link,
//    type,
//   title:req.body.title,
//   userId,
//   tags:[]
// })
//     res.json({
//         message:"content added"
//     })
// });
// app.post("/api/v1/content", userMiddleware,(req, res) => {
// const link=req.body.link;
// const type=req.body.link;
// });
// app.post("/api/v1/brain/share", userMiddleware, async (req: AuthRequest, res: Response) => {
//   const share = req.body.share;
//   if (share) {
//     const existingLink = await LinkModel.findOne({
//       userId: req.userId,
//     });
//     if (existingLink) {
//       res.json({
//         hash: existingLink.hash,
//       });
//       return;
//     }
//     const hash = random(10);
//     await LinkModel.create({
//       userId: req.userId,
//       hash: hash,
//     });
//      res.json({
//       message: "/share/" + hash,
//     });
//   } else {
//     await LinkModel.deleteOne({
//       userId: req.userId,
//     });
//     res.json({
//       message: "Removed link",
//     });
//   }
// });
export default app;
app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "sorry incorrect input"
        });
        return;
    }
    //userid
    const content = await ContentModel.find({
        userId: link.userId
    });
    console.log(link);
    const user = await UserModel.findOne({
        _id: link.userId
    });
    res.json({
        username: user?.username,
        content: content
    });
});
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
//# sourceMappingURL=index.js.map