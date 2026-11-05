import React, { useState } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";
import { PlantSVG } from "../components/PlantSVG";
import { PlantCustomizerModal } from "../components/PlantCustomizerModal";

export const Dashboard = () => {
  const {
    user,
    plant,
    waterPlant,
    setActiveTab,
    setIsDoomscrollOpen,
    logMood,
    completeQuest,
    quests,
    customizePlant,
    showToast
  } = useEcoCalm();

  const [selectedEmotion, setSelectedEmotion] = useState("Calm");
  const [anxietyScore, setAnxietyScore] = useState(3);
  const [isWatering, setIsWatering] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const moodMap = {
    1: "1 / 10 • Deep Serenity",
    2: "2 / 10 • Relaxed Floating",
    3: "3 / 10 • Gentle Ease",
    4: "4 / 10 • Focused Flow",
    5: "5 / 10 • Mild Screen Buzz",
    6: "6 / 10 • Restless Energy",
    7: "7 / 10 • Overstimulated",
    8: "8 / 10 • High Tension",
    9: "9 / 10 • Sensory Clutter",
    10: "10 / 10 • Emergency Grounding"
  };

  const emotions = [
    { label: "Calm", emoji: "🕊️" },
    { label: "Overwhelmed", emoji: "🌧️" },
    { label: "Grateful", emoji: "🌸" },
    { label: "Excited", emoji: "✨" },
    { label: "Drained", emoji: "🔋" }
  ];

  const handleWaterClick = async () => {
    setIsWatering(true);
    await waterPlant(10);
    setTimeout(() => setIsWatering(false), 1600);
  };

  const handleLogEmotion = (emotion) => {
    setSelectedEmotion(emotion.label);
    logMood({
      score: anxietyScore,
      emotion: emotion.label,
      emotionEmoji: emotion.emoji,
      note: `Feeling ${emotion.label.toLowerCase()} with stress at ${anxietyScore}/10`
    });
  };

  const mainQuest = quests.find(q => q.id === "quest_1") || {
    id: "quest_1",
    title: "The Main Character Walk",
    description: "A 15-minute stroll around your block without checking incoming notifications. Listen to the wind, notice three interesting door handles, and simply breathe.",
    duration: "15 Minutes",
    completed: false
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-8 pb-16">
      {/* ================= GREETING & QUICK ACTIONS ================= */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span>Day {user.calmStreakDays || 6} of choosing calm (no pressure though!) ✨</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-primary tracking-tight font-medium">
            Hey, {user.name.split(" ")[0]}! Ready for a little less scrolling? 🌱
          </h1>

          <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-xl">
            Your virtual plant is thriving, your nervous system is recalibrating, and you're already doing enough just by being here.
          </p>
        </div>

        {/* Quick Micro-Action Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab("breathe")}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-primary text-base transition-transform group-hover:rotate-12">
              air
            </span>
            <span>Take a Breather (3m)</span>
          </button>

          <button
            onClick={() => setIsDoomscrollOpen(true)}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container text-xs sm:text-sm font-semibold hover:bg-secondary-fixed transition-all active:scale-95 shadow-xs"
            type="button"
          >
            <span className="text-xs">💀</span>
            <span>I'm Doomscrolling Again</span>
          </button>

          <button
            onClick={() => setActiveTab("hobbies")}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container text-on-primary-container text-xs sm:text-sm font-semibold transition-all hover:brightness-105 active:scale-95 shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-base">grass</span>
            <span>Touch Grass Quest</span>
          </button>
        </div>
      </section>

      {/* ================= CENTERPIECE: BOTANICAL HAVEN SPREAD ================= */}
      <section className="relative rounded-3xl bg-surface-container-lowest p-6 sm:p-10 shadow-xs border border-outline-variant/30 overflow-hidden">
        {/* Decorative washes */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-secondary-container/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Specimen Viewport */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-tertiary text-xs font-semibold mb-4">
              <span className="material-symbols-outlined text-sm">potted_plant</span>
              <span>Stage {plant.stage || 3} • {plant.stageTitle || "Flourishing Sapling"}</span>
            </div>

            {/* Specimen SVG */}
            <div className="relative flex flex-col items-center">
              <PlantSVG
                stage={plant.stage || 3}
                potStyle={plant.potStyle || "ceramic_ribbed"}
                flowerType={plant.flowerType || "rose_bud"}
                companion={plant.companion || "butterfly"}
                size="md"
              />
              <div className="absolute -bottom-1 bg-surface-container-high/95 backdrop-blur-xs px-3.5 py-1 rounded-full shadow-xs border border-outline-variant/30">
                <span className="font-serif text-sm font-semibold text-on-surface">{plant.name}</span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant mt-4">
              {plant.variety || "Monstera Deliciosa"} • Hydrated with pure intention
            </p>
          </div>

          {/* Right: Growth Dynamics & Controls */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-tertiary font-bold">Garden Milestone</span>
                <h2 className="font-serif text-2xl text-on-surface">Sprouting next leaf layer</h2>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold self-start sm:self-auto">
                <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  water_drop
                </span>
                <span>{user.waterDrops || 142} drops stored</span>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>Stage {plant.stage || 3} • {plant.stageTitle || "Flourishing Sapling"}</span>
                <span className="font-semibold text-primary">{plant.hydration || 78}% to Full Bloom 🌸</span>
              </div>
              <div className="h-3 w-full rounded-full bg-surface-container overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${plant.hydration || 78}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-on-surface-variant/75 pt-0.5">
                <span>Last watered: {plant.lastWatered || "2 hours ago"}</span>
                <span>Next bloom unlock: +{plant.dropsNeededForNextBloom || 28} drops</span>
              </div>
            </div>

            {/* Interactive Care Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={handleWaterClick}
                disabled={isWatering}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-sm ${
                  isWatering
                    ? "bg-tertiary text-on-tertiary scale-95"
                    : "bg-primary text-on-primary hover:bg-primary-container"
                }`}
              >
                <span className={`material-symbols-outlined text-base ${isWatering ? "animate-bounce" : ""}`}>
                  {isWatering ? "check_circle" : "water_drop"}
                </span>
                <span>{isWatering ? "Hydrated! (+10 XP) 💧" : "Water Your Plant (+10 XP)"}</span>
              </button>

              <button
                onClick={() => setCustomizeOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest text-xs sm:text-sm font-semibold transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-base text-tertiary">palette</span>
                <span>Customize Pot & Garden</span>
              </button>
            </div>

            {/* Daily Affirmation Scrapbook Note */}
            <div className="relative mt-2 p-4 rounded-2xl bg-surface-container-low shadow-xs border border-outline-variant/30">
              <div className="absolute -top-2.5 left-6 px-3 py-0.5 bg-secondary-container/90 text-on-secondary-container text-[11px] font-bold rounded shadow-xs scrapbook-tape">
                📌 Daily Affirmation
              </div>
              <div className="flex items-start gap-3 pt-1">
                <span className="material-symbols-outlined text-secondary text-xl mt-0.5">sentiment_satisfied</span>
                <div>
                  <p className="font-serif text-base sm:text-lg text-on-surface italic">
                    "{user.dailyAffirmation || "Today's tiny win: 10 mins offline. A little more you."}"
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Gentle pace is still forward momentum. No streaks were broken, only memories made.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BENTO GRID ================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Card A: Today's Tiny Wins */}
        <div className="lg:col-span-4 rounded-3xl bg-surface-container-lowest p-6 flex flex-col justify-between shadow-xs border border-outline-variant/30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-base">emoji_events</span>
                </span>
                <h3 className="font-serif text-lg text-on-surface font-semibold">Today's Tiny Wins</h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">
                Zero Guilt
              </span>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-xl">screen_lock_portrait</span>
                  <div>
                    <p className="text-xs sm:text-sm text-on-surface font-semibold">{user.offlineMinutesToday || 24} mins offline</p>
                    <p className="text-[11px] text-on-surface-variant">Intentional pocket pause</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">+12 💧</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-xl">task_alt</span>
                  <div>
                    <p className="text-xs sm:text-sm text-on-surface font-semibold">{user.questsCompletedToday || 2} Quests Checked</p>
                    <p className="text-[11px] text-on-surface-variant">Breathed & unspooled</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-secondary">+20 💧</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 space-y-2">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm text-tertiary">wb_twilight</span>
              <span className="text-xs italic">"Progress looks like showing up."</span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-container overflow-hidden">
              <div className="h-full rounded-full bg-tertiary-container" style={{ width: "65%" }} />
            </div>
          </div>
        </div>

        {/* Card B: Vibe Check & Horizontal Anxiety Gauge */}
        <div className="lg:col-span-8 rounded-3xl bg-surface-container-lowest p-6 flex flex-col justify-between shadow-xs border border-outline-variant/30">
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined text-base">favorite</span>
                  </span>
                  <h3 className="font-serif text-lg text-on-surface font-semibold">Vibe Check</h3>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  How are you really feeling right now, {user.name.split(" ")[0]}?
                </p>
              </div>
              <span className="text-[11px] text-on-surface-variant self-start sm:self-auto bg-surface-container px-3 py-1 rounded-full font-medium">
                Logged 45 mins ago
              </span>
            </div>

            {/* Emotion Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {emotions.map((em) => {
                const isActive = selectedEmotion === em.label;
                return (
                  <button
                    key={em.label}
                    onClick={() => handleLogEmotion(em)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-secondary-container text-on-secondary-container shadow-xs scale-102"
                        : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    <span className="text-xl">{em.emoji}</span>
                    <span className="truncate">{em.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Horizontal Tension Slider */}
            <div className="p-4 rounded-2xl bg-surface-container-low space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-primary">speed</span>
                  Internal Battery / Stress Level
                </span>
                <span className="text-primary font-bold">{moodMap[anxietyScore] || `${anxietyScore} / 10`}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={anxietyScore}
                onChange={(e) => setAnxietyScore(Number(e.target.value))}
                className="w-full h-2 rounded-full bg-surface-container-highest appearance-none cursor-pointer accent-primary focus:outline-none"
              />
              <div className="flex justify-between text-[11px] text-on-surface-variant">
                <span>1 Peaceful Rest</span>
                <span>5 Mild Buzz</span>
                <span>10 Overstimulated</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-on-surface-variant">
              Tip: Feeling a {anxietyScore} is completely normal. Take whatever space you need.
            </p>
            <button
              onClick={() => setActiveTab("vibe")}
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span>Log Journal Reflection</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Card C: Next Side Quest */}
        <div className="lg:col-span-7 rounded-3xl bg-surface-container-lowest p-6 flex flex-col justify-between shadow-xs border border-outline-variant/30 relative overflow-hidden">
          <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-9xl text-surface-container-high/40 pointer-events-none select-none">
            nature_people
          </span>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-base">explore</span>
                </span>
                <span className="text-xs uppercase tracking-wider text-tertiary font-bold">Your Next Side Quest</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-semibold">
                <span className="material-symbols-outlined text-xs">water_drop</span>
                +15 Water Drops
              </span>
            </div>

            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-on-surface">{mainQuest.title}</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-lg leading-relaxed">
                {mainQuest.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant">
                ⏱️ 15 Minutes
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant">
                👟 Beginner Friendly
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant">
                🍃 Nature & Outdoors
              </span>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 pt-6">
            <button
              onClick={() => completeQuest(mainQuest.id)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-semibold hover:bg-primary-container transition-all active:scale-95 shadow-xs"
            >
              <span>{mainQuest.completed ? "Completed! ✓" : "Accept Side Quest"}</span>
              <span className="material-symbols-outlined text-base">spa</span>
            </button>
            <button
              onClick={() => setActiveTab("hobbies")}
              className="px-4 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs sm:text-sm font-medium transition-colors"
            >
              Explore All Quests 🎲
            </button>
          </div>
        </div>

        {/* Card D: Plot Twist of the Day */}
        <div className="lg:col-span-5 rounded-3xl bg-surface-container-lowest p-6 flex flex-col justify-between shadow-xs border border-outline-variant/30">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-base">wb_sunny</span>
                </span>
                <span className="text-xs uppercase tracking-wider text-primary font-bold">Plot Twist of the Day</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
                The World Is Healing 🌊
              </span>
            </div>

            <h4 className="font-serif text-lg text-on-surface leading-snug">
              Scientists discover coral reef regenerating twice as fast off the coast of Belize
            </h4>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Marine biologists credit grassroots ocean protection corridors and natural micro-current cooling. Nature proves resilient when given room to breathe.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-primary">verified</span>
              Source: Nature Eco 2024
            </span>
            <button
              onClick={() => setActiveTab("plottwist")}
              className="text-secondary font-bold hover:underline flex items-center gap-1"
            >
              <span>Read Full Feed</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= CUSTOMIZE MODAL ================= */}
      {/* Complete Botanical Customizer Studio Modal */}
      <PlantCustomizerModal
        isOpen={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
      />
    </div>
  );
};
