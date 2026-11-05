import mongoose from "mongoose";
import { initialUser, initialAdmin, initialPlant, initialQuests, initialStories, initialPosts, initialMoodLogs, initialChatMessages, initialFeedbacks } from "../data/seedData.js";
import { User, Plant, Quest, Story, Post, MoodLog, ChatMessage, Feedback } from "../models/Schemas.js";

let isMongoConnected = false;

// In-memory fallback repository
export const inMemoryDB = {
  users: [{ ...initialUser }, { ...initialAdmin }],
  user: { ...initialUser },
  admin: { ...initialAdmin },
  plant: { ...initialPlant },
  quests: initialQuests.map(q => ({ ...q })),
  stories: initialStories.map(s => ({ ...s })),
  posts: initialPosts.map(p => ({ ...p, comments: [...p.comments] })),
  moodLogs: initialMoodLogs.map(m => ({ ...m })),
  chatMessages: initialChatMessages.map(c => ({ ...c })),
  feedbacks: initialFeedbacks.map(f => ({ ...f }))
};

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecocalm";
  try {
    console.log(`🌿 Connecting to MongoDB at ${mongoURI}...`);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log("✨ MongoDB connected successfully!");
    await seedMongoIfEmpty();
  } catch (err) {
    isMongoConnected = false;
    console.warn(`⚠️  MongoDB connection skipped (${err.message}). Using high-performance reactive in-memory store for instant zero-dependency execution.`);
  }
};

export const isUsingMongo = () => isMongoConnected;

const seedMongoIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("🌱 Seeding initial EcoCalm data into MongoDB...");
      await User.create(initialUser);
      await User.create(initialAdmin);
      await Plant.create(initialPlant);
      await Quest.insertMany(initialQuests);
      await Story.insertMany(initialStories);
      await Post.insertMany(initialPosts);
      await MoodLog.insertMany(initialMoodLogs);
      await ChatMessage.insertMany(initialChatMessages);
      await Feedback.insertMany(initialFeedbacks);
      console.log("✅ Seed data inserted successfully!");
    } else {
      // Ensure Hemal admin exists
      const hemalAdmin = await User.findOne({ email: "hemal.au123@gmail.com" });
      if (!hemalAdmin) {
        await User.create(initialAdmin);
      } else {
        await User.updateOne({ email: "hemal.au123@gmail.com" }, { role: "admin", password: "hemal@admin" });
      }
      const feedbackCount = await Feedback.countDocuments();
      if (feedbackCount === 0) {
        await Feedback.insertMany(initialFeedbacks);
      }
    }
  } catch (seedErr) {
    console.error("Error during seeding:", seedErr.message);
  }
};
