import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { soundscape } from "../utils/soundscapes";

const EcoCalmContext = createContext();

export const EcoCalmProvider = ({ children }) => {
  // Read saved session from localStorage
  const getSavedUser = () => {
    try {
      const saved = localStorage.getItem("ecocalm_user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  };

  const savedUser = getSavedUser();
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(savedUser));
  const [user, setUser] = useState(
    savedUser || {
      name: "Guest",
      tagline: "Exploring Sanctuary",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2whyhBjn4A9SnEMzocCRmpZP4ZEqmpJ-zWeW23kmuur800au6BqfdYcmvuwTzO79WzC_neRaecdYdFzxrWI45DuCG6rwzNFEUzVaqidljRlDiMlGT_MSXJq5Bqg6DCHCsacno2GMG-rbsJe5Cv7KQB01D4qvRh7qT9Dvw6fh49e89ImV44CfxDLOv6nk-_mdQir7iuP4e_KzmsrZPEM-PNjQETIJFP7OenqynM0Hg6_y8eiUn2A1B_w",
      waterDrops: 0,
      offlineMinutesToday: 0,
      questsCompletedToday: 0,
      calmStreakDays: 1,
      dailyAffirmation: "Your soft life starts here.",
      medals: []
    }
  );

  const [activeTab, setActiveTab] = useState(savedUser ? (savedUser.role === "admin" ? "admin" : "home") : "landing");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // "login" | "signup"
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const openAuthModal = (mode = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openAvatarModal = () => setIsAvatarModalOpen(true);
  const closeAvatarModal = () => setIsAvatarModalOpen(false);

  const openHelpline = () => setIsHelplineOpen(true);
  const closeHelpline = () => setIsHelplineOpen(false);

  const openFeedback = () => setIsFeedbackOpen(true);
  const closeFeedback = () => setIsFeedbackOpen(false);


  const updateUserAvatar = async (newAvatarUrl) => {
    const updatedUser = { ...user, avatar: newAvatarUrl };
    setUser(updatedUser);
    try {
      localStorage.setItem("ecocalm_user", JSON.stringify(updatedUser));
      await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: newAvatarUrl })
      });
    } catch (e) {
      // safe fallback
    }
    triggerCelebration();
    showToast("Profile picture updated! 🌸", "account_circle");
  };

  const loginUser = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("ecocalm_user", JSON.stringify(userData));
      if (token) localStorage.setItem("ecocalm_token", token);
    } catch (e) {}
    if (userData.role === "admin") {
      setActiveTab("admin");
    } else {
      setActiveTab("home");
    }
    setIsAuthModalOpen(false);
    triggerCelebration();
    const displayName = (userData.name || "Mindful Soul").split(" ")[0];
    showToast(userData.role === "admin" ? `Welcome Admin, ${displayName}! 🛡️` : `Welcome back, ${displayName}! 🌸`, "local_florist");
  };

  const logoutUser = () => {
    try {
      localStorage.removeItem("ecocalm_user");
      localStorage.removeItem("ecocalm_token");
    } catch (e) {}
    setIsAuthenticated(false);
    setUser({
      name: "Guest",
      tagline: "Exploring Sanctuary",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2whyhBjn4A9SnEMzocCRmpZP4ZEqmpJ-zWeW23kmuur800au6BqfdYcmvuwTzO79WzC_neRaecdYdFzxrWI45DuCG6rwzNFEUzVaqidljRlDiMlGT_MSXJq5Bqg6DCHCsacno2GMG-rbsJe5Cv7KQB01D4qvRh7qT9Dvw6fh49e89ImV44CfxDLOv6nk-_mdQir7iuP4e_KzmsrZPEM-PNjQETIJFP7OenqynM0Hg6_y8eiUn2A1B_w",
      waterDrops: 0
    });
    setActiveTab("landing");
    showToast("Logged out peacefully. See you soon 🌙", "logout");
  };

  const [plant, setPlant] = useState({
    name: "Sir Photosynth-is",
    variety: "Delulu Monstera Variegata",
    plantType: "monstera",
    stage: 3,
    stageTitle: "Flourishing Sapling",
    hydration: 78,
    dropsNeededForNextBloom: 28,
    totalDropsPoured: 162,
    targetDropsNextStage: 200,
    potStyle: "ceramic_ribbed",
    companion: "butterfly",
    companionName: "Blue Morpho",
    lastWatered: "2 hours ago"
  });

  const [quests, setQuests] = useState([]);
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [moodLogs, setMoodLogs] = useState([]);
  const [isDoomscrollOpen, setIsDoomscrollOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState("rain");
  const [toast, setToast] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showToast = (message, icon = "spa") => {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3500);
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#70702e", "#ffcfcb", "#cbca7e", "#e2e6c0"]
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Fetch initial data from server
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [uRes, pRes, qRes, sRes, cRes, mRes] = await Promise.all([
          fetch("/api/user").catch(() => null),
          fetch("/api/plant").catch(() => null),
          fetch("/api/quests").catch(() => null),
          fetch("/api/stories").catch(() => null),
          fetch("/api/community").catch(() => null),
          fetch("/api/mood").catch(() => null)
        ]);

        if (uRes && uRes.ok) {
          const fetchedUser = await uRes.json();
          // Only overwrite user if user is authenticated
          if (isAuthenticated) setUser(fetchedUser);
        }
        if (pRes && pRes.ok) setPlant(await pRes.json());
        if (qRes && qRes.ok) setQuests(await qRes.json());
        if (sRes && sRes.ok) setStories(await sRes.json());
        if (cRes && cRes.ok) setPosts(await cRes.json());
        if (mRes && mRes.ok) setMoodLogs(await mRes.json());
      } catch (err) {
        console.warn("Using offline memory context");
      }
    };
    loadAll();
  }, [isAuthenticated]);

  // Water Plant
  const waterPlant = async (drops = 10) => {
    try {
      const res = await fetch("/api/plant/water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drops })
      });
      if (res.ok) {
        const data = await res.json();
        setPlant(data.plant);
        setUser(data.user);
        triggerCelebration();
        showToast(`Hydrated! Sir Photosynth-is gained +${drops} water drops 💧`, "water_drop");
      }
    } catch (err) {
      setPlant(prev => ({
        ...prev,
        hydration: Math.min(100, prev.hydration + 15),
        totalDropsPoured: prev.totalDropsPoured + drops,
        lastWatered: "Just now"
      }));
      setUser(prev => ({ ...prev, waterDrops: Math.max(0, prev.waterDrops - drops) }));
      triggerCelebration();
      showToast("Hydrated plant with pure intention 🌱", "water_drop");
    }
  };

  // Customize Plant
  const customizePlant = async (updates) => {
    try {
      const res = await fetch("/api/plant/customize", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setPlant(updated);
        showToast("Sanctuary conservatory updated ✨", "palette");
      }
    } catch (err) {
      setPlant(prev => ({ ...prev, ...updates }));
      showToast("Sanctuary conservatory updated ✨", "palette");
    }
  };

  // Adopt Plant
  const adoptPlant = async (adoptionData) => {
    try {
      const res = await fetch("/api/plant/adopt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adoptionData)
      });
      if (res.ok) {
        const data = await res.json();
        setPlant(data.plant);
        setUser(data.user);
        triggerCelebration();
        showToast(`Welcome! ${data.plant.name} adopted with +25 drops 🌸`, "potted_plant");
        setActiveTab("home");
      }
    } catch (err) {
      setPlant(prev => ({ ...prev, ...adoptionData }));
      setActiveTab("home");
    }
  };

  // Complete Quest
  const completeQuest = async (questId) => {
    try {
      const res = await fetch("/api/quests/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questId })
      });
      if (res.ok) {
        const data = await res.json();
        setQuests(prev => prev.map(q => q.id === questId ? { ...q, completed: true } : q));
        if (data.user) setUser(data.user);
        triggerCelebration();
        showToast(`Quest completed! Earned +${data.dropsEarned} water drops 💧`, "emoji_events");
      }
    } catch (err) {
      setQuests(prev => prev.map(q => q.id === questId ? { ...q, completed: true } : q));
      setUser(prev => ({ ...prev, waterDrops: prev.waterDrops + 20 }));
      triggerCelebration();
      showToast("Quest completed! +20 drops earned 🌱", "emoji_events");
    }
  };

  // Submit Custom Quest
  const submitQuest = async (questData) => {
    try {
      const res = await fetch("/api/quests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questData)
      });
      if (res.ok) {
        const data = await res.json();
        setQuests(prev => [data.quest, ...prev]);
        if (data.user) setUser(data.user);
        triggerCelebration();
        showToast("Quest submitted to community! +20 drops awarded 🌿", "add_task");
      }
    } catch (err) {
      showToast("Thank you for sharing your offline idea! ✨");
    }
  };

  // Like or Bookmark Story
  const toggleStoryBookmark = async (storyId) => {
    try {
      const res = await fetch("/api/stories/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId })
      });
      if (res.ok) {
        const updated = await res.json();
        setStories(prev => prev.map(s => s.id === storyId ? updated : s));
        showToast("Story saved to mindful reading journal 📖", "bookmark");
      }
    } catch (err) {
      setStories(prev => prev.map(s => s.id === storyId ? { ...s, bookmarked: !s.bookmarked, likes: s.likes + 1 } : s));
    }
  };

  // Submit Good News Story
  const submitStory = async (storyData) => {
    try {
      const res = await fetch("/api/stories/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyData)
      });
      if (res.ok) {
        const data = await res.json();
        setStories(prev => [data.story, ...prev]);
        if (data.user) setUser(data.user);
        triggerCelebration();
        showToast("Shared something good! +25 drops added to reservoir 💌", "favorite");
      }
    } catch (err) {
      showToast("Thank you for spreading gentle hope! 🌊");
    }
  };

  // Create Community Post
  const createPost = async (postData) => {
    try {
      const res = await fetch("/api/community/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(prev => [data.post, ...prev]);
        if (data.user) setUser(data.user);
        triggerCelebration();
        showToast("Project post shared with Hobbyverse! +15 drops 🧶", "filter_vintage");
      }
    } catch (err) {
      showToast("Project post shared with Hobbyverse! 🌿");
    }
  };

  // Give Drops to Post
  const giveDropToPost = async (postId) => {
    try {
      const res = await fetch("/api/community/drops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId })
      });
      if (res.ok) {
        const updated = await res.json();
        setPosts(prev => prev.map(p => p.id === postId ? updated : p));
        showToast("Sent encouragement drop to creator 💧", "water_drop");
      }
    } catch (err) {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, dropsGiven: p.dropsGiven + 1, hasGivenDrop: true } : p));
    }
  };

  // Add Comment to Post
  const addCommentToPost = async (postId, text) => {
    try {
      const res = await fetch("/api/community/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, text })
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(prev => prev.map(p => p.id === postId ? data.post : p));
        showToast("Gentle comment posted 💬", "chat_bubble");
      }
    } catch (err) {
      showToast("Comment added! 🌿");
    }
  };

  // Log Vibe Check
  const logMood = async (moodData) => {
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(moodData)
      });
      if (res.ok) {
        const data = await res.json();
        setMoodLogs(prev => [data.mood, ...prev]);
        if (data.user) setUser(data.user);
        showToast("Vibe check logged! +10 drops recorded 🕊️", "favorite");
      }
    } catch (err) {
      showToast("Vibe check logged! 🕊️");
    }
  };

  // Complete Breathing Session
  const completeBreathing = async (minutes = 3, pattern = "box") => {
    try {
      const res = await fetch("/api/breathe/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minutes, pattern })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) setUser(data.user);
        triggerCelebration();
        showToast("Breathing session completed! +20 drops added to your garden 🌱", "spa");
      }
    } catch (err) {
      setUser(prev => ({
        ...prev,
        waterDrops: prev.waterDrops + 20,
        offlineMinutesToday: prev.offlineMinutesToday + minutes
      }));
      triggerCelebration();
      showToast("Breathing session completed! +20 drops 🌱", "spa");
    }
  };

  // Soundscape Toggle
  const toggleSoundscape = (track = "rain") => {
    if (isAudioPlaying && currentSound === track) {
      soundscape.stop();
      setIsAudioPlaying(false);
      showToast("Soundscape paused 🌙", "volume_off");
    } else {
      soundscape.play(track);
      setCurrentSound(track);
      setIsAudioPlaying(true);
      const labels = { rain: "Rain Falling on the Roof", breeze: "Forest Air", vinyl: "Warm Lo-Fi" };
      showToast(`Playing ${labels[track] || track} 🌿`, "volume_up");
    }
  };

  return (
    <EcoCalmContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        loginUser,
        logoutUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        isAvatarModalOpen,
        openAvatarModal,
        closeAvatarModal,
        updateUserAvatar,
        isHelplineOpen,
        setIsHelplineOpen,
        openHelpline,
        closeHelpline,
        isFeedbackOpen,
        setIsFeedbackOpen,
        openFeedback,
        closeFeedback,
        isAdmin: user?.role === "admin",
        activeTab,
        setActiveTab,
        user,
        setUser,
        plant,
        setPlant,
        quests,
        stories,
        posts,
        moodLogs,
        isDoomscrollOpen,
        setIsDoomscrollOpen,
        waterPlant,
        customizePlant,
        adoptPlant,
        completeQuest,
        submitQuest,
        toggleStoryBookmark,
        submitStory,
        createPost,
        giveDropToPost,
        addCommentToPost,
        logMood,
        completeBreathing,
        isAudioPlaying,
        currentSound,
        toggleSoundscape,
        toast,
        showToast,
        triggerCelebration,
        mobileMenuOpen,
        setMobileMenuOpen
      }}
    >
      {children}
    </EcoCalmContext.Provider>
  );
};

export const useEcoCalm = () => useContext(EcoCalmContext);
