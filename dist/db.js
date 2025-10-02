import mongoose, { model, Schema } from "mongoose";
// Connect to MongoDB
mongoose.connect("mongodb+srv://sainiakshay2020_db_user:JLE0NfIpIdR4vZhY@brain.iqpn8s7.mongodb.net/brainApp", {
    // optional settings
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));
// User schema
const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
// User model
export const UserModel = model("User", UserSchema);
const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
});
export const ContentModel = model("Content", ContentSchema);
//# sourceMappingURL=db.js.map