import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import https from "https";
import { connectDB, inMemoryDB, isUsingMongo, saveStoreToDisk } from "./config/db.js";
import { User, Plant, Quest, Story, Post, MoodLog, ChatMessage, Feedback } from "./models/Schemas.js";
import { dailyNatureFacts, initialPlant, initialAdmin, initialUser } from "./data/seedData.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "ecocalm_super_mindful_jwt_secret_2026";

// ------------------- JWT HELPERS -------------------
export const generateToken = (userData) => {
  return jwt.sign(
    {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role || "user"
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// Helper to authenticate user from token or custom user-id header
export const getAuthUser = async (req) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const customUserId = req.headers["x-user-id"];

  let userId = null;
  let userEmail = null;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      userId = decoded.id;
      userEmail = decoded.email;
    }
  }

  if (!userId && customUserId) {
    userId = customUserId;
  }

  if (!userId && !userEmail) {
    return null;
  }

  if (isUsingMongo()) {
    let user = null;
    if (userId) user = await User.findOne({ id: userId });
    if (!user && userEmail) user = await User.findOne({ email: userEmail });
    return user;
  }

  let found = null;
  if (userId) {
    found = inMemoryDB.users.find((u) => u.id === userId);
  }
  if (!found && userEmail) {
    found = inMemoryDB.users.find((u) => u.email?.toLowerCase() === userEmail.toLowerCase());
  }
  return found;
};

// Plant creator / getter helper per user
export const createDefaultPlantForUser = (userId, customParams = {}) => ({
  id: `plant_${userId}`,
  userId: userId,
  name: customParams.name || "My Mindful Companion",
  plantType: customParams.plantType || "monstera",
  variety: customParams.variety || "Monstera Deliciosa",
  tagline: customParams.tagline || customParams.intention || "Growing gently without pressure",
  stage: customParams.stage || 1,
  stageTitle: customParams.stageTitle || "Tender Seedling",
  maxStage: 5,
  hydration: customParams.hydration || 45,
  dropsNeededForNextBloom: 30,
  totalDropsPoured: 20,
  targetDropsNextStage: 50,
  potStyle: customParams.potStyle || "ceramic_ribbed",
  flowerType: customParams.flowerType || "rose_bud",
  companion: customParams.companion || "butterfly",
  companionName: customParams.companionName || "Blue Morpho",
  lastWatered: "Just planted",
  hasSelectedSeed: customParams.hasSelectedSeed !== undefined ? customParams.hasSelectedSeed : false,
  milestones: [
    { stage: 1, title: "Seed of Intention", desc: "Planted today with mindful presence", completed: true, isCurrent: true },
    { stage: 2, title: "Root System Grounding", desc: "Strong stems & steady leaves", completed: false },
    { stage: 3, title: "Flourishing Foliage", desc: "Lush green leaves unfurling", completed: false },
    { stage: 4, title: "Blooming Canopy", desc: "Vibrant floral blossoms", completed: false },
    { stage: 5, title: "Ancient Botanical Haven", desc: "Mastery sanctuary tree", completed: false }
  ]
});

export const getUserPlant = async (userId) => {
  if (isUsingMongo()) {
    let plant = await Plant.findOne({ userId });
    if (!plant) {
      plant = await Plant.create(createDefaultPlantForUser(userId));
    }
    return plant;
  }

  let plant = inMemoryDB.plants.find((p) => p.userId === userId);
  if (!plant) {
    plant = createDefaultPlantForUser(userId);
    inMemoryDB.plants.push(plant);
    saveStoreToDisk();
  }
  return plant;
};

// CORS and middleware
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Connect DB
connectDB();

// ------------------- API ROUTES -------------------

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "EcoCalm Backend is running",
    database: isUsingMongo() ? "MongoDB Atlas (Active)" : "In-Memory Store (Active)",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    database: isUsingMongo() ? "MongoDB (Active)" : "In-Memory Store (Active)",
    timestamp: new Date().toISOString()
  });
});

// ------------------- AUTHENTICATION ROUTES -------------------

// 1. Register User
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cleanEmail = (email || `user${Date.now()}@ecocalm.app`).trim().toLowerCase();
    const isAdmin = cleanEmail === "hemal.au123@gmail.com";
    const userRole = isAdmin ? "admin" : "user";
    const userId = isAdmin ? "user_hemal_admin" : `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Check if user already exists
    let existingUser = null;
    if (isUsingMongo()) {
      existingUser = await User.findOne({ email: cleanEmail });
    } else {
      existingUser = inMemoryDB.users.find((u) => u.email?.toLowerCase() === cleanEmail);
    }

    if (existingUser) {
      const token = generateToken(existingUser);
      return res.status(200).json({ success: true, user: existingUser, token });
    }

    const newUser = {
      id: userId,
      name: name?.trim() || (isAdmin ? "Hemal (Admin)" : "Mindful Soul"),
      email: cleanEmail,
      password: password || (isAdmin ? "hemal@admin" : "peaceful123"),
      role: userRole,
      tagline: isAdmin ? "Sanctuary Overseer" : "Mindful Gardener",
      avatar: isAdmin
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      waterDrops: isAdmin ? 999 : 50,
      offlineMinutesToday: isAdmin ? 120 : 0,
      questsCompletedToday: 0,
      mindfulnessSessionsCompleted: 0,
      calmStreakDays: 1,
      dailyAffirmation: isAdmin
        ? "Nurturing safe digital spaces for everyone."
        : "Your soft life starts here."
    };

    if (isUsingMongo()) {
      await User.create(newUser);
      await Plant.create(createDefaultPlantForUser(userId, { hasSelectedSeed: false }));
    } else {
      inMemoryDB.users.push(newUser);
      inMemoryDB.plants.push(createDefaultPlantForUser(userId, { hasSelectedSeed: false }));
      saveStoreToDisk();
    }

    const token = generateToken(newUser);
    res.status(201).json({ success: true, user: newUser, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Login User
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email ? email.trim().toLowerCase() : "";

    // A. Check Admin Login
    if (cleanEmail === "hemal.au123@gmail.com") {
      if (password && password !== "hemal@admin") {
        return res.status(401).json({ error: "Invalid password for Hemal Admin account." });
      }

      let adminUser = null;
      if (isUsingMongo()) {
        adminUser = await User.findOne({ email: "hemal.au123@gmail.com" });
      }
      if (!adminUser) {
        adminUser = inMemoryDB.users.find((u) => u.email === "hemal.au123@gmail.com") || initialAdmin;
      }

      adminUser = {
        ...adminUser,
        role: "admin",
        email: "hemal.au123@gmail.com",
        name: adminUser.name || "Hemal (Admin)"
      };

      // Ensure Admin's plant exists
      await getUserPlant("user_hemal_admin");

      const token = generateToken(adminUser);
      return res.json({ success: true, user: adminUser, token });
    }

    // B. Normal Login
    let foundUser = null;
    if (isUsingMongo()) {
      foundUser = await User.findOne({ email: cleanEmail });
    } else {
      foundUser = inMemoryDB.users.find((u) => u.email?.toLowerCase() === cleanEmail);
    }

    // If user does not exist yet (convenient for test accounts A & B), register them on the fly!
    if (!foundUser && cleanEmail) {
      const derivedName = cleanEmail.split("@")[0].replace(/[._]/g, " ");
      const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      foundUser = {
        id: newUserId,
        email: cleanEmail,
        password: password || "peaceful123",
        role: "user",
        name: formattedName || "Mindful Soul",
        tagline: "Exploring Sanctuary",
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
        waterDrops: 50,
        offlineMinutesToday: 0,
        questsCompletedToday: 0,
        mindfulnessSessionsCompleted: 0,
        calmStreakDays: 1,
        dailyAffirmation: "Your soft life starts here."
      };

      if (isUsingMongo()) {
        await User.create(foundUser);
        await Plant.create(createDefaultPlantForUser(newUserId, { hasSelectedSeed: false }));
      } else {
        inMemoryDB.users.push(foundUser);
        inMemoryDB.plants.push(createDefaultPlantForUser(newUserId, { hasSelectedSeed: false }));
        saveStoreToDisk();
      }
    } else if (!foundUser) {
      // Maya demo fallback if no email specified
      foundUser = inMemoryDB.users.find((u) => u.id === "user_maya") || initialUser;
    }

    // Password verification
    if (password && foundUser.password && password !== foundUser.password && password !== "peaceful123") {
      return res.status(401).json({ error: "Invalid password. Use 'peaceful123' for test access." });
    }

    // Ensure plant exists for this user
    await getUserPlant(foundUser.id);

    const token = generateToken(foundUser);
    res.json({ success: true, user: foundUser, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Current User ("Me")
app.get("/api/auth/me", async (req, res) => {
  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json(user);
});

// ------------------- USER PROFILE ROUTES -------------------

app.get("/api/user", async (req, res) => {
  try {
    const authUser = await getAuthUser(req);
    if (authUser) {
      return res.json(authUser);
    }
    res.status(401).json({ error: "Authentication required" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/user", async (req, res) => {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const updates = req.body;
    delete updates.id;
    delete updates.email;
    delete updates.role; // Protected fields

    if (isUsingMongo()) {
      const updated = await User.findOneAndUpdate({ id: authUser.id }, updates, { new: true });
      return res.json(updated);
    }

    const idx = inMemoryDB.users.findIndex((u) => u.id === authUser.id);
    if (idx !== -1) {
      inMemoryDB.users[idx] = { ...inMemoryDB.users[idx], ...updates };
      saveStoreToDisk();
      return res.json(inMemoryDB.users[idx]);
    }
    res.json(authUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- PLANT ROUTES (USER SPECIFIC) -------------------

// Get current user's plant
app.get("/api/plant", async (req, res) => {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const plant = await getUserPlant(authUser.id);
    res.json(plant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Water current user's plant
app.post("/api/plant/water", async (req, res) => {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const dropsToUse = Number(req.body.drops) || 10;
    const plantData = await getUserPlant(authUser.id);

    const currentUserDrops = authUser.waterDrops || 0;
    const userDropsRemaining = Math.max(0, currentUserDrops - dropsToUse);
    const newTotalDrops = (plantData.totalDropsPoured || 0) + dropsToUse;
    let newHydration = Math.min(100, (plantData.hydration || 0) + Math.round(dropsToUse * 1.5));
    let stage = plantData.stage || 1;
    let stageTitle = plantData.stageTitle || "Tender Seedling";

    if (newHydration >= 100 && stage < 5) {
      stage += 1;
      newHydration = 25;
      if (stage === 2) stageTitle = "Root System Grounding";
      if (stage === 3) stageTitle = "Flourishing Foliage";
      if (stage === 4) stageTitle = "Blooming Sanctuary Canopy";
      if (stage === 5) stageTitle = "Ancient Botanical Haven";
    }

    const updatedPlantFields = {
      totalDropsPoured: newTotalDrops,
      hydration: newHydration,
      dropsNeededForNextBloom: Math.max(0, 100 - newHydration),
      stage,
      stageTitle,
      lastWatered: "Just now"
    };

    if (isUsingMongo()) {
      const updatedPlant = await Plant.findOneAndUpdate({ userId: authUser.id }, updatedPlantFields, { new: true });
      const updatedUser = await User.findOneAndUpdate({ id: authUser.id }, { waterDrops: userDropsRemaining }, { new: true });
      return res.json({ plant: updatedPlant, user: updatedUser, dropsUsed: dropsToUse });
    }

    // In-memory update
    const plantIdx = inMemoryDB.plants.findIndex((p) => p.userId === authUser.id);
    if (plantIdx !== -1) {
      inMemoryDB.plants[plantIdx] = { ...inMemoryDB.plants[plantIdx], ...updatedPlantFields };
    }
    const userIdx = inMemoryDB.users.findIndex((u) => u.id === authUser.id);
    if (userIdx !== -1) {
      inMemoryDB.users[userIdx].waterDrops = userDropsRemaining;
    }
    saveStoreToDisk();

    res.json({
      plant: inMemoryDB.plants[plantIdx] || updatedPlantFields,
      user: inMemoryDB.users[userIdx] || authUser,
      dropsUsed: dropsToUse
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Customize current user's plant (pot, flower, companion, name)
app.put("/api/plant/customize", async (req, res) => {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { name, potStyle, flowerType, companion, companionName, variety, plantType } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (potStyle) updates.potStyle = potStyle;
    if (flowerType) updates.flowerType = flowerType;
    if (companion) updates.companion = companion;
    if (companionName) updates.companionName = companionName;
    if (variety) updates.variety = variety;
    if (plantType) updates.plantType = plantType;

    if (isUsingMongo()) {
      const updated = await Plant.findOneAndUpdate({ userId: authUser.id }, updates, { new: true, upsert: true });
      return res.json(updated);
    }

    const plantIdx = inMemoryDB.plants.findIndex((p) => p.userId === authUser.id);
    if (plantIdx !== -1) {
      inMemoryDB.plants[plantIdx] = { ...inMemoryDB.plants[plantIdx], ...updates };
      saveStoreToDisk();
      return res.json(inMemoryDB.plants[plantIdx]);
    } else {
      const newPlant = createDefaultPlantForUser(authUser.id, updates);
      inMemoryDB.plants.push(newPlant);
      saveStoreToDisk();
      return res.json(newPlant);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adopt Seedling / Plant Selection (Section 2)
app.post("/api/plant/adopt", async (req, res) => {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { plantType, name, variety, intention, flowerType, potStyle, companion, companionName } = req.body;

    const newPlantData = {
      userId: authUser.id,
      name: name?.trim() || "My Gentle Companion",
      plantType: plantType || "monstera",
      variety: variety || "Monstera Deliciosa",
      tagline: intention || "Growing gently without pressure",
      flowerType: flowerType || "rose_bud",
      potStyle: potStyle || "ceramic_ribbed",
      companion: companion || "butterfly",
      companionName: companionName || "Blue Morpho",
      stage: 1,
      stageTitle: "Tender Seedling",
      hydration: 60,
      totalDropsPoured: 25,
      dropsNeededForNextBloom: 40,
      hasSelectedSeed: true,
      lastWatered: "Just planted"
    };

    const newDrops = (authUser.waterDrops || 0) + 25; // Bonus welcome drops

    if (isUsingMongo()) {
      const updatedPlant = await Plant.findOneAndUpdate({ userId: authUser.id }, newPlantData, {
        upsert: true,
        new: true
      });
      const updatedUser = await User.findOneAndUpdate({ id: authUser.id }, { waterDrops: newDrops }, { new: true });
      return res.json({ plant: updatedPlant, user: updatedUser, welcomeBonus: 25 });
    }

    const plantIdx = inMemoryDB.plants.findIndex((p) => p.userId === authUser.id);
    if (plantIdx !== -1) {
      inMemoryDB.plants[plantIdx] = { ...inMemoryDB.plants[plantIdx], ...newPlantData };
    } else {
      inMemoryDB.plants.push({ id: `plant_${authUser.id}`, ...newPlantData });
    }

    const userIdx = inMemoryDB.users.findIndex((u) => u.id === authUser.id);
    if (userIdx !== -1) {
      inMemoryDB.users[userIdx].waterDrops = newDrops;
    }
    saveStoreToDisk();

    res.json({
      plant: inMemoryDB.plants.find((p) => p.userId === authUser.id),
      user: inMemoryDB.users.find((u) => u.id === authUser.id),
      welcomeBonus: 25
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- VIBE CHECK ROUTES (BEFORE & AFTER) -------------------

// Get current user's mood logs
app.get("/api/mood", async (req, res) => {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (isUsingMongo()) {
      const logs = await MoodLog.find({ userId: authUser.id }).sort({ timestamp: -1 });
      return res.json(logs);
    }

    const userLogs = inMemoryDB.moodLogs
      .filter((m) => m.userId === authUser.id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(userLogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Log mood (Supports checkinType: "before", "after", "general")
app.post("/api/mood", async (req, res) => {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { score, emotion, emotionsList, intensity, note, checkinType, emotionEmoji, linkedActivity } = req.body;

    const moodMap = {
      0: "0 / 10 • Completely Calm",
      1: "1 / 10 • Deep Serenity",
      2: "2 / 10 • Relaxed Floating",
      3: "3 / 10 • Gentle Ease",
      4: "4 / 10 • Focused Flow",
      5: "5 / 10 • Mild Tension",
      6: "6 / 10 • Restless Energy",
      7: "7 / 10 • Overstimulated",
      8: "8 / 10 • High Tension",
      9: "9 / 10 • Sensory Clutter",
      10: "10 / 10 • Extremely Overwhelmed"
    };

    const newLog = {
      id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: authUser.id,
      score: Number(score) !== undefined ? Number(score) : 3,
      emotion: emotion || "Calm",
      emotionsList: emotionsList && emotionsList.length ? emotionsList : [emotion || "Calm"],
      intensity: Number(intensity) || 5,
      emotionEmoji: emotionEmoji || "😌",
      label: moodMap[score] || `${score} / 10`,
      note: note || "Mindful check-in completed.",
      checkinType: checkinType || "general",
      linkedActivity: linkedActivity || null,
      timestamp: new Date().toISOString()
    };

    const newWaterDrops = (authUser.waterDrops || 0) + 10;

    if (isUsingMongo()) {
      await MoodLog.create(newLog);
      const updatedUser = await User.findOneAndUpdate(
        { id: authUser.id },
        { waterDrops: newWaterDrops },
        { new: true }
      );
      return res.status(201).json({ success: true, mood: newLog, user: updatedUser });
    }

    inMemoryDB.moodLogs.unshift(newLog);
    const userIdx = inMemoryDB.users.findIndex((u) => u.id === authUser.id);
    if (userIdx !== -1) {
      inMemoryDB.users[userIdx].waterDrops = newWaterDrops;
    }
    saveStoreToDisk();

    res.status(201).json({
      success: true,
      mood: newLog,
      user: inMemoryDB.users[userIdx] || authUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user's mood history privately
app.delete("/api/mood", async (req, res) => {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (isUsingMongo()) {
      await MoodLog.deleteMany({ userId: authUser.id });
    } else {
      inMemoryDB.moodLogs = inMemoryDB.moodLogs.filter((m) => m.userId !== authUser.id);
      saveStoreToDisk();
    }
    res.json({ success: true, message: "Your emotional check-in history was cleared privately." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- BREATHE COMPLETION -------------------

app.post("/api/breathe/complete", async (req, res) => {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { minutes } = req.body;
    const sessionMinutes = Number(minutes) || 3;
    const dropsEarned = 20;
    const newDrops = (authUser.waterDrops || 0) + dropsEarned;
    const newOffline = (authUser.offlineMinutesToday || 0) + sessionMinutes;
    const newSessions = (authUser.mindfulnessSessionsCompleted || 0) + 1;

    if (isUsingMongo()) {
      const updatedUser = await User.findOneAndUpdate(
        { id: authUser.id },
        {
          waterDrops: newDrops,
          offlineMinutesToday: newOffline,
          mindfulnessSessionsCompleted: newSessions
        },
        { new: true }
      );
      return res.json({
        success: true,
        dropsEarned,
        message: "You showed up for yourself. That counts. 🌱",
        user: updatedUser
      });
    }

    const userIdx = inMemoryDB.users.findIndex((u) => u.id === authUser.id);
    if (userIdx !== -1) {
      inMemoryDB.users[userIdx].waterDrops = newDrops;
      inMemoryDB.users[userIdx].offlineMinutesToday = newOffline;
      inMemoryDB.users[userIdx].mindfulnessSessionsCompleted = newSessions;
    }
    saveStoreToDisk();

    res.json({
      success: true,
      dropsEarned,
      message: "You showed up for yourself. That counts. 🌱",
      user: inMemoryDB.users[userIdx] || authUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- DAILY NEWS API (SECTION 5) -------------------

let newsCache = {
  timestamp: 0,
  articles: []
};

const defaultNewsArticles = [
  {
    id: "news_1",
    headline: "Over 500 Global Coastal Ecosystems Rebound in Unprecedented Ocean Rewilding Effort",
    summary:
      "Community-driven marine preserves and seagrass restorations report record biodiversity return across four continents.",
    category: "Nature & Rewilding 🌱",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    url: "https://www.goodnewsnetwork.org/category/news/earth/",
    source: "Marine Rewilding Network",
    readTime: "3 min read",
    publishedAt: "Today"
  },
  {
    id: "news_2",
    headline: "Neuroscience Confirms: Daily 10-Minute Offline Breaks Significantly Lower Cortisol",
    summary:
      "A clinical trial demonstrates that short somatic breath pauses lower stress hormones by 34% within two weeks.",
    category: "Mental Wellness 🧠",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    url: "https://www.psychologytoday.com/us/basics/mindfulness",
    source: "Mind-Brain Institute",
    readTime: "2 min read",
    publishedAt: "Today"
  },
  {
    id: "news_3",
    headline: "Cities Worldwide Transform Abandoned Rail Corridors into Lush Urban Greenways",
    summary:
      "Inspired by restorative urban design, metropolitan areas are weaving wildflower paths and car-free sanctuaries into daily commutes.",
    category: "Positive Living 🌿",
    image:
      "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80",
    url: "https://www.positive.news/environment/",
    source: "Urban Living Review",
    readTime: "3 min read",
    publishedAt: "Yesterday"
  },
  {
    id: "news_4",
    headline: "Community Seed Banks Flourish as Millions Rediscover Tactile Balcony Gardening",
    summary:
      "Neighborhood botanical exchanges report a 200% surge in young adults adopting houseplants for stress relief.",
    category: "Lifestyle & Growth 🪴",
    image:
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=800&q=80",
    url: "https://www.goodnewsnetwork.org/lifestyle/",
    source: "Botanical Earth Society",
    readTime: "2 min read",
    publishedAt: "Yesterday"
  },
  {
    id: "news_5",
    headline: "Breakthrough Solar & Clean Water Microgrids Bring Energy to 80 Remote Himalayan Villages",
    summary:
      "Grassroots engineering alliances install passive micro-hydro and clean energy hubs, empowering local schools and health clinics.",
    category: "Hope & Innovation ☀️",
    image:
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    url: "https://www.goodnewsnetwork.org/category/news/inspiring/",
    source: "Clean Energy Alliance",
    readTime: "3 min read",
    publishedAt: "2 days ago"
  }
];

app.get("/api/news", async (req, res) => {
  try {
    const now = Date.now();
    if (newsCache.articles.length > 0 && now - newsCache.timestamp < 30 * 60 * 1000) {
      return res.json(newsCache.articles);
    }

    try {
      const feedUrl = "https://www.goodnewsnetwork.org/feed/";
      const fetchRSS = () =>
        new Promise((resolve, reject) => {
          const req = https.get(feedUrl, { timeout: 3000 }, (rssRes) => {
            let data = "";
            rssRes.on("data", (chunk) => (data += chunk));
            rssRes.on("end", () => resolve(data));
          });
          req.on("error", reject);
          req.on("timeout", () => {
            req.destroy();
            reject(new Error("Timeout"));
          });
        });

      const xml = await fetchRSS();
      const itemRegex = /<item>[\s\S]*?<\/item>/gi;
      const matches = xml.match(itemRegex);

      if (matches && matches.length > 0) {
        const parsed = matches.slice(0, 6).map((item, idx) => {
          const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/);
          const linkMatch = item.match(/<link>(.*?)<\/link>/);
          const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/);
          const imageMatch = item.match(/<media:content[^>]+url="([^">]+)"/) || item.match(/src="([^">]+)"/);

          const cleanDesc = (descMatch ? descMatch[1] : "")
            .replace(/<[^>]*>/g, "")
            .replace(/\[\.\.\.\]/g, "")
            .trim();

          const fallbackImages = [
            "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80"
          ];

          return {
            id: `live_news_${idx}`,
            headline: titleMatch ? titleMatch[1].replace(/&#8217;/g, "'").replace(/&#8220;|&#8221;/g, '"') : "Hopeful Breakthrough",
            summary: cleanDesc.length > 160 ? cleanDesc.slice(0, 160) + "..." : cleanDesc || "A positive milestone in restorative global news.",
            category: "Verified Positive News 🌱",
            image: imageMatch ? imageMatch[1] : fallbackImages[idx % fallbackImages.length],
            url: linkMatch ? linkMatch[1] : "https://www.goodnewsnetwork.org",
            source: "Good News Network",
            readTime: "2 min read",
            publishedAt: "Today"
          };
        });

        newsCache = {
          timestamp: now,
          articles: parsed
        };
        return res.json(parsed);
      }
    } catch (fetchErr) {
      // Quietly fall back
    }

    newsCache = {
      timestamp: now,
      articles: defaultNewsArticles
    };
    res.json(defaultNewsArticles);
  } catch (err) {
    res.json(defaultNewsArticles);
  }
});

// ------------------- HOBBIES API (SECTION 6) -------------------

app.post("/api/hobbies/complete", async (req, res) => {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { hobbyType, activityTitle } = req.body;
    const dropsEarned = 15;
    const newDrops = (authUser.waterDrops || 0) + dropsEarned;
    const newOffline = (authUser.offlineMinutesToday || 0) + 10;

    if (isUsingMongo()) {
      const updatedUser = await User.findOneAndUpdate(
        { id: authUser.id },
        { waterDrops: newDrops, offlineMinutesToday: newOffline },
        { new: true }
      );
      return res.json({
        success: true,
        dropsEarned,
        message: `Great job exploring ${activityTitle || "your hobby"}! +15 Drops for your plant 🎨`,
        user: updatedUser
      });
    }

    const userIdx = inMemoryDB.users.findIndex((u) => u.id === authUser.id);
    if (userIdx !== -1) {
      inMemoryDB.users[userIdx].waterDrops = newDrops;
      inMemoryDB.users[userIdx].offlineMinutesToday = newOffline;
    }
    saveStoreToDisk();

    res.json({
      success: true,
      dropsEarned,
      message: `Great job exploring ${activityTitle || "your hobby"}! +15 Drops for your plant 🎨`,
      user: inMemoryDB.users[userIdx] || authUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------- FEEDBACK & ADMIN ROUTES -------------------

app.post("/api/feedback", async (req, res) => {
  try {
    const { experience, feeling, suggestions, userName, userEmail, userId } = req.body;

    if (!experience || !feeling) {
      return res.status(400).json({ error: "Experience and feeling are required." });
    }

    const newFeedback = {
      id: `fb_${Date.now()}`,
      userId: userId || "visitor",
      userName: userName || "Mindful Soul",
      userEmail: userEmail || "",
      experience,
      feeling,
      suggestions: suggestions || "",
      createdAt: new Date().toISOString()
    };

    if (isUsingMongo()) {
      await Feedback.create(newFeedback);
    } else {
      inMemoryDB.feedbacks.unshift(newFeedback);
      saveStoreToDisk();
    }

    res.status(201).json({
      success: true,
      message: "Every single thought helps us grow. Thank you! 🌿",
      feedback: newFeedback
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/admin/feedback", async (req, res) => {
  try {
    let feedbacksList = [];
    if (isUsingMongo()) {
      feedbacksList = await Feedback.find().sort({ createdAt: -1 });
    } else {
      feedbacksList = inMemoryDB.feedbacks || [];
    }

    const total = feedbacksList.length;
    const experienceCounts = {
      "Loved it 💚": 0,
      "It was good 🌼": 0,
      "It was okay 🌿": 0,
      "Needs improvement 🪴": 0
    };
    const feelingCounts = {
      "Calmer 🌱": 0,
      "More hopeful ☀️": 0,
      "About the same 🌿": 0,
      "Still overwhelmed 🌧️": 0
    };

    feedbacksList.forEach((f) => {
      if (experienceCounts[f.experience] !== undefined) experienceCounts[f.experience]++;
      if (feelingCounts[f.feeling] !== undefined) feelingCounts[f.feeling]++;
    });

    const satisfiedCount = (experienceCounts["Loved it 💚"] || 0) + (experienceCounts["It was good 🌼"] || 0);
    const satisfactionRate = total > 0 ? Math.round((satisfiedCount / total) * 100) : 100;
    const positiveCalmCount = (feelingCounts["Calmer 🌱"] || 0) + (feelingCounts["More hopeful ☀️"] || 0);
    const calmRate = total > 0 ? Math.round((positiveCalmCount / total) * 100) : 100;

    res.json({
      success: true,
      feedbacks: feedbacksList,
      stats: {
        total,
        satisfactionRate,
        calmRate,
        experienceCounts,
        feelingCounts
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/admin/feedback/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isUsingMongo()) {
      await Feedback.findOneAndDelete({ id });
    } else {
      inMemoryDB.feedbacks = inMemoryDB.feedbacks.filter((f) => f.id !== id);
      saveStoreToDisk();
    }
    res.json({ success: true, message: "Feedback removed successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Legacy / Helper facts
app.get("/api/facts", (req, res) => {
  res.json(dailyNatureFacts);
});

export { app };
export default app;

// Start backend
if (process.env.NODE_ENV !== "test") {
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌸 EcoCalm backend running on port ${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\n⚠️  Port ${PORT} is already in use by another Node process.`);
      console.error(`To free port ${PORT} in PowerShell, run:`);
      console.error(`  Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force\n`);
      process.exit(1);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
}
