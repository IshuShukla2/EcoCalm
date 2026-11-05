# 🌿 EcoCalm — Digital Well-Being Platform

> **Tagline**: *Less Doomscrolling. More Growing.*  
> A Gen Z-focused digital sanctuary designed to help users reduce doomscrolling, manage eco-anxiety, understand their emotions, reconnect with offline hobbies, and discover positive developments around the world.

Built with the complete **MERN Stack** (MongoDB, Express, React, Node.js), containerized with **Docker & Docker Compose**, and fully responsive across smartphones, tablets, and desktops.

---

## 📁 Repository Structure

As requested, the project is cleanly divided into separate `frontend` and `backend` directories:

```
stitch_ecocalm_digital_well_being_platform/
├── frontend/                      # React 18 + Vite + TailwindCSS + Web Audio API
│   ├── src/
│   │   ├── components/            # PlantSVG, PlantCustomizerModal, AuthModal, TopHeader, Sidebar, DoomscrollModal
│   │   ├── pages/                 # LandingPage, Dashboard, VibeCheckPage, BreatheChamber, ExploreHobbies, PlotTwistFeed, Hobbyverse, SanctuaryGarden, ProfilePage
│   │   ├── context/               # EcoCalmContext.jsx (reactive state & API integration)
│   │   └── utils/                 # soundscapes.js (Web Audio API ambient audio synthesizer)
│   ├── nginx.conf                 # Reverse proxy /api/ to backend container
│   ├── Dockerfile
│   └── package.json
├── backend/                       # Node.js + Express + Mongoose (REST API)
│   ├── config/db.js               # MongoDB connection with reactive in-memory fallback
│   ├── models/Schemas.js          # User, Plant, Quest, Story, Post, MoodLog, ChatMessage
│   ├── data/seedData.js           # Verified seeds, achievements, daily facts, and mood logs
│   ├── server.js                  # Complete REST API endpoints (Auth, Plant, Quests, Stories, Community, Mood, Breathe)
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml             # Orchestrates mongodb, backend, and frontend containers
└── package.json                   # Root orchestrator scripts
```

---

## 🪴 Botanical Customization Studio (Expanded Options)

Users can freely customize their plant in real time from the **Home Dashboard**, **Conservatory Customizer Modal**, or **My Garden**:

1. **8 Pot Colors & Finishes**:
   - *Warm Linen* (`#ebe1d5`) — Ribbed organic porcelain
   - *Warm Terracotta* (`#d3927d`) — Sunbaked porous earthenware
   - *Unglazed Stone* (`#c7beb3`) — Rough river stone texture
   - *Celadon Sage* (`#a9ad8a`) — Cracked jade heritage glaze
   - *Pastel Rose* (`#f2c4c0`) — Soft rosy earthenware
   - *Lavender Glaze* (`#d4c2e6`) — Lilac mineral ceramic
   - *Matte Obsidian* (`#4a483e`) — Charcoal volcanic finish
   - *Sky Mineral* (`#b8d5db`) — Powder blue slip cast
2. **6 Flower Varieties**:
   - *Tender Rose Bud* 🌹 — Soft blush petals with morning dew
   - *Cherry Blossom (Sakura)* 🌸 — Five-petal ephemeral spring bloom
   - *Golden Sunflower* 🌻 — Radiant sunny rays facing the morning light
   - *French Lavender* 🪻 — Calming purple floral spikes
   - *Star Jasmine* ⭐ — Sweet radiant night-blooming white petals
   - *Emergent Lotus* 🪷 — Graceful water bloom symbolizing mindful resilience
3. **6 Insects & Garden Companions**:
   - *Blue Morpho Butterfly* 🦋 — Iridescent azure wings fluttering gently
   - *Sunlit Honeybee* 🐝 — Fuzzy pollinator seeking sweet nectar
   - *Garden Ladybug* 🐞 — Polka-dot luck charm resting on the stem
   - *Glowing Firefly* ✨ — Warm luminescent beacon pulsing at dusk
   - *Emerald Dragonfly* 🌱 — Speedy gossamer-winged sanctuary guardian
   - *Ruby Hummingbird* 🐦 — Fast-hovering emerald nectar lover
4. **Personalized Plant Nicknames**:
   - Customizable names (e.g., *Sir Photosynth-is*, *Boba*, *Delulu Fern*, *Matcha Sprout*)
   - Plants **never die or punish users** for missing days.

---

## 🌟 Complete 15-Step Feature Flow

| Step | Feature | Description & Implementation |
|---|---|---|
| **Step 1** | **Welcome Page & User Login** | "Your soft life starts here." Landing page with `AuthModal` supporting Login & Registration, guest demo switch, and interactive seedling choice. |
| **Step 2** | **Adopt Your Virtual Plant** | Choose from 4 seedlings (*Monstera*, *Sunflower*, *Lavender*, *Ficus*), set daily intentions, customize pot & name, unlock +25 welcome drops. |
| **Step 3** | **Anxiety & Emotion Check-In** | 0–10 Anxiety scale, 10 multi-select emotion chips with 0–10 intensity slider, optional reflection journal, before/after tracking toggle. |
| **Step 4** | **Breathing & Mindfulness Zone** | Animated expanding guide (Box, 4-7-8, Coherent), countdown timer, Web Audio soundscapes (*Rain*, *Forest*, *Lo-Fi*) with mute toggle. |
| **Step 5** | **Explore Offline Activities (Side Quests)** | 6 categories (*Arts & Crafts*, *Reading & Writing*, *Games & Puzzles*, *Sports & Movement*, *Nature*, *Wellness*), bookmarks, duration filters, water drop rewards. |
| **Step 6** | **Earn Water Drops & Rewards** | Personal water-drop balance, spend drops to hydrate plant, growth stages 1 through 5, unlocking pots, flowers, and badges. |
| **Step 7** | **The Plot Twist Feed** | Verified positive news in 5 categories, daily nature/science facts carousel, external source links, like/bookmark/share/submit. |
| **Step 8** | **The Vibe Check (Insights)** | Average anxiety over time (daily/weekly/monthly), weekly trend bar chart, before vs after shift (65% drop), non-judgmental fluctuation reminders. |
| **Step 9** | **Hobbyverse Communities** | 8 interest circles (*Crochet & Chill*, *Bookworms*, *Delulu Artists*, *Chess Not Stress*, etc.), project showcase photo sharing, live circle chat, and moderation report tool. |
| **Step 10** | **Anti-Doomscroll Button** | "I'm Doomscrolling Again 💀" persistent button opening 5-4-3-2-1 somatic grounding, relatable message, and 3 immediate offline activity swaps. |
| **Step 11** | **Touch Grass Quests & Badges** | Challenges (*Main Character Quest*, *Grass-Touching Champion*, *Plot Armour*, *Renaissance Human*), cosmetic rewards based on participation. |
| **Step 12** | **Personal Profile & Progress Dashboard** | Central overview of user journey, plant stage, drops ledger, mindfulness count, unlocked achievements, bookmarked stories, and circles. |
| **Step 13** | **Privacy, Accessibility & Safety** | Optional & private check-ins by default, JSON data export, one-click mood history wipe, no competitive leaderboards, clear mental health disclaimer. |
| **Step 14** | **Website Design & Navigation** | Olive Grove, Warm Ivory & Rose Dust palette, desktop sidebar + mobile bottom navigation dock with emergency reset anchor. |
| **Step 15** | **Complete User Journey** | Seamless end-to-end flow from login to adoption, check-in, breathing, offline quests, positive news, community chat, and profile progress. |

---

## 🚀 Running the Project

### Option A: Running with Docker (Recommended)

Ensure Docker Desktop is active:

```bash
# Build and run MongoDB, Backend API, and Frontend Client
docker compose up -d

# Open the sanctuary in your browser
http://localhost:3000
```

### Option B: Running Locally (Development Mode)

From the project root:

```bash
# 1. Start Backend (Express API on port 5001)
npm run dev:backend

# 2. In a second terminal, start Frontend (React + Vite on port 3000)
npm run dev:frontend

# 3. Access in browser
http://localhost:3000
```

---

## 🔒 Privacy & Health Disclaimer

EcoCalm is an educational digital well-being companion promoting mindfulness, tactile hobbies, and nervous system regulation. It is **not** a clinical diagnostic tool or emergency psychiatric crisis service. All personal reflections and anxiety logs are stored encrypted and remain 100% private.
