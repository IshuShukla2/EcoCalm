import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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

  const getSavedToken = () => {
    try {
      return localStorage.getItem("ecocalm_token") || null;
    } catch (e) {
      return null;
    }
  };

  const initialSavedUser = getSavedUser();
  const initialSavedToken = getSavedToken();

  const [token, setToken] = useState(initialSavedToken);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialSavedUser && initialSavedToken));
  const [user, setUser] = useState(
    initialSavedUser || {
      name: "Guest",
      tagline: "Exploring Sanctuary",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ecocalm_guest",
      waterDrops: 0,
      offlineMinutesToday: 0,
      questsCompletedToday: 0,
      calmStreakDays: 1,
      dailyAffirmation: "Your soft life starts here.",
      medals: []
    }
  );

  // Active navigation tab
  // 1. plant, 2. vibe_before, 3. breathe, 4. news, 5. hobbies, 6. vibe_after, 7. helpline, admin, landing
  const [activeTab, setActiveTab] = useState(
    initialSavedUser ? (initialSavedUser.role === "admin" ? "plant" : "plant") : "landing"
  );

  const [plant, setPlant] = useState({
    name: "My Gentle Companion",
    variety: "Monstera Deliciosa",
    plantType: "monstera",
    stage: 1,
    stageTitle: "Tender Seedling",
    hydration: 50,
    dropsNeededForNextBloom: 30,
    totalDropsPoured: 20,
    targetDropsNextStage: 50,
    potStyle: "ceramic_ribbed",
    flowerType: "rose_bud",
    companion: "butterfly",
    companionName: "Blue Morpho",
    hasSelectedSeed: false,
    lastWatered: "Just now"
  });

  const [moodLogs, setMoodLogs] = useState([]);
  const [vibeBefore, setVibeBefore] = useState(null);
  const [vibeAfter, setVibeAfter] = useState(null);

  const [newsArticles, setNewsArticles] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // "login" | "signup"
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isDoomscrollOpen, setIsDoomscrollOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState("rain");
  const [toast, setToast] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authenticated fetch wrapper
  const authFetch = useCallback(
    async (url, options = {}) => {
      const currentToken = token || localStorage.getItem("ecocalm_token");
      const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
      };
      if (currentToken) {
        headers["Authorization"] = `Bearer ${currentToken}`;
      }
      if (user?.id) {
        headers["x-user-id"] = user.id;
      }
      return fetch(url, { ...options, headers });
    },
    [token, user?.id]
  );

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
    } catch (e) {}
  };

  const openAuthModal = (mode = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openAvatarModal = () => setIsAvatarModalOpen(true);
  const closeAvatarModal = () => setIsAvatarModalOpen(false);
  const openHelpline = () => setIsHelplineOpen(true);
  const closeHelpline = () => setIsHelplineOpen(false);
  const openFeedback = () => setIsFeedbackOpen(true);
  const closeFeedback = () => setIsFeedbackOpen(false);

  // Load user data specifically for the logged-in account
  const refreshUserData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [uRes, pRes, mRes] = await Promise.all([
        authFetch("/api/user").catch(() => null),
        authFetch("/api/plant").catch(() => null),
        authFetch("/api/mood").catch(() => null)
      ]);

      if (uRes && uRes.ok) {
        const userData = await uRes.json();
        setUser(userData);
        localStorage.setItem("ecocalm_user", JSON.stringify(userData));
      }

      if (pRes && pRes.ok) {
        const plantData = await pRes.json();
        setPlant(plantData);
      }

      if (mRes && mRes.ok) {
        const logs = await mRes.json();
        setMoodLogs(logs);
        // Find latest before and after checks
        const latestBefore = logs.find((l) => l.checkinType === "before");
        const latestAfter = logs.find((l) => l.checkinType === "after");
        if (latestBefore) setVibeBefore(latestBefore);
        if (latestAfter) setVibeAfter(latestAfter);
      }
    } catch (err) {
      console.warn("Using offline user context:", err);
    }
  }, [authFetch, isAuthenticated]);

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      refreshUserData();
    }
  }, [isAuthenticated, refreshUserData]);

  // Fetch daily news
  useEffect(() => {
    authFetch("/api/news")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setNewsArticles(data);
        }
      })
      .catch(() => {});
  }, [authFetch]);

  // Log in user
  const loginUser = async (userData, authToken) => {
    const validToken = authToken || `jwt_${userData.id || Date.now()}`;
    setToken(validToken);
    setUser(userData);
    setIsAuthenticated(true);

    try {
      localStorage.setItem("ecocalm_user", JSON.stringify(userData));
      localStorage.setItem("ecocalm_token", validToken);
    } catch (e) {}

    // Clear previous user's temporary checks
    setVibeBefore(null);
    setVibeAfter(null);

    // Fetch this specific user's plant and mood logs
    try {
      const [pRes, mRes] = await Promise.all([
        fetch("/api/plant", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${validToken}`,
            "x-user-id": userData.id
          }
        }).catch(() => null),
        fetch("/api/mood", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${validToken}`,
            "x-user-id": userData.id
          }
        }).catch(() => null)
      ]);

      if (pRes && pRes.ok) {
        const plantData = await pRes.json();
        setPlant(plantData);
      } else {
        setPlant({
          name: "My Gentle Companion",
          variety: "Monstera Deliciosa",
          plantType: "monstera",
          stage: 1,
          stageTitle: "Tender Seedling",
          hydration: 50,
          dropsNeededForNextBloom: 30,
          totalDropsPoured: 20,
          targetDropsNextStage: 50,
          potStyle: "ceramic_ribbed",
          flowerType: "rose_bud",
          companion: "butterfly",
          companionName: "Blue Morpho",
          hasSelectedSeed: false,
          lastWatered: "Just planted"
        });
      }

      if (mRes && mRes.ok) {
        const logs = await mRes.json();
        setMoodLogs(logs);
        const latestBefore = logs.find((l) => l.checkinType === "before");
        const latestAfter = logs.find((l) => l.checkinType === "after");
        if (latestBefore) setVibeBefore(latestBefore);
        if (latestAfter) setVibeAfter(latestAfter);
      } else {
        setMoodLogs([]);
      }
    } catch (e) {
      setMoodLogs([]);
    }

    // Default first screen after login: PLANT (Section 1)
    setActiveTab("plant");
    setIsAuthModalOpen(false);
    triggerCelebration();

    const displayName = (userData.name || "Mindful Soul").split(" ")[0];
    showToast(
      userData.role === "admin"
        ? `Welcome Admin, ${displayName}! 🛡️`
        : `Welcome back, ${displayName}! 🌸`,
      "local_florist"
    );
  };

  // Log out user
  const logoutUser = () => {
    try {
      localStorage.removeItem("ecocalm_user");
      localStorage.removeItem("ecocalm_token");
    } catch (e) {}

    setToken(null);
    setIsAuthenticated(false);
    setUser({
      name: "Guest",
      tagline: "Exploring Sanctuary",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ecocalm_guest",
      waterDrops: 0
    });
    setPlant({
      name: "My Gentle Companion",
      variety: "Monstera Deliciosa",
      plantType: "monstera",
      stage: 1,
      stageTitle: "Tender Seedling",
      hydration: 50,
      dropsNeededForNextBloom: 30,
      totalDropsPoured: 20,
      targetDropsNextStage: 50,
      potStyle: "ceramic_ribbed",
      flowerType: "rose_bud",
      companion: "butterfly",
      companionName: "Blue Morpho",
      hasSelectedSeed: false,
      lastWatered: "Just now"
    });
    setMoodLogs([]);
    setVibeBefore(null);
    setVibeAfter(null);
    setActiveTab("landing");
    showToast("Logged out peacefully. See you soon 🌙", "logout");
  };

  // Update user avatar
  const updateUserAvatar = async (newAvatarUrl) => {
    const updatedUser = { ...user, avatar: newAvatarUrl };
    setUser(updatedUser);
    try {
      localStorage.setItem("ecocalm_user", JSON.stringify(updatedUser));
      await authFetch("/api/user", {
        method: "PUT",
        body: JSON.stringify({ avatar: newAvatarUrl })
      });
    } catch (e) {}
    triggerCelebration();
    showToast("Profile picture updated! 🌸", "account_circle");
  };

  // Water Plant
  const waterPlant = async (drops = 10) => {
    try {
      const res = await authFetch("/api/plant/water", {
        method: "POST",
        body: JSON.stringify({ drops })
      });
      if (res.ok) {
        const data = await res.json();
        setPlant(data.plant);
        setUser(data.user);
        triggerCelebration();
        showToast(`Hydrated! ${data.plant.name} gained +${drops} water drops 💧`, "water_drop");
      }
    } catch (err) {
      setPlant((prev) => ({
        ...prev,
        hydration: Math.min(100, (prev.hydration || 50) + 15),
        totalDropsPoured: (prev.totalDropsPoured || 0) + drops,
        lastWatered: "Just now"
      }));
      setUser((prev) => ({ ...prev, waterDrops: Math.max(0, (prev.waterDrops || 0) - drops) }));
      triggerCelebration();
      showToast("Hydrated plant with pure intention 🌱", "water_drop");
    }
  };

  // Customize Plant
  const customizePlant = async (updates) => {
    try {
      const res = await authFetch("/api/plant/customize", {
        method: "PUT",
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setPlant(updated);
        showToast("Plant preferences saved! ✨", "palette");
      }
    } catch (err) {
      setPlant((prev) => ({ ...prev, ...updates }));
      showToast("Plant preferences saved! ✨", "palette");
    }
  };

  // Adopt / Select Plant Seed (Section 2)
  const adoptPlant = async (adoptionData) => {
    try {
      const res = await authFetch("/api/plant/adopt", {
        method: "POST",
        body: JSON.stringify(adoptionData)
      });
      if (res.ok) {
        const data = await res.json();
        setPlant(data.plant);
        setUser(data.user);
        triggerCelebration();
        showToast(`Welcome! ${data.plant.name} planted with +25 drops 🌸`, "potted_plant");
      }
    } catch (err) {
      setPlant((prev) => ({ ...prev, ...adoptionData, hasSelectedSeed: true }));
      setUser((prev) => ({ ...prev, waterDrops: (prev.waterDrops || 0) + 25 }));
      showToast("Seed planted with care! 🌱", "potted_plant");
    }
  };

  // Log Vibe Check (Supports "before" and "after")
  const logMood = async (moodData) => {
    try {
      const res = await authFetch("/api/mood", {
        method: "POST",
        body: JSON.stringify(moodData)
      });
      if (res.ok) {
        const data = await res.json();
        setMoodLogs((prev) => [data.mood, ...prev]);
        if (data.user) setUser(data.user);

        if (moodData.checkinType === "before") {
          setVibeBefore(data.mood);
        } else if (moodData.checkinType === "after") {
          setVibeAfter(data.mood);
        }

        triggerCelebration();
        showToast(
          moodData.checkinType === "before"
            ? "Baseline mood recorded! Ready for mindful activities 🌱"
            : "Post-activity check-in saved! +10 Drops awarded 🕊️",
          "favorite"
        );
      }
    } catch (err) {
      const fallbackLog = {
        id: `m_${Date.now()}`,
        score: moodData.score,
        emotion: moodData.emotion,
        emotionsList: moodData.emotionsList || [moodData.emotion],
        intensity: moodData.intensity || 5,
        note: moodData.note || "",
        checkinType: moodData.checkinType || "general",
        timestamp: new Date().toISOString()
      };
      setMoodLogs((prev) => [fallbackLog, ...prev]);
      if (moodData.checkinType === "before") setVibeBefore(fallbackLog);
      if (moodData.checkinType === "after") setVibeAfter(fallbackLog);
      setUser((prev) => ({ ...prev, waterDrops: (prev.waterDrops || 0) + 10 }));
      showToast("Vibe check logged! 🕊️", "favorite");
    }
  };

  // Complete Breathing Exercise
  const completeBreathing = async (minutes = 3, pattern = "box") => {
    try {
      const res = await authFetch("/api/breathe/complete", {
        method: "POST",
        body: JSON.stringify({ minutes, pattern })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) setUser(data.user);
        triggerCelebration();
        showToast("Breathing session completed! +20 drops added to your plant 🌱", "spa");
      }
    } catch (err) {
      setUser((prev) => ({
        ...prev,
        waterDrops: (prev.waterDrops || 0) + 20,
        offlineMinutesToday: (prev.offlineMinutesToday || 0) + minutes
      }));
      triggerCelebration();
      showToast("Breathing session completed! +20 drops 🌱", "spa");
    }
  };

  // Complete Hobby Activity (Section 6)
  const completeHobbyActivity = async (hobbyType, activityTitle) => {
    try {
      const res = await authFetch("/api/hobbies/complete", {
        method: "POST",
        body: JSON.stringify({ hobbyType, activityTitle })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) setUser(data.user);
        triggerCelebration();
        showToast(data.message || "Hobby activity completed! +15 Drops 🎨", "palette");
      }
    } catch (err) {
      setUser((prev) => ({
        ...prev,
        waterDrops: (prev.waterDrops || 0) + 15,
        offlineMinutesToday: (prev.offlineMinutesToday || 0) + 10
      }));
      triggerCelebration();
      showToast("Hobby activity completed! +15 Drops 🎨", "palette");
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
      const labels = { rain: "Rain on Leaves", breeze: "Forest Air", vinyl: "Warm Lo-Fi Chords" };
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
        moodLogs,
        vibeBefore,
        vibeAfter,
        newsArticles,
        isDoomscrollOpen,
        setIsDoomscrollOpen,
        waterPlant,
        customizePlant,
        adoptPlant,
        logMood,
        completeBreathing,
        completeHobbyActivity,
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
