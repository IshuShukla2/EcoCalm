import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  initialUser,
  initialAdmin,
  initialPlant,
  initialQuests,
  initialStories,
  initialPosts,
  initialMoodLogs,
  initialChatMessages,
  initialFeedbacks
} from "../data/seedData.js";
import { User, Plant, Quest, Story, Post, MoodLog, ChatMessage, Feedback } from "../models/Schemas.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storeFilePath = path.join(__dirname, "../data/persisted_store.json");

let isMongoConnected = false;

  // Admin plant
  const adminPlant = {
    ...initialPlant,
    id: "plant_admin",
    userId: "user_hemal_admin",
    name: "Overseer Bonsai",
    variety: "Zen Bonsai Ficus",
    plantType: "ficus",
    tagline: "Guardian of mindful sanctuaries",
    stage: 4,
    stageTitle: "Blooming Sanctuary Canopy",
    hydration: 90,
    potStyle: "celadon_green",
    flowerType: "star_jasmine",
    companion: "dragonfly",
    companionName: "Emerald Dragonfly",
    hasSelectedSeed: true
  };

  const mayaPlant = {
    ...initialPlant,
    id: "plant_maya",
    userId: "user_maya",
    hasSelectedSeed: true
  };

  const defaultState = {
    users: [{ ...initialUser }, { ...initialAdmin }],
  plants: [mayaPlant, adminPlant],
    quests: initialQuests.map((q) => ({ ...q })),
    stories: initialStories.map((s) => ({ ...s })),
    posts: initialPosts.map((p) => ({ ...p, comments: [...p.comments] })),
    moodLogs: initialMoodLogs.map((m) => ({ ...m })),
    chatMessages: initialChatMessages.map((c) => ({ ...c })),
    feedbacks: initialFeedbacks.map((f) => ({ ...f }))
  };

  const loadPersistedStore = () => {
    try {
      if (fs.existsSync(storeFilePath)) {
        const data = fs.readFileSync(storeFilePath, "utf8");
        const parsed = JSON.parse(data);
        if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.plants)) {
          return {
            ...defaultState,
            ...parsed
          };
        }
      }
    } catch (err) {
      console.warn("Could not read persisted store, initializing defaults:", err.message);
    }
    return defaultState;
  };

  // In-memory fallback repository
  export const inMemoryDB = loadPersistedStore();

  export const saveStoreToDisk = () => {
    try {
      fs.writeFileSync(storeFilePath, JSON.stringify(inMemoryDB, null, 2), "utf8");
    } catch (err) {
      console.warn("Failed to persist store to disk:", err.message);
    }
  };

  export const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecocalm";
    try {
      console.log(`🌿 Connecting to MongoDB at ${mongoURI}...`);
      await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000
      });
      isMongoConnected = true;
      console.log("✨ MongoDB connected successfully!");
      await seedMongoIfEmpty();
    } catch (err) {
      isMongoConnected = false;
      console.warn(
        `⚠️  MongoDB connection skipped (${err.message}). Using high-performance reactive in-memory store for instant zero-dependency execution.`
      );
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
        await Plant.create(mayaPlant);
        await Plant.create(adminPlant);
        await Quest.insertMany(initialQuests);
        await Story.insertMany(initialStories);
        await Post.insertMany(initialPosts);
        await MoodLog.insertMany(initialMoodLogs);
        await ChatMessage.insertMany(initialChatMessages);
        await Feedback.insertMany(initialFeedbacks);
        console.log("✅ Seed data inserted successfully!");
      } else {
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
