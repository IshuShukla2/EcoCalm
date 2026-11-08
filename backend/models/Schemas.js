import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  id: { type: String, default: "user_maya" },
  email: { type: String, default: "maya@ecocalm.app" },
  password: { type: String, default: "peaceful123" },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  name: { type: String, default: "Maya Chen" },
  tagline: { type: String, default: "Gentle Pacer" },
  avatar: { type: String },
  waterDrops: { type: Number, default: 142 },
  offlineMinutesToday: { type: Number, default: 45 },
  questsCompletedToday: { type: Number, default: 2 },
  mindfulnessSessionsCompleted: { type: Number, default: 4 },
  calmStreakDays: { type: Number, default: 6 },
  dailyAffirmation: { type: String, default: "Today's tiny win: 10 mins offline. A little more you." },
  soundscapeTrack: { type: String, default: "Rain Falling on the Roof" },
  joinedCircles: { type: [String], default: ["crochet", "plants", "books"] },
  favoriteQuests: { type: [String], default: ["quest_1", "quest_2"] },
  achievements: [
    { id: String, title: String, icon: String, desc: String, unlockedAt: Date }
  ],
  medals: [
    { id: String, title: String, icon: String, desc: String }
  ],
  privacySettings: {
    isPrivate: { type: Boolean, default: true },
    allowCommunityVisibility: { type: Boolean, default: true },
    soundEnabled: { type: Boolean, default: true }
  }
}, { timestamps: true });

const PlantSchema = new mongoose.Schema({
  id: { type: String, default: "plant_01" },
  userId: { type: String, default: "user_maya" },
  name: { type: String, default: "Sir Photosynth-is" },
  variety: { type: String, default: "Delulu Monstera Variegata" },
  plantType: { type: String, default: "monstera" }, // monstera, sunflower, lavender, ficus, fern, boba
  tagline: { type: String, default: "The Delulu Dreamer" },
  stage: { type: Number, default: 3 },
  stageTitle: { type: String, default: "Flourishing Sapling" },
  maxStage: { type: Number, default: 5 },
  hydration: { type: Number, default: 78 },
  dropsNeededForNextBloom: { type: Number, default: 28 },
  totalDropsPoured: { type: Number, default: 162 },
  targetDropsNextStage: { type: Number, default: 200 },
  potStyle: { type: String, default: "ceramic_ribbed" }, // ceramic_ribbed, terracotta, unglazed_stone, celadon_green, pastel_rose, lavender_glaze, matte_obsidian, sky_mineral
  flowerType: { type: String, default: "rose_bud" }, // rose_bud, cherry_blossom, sunflower, lavender, star_jasmine, lotus
  companion: { type: String, default: "butterfly" }, // butterfly, honeybee, hummingbird, ladybug, firefly, dragonfly
  companionName: { type: String, default: "Blue Morpho" },
  hasSelectedSeed: { type: Boolean, default: false },
  lastWatered: { type: String, default: "Just now" },
  milestones: [{ stage: Number, title: String, desc: String, completed: Boolean, isCurrent: Boolean }]
}, { timestamps: true });

const QuestSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  categoryLabel: { type: String },
  duration: { type: String },
  timeBucket: { type: String },
  cost: { type: String },
  costBucket: { type: String },
  setting: { type: String },
  dropsReward: { type: Number, default: 15 },
  tag: { type: String },
  difficulty: { type: String },
  description: { type: String },
  instructions: [String],
  isFeatured: { type: Boolean, default: false },
  isWeeklySpotlight: { type: Boolean, default: false },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

const PostSchema = new mongoose.Schema({
  id: { type: String, required: true },
  author: { type: String, required: true },
  authorRole: { type: String },
  authorAvatar: { type: String },
  timeAgo: { type: String },
  circle: { type: String },
  circleName: { type: String },
  title: { type: String },
  text: { type: String },
  tags: [String],
  image: { type: String },
  dropsGiven: { type: Number, default: 0 },
  hasGivenDrop: { type: Boolean, default: false },
  isReported: { type: Boolean, default: false },
  comments: [{ id: String, author: String, text: String, createdAt: { type: Date, default: Date.now } }]
}, { timestamps: true });

const StorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  categoryLabel: { type: String },
  readTime: { type: String },
  dropsReward: { type: Number, default: 10 },
  source: { type: String },
  sourceUrl: { type: String, default: "https://nature.com" },
  location: { type: String },
  timeAgo: { type: String },
  image: { type: String },
  quote: { type: String },
  quoteAuthor: { type: String },
  summary: { type: String },
  isFeatured: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  bookmarked: { type: Boolean, default: false }
}, { timestamps: true });

const MoodLogSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: String, default: "user_maya" },
  score: { type: Number, required: true }, // 0 to 10 scale
  emotion: { type: String, required: true }, // e.g. Happy, Calm, Grateful, Anxious, Sad, Frustrated, Drained, Overwhelmed, Numb, Excited
  emotionsList: [String], // multi-select emotions
  intensity: { type: Number, default: 5 }, // 0 to 10
  emotionEmoji: { type: String },
  label: { type: String },
  note: { type: String },
  checkinType: { type: String, default: "general" }, // "general", "before_session", "after_session"
  linkedActivity: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const ChatMessageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  circle: { type: String, required: true },
  author: { type: String, required: true },
  authorAvatar: { type: String },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const FeedbackSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: String },
  userName: { type: String, default: "Mindful Visitor" },
  userEmail: { type: String },
  experience: { type: String, required: true }, // "Loved it 💚", "It was good 🌼", "It was okay 🌿", "Needs improvement 🪴"
  feeling: { type: String, required: true }, // "Calmer 🌱", "More hopeful ☀️", "About the same 🌿", "Still overwhelmed 🌧️"
  suggestions: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const User = mongoose.model("User", UserSchema);
export const Plant = mongoose.model("Plant", PlantSchema);
export const Quest = mongoose.model("Quest", QuestSchema);
export const Post = mongoose.model("Post", PostSchema);
export const Story = mongoose.model("Story", StorySchema);
export const MoodLog = mongoose.model("MoodLog", MoodLogSchema);
export const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);
export const Feedback = mongoose.model("Feedback", FeedbackSchema);

