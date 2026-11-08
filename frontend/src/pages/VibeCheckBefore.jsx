import React, { useState } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const VibeCheckBefore = () => {
  const { logMood, vibeBefore, setActiveTab, showToast, triggerCelebration } = useEcoCalm();

  const [selectedEmotion, setSelectedEmotion] = useState(vibeBefore?.emotion || "Calm");
  const [stressScore, setStressScore] = useState(vibeBefore?.score !== undefined ? vibeBefore.score : 3);
  const [shortNote, setShortNote] = useState(vibeBefore?.note || "");
  const [isSaved, setIsSaved] = useState(Boolean(vibeBefore));

  // 8 Clear, non-intimidating emotions
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

  // Stress scale descriptors
  const getStressLabel = (score) => {
    if (score <= 2) return "Low • Feeling grounded and at ease";
    if (score <= 5) return "Mild • Slight digital buzz or tension";
    if (score <= 7) return "Moderate • Noticeable restlessness or worry";
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
      note: shortNote.trim() || "Baseline emotional check-in.",
      checkinType: "before",
      linkedActivity: "Pre-Wellness Baseline"
    });

    setIsSaved(true);
    triggerCelebration();
    showToast("Baseline mood recorded! Your plant feels your presence 🌱", "favorite");
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-6 pb-20 pt-2 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-1">
            <span className="material-symbols-outlined text-sm">favorite_border</span>
            <span>Step 2 of 6 • Initial Vibe Check</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold tracking-tight">
            How are you feeling right now?
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl">
            Take a gentle breath and acknowledge your starting point. No judgment, just honest awareness.
          </p>
        </div>

        {isSaved && (
          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>Baseline Recorded</span>
          </span>
        )}
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSave} className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-xs space-y-6">
        {/* 1. Mood Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
            1. Select Your Primary Feeling
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
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    isSelected
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

        {/* 2. Short Anxiety / Stress Assessment */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label htmlFor="stress-slider" className="text-xs font-bold text-on-surface uppercase tracking-wider">
              2. Anxiety & Stress Level
            </label>
            <span className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary-fixed/40">
              {stressScore} / 10
            </span>
          </div>

          <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20 space-y-3">
            <input
              id="stress-slider"
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

        {/* 3. Optional 1-sentence note */}
        <div className="space-y-1.5 pt-2">
          <label htmlFor="intention-note-input" className="text-xs font-bold text-on-surface uppercase tracking-wider block">
            3. A Gentle Thought or Intention (Optional)
          </label>
          <input
            id="intention-note-input"
            type="text"
            value={shortNote}
            onChange={(e) => {
              setShortNote(e.target.value);
              setIsSaved(false);
            }}
            placeholder="e.g. Taking 5 minutes for myself today..."
            className="w-full bg-surface-container-low px-4 py-3 rounded-xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-on-surface-variant">
            {isSaved ? "Saved with date and time 🕒" : "Tap save to record your baseline."}
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-2 active:scale-95"
          >
            <span>{isSaved ? "Update Baseline" : "Save Baseline (+10 Drops)"}</span>
            <span className="material-symbols-outlined text-sm">check</span>
          </button>
        </div>
      </form>

      {/* Seamless Journey Next Step Card */}
      <div className="p-5 rounded-2xl bg-secondary-container/40 border border-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined text-xl">air</span>
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-on-surface">
              Next in your journey: Mindful Breathing
            </h3>
            <p className="text-xs text-on-surface-variant">
              Step 3: A visual guided breathing exercise to ground your nervous system.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveTab("breathe");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 self-end sm:self-auto shrink-0 active:scale-95"
        >
          <span>Continue to Guided Breathing</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

