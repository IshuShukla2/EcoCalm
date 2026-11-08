import React, { useState, useRef, useEffect } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const HobbiesSection = () => {
  const { completeHobbyActivity, setActiveTab, showToast, triggerCelebration } = useEcoCalm();

  const [activeTab, setActiveTabLocal] = useState("drawing"); // drawing, journal, sound, puzzle, poetry

  // ---------------- 1. DRAWING CANVAS STATE ----------------
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#2d552a");
  const [brushSize, setBrushSize] = useState(4);

  const colors = ["#2d552a", "#3b6637", "#b8705a", "#d4c2e6", "#e8c547", "#3066be", "#2b2b2b"];

  useEffect(() => {
    if (activeTab === "drawing" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      // Set background white/canvas color once
      if (!canvas.dataset.initialized) {
        ctx.fillStyle = "#faf8f5";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        canvas.dataset.initialized = "true";
      }
    }
  }, [activeTab]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = brushColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#faf8f5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      showToast("Canvas refreshed", "refresh");
    }
  };

  const handleSaveDrawing = () => {
    completeHobbyActivity("drawing", "Mindful Botanical Sketch");
    triggerCelebration();
  };

  // ---------------- 2. JOURNALING STATE ----------------
  const journalPrompts = [
    "What is one tiny sound, texture, or scent that brought you quiet peace today?",
    "Write down one burden you are intentionally giving yourself permission to set down.",
    "Describe a moment this week when you felt unhurried and truly present."
  ];
  const [promptIdx, setPromptIdx] = useState(0);
  const [journalText, setJournalText] = useState("");
  const [savedJournal, setSavedJournal] = useState(false);

  const handleSaveJournal = (e) => {
    e.preventDefault();
    if (!journalText.trim()) return;
    completeHobbyActivity("journaling", "Gentle Reflection Journal");
    setSavedJournal(true);
    triggerCelebration();
  };

  // ---------------- 3. SOUNDBOARD STATE ----------------
  const soundTracks = [
    { id: "rain", name: "Rain on Leaves", icon: "water_drop", desc: "Gentle tropical raindrops on foliage" },
    { id: "stream", name: "Mountain Stream", icon: "waves", desc: "Crisp babbling brook through mossy rocks" },
    { id: "birds", name: "Forest Birds", icon: "flutter", desc: "Soft morning birdsong in sunlit canopies" },
    { id: "bowl", name: "Singing Bowl", icon: "spa", desc: "Resonant Tibetan meditative harmonic tone" }
  ];
  const [activeSoundId, setActiveSoundId] = useState(null);

  const toggleSound = (id) => {
    if (activeSoundId === id) {
      setActiveSoundId(null);
      showToast("Soundscape paused 🌙", "volume_off");
    } else {
      setActiveSoundId(id);
      showToast(`Playing ${soundTracks.find((s) => s.id === id)?.name} 🌿`, "volume_up");
      completeHobbyActivity("soundscape", "Mindful Soundscape Immersion");
    }
  };

  // ---------------- 4. ZEN MATCH PUZZLE STATE ----------------
  const initialCards = [
    { id: 1, symbol: "🍃", matched: false },
    { id: 2, symbol: "🌸", matched: false },
    { id: 3, symbol: "🪴", matched: false },
    { id: 4, symbol: "🍃", matched: false },
    { id: 5, symbol: "🌸", matched: false },
    { id: 6, symbol: "🪴", matched: false }
  ];
  const [cards, setCards] = useState(initialCards);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [puzzleWon, setPuzzleWon] = useState(false);

  const handleCardClick = (idx) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(idx) || cards[idx].matched) return;

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        setTimeout(() => {
          setCards((prev) => {
            const updated = prev.map((c, i) => (i === first || i === second ? { ...c, matched: true } : c));
            if (updated.every((c) => c.matched)) {
              setPuzzleWon(true);
              completeHobbyActivity("puzzle", "Zen Memory Match");
              triggerCelebration();
            }
            return updated;
          });
          setFlippedIndices([]);
        }, 500);
      } else {
        setTimeout(() => setFlippedIndices([]), 900);
      }
    }
  };

  const resetPuzzle = () => {
    setCards(initialCards.sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setPuzzleWon(false);
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-6 pb-20 pt-2 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-1">
            <span className="material-symbols-outlined text-sm">palette</span>
            <span>Step 5 of 6 • Mindful Hobbies & Play</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold tracking-tight">
            Creative Offline Play
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl">
            Take a screen pause. Sketch, reflect, listen, or solve a soothing puzzle. No pressure, just joy.
          </p>
        </div>

        <span className="self-start sm:self-auto text-xs font-bold text-primary bg-primary-fixed/40 px-3.5 py-1.5 rounded-full">
          Earn +15 Drops per activity 💧
        </span>
      </div>

      {/* 4 Interactive Hobby Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { id: "drawing", label: "Doodle & Draw", icon: "brush", desc: "Interactive sketchpad" },
          { id: "journal", label: "Mindful Journal", icon: "edit_note", desc: "Gentle writing prompt" },
          { id: "sound", label: "Soundscape", icon: "graphic_eq", desc: "Nature soundboard" },
          { id: "puzzle", label: "Zen Stones", icon: "extension", desc: "Quick peaceful match" }
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabLocal(tab.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${isSelected
                  ? "bg-primary-container text-on-primary-container border-primary font-bold shadow-xs scale-[1.01]"
                  : "bg-surface-container-low border-outline-variant/30 hover:bg-surface-container text-on-surface"
                }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                <span className="text-xs font-bold">{tab.label}</span>
              </div>
              <p className="text-[10px] text-on-surface-variant/80 mt-1">{tab.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Active Tab Interaction Container */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-xs">
        {/* ================= 1. DOODLE & DRAW ================= */}
        {activeTab === "drawing" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface">Colors:</span>
                <div className="flex gap-1.5">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setBrushColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${brushColor === c ? "scale-125 border-primary shadow-xs" : "border-transparent"
                        }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearCanvas}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-surface-container text-on-surface-variant hover:text-on-surface"
                >
                  Clear
                </button>
                <button
                  onClick={handleSaveDrawing}
                  className="px-4 py-1.5 rounded-full text-xs font-bold bg-primary text-on-primary shadow-2xs hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95"
                >
                  Save Sketch (+15 Drops)
                </button>
              </div>
            </div>

            {/* Drawing Canvas */}
            <div className="flex justify-center overflow-hidden rounded-2xl border border-outline-variant/30 shadow-inner">
              <canvas
                ref={canvasRef}
                width={700}
                height={350}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
                className="w-full max-w-[700px] h-[320px] bg-[#faf8f5] cursor-crosshair touch-none"
              />
            </div>
            <p className="text-[11px] text-center text-on-surface-variant italic">
              Draw a leaf, a spiral, or whatever unhurried shape flows from your hands.
            </p>
          </div>
        )}

        {/* ================= 2. JOURNALING ================= */}
        {activeTab === "journal" && (
          <form onSubmit={handleSaveJournal} className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold tracking-wider text-primary">
                Daily Reflection Prompt
              </span>
              <button
                type="button"
                onClick={() => setPromptIdx((p) => (p + 1) % journalPrompts.length)}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <span>New Prompt</span>
                <span className="material-symbols-outlined text-xs">refresh</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30">
              <p className="font-serif text-sm sm:text-base font-semibold text-on-surface">
                “{journalPrompts[promptIdx]}”
              </p>
            </div>

            <div className="space-y-1">
              <textarea
                rows={5}
                value={journalText}
                onChange={(e) => {
                  setJournalText(e.target.value);
                  setSavedJournal(false);
                }}
                placeholder="Let your thoughts flow freely. No editing or perfection needed..."
                className="w-full bg-surface-container-low p-4 rounded-2xl text-xs sm:text-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-on-surface-variant">
                {savedJournal ? "Reflection recorded safely ✨" : `${journalText.length} characters`}
              </span>
              <button
                type="submit"
                disabled={!journalText.trim()}
                className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">bookmark</span>
                <span>Save Reflection (+15 Drops)</span>
              </button>
            </div>
          </form>
        )}

        {/* ================= 3. SOUNDSCAPE SANCTUARY ================= */}
        {activeTab === "sound" && (
          <div className="space-y-6">
            <div className="text-center max-w-md mx-auto space-y-1">
              <h3 className="font-serif text-lg font-bold text-on-surface">Ambient Calming Frequencies</h3>
              <p className="text-xs text-on-surface-variant">
                Tap any soundscape to invite organic resonance into your workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {soundTracks.map((item) => {
                const isPlaying = activeSoundId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSound(item.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${isPlaying
                        ? "bg-primary-container text-on-primary-container border-primary shadow-sm"
                        : "bg-surface-container-low border-outline-variant/30 hover:bg-surface-container text-on-surface"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">{item.name}</h4>
                        <p className="text-[10px] text-on-surface-variant line-clamp-1">{item.desc}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`p-2 rounded-full ${isPlaying ? "bg-primary text-on-primary" : "bg-surface text-on-surface-variant"}`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {isPlaying ? "pause" : "play_arrow"}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 4. ZEN STONES PUZZLE ================= */}
        {activeTab === "puzzle" && (
          <div className="space-y-6 flex flex-col items-center">
            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-on-surface">Zen Focus Stone Match</h3>
              <p className="text-xs text-on-surface-variant">
                Match the three peaceful nature pairs with gentle attention.
              </p>
            </div>

            {puzzleWon ? (
              <div className="p-6 rounded-2xl bg-emerald-100 text-emerald-900 text-center space-y-3 animate-in zoom-in-95">
                <span className="text-4xl">🌸</span>
                <h4 className="font-serif text-base font-bold">Mind Cleared & Grounded</h4>
                <p className="text-xs">You matched all sanctuary stones with focused calm. +15 Drops awarded!</p>
                <button
                  onClick={resetPuzzle}
                  className="px-4 py-2 rounded-full bg-emerald-700 text-white text-xs font-bold shadow-2xs hover:bg-emerald-800"
                >
                  Play Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                {cards.map((card, idx) => {
                  const isFlipped = flippedIndices.includes(idx) || card.matched;
                  return (
                    <button
                      key={card.id + "-" + idx}
                      onClick={() => handleCardClick(idx)}
                      className={`h-24 rounded-2xl border flex items-center justify-center text-3xl transition-all duration-300 ${isFlipped
                          ? "bg-primary-container/80 border-primary shadow-xs"
                          : "bg-surface-container-high border-outline-variant/40 hover:bg-surface-container-highest cursor-pointer"
                        }`}
                    >
                      {isFlipped ? card.symbol : "🌿"}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Seamless Journey Next Step Card */}
      <div className="p-5 rounded-2xl bg-secondary-container/40 border border-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined text-xl">ecg_heart</span>
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-on-surface">
              Next in your journey: Vibe Check (After)
            </h3>
            <p className="text-xs text-on-surface-variant">
              Step 6: Check in again to see how your mindful activities shifted your baseline emotions.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveTab("vibe_after");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 self-end sm:self-auto shrink-0 active:scale-95"
        >
          <span>Continue to Vibe Check (After)</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
