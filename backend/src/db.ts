import mongoose, { model, Schema } from "mongoose";

// Connect to MongoDB
const fallbackUri = "mongodb+srv://sainiakshay2020_db_user:JLE0NfIpIdR4vZhY@brain.iqpn8s7.mongodb.net/brainApp";
const mongoUri = process.env.MONGODB_URI || fallbackUri;

console.log("Using MongoDB URI:", mongoUri.startsWith("mongodb+srv") ? "<atlas_uri>" : mongoUri);

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// User schema
const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

// User model

export const UserModel = model("User", UserSchema);



const ContentSchema= new Schema({
    title:String,
    link:String,
    tags:[{type:mongoose.Types.ObjectId,ref:'Tag'}],
    userId:{type:mongoose.Types.ObjectId,ref:'User',required:true}
})
const LinkSchema=new Schema({
    hash:String,
    userId:{type:mongoose.Types.ObjectId,ref:'User',required:true,unique:true},
})
export const LinkModel=model("Link",LinkSchema)
export const ContentModel=model("Content",ContentSchema);
