import React, { useState, useEffect } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const DoomscrollModal = () => {
  const { isDoomscrollOpen, setIsDoomscrollOpen, setActiveTab, waterPlant, showToast } = useEcoCalm();
  const [breathPhase, setBreathPhase] = useState("Inhale");
  const [countdown, setCountdown] = useState(4);
  const [selectedAnchorStep, setSelectedAnchorStep] = useState(0);

  const anchorSteps = [
    { num: 5, label: "See", desc: "Look around your real room. Name 5 physical objects you can see (e.g. lamp, plant, coffee mug, window frame, floor rug)." },
    { num: 4, label: "Touch", desc: "Touch 4 different textures near your hands (e.g. your soft sleeve, smooth wooden desk, ceramic mug, cool paper)." },
    { num: 3, label: "Hear", desc: "Listen carefully. Name 3 distinct sounds in your environment (e.g. distant traffic, wind rustle, ticking clock)." },
    { num: 2, label: "Smell", desc: "Notice 2 scents in the air (e.g. tea, fresh air, wood polish, ambient room warmth)." },
    { num: 1, label: "Taste", desc: "Notice 1 physical taste or take one slow, cold sip of clean water." }
  ];

  // Gentle 4-4-4 cycle in the emergency modal
  useEffect(() => {
    if (!isDoomscrollOpen) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setBreathPhase((curr) => {
            if (curr === "Inhale") return "Hold";
            if (curr === "Hold") return "Exhale";
            return "Inhale";
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isDoomscrollOpen]);

  if (!isDoomscrollOpen) {
    return (
      <div className="fixed bottom-space-md sm:bottom-space-lg left-1/2 transform -translate-x-1/2 z-40 pointer-events-auto">
        <button
          onClick={() => setIsDoomscrollOpen(true)}
          className="group flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-full bg-secondary-container text-on-secondary-container font-sans text-sm sm:text-base font-semibold shadow-[0_12px_28px_-4px_rgba(211,166,163,0.55)] hover:shadow-[0_16px_36px_-4px_rgba(211,166,163,0.7)] hover:scale-[1.03] active:scale-95 transition-all duration-200 border border-secondary-fixed/50"
          type="button"
        >
          <span className="text-base leading-none">💀</span>
          <span>I'm Doomscrolling Again</span>
          <span className="material-symbols-outlined text-base text-secondary transition-transform group-hover:rotate-45 duration-300">
            self_improvement
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-3xl p-6 sm:p-10 shadow-2xl border border-secondary-container/60 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsDoomscrollOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold uppercase tracking-wider">
            <span>💀 Gentle Emergency Reset</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold">
            Pause. You are not broken.
          </h2>
          <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-lg mx-auto">
            Algorithms are engineered by billion-dollar teams to capture human attention. Take a deep breath, soften your eyes, and feel your feet on the ground.
          </p>
        </div>

        {/* Dynamic 60s Breathing Sphere */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-secondary-container via-surface-container-low to-tertiary-fixed flex flex-col items-center justify-center text-center shadow-lg transition-transform duration-1000 ease-in-out scale-100">
            <span className="material-symbols-outlined text-secondary text-2xl mb-1">spa</span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-on-surface">
              {breathPhase}
            </span>
            <span className="font-sans text-xs font-bold text-secondary mt-1 bg-surface-container-lowest px-2.5 py-0.5 rounded-full">
              {countdown}s
            </span>
            <span className="text-[11px] text-on-surface-variant mt-1">
              Drop shoulders & unclench jaw
            </span>
          </div>
        </div>

        {/* 5-4-3-2-1 Sensory Grounding Tabs */}
        <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              5-4-3-2-1 Somatic Grounding Anchor
            </span>
            <span className="text-xs text-on-surface-variant">Step {selectedAnchorStep + 1} of 5</span>
          </div>

          <div className="flex gap-2 justify-center">
            {anchorSteps.map((step, idx) => (
              <button
                key={step.num}
                onClick={() => setSelectedAnchorStep(idx)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                  selectedAnchorStep === idx
                    ? "bg-secondary-container text-on-secondary-container scale-105 shadow-xs"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {step.num}
              </button>
            ))}
          </div>

          <div className="p-3 bg-surface-container-lowest rounded-xl text-center">
            <p className="font-serif text-base text-on-surface font-semibold">
              {anchorSteps[selectedAnchorStep].num} • {anchorSteps[selectedAnchorStep].label}
            </p>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
              {anchorSteps[selectedAnchorStep].desc}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              setIsDoomscrollOpen(false);
              setActiveTab("breathe");
              showToast("Entering Respiration Chamber 🕊️", "air");
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-on-primary font-sans text-sm font-semibold hover:bg-primary-container transition-all active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">air</span>
            <span>Respiration Chamber</span>
          </button>

          <button
            onClick={() => {
              waterPlant(10);
              setIsDoomscrollOpen(false);
            }}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-surface-container-high text-on-surface font-sans text-sm font-semibold hover:bg-surface-container-highest transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg text-primary">water_drop</span>
            <span>Water Plant & Disconnect 🌱</span>
          </button>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => {
              setIsDoomscrollOpen(false);
              showToast("Screens down. Proud of you for choosing reality 🌿", "spa");
            }}
            className="text-xs text-on-surface-variant hover:text-on-surface underline"
          >
            I'm ready to put my phone down now
          </button>
        </div>
      </div>
    </div>
  );
};
