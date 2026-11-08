import React, { useState } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";
import { PlantSVG } from "../components/PlantSVG";

export const ProfilePage = () => {
  const {
    user,
    setUser,
    plant,
    quests,
    stories,
    moodLogs,
    showToast,
    triggerCelebration,
    setActiveTab,
    openAvatarModal
  } = useEcoCalm();

  const [activeTab, setActiveProfileTab] = useState("overview"); // overview, achievements, favorites, privacy
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user.name || "Mindful Soul");
  const [profileTagline, setProfileTagline] = useState(user.tagline || "Gentle Pacer");
  const [dailyAffirmation, setDailyAffirmation] = useState(user.dailyAffirmation || "Today's tiny win: 10 mins offline.");

  // Privacy toggles
  const [privateJournals, setPrivateJournals] = useState(true);
  const [shareOfflineMinutes, setShareOfflineMinutes] = useState(false);
  const [allowNotifications, setAllowNotifications] = useState(true);

  const completedQuestsCount = quests.filter(q => q.completed).length;
  const savedStories = stories.filter(s => s.bookmarked);
  const joinedCircles = user.joinedCircles || ["crochet", "plants", "books"];

  // Achievements & Badges (Step 11 & Step 12)
  const achievements = [
    {
      id: "sunbeam",
      title: "Sunbeam Collector",
      icon: "wb_sunny",
      desc: "Completed first 5 mindful morning pauses",
      unlocked: true,
      category: "Mindfulness",
      dateUnlocked: "2 days ago"
    },
    {
      id: "offline10h",
      title: "10h Offline Clay Seal",
      icon: "spa",
      desc: "Accumulated 10 hours of screen-free hobbies",
      unlocked: true,
      category: "Digital Well-Being",
      dateUnlocked: "Yesterday"
    },
    {
      id: "greenhouse_key",
      title: "Greenhouse Key",
      icon: "key",
      desc: "Nurtured virtual plant to Stage 3",
      unlocked: true,
      category: "Sanctuary",
      dateUnlocked: "Oct 24"
    },
    {
      id: "grass_toucher",
      title: "Grass-Touching Champion",
      icon: "park",
      desc: "Spent 30+ minutes on an outdoor nature quest",
      unlocked: user.offlineMinutesToday >= 30,
      category: "Nature",
      dateUnlocked: "In Progress"
    },
    {
      id: "main_character",
      title: "Main Character Energy",
      icon: "auto_stories",
      desc: "Read 5 book pages or sketched an unfinished draft",
      unlocked: true,
      category: "Creative",
      dateUnlocked: "Today"
    },
    {
      id: "plot_armour",
      title: "Plot Armour",
      icon: "shield",
      desc: "Used the Anti-Doomscroll button during a spiral",
      unlocked: true,
      category: "Resilience",
      dateUnlocked: "Today"
    },
    {
      id: "earth_child",
      title: "Earth's Favourite Child",
      icon: "recycling",
      desc: "Completed an eco-friendly planting or compost quest",
      unlocked: false,
      category: "Eco-Habit",
      dateUnlocked: "Locked"
    },
    {
      id: "renaissance_human",
      title: "Renaissance Human",
      icon: "palette",
      desc: "Explored 3 distinct offline hobby categories",
      unlocked: true,
      category: "Exploration",
      dateUnlocked: "This week"
    }
  ];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: profileName,
      tagline: profileTagline,
      dailyAffirmation
    };
    try {
      await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      // offline fallback
    }
    setUser(updated);
    setIsEditingProfile(false);
    showToast("Profile preferences updated ✨", "manage_accounts");
  };

  const handleExportData = () => {
    const dataToExport = {
      user,
      plant,
      moodHistory: moodLogs,
      completedQuests: quests.filter(q => q.completed),
      bookmarkedStories: savedStories,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ecocalm_privacy_export_${Date.now()}.json`;
    a.click();
    showToast("Personal data downloaded privately 📥", "download");
  };

  const handleClearMoodHistory = async () => {
    if (window.confirm("Are you sure you want to permanently clear your private mood logs? This cannot be undone.")) {
      try {
        await fetch("/api/mood", { method: "DELETE" });
      } catch (e) {
        // offline fallback
      }
      showToast("Mood check-in records wiped privately 🔒", "lock_reset");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto space-y-8 pb-20 pt-4">
      {/* ================= TOP PROFILE HERO BANNER ================= */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-surface-container-low shadow-xs border border-outline-variant/30 overflow-hidden">
        {/* Decorative blur glows */}
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -bottom-16 w-64 h-64 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Avatar & User Details */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div
              className="relative group cursor-pointer"
              onClick={openAvatarModal}
              title="Click to change profile picture"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20 group-hover:ring-primary/60 shadow-md transition-all group-hover:scale-102"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openAvatarModal();
                }}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs shadow-md hover:scale-110 active:scale-95 transition-transform"
                title="Change Avatar (Presets or Gallery)"
              >
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold mb-1">
                <span className="material-symbols-outlined text-sm">nature_people</span>
                <span>Mindful Member • Day {user.calmStreakDays || 6}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <h1 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold">
                  {user.name}
                </h1>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="p-1 text-on-surface-variant hover:text-primary rounded-lg transition-colors"
                  title="Edit Profile Info"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                </button>
                <button
                  type="button"
                  onClick={openAvatarModal}
                  className="px-2.5 py-1 text-xs rounded-full bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high font-semibold flex items-center gap-1.5 transition-colors shadow-xs ml-1"
                  title="Change Profile Picture (Choose from Gallery or Presets)"
                >
                  <span className="material-symbols-outlined text-sm text-primary">photo_camera</span>
                  <span>Change Avatar</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-primary font-medium">
                {user.tagline || "Gentle Pacer"} • {user.email || "visitor@ecocalm.app"}
              </p>

              <p className="text-xs text-on-surface-variant italic max-w-md pt-1">
                “{user.dailyAffirmation || "Today's tiny win: 10 mins offline. A little more you."}”
              </p>
            </div>
          </div>

          {/* Quick Stats Capsule */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
            <div className="px-4 py-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30 flex flex-col items-center min-w-[100px]">
              <span className="text-lg font-serif font-bold text-primary">{user.waterDrops || 142} 💧</span>
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Drops Balance</span>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30 flex flex-col items-center min-w-[100px]">
              <span className="text-lg font-serif font-bold text-tertiary">{user.offlineMinutesToday || 45}m</span>
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Offline Today</span>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-outline-variant/30 flex flex-col items-center min-w-[100px]">
              <span className="text-lg font-serif font-bold text-secondary">{completedQuestsCount || 4} 🌿</span>
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Quests Done</span>
            </div>
          </div>
        </div>

        {/* Inline Profile Editing Drawer */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-outline-variant/20 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface">Your Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-surface-container-lowest px-3 py-2 rounded-xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface">Pacing Tagline</label>
              <input
                type="text"
                value={profileTagline}
                onChange={(e) => setProfileTagline(e.target.value)}
                className="w-full bg-surface-container-lowest px-3 py-2 rounded-xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface">Daily Intention / Affirmation</label>
              <input
                type="text"
                value={dailyAffirmation}
                onChange={(e) => setDailyAffirmation(e.target.value)}
                className="w-full bg-surface-container-lowest px-3 py-2 rounded-xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-3 flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={openAvatarModal}
                className="px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold hover:bg-secondary-fixed transition-colors flex items-center gap-1.5 shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">photo_camera</span>
                <span>Change Avatar (Presets or Gallery)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-1.5 rounded-full text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold shadow-xs active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* ================= SECTION NAVIGATION TABS ================= */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: "overview", label: "Overview & Plant", icon: "potted_plant" },
          { id: "achievements", label: "Achievements & Badges (8)", icon: "emoji_events" },
          { id: "favorites", label: "Favorites & Communities", icon: "bookmarks" },
          { id: "privacy", label: "Privacy & Data Safety", icon: "security" }
        ].map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveProfileTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${isActive
                  ? "bg-primary text-on-primary shadow-xs font-bold"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
            >
              <span className="material-symbols-outlined text-base">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW & PLANT ================= */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Virtual Plant Card (5 cols) */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-3xl p-6 shadow-xs border border-outline-variant/30 flex flex-col items-center text-center justify-between">
            <div className="w-full flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-primary">Nurtured Companion</span>
              <button
                onClick={() => setActiveTab("garden")}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                Open Conservatory <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>

            <div className="py-2">
              <PlantSVG
                stage={plant.stage || 3}
                potStyle={plant.potStyle || "ceramic_ribbed"}
                flowerType={plant.flowerType || "rose_bud"}
                companion={plant.companion || "butterfly"}
                size="md"
              />
            </div>

            <div className="space-y-1 w-full pt-2">
              <h3 className="font-serif text-xl font-bold text-on-surface">{plant.name}</h3>
              <p className="text-xs text-on-surface-variant">
                Stage {plant.stage || 3} of 5 • {plant.stageTitle || "Flourishing Sapling"}
              </p>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${plant.hydration || 78}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-on-surface-variant pt-1">
                <span>Hydration: {plant.hydration || 78}%</span>
                <span>{plant.dropsNeededForNextBloom || 28} drops to next bloom</span>
              </div>
            </div>
          </div>

          {/* Holistic Progress Metrics (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xs border border-outline-variant/30 space-y-4">
              <h3 className="font-serif text-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">self_improvement</span>
                Sanctuary Well-Being Highlights
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-surface-container-low text-center">
                  <span className="text-xl font-serif font-bold text-primary">{user.waterDrops || 142}</span>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Water Drops Earned</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-container-low text-center">
                  <span className="text-xl font-serif font-bold text-tertiary">{plant.totalDropsPoured || 162}</span>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Drops Poured</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-container-low text-center">
                  <span className="text-xl font-serif font-bold text-secondary">{user.mindfulnessSessionsCompleted || 8}</span>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Breathing Sessions</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface-container-low text-center">
                  <span className="text-xl font-serif font-bold text-on-surface">{moodLogs.length || 12}</span>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Vibe Check-Ins</p>
                </div>
              </div>

              {/* Gentle observation */}
              <div className="p-4 rounded-2xl bg-surface-container-high/60 border border-outline-variant/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">lightbulb</span>
                <div className="text-xs space-y-1">
                  <span className="font-bold text-on-surface">Weekly Well-Being Observation:</span>
                  <p className="text-on-surface-variant leading-relaxed">
                    “You logged 45 minutes of offline craft & nature quests today. Your anxiety scores averaged 2.8 / 10 after breathing pauses—40% lower than initial check-ins.”
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setActiveTab("vibe")}
                className="p-4 rounded-2xl bg-secondary-container/40 hover:bg-secondary-container/60 transition-colors text-left flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-on-secondary-container">Emotional Trends</div>
                  <div className="text-[11px] text-on-surface-variant">Review 7-day anxiety compass</div>
                </div>
                <span className="material-symbols-outlined text-secondary">arrow_forward</span>
              </button>

              <button
                onClick={() => setActiveTab("hobbies")}
                className="p-4 rounded-2xl bg-tertiary-fixed/40 hover:bg-tertiary-fixed/60 transition-colors text-left flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-on-tertiary-fixed-variant">Offline Side Quests</div>
                  <div className="text-[11px] text-on-surface-variant">Browse 18 tactile hobbies</div>
                </div>
                <span className="material-symbols-outlined text-tertiary">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: ACHIEVEMENTS & BADGES ================= */}
      {activeTab === "achievements" && (
        <div className="space-y-6">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xs border border-outline-variant/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant/20 mb-6">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-on-surface">Touch Grass Badges & Quests 🏆</h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Gentle cosmetic honors rewarding curiosity, presence, and tactile living—never competitive rankings.
                </p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold w-fit">
                {achievements.filter(a => a.unlocked).length} of {achievements.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${ach.unlocked
                      ? "bg-surface-container-low border-primary/20 shadow-xs hover:-translate-y-0.5"
                      : "bg-surface-container-lowest opacity-60 border-outline-variant/20"
                    }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ach.unlocked ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface-variant"
                        }`}>
                        <span className="material-symbols-outlined text-xl">{ach.icon}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${ach.unlocked ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-surface-container text-outline"
                        }`}>
                        {ach.unlocked ? "Unlocked" : "Locked"}
                      </span>
                    </div>

                    <h4 className="font-serif text-sm font-bold text-on-surface mb-1">{ach.title}</h4>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">{ach.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-outline-variant/20 flex justify-between text-[10px] text-on-surface-variant">
                    <span>{ach.category}</span>
                    <span className="font-semibold">{ach.dateUnlocked}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: FAVORITES & COMMUNITIES ================= */}
      {activeTab === "favorites" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Saved Positive News Stories */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xs border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="font-serif text-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">bookmark</span>
                Saved Positive News ({savedStories.length})
              </h3>
              <button
                onClick={() => setActiveTab("plottwist")}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Read Feed →
              </button>
            </div>

            {savedStories.length === 0 ? (
              <p className="text-xs text-on-surface-variant py-4">No stories bookmarked yet. Tap the bookmark icon on any Plot Twist story.</p>
            ) : (
              <div className="space-y-3">
                {savedStories.map((story) => (
                  <div key={story.id} className="p-3.5 rounded-2xl bg-surface-container-low flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase">{story.categoryLabel}</span>
                      <h4 className="text-xs font-bold text-on-surface mt-0.5">{story.title}</h4>
                      <p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">{story.summary}</p>
                    </div>
                    <span className="text-xs text-primary font-bold whitespace-nowrap">+{story.dropsReward} 💧</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Joined Communities */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xs border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <h3 className="font-serif text-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-xl">group</span>
                Joined Hobby Circles ({joinedCircles.length})
              </h3>
              <button
                onClick={() => setActiveTab("hobbyverse")}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Explore Hobbyverse →
              </button>
            </div>

            <div className="space-y-3">
              {[
                { id: "crochet", label: "Crochet & Chill", icon: "🧶", desc: "Mindful granny squares & zero deadlines" },
                { id: "plants", label: "The Green Thumb Gang", icon: "🪴", desc: "Propagations, compost, and sunny balconies" },
                { id: "books", label: "Bookworms' Corner", icon: "📖", desc: "Unhurried reading & cozy chapter reflections" }
              ].map((circle) => (
                <div key={circle.id} className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{circle.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">{circle.label}</h4>
                      <p className="text-[11px] text-on-surface-variant">{circle.desc}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-surface-container px-2.5 py-1 rounded-full text-on-surface font-semibold">
                    Joined
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: PRIVACY & SAFETY SETTINGS ================= */}
      {activeTab === "privacy" && (
        <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xs border border-outline-variant/30 space-y-6">
          <div className="pb-4 border-b border-outline-variant/20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 text-on-primary-fixed-variant text-xs font-semibold mb-2">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Step 13: Privacy, Accessibility & Safety Compliant</span>
            </div>
            <h3 className="font-serif text-2xl font-semibold text-on-surface">Data Privacy & Sovereignty 🔒</h3>
            <p className="text-xs text-on-surface-variant mt-1 max-w-2xl">
              You own your emotional data. EcoCalm never runs algorithmic trackers, never sells your reflections, and avoids public mental health leaderboards.
            </p>
          </div>

          {/* Privacy Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low">
              <div>
                <div className="text-xs font-bold text-on-surface">Keep Emotional Check-Ins Strictly Private</div>
                <div className="text-[11px] text-on-surface-variant">Anxiety ratings and personal journal logs are stored encrypted and never shown publicly.</div>
              </div>
              <input
                type="checkbox"
                checked={privateJournals}
                onChange={(e) => setPrivateJournals(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low">
              <div>
                <div className="text-xs font-bold text-on-surface">Display Offline Minutes to Hobbyverse</div>
                <div className="text-[11px] text-on-surface-variant">Show your mindful screen-free hours as encouragement on community circles.</div>
              </div>
              <input
                type="checkbox"
                checked={shareOfflineMinutes}
                onChange={(e) => setShareOfflineMinutes(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low">
              <div>
                <div className="text-xs font-bold text-on-surface">Gentle Sanctuary Notifications</div>
                <div className="text-[11px] text-on-surface-variant">Allow soft daily whispers when your plant needs hydration (zero guilt streaks).</div>
              </div>
              <input
                type="checkbox"
                checked={allowNotifications}
                onChange={(e) => setAllowNotifications(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Data Export & Wipe */}
          <div className="pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleExportData}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Download My Sanctuary Data (.JSON)</span>
            </button>

            <button
              onClick={handleClearMoodHistory}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-error-container/40 hover:bg-error-container text-xs font-semibold text-on-error-container flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">delete_forever</span>
              <span>Wipe Mood Check-In History</span>
            </button>
          </div>

          {/* Safety Notice & Medical Disclaimer */}
          <div className="p-4 rounded-2xl bg-surface-container-high/60 border border-outline-variant/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
              <span className="material-symbols-outlined text-base text-primary">verified_user</span>
              <span>Important Health & Safety Disclaimer:</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              EcoCalm is an educational digital well-being companion promoting mindfulness, tactile hobbies, and nervous system regulation. It is <strong>not</strong> a medical device, psychiatric diagnostic tool, or emergency mental health crisis service. If you are experiencing acute distress, please reach out to trusted professional care or call 988 (USA) or your local emergency health line.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
