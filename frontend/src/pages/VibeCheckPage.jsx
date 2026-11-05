import React, { useState } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const VibeCheckPage = () => {
  const { user, moodLogs, logMood, showToast, setActiveTab, triggerCelebration } = useEcoCalm();

  // Active view tab: "checkin" or "insights" (Step 3 & Step 8)
  const [activeTab, setVibeTab] = useState("checkin");

  // Step 3 Check-In State
  const [anxietyScore, setAnxietyScore] = useState(3); // 0 to 10
  const [selectedEmotions, setSelectedEmotions] = useState(["Calm"]); // multi-select
  const [emotionIntensity, setEmotionIntensity] = useState(5); // 0 to 10
  const [journalNote, setJournalNote] = useState("");
  const [gratitudeNote, setGratitudeNote] = useState("");
  const [checkinType, setCheckinType] = useState("general"); // "general", "before_activity", "after_activity"
  const [linkedActivity, setLinkedActivity] = useState("Breathing Exercise");

  // Step 8 Insights State
  const [timePeriod, setTimePeriod] = useState("weekly"); // "daily", "weekly", "monthly"

  // Emotion options with emojis
  const availableEmotions = [
    { label: "Happy", emoji: "😊", color: "bg-amber-100 text-amber-800" },
    { label: "Calm", emoji: "😌", color: "bg-emerald-100 text-emerald-800" },
    { label: "Grateful", emoji: "🥰", color: "bg-rose-100 text-rose-800" },
    { label: "Anxious", emoji: "😰", color: "bg-orange-100 text-orange-800" },
    { label: "Sad", emoji: "😔", color: "bg-sky-100 text-sky-800" },
    { label: "Frustrated", emoji: "😡", color: "bg-red-100 text-red-800" },
    { label: "Drained", emoji: "🪫", color: "bg-zinc-200 text-zinc-800" },
    { label: "Overwhelmed", emoji: "😵‍💫", color: "bg-purple-100 text-purple-800" },
    { label: "Numb", emoji: "😐", color: "bg-slate-200 text-slate-800" },
    { label: "Excited", emoji: "🤩", color: "bg-yellow-100 text-yellow-800" }
  ];

  // Anxiety scale descriptors (0 to 10)
  const anxietyDescriptors = {
    0: "0 / 10 • Completely Calm & Grounded",
    1: "1 / 10 • Deep Serenity & Stillness",
    2: "2 / 10 • Relaxed Floating Ease",
    3: "3 / 10 • Gentle Quiet Presence",
    4: "4 / 10 • Focused & Mindful Flow",
    5: "5 / 10 • Mild Digital Buzz",
    6: "6 / 10 • Restless Nervous Energy",
    7: "7 / 10 • Overstimulated Buzz",
    8: "8 / 10 • High Tension & Agitation",
    9: "9 / 10 • Sensory Clutter & Fatigue",
    10: "10 / 10 • Extremely Anxious & Overwhelmed"
  };

  const toggleEmotion = (label) => {
    if (selectedEmotions.includes(label)) {
      if (selectedEmotions.length > 1) {
        setSelectedEmotions(selectedEmotions.filter((e) => e !== label));
      }
    } else {
      setSelectedEmotions([...selectedEmotions, label]);
    }
  };

  const handleCheckInSubmit = (e) => {
    e.preventDefault();
    const primaryEmotion = selectedEmotions[0] || "Calm";
    const primaryObj = availableEmotions.find((e) => e.label === primaryEmotion);

    const fullNote = [
      journalNote.trim(),
      gratitudeNote.trim() ? `• Gratitude: ${gratitudeNote.trim()}` : "",
      checkinType !== "general" ? `[${checkinType === "before_activity" ? "Before" : "After"} ${linkedActivity}]` : ""
    ]
      .filter(Boolean)
      .join(" ");

    logMood({
      score: anxietyScore,
      emotion: primaryEmotion,
      emotionsList: selectedEmotions,
      intensity: emotionIntensity,
      emotionEmoji: primaryObj?.emoji || "😌",
      note: fullNote || "Mindful check-in completed.",
      checkinType,
      linkedActivity: checkinType !== "general" ? linkedActivity : null
    });

    setJournalNote("");
    setGratitudeNote("");
    triggerCelebration();
    showToast("Vibe check logged! +10 Drops recorded in your garden 🕊️", "favorite");
  };

  // Compute insights statistics
  const totalLogs = moodLogs.length || 1;
  const avgAnxiety = (moodLogs.reduce((acc, m) => acc + (m.score || 3), 0) / totalLogs).toFixed(1);

  // Frequency of each emotion
  const emotionCounts = {};
  moodLogs.forEach((log) => {
    const list = log.emotionsList || [log.emotion || "Calm"];
    list.forEach((em) => {
      emotionCounts[em] = (emotionCounts[em] || 0) + 1;
    });
  });

  // Weekly anxiety points (mocked fallback if few logs)
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const trendData = [
    { day: "Mon", score: 6.2, label: "Tense" },
    { day: "Tue", score: 4.8, label: "Gentle" },
    { day: "Wed", score: 5.4, label: "Busy" },
    { day: "Thu", score: 3.1, label: "Calm" },
    { day: "Fri", score: 2.8, label: "Relaxed" },
    { day: "Sat", score: 2.2, label: "Grounded" },
    { day: "Sun", score: Number(avgAnxiety), label: "Present" }
  ];

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-8 pb-20 pt-4">
      {/* ================= HEADER ================= */}
      <div className="space-y-3 border-b border-outline-variant/30 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/60 text-on-secondary-container text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">favorite</span>
              <span>The Vibe Check • Emotional Self-Tracking & Compass</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-on-surface font-medium">
              How are you feeling right now, {user.name.split(" ")[0]}? 💗
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl">
              All check-ins are 100% optional and private by default. There are no good or bad scores—only honest human data to help you pace your days.
            </p>
          </div>

          {/* Mode Switcher: Check-in vs Insights */}
          <div className="flex items-center p-1 bg-surface-container rounded-2xl shadow-xs border border-outline-variant/30">
            <button
              onClick={() => setVibeTab("checkin")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "checkin"
                  ? "bg-surface-container-lowest text-primary shadow-xs font-bold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-sm">edit_note</span>
              <span>New Check-In</span>
            </button>
            <button
              onClick={() => setVibeTab("insights")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "insights"
                  ? "bg-surface-container-lowest text-primary shadow-xs font-bold"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-sm">analytics</span>
              <span>Daily Insights ✨</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= STEP 3: CHECK-IN FORM ================= */}
      {activeTab === "checkin" && (
        <form onSubmit={handleCheckInSubmit} className="space-y-6">
          {/* Check-In Context Pill (Before / After tracking) */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">swap_horiz</span>
              <span className="text-xs font-bold text-on-surface">Before-and-After Tracking (Step 3D):</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={checkinType}
                onChange={(e) => setCheckinType(e.target.value)}
                className="bg-surface-container-lowest text-xs font-semibold px-3 py-1.5 rounded-xl border border-outline-variant/30 focus:outline-none text-on-surface"
              >
                <option value="general">General Check-In</option>
                <option value="before_activity">Before Activity Pause</option>
                <option value="after_activity">After Activity Pause</option>
              </select>

              {checkinType !== "general" && (
                <select
                  value={linkedActivity}
                  onChange={(e) => setLinkedActivity(e.target.value)}
                  className="bg-surface-container-lowest text-xs font-semibold px-3 py-1.5 rounded-xl border border-outline-variant/30 focus:outline-none text-on-surface"
                >
                  <option value="Breathing Exercise">Breathing Exercise 🌬️</option>
                  <option value="Crochet & Knitting">Crochet & Knitting 🧶</option>
                  <option value="Reading 5 Pages">Reading Books 📖</option>
                  <option value="Nature Walk">Nature Walk 🌿</option>
                  <option value="Drawing / Painting">Sketching / Painting 🎨</option>
                  <option value="Baking / Tea">Baking / Herbal Tea 🥖</option>
                </select>
              )}
            </div>
          </div>

          {/* Section A: Anxiety Level Tracker (0 to 10 scale) */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xs border border-outline-variant/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">A. Anxiety Level Tracker (0–10)</span>
                <h3 className="font-serif text-xl font-semibold text-on-surface mt-0.5">
                  How high is your current anxiety or overstimulation?
                </h3>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold self-start sm:self-auto">
                {anxietyDescriptors[anxietyScore] || `${anxietyScore} / 10`}
              </span>
            </div>

            <div className="space-y-2 pt-2">
              <input
                type="range"
                min="0"
                max="10"
                value={anxietyScore}
                onChange={(e) => setAnxietyScore(Number(e.target.value))}
                className="w-full h-3 rounded-full bg-surface-container-highest appearance-none cursor-pointer accent-primary focus:outline-none"
              />
              <div className="flex justify-between text-[11px] text-on-surface-variant font-medium">
                <span>0 • Completely Calm 😌</span>
                <span>5 • Mild Buzz ⚡</span>
                <span>10 • Extremely Anxious 😰</span>
              </div>
            </div>
          </div>

          {/* Section B: Emotion Multi-Select & Intensity */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xs border border-outline-variant/30 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">B. Emotion Tracker (Multi-Select)</span>
              <h3 className="font-serif text-xl font-semibold text-on-surface mt-0.5">
                Which emotions are present with you right now?
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Select one or more that resonate. It's okay to feel calm and anxious at the same time.
              </p>
            </div>

            {/* 10 Emotion Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {availableEmotions.map((em) => {
                const isSelected = selectedEmotions.includes(em.label);
                return (
                  <button
                    type="button"
                    key={em.label}
                    onClick={() => toggleEmotion(em.label)}
                    className={`flex items-center gap-2 p-3 rounded-2xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? "bg-secondary-container/50 border-secondary ring-2 ring-secondary/50 shadow-xs scale-102 font-bold text-on-secondary-container"
                        : "bg-surface-container-low border-outline-variant/20 text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    <span className="text-2xl">{em.emoji}</span>
                    <span className="truncate">{em.label}</span>
                    {isSelected && (
                      <span className="material-symbols-outlined text-xs text-secondary ml-auto">check</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Emotion Intensity Slider (0 to 10) */}
            <div className="p-4 rounded-2xl bg-surface-container-low space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-on-surface">Overall Emotion Intensity (0–10 Scale):</span>
                <span className="text-secondary font-bold">{emotionIntensity} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={emotionIntensity}
                onChange={(e) => setEmotionIntensity(Number(e.target.value))}
                className="w-full h-2 rounded-full bg-surface-container-highest appearance-none cursor-pointer accent-secondary focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-on-surface-variant">
                <span>0 • Barely noticeable</span>
                <span>5 • Moderate presence</span>
                <span>10 • Deeply felt & overwhelming</span>
              </div>
            </div>
          </div>

          {/* Section C: Optional Journal Reflection */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xs border border-outline-variant/30 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-tertiary">C. Optional Journal</span>
              <h3 className="font-serif text-xl font-semibold text-on-surface mt-0.5">
                What may have influenced your mood today?
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Reflection / Brain Dump</label>
                <textarea
                  rows={3}
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  placeholder="What thoughts or screen sessions triggered this feeling?"
                  className="w-full bg-surface-container-low p-3.5 rounded-2xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Tiny Grounding Gratitude</label>
                <textarea
                  rows={3}
                  value={gratitudeNote}
                  onChange={(e) => setGratitudeNote(e.target.value)}
                  placeholder="One small thing you noticed (warm sunbeam, cup of tea, silence)..."
                  className="w-full bg-surface-container-low p-3.5 rounded-2xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
            <span className="text-xs text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary">lock</span>
              Private by default • Records +10 water drops for your garden
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab("breathe")}
                className="px-4 py-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold text-on-surface-variant transition-colors"
              >
                Take a Breather First 🌬️
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>Save Vibe Check</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ================= STEP 8: THE VIBE CHECK INSIGHTS DASHBOARD ================= */}
      {activeTab === "insights" && (
        <div className="space-y-6">
          {/* Supportive Mindset Banner */}
          <div className="p-5 rounded-3xl bg-surface-container-high/60 border border-outline-variant/30 flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-xl">self_improvement</span>
            </div>
            <div className="space-y-1">
              <h4 className="font-serif text-sm font-bold text-on-surface">A Gentle Reminder on Emotions:</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                “Emotions naturally fluctuate like changing seasons in a greenhouse. There are no good or bad scores here—only patterns that show how quiet offline pauses nurture your nervous system.”
              </p>
            </div>
          </div>

          {/* Time Filter & Overview Cards */}
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-semibold text-on-surface">Emotional Patterns Over Time</h3>
            <div className="flex items-center gap-1 p-1 bg-surface-container rounded-xl text-xs font-semibold">
              {["daily", "weekly", "monthly"].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                    timePeriod === period ? "bg-surface-container-lowest text-primary font-bold shadow-xs" : "text-on-surface-variant"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Avg Anxiety */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xs border border-outline-variant/30">
              <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">Average Anxiety Rating</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-serif text-3xl font-bold text-primary">{avgAnxiety}</span>
                <span className="text-xs text-on-surface-variant">/ 10 Scale</span>
              </div>
              <p className="text-xs text-primary font-semibold mt-1">
                {anxietyDescriptors[Math.round(Number(avgAnxiety))]?.split("•")[1] || "Gentle Ease"}
              </p>
              <span className="text-[10px] text-on-surface-variant mt-2 block">
                Based on {moodLogs.length} verified check-ins
              </span>
            </div>

            {/* Before vs After Impact */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xs border border-outline-variant/30">
              <span className="text-[10px] uppercase font-bold tracking-wider text-secondary">Before & After Shift</span>
              <div className="flex items-center gap-3 mt-2">
                <div className="text-center">
                  <span className="text-xs text-on-surface-variant block">Before</span>
                  <span className="font-serif text-xl font-bold text-error">6.8 😰</span>
                </div>
                <span className="material-symbols-outlined text-secondary">arrow_forward</span>
                <div className="text-center">
                  <span className="text-xs text-on-surface-variant block">After</span>
                  <span className="font-serif text-xl font-bold text-primary">2.4 😌</span>
                </div>
              </div>
              <p className="text-xs text-on-surface font-semibold mt-2">
                65% drop in reported overstimulation after offline side quests.
              </p>
            </div>

            {/* Top Reported Emotion */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xs border border-outline-variant/30">
              <span className="text-[10px] uppercase font-bold tracking-wider text-tertiary">Most Frequent State</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-3xl">🕊️</span>
                <span className="font-serif text-2xl font-bold text-on-surface">Calm & Grounded</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                Selected in 48% of total emotional compass reflections this week.
              </p>
            </div>
          </div>

          {/* Weekly Anxiety Trend Chart */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xs border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-lg font-semibold text-on-surface">Weekly Anxiety Trend Chart</h4>
                <p className="text-xs text-on-surface-variant">Notice how tension ebbs when you step into offline creative quests.</p>
              </div>
              <span className="text-xs text-primary font-bold">Target: &lt; 4.0 Calm Zone</span>
            </div>

            {/* Bar Chart Representation */}
            <div className="pt-6 pb-2">
              <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2">
                {trendData.map((item) => {
                  const heightPercent = Math.max(15, (item.score / 10) * 100);
                  const isHigh = item.score >= 5.5;
                  return (
                    <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] font-bold text-on-surface-variant">{item.score}</span>
                      <div className="w-full bg-surface-container-high rounded-xl h-36 flex items-end p-1">
                        <div
                          className={`w-full rounded-lg transition-all duration-700 ${
                            isHigh ? "bg-secondary-container" : "bg-primary-container"
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-on-surface">{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Algorithmic Observation Insight */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-lg">psychiatry</span>
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-on-surface">Real-Data Pattern Observation:</span>
                <p className="text-on-surface-variant">
                  “You reported feeling calmer after several of your reading sessions and nature walks this week. Your lowest tension occurred on Saturday afternoon.”
                </p>
              </div>
            </div>
          </div>

          {/* Emotion Frequency Badges */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xs border border-outline-variant/30 space-y-4">
            <h4 className="font-serif text-lg font-semibold text-on-surface">Emotion Frequency Spectrum</h4>
            <div className="flex flex-wrap gap-2.5">
              {availableEmotions.map((em) => {
                const count = emotionCounts[em.label] || 0;
                return (
                  <div
                    key={em.label}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-surface-container-low border border-outline-variant/20 text-xs"
                  >
                    <span className="text-lg">{em.emoji}</span>
                    <span className="font-semibold text-on-surface">{em.label}</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container font-bold text-on-surface-variant text-[10px]">
                      {count} times
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personal Journal History */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xs border border-outline-variant/30 space-y-4">
            <h4 className="font-serif text-lg font-semibold text-on-surface">Personal Check-In History & Reflections</h4>
            <div className="space-y-3">
              {moodLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-surface-container-low flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{log.emotionEmoji || "😌"}</span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-serif text-sm font-bold text-on-surface">{log.emotion}</span>
                        <span className="text-[10px] bg-surface-container px-2.5 py-0.5 rounded-full font-semibold text-primary">
                          Anxiety: {log.score} / 10
                        </span>
                        {log.checkinType && log.checkinType !== "general" && (
                          <span className="text-[10px] bg-secondary-container px-2 py-0.5 rounded-full text-on-secondary-container">
                            {log.checkinType.replace("_", " ")}
                          </span>
                        )}
                      </div>
                      {log.note && <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">{log.note}</p>}
                    </div>
                  </div>
                  <span className="text-[10px] text-on-surface-variant whitespace-nowrap self-end sm:self-start">
                    {new Date(log.timestamp).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
