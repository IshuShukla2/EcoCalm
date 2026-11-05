export const initialUser = {
  id: "user_maya",
  email: "maya@ecocalm.app",
  password: "peaceful123",
  role: "user",
  name: "Maya Chen",
  tagline: "Gentle Pacer",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2whyhBjn4A9SnEMzocCRmpZP4ZEqmpJ-zWeW23kmuur800au6BqfdYcmvuwTzO79WzC_neRaecdYdFzxrWI45DuCG6rwzNFEUzVaqidljRlDiMlGT_MSXJq5Bqg6DCHCsacno2GMG-rbsJe5Cv7KQB01D4qvRh7qT9Dvw6fh49e89ImV44CfxDLOv6nk-_mdQir7iuP4e_KzmsrZPEM-PNjQETIJFP7OenqynM0Hg6_y8eiUn2A1B_w",
  waterDrops: 142,
  offlineMinutesToday: 45,
  questsCompletedToday: 2,
  mindfulnessSessionsCompleted: 4,
  calmStreakDays: 6,
  dailyAffirmation: "Today's tiny win: 10 mins offline. A little more you.",
  soundscapeTrack: "Rain Falling on the Roof",
  joinedCircles: ["crochet", "plants", "books"],
  favoriteQuests: ["quest_1", "quest_2"],
  achievements: [
    { id: "main_character", title: "Main Character Quest", icon: "menu_book", desc: "Read 5 pages without checking phone", unlockedAt: new Date() },
    { id: "grass_toucher", title: "Grass-Touching Champion", icon: "park", desc: "Spent 15 minutes immersed in nature", unlockedAt: new Date() },
    { id: "healing_era", title: "Artist in Her Healing Era", icon: "palette", desc: "Created something tactile for 10 minutes", unlockedAt: new Date() },
    { id: "plot_armour", title: "Plot Armour", icon: "shield", desc: "Took a mindful breath break when overwhelmed", unlockedAt: new Date() }
  ],
  medals: [
    { id: "sunbeam", title: "Sunbeam Collector", icon: "wb_sunny", desc: "First 5 mindful mornings" },
    { id: "offline10h", title: "10h Offline Clay Seal", icon: "spa", desc: "10 hours away from feed" },
    { id: "greenhouse_key", title: "Greenhouse Key", icon: "key", desc: "Stage 3 Sanctuary Unlocked" }
  ],
  privacySettings: {
    isPrivate: true,
    allowCommunityVisibility: true,
    soundEnabled: true
  }
};

export const initialPlant = {
  id: "plant_01",
  userId: "user_maya",
  name: "Sir Photosynth-is",
  variety: "Delulu Monstera Variegata",
  plantType: "monstera",
  tagline: "The Delulu Dreamer",
  stage: 3,
  stageTitle: "Flourishing Sapling",
  maxStage: 5,
  hydration: 78,
  dropsNeededForNextBloom: 28,
  totalDropsPoured: 162,
  targetDropsNextStage: 200,
  potStyle: "ceramic_ribbed", // ceramic_ribbed, terracotta, unglazed_stone, celadon_green, pastel_rose, lavender_glaze, matte_obsidian, sky_mineral
  flowerType: "rose_bud", // rose_bud, cherry_blossom, sunflower, lavender, star_jasmine, lotus
  companion: "butterfly", // butterfly, honeybee, hummingbird, ladybug, firefly, dragonfly
  companionName: "Blue Morpho",
  lastWatered: "2 hours ago",
  milestones: [
    { stage: 1, title: "Seed of Intention", desc: "Planted on Nov 12 • 2 leaves unfurled", completed: true },
    { stage: 2, title: "Root System Grounding", desc: "Strong stems • 5 Offline Sessions", completed: true },
    { stage: 3, title: "Flourishing Plant (Current)", desc: "Delulu Monstera with rare rose buds", completed: true, isCurrent: true },
    { stage: 4, title: "Blooming Garden Canopy", desc: "Unlocks greenhouse glass conservatory tint", completed: false },
    { stage: 5, title: "Ancient Botanical Grove", desc: "Mastery tree • Infinite peaceful shade", completed: false }
  ]
};

export const initialQuests = [
  {
    id: "quest_1",
    title: "The Main Character Walk",
    category: "nature",
    categoryLabel: "Nature & Environment 🌿",
    duration: "15 mins",
    timeBucket: "<15",
    cost: "Free",
    costBucket: "free",
    setting: "Outdoor",
    dropsReward: 15,
    tag: "Nature & Outdoors",
    difficulty: "Beginner Friendly",
    description: "A 15-minute stroll around your block without checking incoming notifications. Listen to the wind, notice three interesting door handles, and simply breathe.",
    instructions: [
      "Put your phone in 'Do Not Disturb' or leave it in your pocket",
      "Notice 3 distinct sounds from birds or rustling foliage",
      "Touch a textured wall, tree bark, or flower petal",
      "Take 5 deep grounding breaths before heading inside"
    ],
    isFeatured: true,
    completed: false
  },
  {
    id: "quest_2",
    title: "Artist in Your Healing Era",
    category: "crafts",
    categoryLabel: "Arts & Crafts 🧶",
    duration: "20 mins",
    timeBucket: "30",
    cost: "Free",
    costBucket: "free",
    setting: "Indoor",
    dropsReward: 25,
    tag: "Creative Release",
    difficulty: "Beginner Friendly",
    description: "Watercolor doodling without perfectionism. Splash organic pigment circles, blend watery leaves, and let the dried layers bleed happily.",
    instructions: [
      "Gather any paper and water-based markers, coffee, or watercolor paint",
      "Draw 5 imperfect organic pebble shapes without worrying about symmetry",
      "Write a short, kind sentence to yourself inside one pebble"
    ],
    completed: false
  },
  {
    id: "quest_3",
    title: "Touch Grass Quest",
    category: "nature",
    categoryLabel: "Nature & Environment 🌿",
    duration: "15 mins",
    timeBucket: "<15",
    cost: "Free",
    costBucket: "free",
    setting: "Outdoor",
    dropsReward: 20,
    tag: "Outdoor Respite",
    difficulty: "Beginner Friendly",
    description: "Collect 3 distinctive fallen leaves or pinecones in your local park. Feel the crisp air, leave your phone in your pocket, and look up at the tree canopy.",
    instructions: [
      "Step outside to the nearest green patch",
      "Find three fallen leaves with contrasting colors or shapes",
      "Place them on your desk or windowsill as tactile anchors"
    ],
    completed: false
  },
  {
    id: "quest_4",
    title: "Bake It Till You Make It",
    category: "wellness",
    categoryLabel: "Everyday Wellness 🍵",
    duration: "45 mins",
    timeBucket: "1hr",
    cost: "Thrift",
    costBucket: "thrift",
    setting: "Indoor",
    dropsReward: 35,
    tag: "Kitchen Sanctuary",
    difficulty: "Cozy Mood",
    description: "Focaccia bread art with rosemary twigs and cherry tomatoes. Press your fingers deep into oily dough and arrange herbs like an edible botanical portrait.",
    instructions: [
      "Prepare simple dough or toast base",
      "Press rosemary leaves and olive slices like floral stems",
      "Enjoy the tactile sensation of dough rising"
    ],
    completed: false
  },
  {
    id: "quest_5",
    title: "Bookworm Behaviour",
    category: "reading",
    categoryLabel: "Reading & Writing 📖",
    duration: "15 mins",
    timeBucket: "<15",
    cost: "Free",
    costBucket: "free",
    setting: "Indoor",
    dropsReward: 15,
    tag: "Slow Mind",
    difficulty: "Relaxed",
    description: "Read 10 pages in natural morning light. No notifications, no audiobook at 2x speed, just the tactile rustle of paper pages and your imagination.",
    instructions: [
      "Select a book you love or haven't opened in months",
      "Sit near a window or daylight source",
      "Read just 10 unhurried pages"
    ],
    completed: true
  },
  {
    id: "quest_6",
    title: "Crochet & Chill Basics",
    category: "crafts",
    categoryLabel: "Arts & Crafts 🧶",
    duration: "30 mins",
    timeBucket: "30",
    cost: "Thrift",
    costBucket: "thrift",
    setting: "Indoor",
    dropsReward: 30,
    tag: "Hands Busy",
    difficulty: "Tactile Flow",
    description: "First granny square without unravelling. Keep anxious fingers rhythmically occupied while your mind drifts into a meditative resting zone.",
    instructions: [
      "Chain 4 stitches or practice finger knitting loops",
      "Focus on the rhythm of yarn sliding through your fingers",
      "No penalty for dropped stitches"
    ],
    completed: false
  },
  {
    id: "quest_7",
    title: "Chess Not Stress",
    category: "games",
    categoryLabel: "Games & Puzzles ♟️",
    duration: "20 mins",
    timeBucket: "30",
    cost: "Free",
    costBucket: "free",
    setting: "Indoor",
    dropsReward: 20,
    tag: "Mind Focus",
    difficulty: "Tactile",
    description: "Solve 3 physical board tactics or play a quiet match with a friend over tea. Experience the physical heft of real wooden pieces on felt.",
    instructions: [
      "Set up a physical board or puzzle sheet",
      "Take 5 unhurried minutes per move",
      "Sip warm tea between turns"
    ],
    completed: false
  },
  {
    id: "quest_8",
    title: "Pressed Herb Bookmark",
    category: "crafts",
    categoryLabel: "Arts & Crafts 🧶",
    duration: "10 mins",
    timeBucket: "<15",
    cost: "Free",
    costBucket: "free",
    setting: "Indoor",
    dropsReward: 40,
    tag: "Weekly Spotlight Quest",
    difficulty: "Super Gentle",
    description: "Make a botanical bookmark with pressed kitchen herbs (mint, thyme, lavender). Press inside a heavy book with parchment paper.",
    instructions: [
      "Take 1 sprig of mint, thyme, or lavender",
      "Press gently between two paper sheets inside a heavy dictionary",
      "Tie a small twine string around your card"
    ],
    completed: false,
    isWeeklySpotlight: true
  }
];

export const initialStories = [
  {
    id: "story_1",
    title: "Coral Reefs in the South Pacific are Regenerating Twice as Fast as Expected After Local Marine Sanctuaries Ban Industrial Trawling",
    category: "healing",
    categoryLabel: "The World Is Healing 🌱",
    readTime: "3 min read",
    dropsReward: 15,
    source: "Nature Conservation Journal",
    sourceUrl: "https://www.nature.com",
    location: "Cook Islands & Samoa Basin",
    timeAgo: "4 hours ago",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYy--OhK-Rdfk4wK9Ds4lUQ8gxj1P_qEXNybOTDNK_LPjdnBvOA-226jd5LvEpihbQYbVuOIx9Bx-3IzO5Am5ZFbmHhLgrOYH74IXVa7h8ARqmnkaPwyOpCis20VXqYi51TFaipF0eH2XmdJXukwB-pXI91vZpLrLUT7_zmqsmmYW8FwHMKcfoFWa5iH2hXRScnOb9skOzSPCqE9rXSZflpHYPJth839rtf767jw7TJgft2TO4AHbHpw",
    quote: "When we step back and give ocean habitats quiet room to exhale, biological memory kicks in with breathtaking speed.",
    quoteAuthor: "Dr. Leilani Fetu, Lead Marine Ecologist",
    summary: "Marine biologists across 14 monitoring stations recorded rapid coral recruitment in areas previously damaged by heavy commercial shipping. Grassroots protection corridors and natural micro-current cooling have revived over 400 square miles of pristine marine biodiversity.",
    isFeatured: true,
    likes: 842,
    bookmarked: false
  },
  {
    id: "story_2",
    title: "New Solar-Absorbing Concrete Turns Urban Walkways into Clean Energy Micro-Grids in 14 European Cities",
    category: "science",
    categoryLabel: "Science Ate 🔬",
    readTime: "2 min read",
    dropsReward: 10,
    source: "CleanTech Weekly",
    sourceUrl: "https://cleantechnica.com",
    location: "Copenhagen, Munich, Vienna",
    timeAgo: "5 hrs ago",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80",
    summary: "Engineers have deployed porous, piezoelectric and photovoltaic paving stones that quietly power pedestrian streetlamps and water refill stations, reducing city grid loads without altering historic cobbled aesthetics.",
    likes: 615,
    bookmarked: false
  },
  {
    id: "story_3",
    title: "The Iberian Lynx Population Exceeds 2,000 for the First Time in Six Decades Following Community Rewilding Effort",
    category: "nature",
    categoryLabel: "Nature's Comeback Era 🦭",
    readTime: "3 min read",
    dropsReward: 12,
    source: "Wildlife Foundation",
    sourceUrl: "https://worldwildlife.org",
    location: "Spain & Portugal Scrublands",
    timeAgo: "Yesterday",
    image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80",
    summary: "From fewer than 100 individuals in 2002, the wild feline recovery is recognized as one of the most successful biodiversity rescues in European conservation history.",
    likes: 928,
    bookmarked: false
  },
  {
    id: "story_4",
    title: "London Suburb Transforms Abandoned Bowling Alley into 24/7 Community Repair Cafe & Winter Seed Bank",
    category: "humanity",
    categoryLabel: "Faith in Humanity Restored 🤝",
    readTime: "3 min read",
    dropsReward: 15,
    source: "Good News Daily",
    sourceUrl: "https://goodnewsnetwork.org",
    location: "South London Co-op",
    timeAgo: "2 days ago",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80",
    summary: "Over 4,000 household appliances repaired for free, alongside 12,000 heirloom tomato and sweet pea seeds distributed to neighborhood balcony gardeners.",
    likes: 1240,
    bookmarked: false
  },
  {
    id: "story_5",
    title: "University Students Start 'Silent Reading & Herbal Tea' Society, Filling Lecture Halls with 500 Phone-Free Readers",
    category: "tinywins",
    categoryLabel: "Tiny Wins, Big Feelings ☕",
    readTime: "2 min read",
    dropsReward: 10,
    source: "Campus Chronicle",
    sourceUrl: "https://theconversation.com",
    location: "Edinburgh, Scotland",
    timeAgo: "3 days ago",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
    summary: "What started as four friends putting smartphones in a wicker basket became a weekly haven of soft acoustic playlists, peppermint tea, and uninterrupted novel reading.",
    likes: 779,
    bookmarked: true
  },
  {
    id: "story_6",
    title: "Ozone Layer Recovery is Fully on Track to Complete Global Healing by 2040, UN Report Affirms",
    category: "healing",
    categoryLabel: "The World Is Healing 🌱",
    readTime: "3 min read",
    dropsReward: 15,
    source: "Global Science Journal",
    sourceUrl: "https://unep.org",
    location: "Global Atmosphere",
    timeAgo: "4 days ago",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    summary: "Decades after the Montreal Protocol phased out atmospheric chlorofluorocarbons, satellite radar confirms the southern polar ozone gap is closing precisely as projected.",
    likes: 1845,
    bookmarked: false
  }
];

export const initialPosts = [
  {
    id: "post_1",
    author: "daisy_stitches",
    authorRole: "Crochet Circle",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    timeAgo: "22 minutes ago • Sitting by the radiator",
    circle: "crochet",
    circleName: "Crochet & Chill",
    title: "Finished my first wonky checkered tote bag!",
    text: "It has 4 dropped stitches and uneven sides, but it holds my paperbacks and I love it with all my soul 🌸 Zero perfectionism here, just soft wool and peaceful hands.",
    tags: ["#BeginnerFriendly", "#UnrushedCraft", "#WonkyBagClub"],
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
    dropsGiven: 84,
    hasGivenDrop: false,
    comments: [
      { id: "c1", author: "purl_queen", text: "The colors are sheer perfection and the shape looks so cozy!" },
      { id: "c2", author: "sam_yarn", text: "Wonky edges give it character that a factory could never replicate." }
    ]
  },
  {
    id: "post_2",
    author: "marcus_reads",
    authorRole: "Bookworms' Corner",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    timeAgo: "1 hour ago • Phone in flight mode 📴",
    circle: "books",
    circleName: "Bookworms' Corner",
    title: "Setting my phone in another room for 45 minutes to finish 'The Overstory'",
    text: "Light rain on the window + immaculate dopamine. My brain feels so rested and quiet right now. If you're scrolling, this is your gentle nudge to pause and pick up that chapter.",
    tags: ["#OfflineSprint", "#RainyAfternoon", "#PureReading"],
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    dropsGiven: 61,
    hasGivenDrop: true,
    isCrossCircleSpotlight: true,
    offlineSprintMinutes: 45,
    syncUsersCount: 43,
    comments: [
      { id: "c3", author: "elena_k", text: "Joined the sync! Starting chapter 7 of Piranesi." }
    ]
  },
  {
    id: "post_3",
    author: "plant_celia",
    authorRole: "The Green Thumb Gang",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    timeAgo: "3 hours ago • Window Sill Lab",
    circle: "plants",
    circleName: "The Green Thumb Gang",
    title: "Propagating golden pothos in antique honey jars",
    text: "Look at these tiny water roots after 10 days! 🌱 Root patience is my free therapy session. Nothing in nature rushes, yet everything gets done.",
    tags: ["#PlantParenthood", "#WaterProp", "#RootPatience"],
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
    dropsGiven: 112,
    hasGivenDrop: false,
    comments: [
      { id: "c4", author: "green_clara", text: "Water roots are magical! The honey jar look is stunning." }
    ]
  }
];

export const initialMoodLogs = [
  {
    id: "m_1",
    score: 3,
    emotion: "Calm",
    emotionsList: ["Calm", "Grateful"],
    intensity: 4,
    emotionEmoji: "😌",
    label: "3 / 10 • Gentle Ease",
    note: "Feeling settled after morning 4-7-8 breath and watering Sir Photosynth-is.",
    checkinType: "after_session",
    linkedActivity: "Breathing Session",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: "m_2",
    score: 7,
    emotion: "Overwhelmed",
    emotionsList: ["Overwhelmed", "Anxious"],
    intensity: 7,
    emotionEmoji: "😵💫",
    label: "7 / 10 • Overstimulated",
    note: "Screen overload before starting the offline walk.",
    checkinType: "before_session",
    linkedActivity: "The Main Character Walk",
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: "m_3",
    score: 2,
    emotion: "Calm",
    emotionsList: ["Calm", "Happy"],
    intensity: 2,
    emotionEmoji: "😊",
    label: "2 / 10 • Relaxed Floating",
    note: "Walk finished! Cold breeze and seeing three neighborhood cats helped immensely.",
    checkinType: "after_session",
    linkedActivity: "The Main Character Walk",
    timestamp: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString()
  }
];

export const initialChatMessages = [
  {
    id: "chat_1",
    circle: "crochet",
    author: "purl_queen",
    text: "Has anyone tried bamboo hooks vs metal hooks for tension? Bamboo feels so grounding! 🎋",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: "chat_2",
    circle: "crochet",
    author: "daisy_stitches",
    text: "Bamboo 100%! Less hand fatigue when curling up on the sofa.",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: "chat_3",
    circle: "plants",
    author: "plant_celia",
    text: "Gentle reminder to mist your ferns today if indoor heating is drying out the air! 🌿",
    timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString()
  }
];

export const dailyNatureFacts = [
  {
    fact: "Trees in forests share nutrients and communicate through an underground mycorrhizal network often called the 'Wood Wide Web'.",
    topic: "Forest Ecology 🌲"
  },
  {
    fact: "Lavender aroma stimulates the brain's amygdala in a similar soothing pathway to biological signals of safety.",
    topic: "Botanical Neuroscience 💜"
  },
  {
    fact: "Looking at natural fractals (like ferns, coastlines, and clouds) reduces alpha brainwave tension within 60 seconds.",
    topic: "Psychology & Nature 🍃"
  }
];

export const initialAdmin = {
  id: "user_hemal_admin",
  email: "hemal.au123@gmail.com",
  password: "hemal@admin",
  role: "admin",
  name: "Hemal (Admin)",
  tagline: "EcoCalm Groundskeeper",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  waterDrops: 999,
  offlineMinutesToday: 120,
  questsCompletedToday: 5,
  mindfulnessSessionsCompleted: 10,
  calmStreakDays: 30,
  dailyAffirmation: "Nurturing safe digital spaces for everyone.",
  joinedCircles: ["crochet", "plants", "books"],
  favoriteQuests: ["quest_1", "quest_2"],
  achievements: [
    { id: "admin_star", title: "Guardian Star", icon: "shield", desc: "EcoCalm Platform Guardian", unlockedAt: new Date() }
  ],
  medals: [
    { id: "admin_seal", title: "Admin Seal", icon: "verified", desc: "Sanctuary Administrator" }
  ],
  privacySettings: {
    isPrivate: false,
    allowCommunityVisibility: true,
    soundEnabled: true
  }
};

export const initialFeedbacks = [
  {
    id: "fb_1",
    userId: "user_maya",
    userName: "Maya Chen",
    userEmail: "maya@ecocalm.app",
    experience: "Loved it 💚",
    feeling: "Calmer 🌱",
    suggestions: "The breathing chamber with rain soundscapes completely relaxed my nervous system after work. The Tele-MANAS helpline card is also a very compassionate addition.",
    createdAt: new Date(Date.now() - 3600000 * 3)
  },
  {
    id: "fb_2",
    userId: "user_aarav",
    userName: "Aarav Sharma",
    userEmail: "aarav@gmail.com",
    experience: "It was good 🌼",
    feeling: "More hopeful ☀️",
    suggestions: "Really appreciate how the plant never dies even if I skip a day. It feels supportive rather than guilt-tripping.",
    createdAt: new Date(Date.now() - 3600000 * 18)
  },
  {
    id: "fb_3",
    userId: "user_ananya",
    userName: "Ananya Patel",
    userEmail: "ananya.p@outlook.com",
    experience: "Loved it 💚",
    feeling: "Calmer 🌱",
    suggestions: "The offline hobbies inspired me to do 20 minutes of watercolor sketching today instead of endless TikTok scrolling.",
    createdAt: new Date(Date.now() - 3600000 * 42)
  },
  {
    id: "fb_4",
    userId: "user_rohan",
    userName: "Rohan V.",
    userEmail: "rohan99@gmail.com",
    experience: "It was okay 🌿",
    feeling: "About the same 🌿",
    suggestions: "Would love to see even more nature soundscapes like ocean waves or crackling campfires.",
    createdAt: new Date(Date.now() - 3600000 * 65)
  }
];

