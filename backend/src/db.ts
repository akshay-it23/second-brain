import mongoose, { model, Schema } from "mongoose";

// Export a function to connect to MongoDB so the server only starts after DB is ready.
function getMongoUri(): string {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is required");
  }
  return mongoUri;
}

// Retry configuration
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Sleep utility for retry delays
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function connectToDatabase(): Promise<void> {
  const mongoUri = getMongoUri();
  console.log("Using MongoDB URI:", mongoUri.startsWith("mongodb+srv") ? "<atlas_uri>" : mongoUri);

  let lastError: any;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🔄 MongoDB connection attempt ${attempt}/${MAX_RETRIES}...`);

      // Mongoose 7.x connection options
      await mongoose.connect(mongoUri, {
        // Connection pool settings
        minPoolSize: 5,
        maxPoolSize: 10,

        // Timeout settings
        serverSelectionTimeoutMS: 10000, // 10 seconds to select a server
        socketTimeoutMS: 45000, // 45 seconds socket timeout
        connectTimeoutMS: 30000, // 30 seconds connection timeout

        // Retry settings
        retryWrites: true,
        retryReads: true,
      });

      console.log("✅ MongoDB connected successfully");

      // Set up connection event listeners
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });

      return; // Success, exit function

    } catch (err: any) {
      lastError = err;
      console.error(`❌ MongoDB connection attempt ${attempt} failed:`, err.message);

      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`⏳ Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  // All retries failed
  console.error("❌ Failed to connect to MongoDB after", MAX_RETRIES, "attempts");
  console.error("Last error:", lastError);
  throw lastError;
}

// User schema
const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

// User model
export const UserModel = model("User", UserSchema);

// Content schema
const ContentSchema = new Schema({
  title: String,
  link: String,
  type: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
});

// Link schema
const LinkSchema = new Schema({
  hash: String,
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
});

export const LinkModel = model("Link", LinkSchema);
export const ContentModel = model("Content", ContentSchema);
