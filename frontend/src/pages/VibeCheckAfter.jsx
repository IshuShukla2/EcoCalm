import React, { useState } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const VibeCheckAfter = () => {
  const { logMood, vibeBefore, vibeAfter, setActiveTab, openHelpline, showToast, triggerCelebration } = useEcoCalm();

  const [selectedEmotion, setSelectedEmotion] = useState(vibeAfter?.emotion || "Peaceful");
  const [stressScore, setStressScore] = useState(vibeAfter?.score !== undefined ? vibeAfter.score : 2);
  const [shortNote, setShortNote] = useState(vibeAfter?.note || "");
  const [isSaved, setIsSaved] = useState(Boolean(vibeAfter));

  // Same 8 emotions as initial Vibe Check
  const emotionOptions = [
    { label: "Peaceful", emoji: "😌", color: "bg-emerald-100 text-emerald-800" },
    { label: "Content", emoji: "😊", color: "bg-amber-100 text-amber-800" },
    { label: "Grateful", emoji: "🥰", color: "bg-rose-100 text-rose-800" },
    { label: "Neutral", emoji: "😐", color: "bg-slate-100 text-slate-800" },
    { label: "Tired", emoji: "🪫", color: "bg-zinc-200 text-zinc-800" },
    { label: "Anxious", emoji: "😰", color: "bg-orange-100 text-orange-800" },
    { label: "Stressed", emoji: "😵‍💫", color: "bg-purple-100 text-purple-800" },
    { label: "Sad", emoji: "😔", color: "bg-sky-100 text-sky-800" }
  ];

  const getStressLabel = (score) => {
    if (score <= 2) return "Low • Grounded and at ease";
    if (score <= 5) return "Mild • Gentle lingering buzz";
    if (score <= 7) return "Moderate • Noticeable restlessness";
    return "High • Overwhelmed or heavily burdened";
  };

  const handleSave = (e) => {
    e.preventDefault();
    const emotionObj = emotionOptions.find((e) => e.label === selectedEmotion) || emotionOptions[0];

    logMood({
      score: stressScore,
      emotion: selectedEmotion,
      emotionsList: [selectedEmotion],
      intensity: stressScore,
      emotionEmoji: emotionObj.emoji,
      note: shortNote.trim() || "Post-wellness journey reflection.",
      checkinType: "after",
      linkedActivity: "Post-Wellness Comparison"
    });

    setIsSaved(true);
    triggerCelebration();
    showToast("Completed daily wellness cycle! +10 Drops awarded 🕊️", "emoji_events");
  };

  // Compare Before & After
  const beforeScore = vibeBefore?.score !== undefined ? vibeBefore.score : null;
  const afterScore = stressScore;
  const scoreDiff = beforeScore !== null ? beforeScore - afterScore : null;

  const renderComparisonFeedback = () => {
    if (scoreDiff === null) {
      return (
        <p className="text-xs text-on-surface-variant">
          Complete your initial Vibe Check next time to see your full before-and-after shift.
        </p>
      );
    }

    if (scoreDiff > 0) {
      return (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs sm:text-sm space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-emerald-800">
            <span className="material-symbols-outlined text-base">trending_down</span>
            <span>Stress reduced by {scoreDiff} points! 🌱</span>
          </div>
          <p className="leading-relaxed">
            Your mindful pause allowed your nervous system to soften. Celebrate this tiny victory for your well-being.
          </p>
        </div>
      );
    }

    if (scoreDiff === 0) {
      return (
        <div className="p-4 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200 text-xs sm:text-sm space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-blue-800">
            <span className="material-symbols-outlined text-base">horizontal_rule</span>
            <span>Consistent baseline maintained 🌿</span>
          </div>
          <p className="leading-relaxed">
            Your emotional state remained steady. Showing up with awareness and self-compassion is already a great accomplishment.
          </p>
        </div>
      );
    }

    return (
      <div className="p-4 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 text-xs sm:text-sm space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-amber-800">
          <span className="material-symbols-outlined text-base">info</span>
          <span>Higher tension noted — and that is completely valid 💛</span>
        </div>
        <p className="leading-relaxed">
          Wellness is not linear. Some days bring up difficult thoughts when we slow down. You are safe, you are human, and reaching out is always here if you need support.
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-6 pb-20 pt-2 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-1">
            <span className="material-symbols-outlined text-sm">ecg_heart</span>
            <span>Step 6 of 6 • Post-Wellness Vibe Check</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold tracking-tight">
            How are you feeling now?
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl">
            Reflect on how your breathing, news break, and creative pause influenced your headspace.
          </p>
        </div>

        {isSaved && (
          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>Journey Complete</span>
          </span>
        )}
      </div>

      {/* Main Check-In Form */}
      <form onSubmit={handleSave} className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-xs space-y-6">
        {/* Mood Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
            1. How Are You Feeling Right Now?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {emotionOptions.map((item) => {
              const isSelected = selectedEmotion === item.label;
              return (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => {
                    setSelectedEmotion(item.label);
                    setIsSaved(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${isSelected
                      ? "bg-primary-container text-on-primary-container border-primary shadow-xs ring-2 ring-primary/40 font-bold scale-[1.02]"
                      : "bg-surface-container-low border-outline-variant/30 hover:bg-surface-container text-on-surface"
                    }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Anxiety & Stress Level */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label htmlFor="post-stress-slider" className="text-xs font-bold text-on-surface uppercase tracking-wider">
              2. Current Anxiety & Stress Level
            </label>
            <span className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary-fixed/40">
              {stressScore} / 10
            </span>
          </div>

          <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20 space-y-3">
            <input
              id="post-stress-slider"
              type="range"
              min="0"
              max="10"
              value={stressScore}
              onChange={(e) => {
                setStressScore(Number(e.target.value));
                setIsSaved(false);
              }}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-on-surface-variant font-medium">
              <span>0 (Peaceful Stillness)</span>
              <span>5 (Mild Buzz)</span>
              <span>10 (Overwhelmed)</span>
            </div>
            <p className="text-xs text-primary font-semibold text-center pt-1">
              {getStressLabel(stressScore)}
            </p>
          </div>
        </div>

        {/* Reflection Note */}
        <div className="space-y-1.5 pt-2">
          <label htmlFor="post-reflection-input" className="text-xs font-bold text-on-surface uppercase tracking-wider block">
            3. Final Reflection Note (Optional)
          </label>
          <input
            id="post-reflection-input"
            type="text"
            value={shortNote}
            onChange={(e) => {
              setShortNote(e.target.value);
              setIsSaved(false);
            }}
            placeholder="e.g. My chest feels much lighter after breathing..."
            className="w-full bg-surface-container-low px-4 py-3 rounded-xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-on-surface-variant">
            {isSaved ? "Saved separately to your profile 🕒" : "Tap save to compare your shift."}
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-2 active:scale-95"
          >
            <span>{isSaved ? "Update Final Check-In" : "Save & Compare (+10 Drops)"}</span>
            <span className="material-symbols-outlined text-sm">check</span>
          </button>
        </div>
      </form>

      {/* ================= BEFORE VS AFTER COMPARISON CARD ================= */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">insights</span>
            <span>Your Wellness Journey Comparison</span>
          </h2>
          <span className="text-xs text-on-surface-variant font-mono">Today’s Session</span>
        </div>

        {/* 2-Column Before vs After Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Before */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">
              Initial Baseline (Before)
            </span>
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {emotionOptions.find((e) => e.label === vibeBefore?.emotion)?.emoji || "😌"}
              </span>
              <div>
                <h3 className="text-sm font-bold text-on-surface">
                  {vibeBefore?.emotion || "Not recorded yet"}
                </h3>
                <p className="text-xs text-primary font-semibold">
                  Stress Score: {vibeBefore?.score !== undefined ? `${vibeBefore.score} / 10` : "—"}
                </p>
              </div>
            </div>
            {vibeBefore?.note && (
              <p className="text-[11px] text-on-surface-variant italic border-t border-outline-variant/20 pt-1.5 mt-1">
                “{vibeBefore.note}”
              </p>
            )}
          </div>

          {/* After */}
          <div className="p-4 rounded-2xl bg-primary-container/30 border border-primary/30 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
              Current Headspace (After)
            </span>
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {emotionOptions.find((e) => e.label === selectedEmotion)?.emoji || "😌"}
              </span>
              <div>
                <h3 className="text-sm font-bold text-on-surface">{selectedEmotion}</h3>
                <p className="text-xs text-primary font-semibold">Stress Score: {stressScore} / 10</p>
              </div>
            </div>
            {shortNote && (
              <p className="text-[11px] text-on-surface-variant italic border-t border-outline-variant/20 pt-1.5 mt-1">
                “{shortNote}”
              </p>
            )}
          </div>
        </div>

        {/* Comparison Feedback Message */}
        {renderComparisonFeedback()}
      </div>

      {/* Final Destination Actions: Helpline Support & Plant Care */}
      <div className="p-5 rounded-2xl bg-[#eaf3eb] border border-[#cbe1ce] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3b6637] flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-xl">support_agent</span>
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-[#1f3a1c]">
              24/7 Verified Support & Helplines Always Open
            </h3>
            <p className="text-xs text-[#3b6637]">
              Step 7: Reaching out is strength. Access tele-counseling whenever you need a listening ear.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
          <button
            onClick={openHelpline}
            className="px-4 py-2.5 rounded-full bg-[#2d552a] text-white text-xs font-bold shadow-xs hover:bg-[#1f3a1c] transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">call</span>
            <span>Helplines Directory</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("plant");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-4 py-2.5 rounded-full bg-white text-[#2d552a] text-xs font-bold border border-[#cbe1ce] hover:bg-surface-container transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">local_florist</span>
            <span>Return to Plant</span>
          </button>
        </div>
      </div>
    </div>
  );
};
