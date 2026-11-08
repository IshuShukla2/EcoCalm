import React, { useState, useEffect } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const BreatheSection = () => {
  const {
    completeBreathing,
    setActiveTab,
    isAudioPlaying,
    currentSound,
    toggleSoundscape,
    showToast
  } = useEcoCalm();

  // 3 Clear rhythms
  const cadences = {
    box: {
      name: "Box Breathing",
      desc: "4s Inhale · 4s Hold · 4s Exhale · 4s Rest",
      steps: [
        { phase: "Inhale", duration: 4, hint: "Gently expand your chest and belly" },
        { phase: "Hold", duration: 4, hint: "Soft stillness in the body" },
        { phase: "Exhale", duration: 4, hint: "Slowly release all tension through mouth" },
        { phase: "Hold", duration: 4, hint: "Quiet rest before the next wave" }
      ]
    },
    relax: {
      name: "4-7-8 Deep Calm",
      desc: "4s Inhale · 7s Hold · 8s Sigh Out",
      steps: [
        { phase: "Inhale", duration: 4, hint: "Inhale softly through the nose" },
        { phase: "Hold", duration: 7, hint: "Gently hold, letting your pulse slow" },
        { phase: "Exhale", duration: 8, hint: "Long calming whoosh out" }
      ]
    },
    coherent: {
      name: "Coherent Flow",
      desc: "5s Inhale · 5s Exhale",
      steps: [
        { phase: "Inhale", duration: 5, hint: "Continuous smooth wave in" },
        { phase: "Exhale", duration: 5, hint: "Continuous smooth wave out" }
      ]
    }
  };

  const [activeCadenceKey, setActiveCadenceKey] = useState("box");
  const [isRunning, setIsRunning] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);

  const currentCadence = cadences[activeCadenceKey];
  const currentStep = currentCadence.steps[stepIdx] || currentCadence.steps[0];

  // Timer loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          const nextIdx = (stepIdx + 1) % currentCadence.steps.length;
          setStepIdx(nextIdx);
          return currentCadence.steps[nextIdx].duration;
        }
        return prev - 1;
      });

      setSessionSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, stepIdx, activeCadenceKey, currentCadence.steps]);

  const handleStart = () => {
    setIsRunning(true);
    showToast("Guided breathing started. Follow the circle 🌿", "air");
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setStepIdx(0);
    setSecondsLeft(currentCadence.steps[0].duration);
    setSessionSeconds(0);
    showToast("Session reset", "restart_alt");
  };

  const handleCompleteSession = async () => {
    setIsRunning(false);
    const minutes = Math.max(1, Math.round(sessionSeconds / 60));
    await completeBreathing(minutes, activeCadenceKey);
    setCompletedSessionsCount((c) => c + 1);
  };

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Compute visual circle scale based on phase
  const getScaleClass = () => {
    if (!isRunning) return "scale-100";
    if (currentStep.phase === "Inhale") return "scale-125 duration-[4000ms]";
    if (currentStep.phase === "Hold") return "scale-125 duration-1000";
    if (currentStep.phase === "Exhale") return "scale-90 duration-[4000ms]";
    return "scale-90 duration-1000";
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-6 pb-20 pt-2 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-1">
            <span className="material-symbols-outlined text-sm">air</span>
            <span>Step 3 of 6 • Guided Breathing</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold tracking-tight">
            Distraction-Free Breathing
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl">
            Match your breath to the expanding and contracting guide. Let your shoulders soften.
          </p>
        </div>

        {/* Ambient Soundscape Toggle */}
        <button
          onClick={() => toggleSoundscape(currentSound)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all self-start sm:self-auto ${isAudioPlaying
              ? "bg-primary-container text-on-primary-container border-primary shadow-xs"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high border-outline-variant/30"
            }`}
        >
          <span className="material-symbols-outlined text-sm">
            {isAudioPlaying ? "volume_up" : "volume_off"}
          </span>
          <span>{isAudioPlaying ? "Rain Ambient On" : "Play Gentle Rain"}</span>
        </button>
      </div>

      {/* Cadence Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {Object.entries(cadences).map(([key, item]) => {
          const isSelected = activeCadenceKey === key;
          return (
            <button
              key={key}
              onClick={() => {
                setActiveCadenceKey(key);
                setStepIdx(0);
                setSecondsLeft(item.steps[0].duration);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all ${isSelected
                  ? "bg-primary-container text-on-primary-container border-primary font-bold shadow-xs"
                  : "bg-surface-container-low border-outline-variant/30 hover:bg-surface-container text-on-surface"
                }`}
            >
              <div className="text-xs font-bold">{item.name}</div>
              <div className="text-[11px] text-on-surface-variant/80 mt-0.5">{item.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Main Breathing Visualizer Canvas */}
      <div className="bg-surface-container-lowest rounded-3xl p-8 sm:p-12 border border-outline-variant/30 shadow-xs flex flex-col items-center justify-center text-center relative min-h-[380px] overflow-hidden">
        {/* Soft background aura */}
        <div className="absolute w-72 h-72 rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none" />

        {/* Dynamic Expanding/Contracting Circle */}
        <div className="relative flex items-center justify-center my-6">
          {/* Outer gentle ripple ring */}
          <div
            className={`w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-primary/20 flex items-center justify-center transition-transform ease-in-out ${getScaleClass()}`}
          >
            {/* Middle colored orb */}
            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-primary/15 backdrop-blur-xs border border-primary/30 flex flex-col items-center justify-center shadow-inner">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                {currentStep.phase}
              </span>
              <span className="font-mono text-3xl sm:text-4xl font-extrabold text-on-surface mt-1">
                {isRunning ? secondsLeft : currentStep.duration}s
              </span>
            </div>
          </div>
        </div>

        {/* Phase instruction */}
        <p className="text-xs sm:text-sm text-on-surface-variant font-medium max-w-sm mt-2">
          {isRunning ? currentStep.hint : "Press Start whenever you are ready to begin."}
        </p>

        {/* Timer display */}
        <div className="mt-3 text-xs font-mono text-on-surface-variant">
          Session Elapsed: <span className="font-bold text-on-surface">{formatTime(sessionSeconds)}</span>
        </div>

        {/* Playback Controls: Start, Pause, Resume, Stop */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-md hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-base">play_arrow</span>
              <span>{sessionSeconds > 0 ? "Resume" : "Start Session"}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-6 py-2.5 rounded-full bg-surface-container text-on-surface text-xs font-bold border border-outline-variant/40 hover:bg-surface-container-high transition-all flex items-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-base">pause</span>
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleStop}
            className="px-4 py-2.5 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high text-xs font-medium border border-outline-variant/30 transition-all"
            title="Reset to beginning"
          >
            Reset
          </button>

          {sessionSeconds >= 10 && (
            <button
              onClick={handleCompleteSession}
              className="px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition-all flex items-center gap-1.5 active:scale-95 animate-in fade-in"
            >
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Complete Session (+20 Drops)</span>
            </button>
          )}
        </div>
      </div>

      {/* Seamless Journey Next Step Card */}
      <div className="p-5 rounded-2xl bg-secondary-container/40 border border-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined text-xl">newspaper</span>
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-on-surface">
              Next in your journey: Daily Uplifting News
            </h3>
            <p className="text-xs text-on-surface-variant">
              Step 4: Explore a small, curated selection of positive wellness news stories.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveTab("news");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 self-end sm:self-auto shrink-0 active:scale-95"
        >
          <span>Continue to Daily News</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
