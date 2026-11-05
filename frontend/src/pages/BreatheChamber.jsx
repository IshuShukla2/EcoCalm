import React, { useState, useEffect } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const BreatheChamber = () => {
  const {
    user,
    plant,
    waterPlant,
    completeBreathing,
    setActiveTab,
    isAudioPlaying,
    currentSound,
    toggleSoundscape,
    showToast
  } = useEcoCalm();

  // Cadence definition
  const patterns = {
    box: {
      name: "Box Breathing",
      sub: "4s Inhale · 4s Hold · 4s Exhale · 4s Rest",
      steps: [
        { phase: "Inhale", duration: 4, hint: "Expanding your ribs gently" },
        { phase: "Hold", duration: 4, hint: "Soft stillness in the chest" },
        { phase: "Exhale", duration: 4, hint: "Releasing tension via mouth" },
        { phase: "Rest", duration: 4, hint: "Quiet pause before the breath" }
      ]
    },
    "478": {
      name: "4-7-8 Deep Sleep",
      sub: "4s Inhale · 7s Hold · 8s Sigh Out",
      steps: [
        { phase: "Inhale", duration: 4, hint: "Inhale quietly through nose" },
        { phase: "Hold", duration: 7, hint: "Retaining gentle presence" },
        { phase: "Exhale", duration: 8, hint: "Slow whoosh sigh out" }
      ]
    },
    coherent: {
      name: "Coherent Heart Rhythm",
      sub: "5.5s Inhale · 5.5s Exhale",
      steps: [
        { phase: "Inhale", duration: 5, hint: "Smooth, continuous wave in" },
        { phase: "Exhale", duration: 5, hint: "Smooth, continuous wave out" }
      ]
    }
  };

  const [activeCadence, setActiveCadence] = useState("box");
  const [isRunning, setIsRunning] = useState(true);
  const [stepIdx, setStepIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [sessionSeconds, setSessionSeconds] = useState(225); // 03:45
  const [somaticState, setSomaticState] = useState(null);

  const currentPattern = patterns[activeCadence];
  const currentStep = currentPattern.steps[stepIdx] || currentPattern.steps[0];

  // Breathing loop timer
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          const nextIdx = (stepIdx + 1) % currentPattern.steps.length;
          setStepIdx(nextIdx);
          return currentPattern.steps[nextIdx].duration;
        }
        return prev - 1;
      });

      setSessionSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, stepIdx, activeCadence]);

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectCadence = (key) => {
    setActiveCadence(key);
    setStepIdx(0);
    setSecondsLeft(patterns[key].steps[0].duration);
    showToast(`Switched to ${patterns[key].name} flow 🌿`, "air");
  };

  const handleResetSession = () => {
    setStepIdx(0);
    setSecondsLeft(currentPattern.steps[0].duration);
    setSessionSeconds(0);
    showToast("Session reset to beginning", "restart_alt");
  };

  const handleCompleteSession = async () => {
    await completeBreathing(Math.max(1, Math.round(sessionSeconds / 60)), activeCadence);
  };

  // Dynamic scale for breathing sphere
  const getScaleClass = () => {
    if (currentStep.phase === "Inhale") return "scale-110 duration-[4000ms]";
    if (currentStep.phase === "Hold") return "scale-110 duration-500";
    if (currentStep.phase === "Exhale") return "scale-90 duration-[4000ms]";
    return "scale-90 duration-500";
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-8 pb-20">
      {/* ================= MAIN RESPIRATION WRAPPER ================= */}
      <div className="relative overflow-hidden w-full rounded-3xl bg-gradient-to-b from-surface-container-low via-surface-container to-surface-container-low p-6 sm:p-10 shadow-[0_4px_30px_-6px_rgba(65,67,33,0.06)] border border-outline-variant/30">
        <div className="absolute -top-32 -left-24 w-80 h-80 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -right-20 w-96 h-96 rounded-full bg-secondary-container/30 blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-space-md border-b border-outline-variant/40 pb-space-lg">
          <div className="space-y-space-xs max-w-2xl">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-highest/80 backdrop-blur-xs text-tertiary">
              <span className="material-symbols-outlined text-[18px]">spa</span>
              <span className="text-xs uppercase tracking-widest font-semibold">Respiration Chamber</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-on-surface font-medium tracking-tight">
              Let's take a breather.
            </h1>

            <p className="font-sans text-sm sm:text-base text-on-surface-variant font-normal">
              Inhale the calm, exhale the algorithm. No rush, no performance.
            </p>
          </div>

          {/* Quick Session Controls Pill Cluster */}
          <div className="flex items-center flex-wrap gap-2 bg-surface-container-lowest/80 p-1.5 rounded-2xl shadow-xs backdrop-blur-xs border border-outline-variant/30">
            <button
              onClick={() => toggleSoundscape("rain")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-base text-tertiary">water_drop</span>
              <span>{isAudioPlaying ? "Rain Falling on the Roof" : "Soundscape Off"}</span>
            </button>

            <button
              onClick={() => toggleSoundscape(currentSound)}
              className="w-8 h-8 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition-colors"
              title="Toggle Soundscape"
            >
              <span className="material-symbols-outlined text-base">
                {isAudioPlaying ? "volume_up" : "volume_off"}
              </span>
            </button>

            <div className="h-5 w-px bg-outline-variant/50 mx-1" />

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface text-on-surface">
              <span className="material-symbols-outlined text-base text-secondary">timer</span>
              <span className="text-xs font-bold tracking-wide">{formatTimer(sessionSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Main Respiration Stage */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-8">
          {/* Left Column: Cadence selector */}
          <div className="lg:col-span-4 flex flex-col gap-4 order-2 lg:order-1">
            <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl p-5 shadow-xs border border-outline-variant/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Select Cadence</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold">Guided Flow</span>
              </div>

              {/* Cadence Buttons */}
              <div className="flex flex-col gap-2.5">
                {Object.keys(patterns).map((k) => {
                  const pat = patterns[k];
                  const isCur = activeCadence === k;
                  return (
                    <button
                      key={k}
                      onClick={() => handleSelectCadence(k)}
                      className={`w-full text-left p-3.5 rounded-xl transition-all duration-300 flex items-center justify-between group ${
                        isCur
                          ? "bg-primary-container text-on-primary-container shadow-xs scale-102"
                          : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-bold font-serif">{pat.name}</span>
                        <span className="text-[11px] opacity-80 mt-0.5">{pat.sub}</span>
                      </div>
                      <span className="material-symbols-outlined text-lg">
                        {isCur ? "radio_button_checked" : "radio_button_unchecked"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Botanical Note Quote */}
              <div className="bg-surface-container-low/70 rounded-xl p-3 flex items-start gap-2 border border-outline-variant/20">
                <span className="material-symbols-outlined text-tertiary text-base mt-0.5">nest_eco_leaf</span>
                <p className="text-xs text-on-surface-variant italic leading-relaxed">
                  “Longer exhales slow down the vagus nerve, signaling biological safety within 90 seconds.”
                </p>
              </div>
            </div>

            {/* Soundscape Aura Chips */}
            <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-2xl p-4 shadow-xs border border-outline-variant/30 space-y-2">
              <span className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Soundscape Aura</span>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { id: "rain", label: "Rain Glass", icon: "🌧️" },
                  { id: "breeze", label: "Forest Air", icon: "🍃" },
                  { id: "vinyl", label: "Warm Lo-Fi", icon: "☕" }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => toggleSoundscape(s.id)}
                    className={`p-2 rounded-xl text-center text-xs font-semibold transition-all shadow-xs ${
                      isAudioPlaying && currentSound === s.id
                        ? "bg-secondary-fixed text-on-secondary-fixed"
                        : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    <span className="block text-base mb-0.5">{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Animated Breathing Sphere Stage */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center py-6 sm:py-10 relative order-1 lg:order-2">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-tr from-tertiary-fixed-dim/30 via-secondary-container/20 to-primary-fixed/40 blur-xl transition-all ease-in-out ${getScaleClass()}`}
              />

              {/* Dashed guide ring */}
              <div className="absolute inset-4 sm:inset-6 rounded-full border border-dashed border-outline-variant/60" />

              {/* Secondary halo */}
              <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-surface-container-lowest shadow-[0_8px_32px_rgba(65,67,33,0.08)]" />

              {/* Breathing Core Nucleus */}
              <div
                className={`relative z-20 w-44 h-44 sm:w-60 sm:h-60 rounded-full bg-gradient-to-br from-tertiary-fixed via-primary-container to-primary text-on-primary flex flex-col items-center justify-center p-space-md text-center shadow-[0_16px_40px_-8px_rgba(87,87,24,0.35)] transition-all ease-in-out select-none cursor-pointer ${getScaleClass()}`}
                onClick={() => setIsRunning(!isRunning)}
              >
                <span className="material-symbols-outlined text-primary-fixed/40 text-2xl mb-1">spa</span>
                <div className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-surface-lowest">
                  {currentStep.phase}
                </div>
                <div className="mt-2 px-3 py-0.5 rounded-full bg-on-primary-fixed/20 backdrop-blur-md">
                  <span className="text-sm font-bold tracking-widest text-primary-fixed">
                    {secondsLeft}s
                  </span>
                </div>
                <span className="text-[11px] mt-1.5 opacity-90 text-surface-variant font-medium max-w-[140px]">
                  {currentStep.hint}
                </span>
              </div>
            </div>

            {/* Playback Actions */}
            <div className="mt-8 flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-semibold shadow-md hover:bg-primary-container active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-lg">
                  {isRunning ? "pause" : "play_arrow"}
                </span>
                <span>{isRunning ? "Pause Sanctuary" : "Resume"}</span>
              </button>

              <button
                onClick={handleResetSession}
                className="p-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant transition-colors"
                title="Reset Session"
              >
                <span className="material-symbols-outlined text-lg">restart_alt</span>
              </button>

              <div className="h-6 w-px bg-outline-variant/60 hidden sm:block" />

              <button
                onClick={handleCompleteSession}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-surface-container-lowest hover:bg-surface-container text-tertiary text-xs sm:text-sm font-semibold shadow-xs border border-outline-variant/30 transition-all"
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>Complete Session (+20 Drops)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MIDDLE SECTION: MILESTONE & SOMATIC RESONANCE ================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Garden Milestone Card */}
        <div className="md:col-span-7 bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xs border border-outline-variant/30 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-space-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-secondary-container text-on-secondary-container text-xs font-bold">
                <span className="material-symbols-outlined text-sm">potted_plant</span>
                <span>Garden Milestone</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-on-surface font-semibold pt-1">
                You showed up for yourself. That counts. 🌱
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Your mindful presence converts digital overload into nourishment for your indoor sanctuary.
              </p>
            </div>
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-tertiary-fixed/60 flex flex-col items-center justify-center text-center p-1 shadow-xs">
              <span className="material-symbols-outlined text-tertiary text-2xl">water_drop</span>
              <span className="text-[11px] font-bold text-tertiary mt-0.5">+20 Drops</span>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span>{plant.name || "Sir Photosynth-is"} ({plant.variety || "Monstera Deliciosa"})</span>
              </div>
              <span className="text-primary">{plant.totalDropsPoured || 162} / 200 drops to Leaf 9</span>
            </div>
            <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: "81%" }} />
            </div>
            <div className="flex justify-between text-[11px] text-on-surface-variant pt-1">
              <span>Stagnant screen tension released</span>
              <span className="font-medium text-secondary">Unlocks "Dewdrop Glow" skin</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="flex items-center gap-1 text-[11px] text-on-surface-variant">
              <span className="material-symbols-outlined text-sm text-primary">check</span>
              Automatically saved to daily sanctuary log
            </span>
            <button
              onClick={() => waterPlant(20)}
              className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container shadow-xs active:scale-95 transition-all"
            >
              Pour 20 Drops on Plant
            </button>
          </div>
        </div>

        {/* Somatic Resonance Card */}
        <div className="md:col-span-5 bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xs border border-outline-variant/30 space-y-4">
          <div>
            <span className="text-[11px] text-tertiary uppercase tracking-wider font-bold">Somatic Resonance</span>
            <h3 className="font-serif text-lg sm:text-xl text-on-surface font-semibold mt-1">
              Notice any change in your chest or shoulders?
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Tap what feels true right now. Non-judgmental awareness is the medicine.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: "lighter", label: "Lighter & Soft", sub: "Shoulders dropped", icon: "🪶" },
              { id: "spacious", label: "Spacious Breath", sub: "Chest opened up", icon: "🌊" },
              { id: "quiet", label: "Quiet Mind", sub: "Less notification buzz", icon: "🍃" },
              { id: "settling", label: "Still Settling", sub: "Needs more time", icon: "🌱" }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSomaticState(s.id);
                  showToast(`Noted: ${s.label}. Giving yourself permission to rest.`, "spa");
                }}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  somaticState === s.id
                    ? "bg-secondary-container/60 border-secondary text-on-secondary-container shadow-xs"
                    : "bg-surface-container-low border-outline-variant/30 text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className="text-lg block mb-1">{s.icon}</span>
                <span className="font-serif text-xs font-bold block">{s.label}</span>
                <span className="text-[10px] text-on-surface-variant">{s.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= EMERGENCY SOMATIC ANCHORS (5-4-3-2-1) ================= */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xs border border-outline-variant/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-xl">self_improvement</span>
            <h3 className="font-serif text-lg font-semibold text-on-surface">Emergency Somatic Anchors (5-4-3-2-1)</h3>
          </div>
          <span className="text-[11px] text-on-surface-variant">When high screen stimulation strikes</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { num: 5, title: "See", desc: "5 objects in your real room" },
            { num: 4, title: "Touch", desc: "4 physical textures near hands" },
            { num: 3, title: "Hear", desc: "3 distinct subtle room sounds" },
            { num: 2, title: "Smell", desc: "2 scents (tea, wood, plant air)" },
            { num: 1, title: "Taste", desc: "1 sip of fresh cool water" }
          ].map((a) => (
            <div key={a.num} className="p-3.5 rounded-2xl bg-surface-container-low text-center space-y-1">
              <span className="font-serif text-xl font-bold text-secondary">{a.num}</span>
              <p className="font-sans text-xs font-bold text-on-surface">{a.title}</p>
              <p className="text-[10px] text-on-surface-variant leading-tight">{a.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={() => showToast("Jaw unclenched, shoulders soft, breath deep ✨", "spa")}
            className="px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold hover:bg-secondary-fixed transition-colors shadow-xs"
          >
            Release jaw & drop shoulders ✨
          </button>
          <button
            onClick={() => setActiveTab("garden")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Garden Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
