import React, { useState } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";
import { PlantSVG } from "../components/PlantSVG";
import { PlantCustomizerModal } from "../components/PlantCustomizerModal";

export const SanctuaryGarden = () => {
  const {
    user,
    plant,
    waterPlant,
    customizePlant,
    isAudioPlaying,
    currentSound,
    toggleSoundscape,
    showToast
  } = useEcoCalm();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(plant.name || "Sir Photosynth-is");
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [companionSelectorOpen, setCompanionSelectorOpen] = useState(false);
  const [potSelectorOpen, setPotSelectorOpen] = useState(false);
  const [flowerSelectorOpen, setFlowerSelectorOpen] = useState(false);

  // 6 Insects & Companions
  const companions = [
    { id: "butterfly", name: "Blue Morpho Butterfly", icon: "🦋" },
    { id: "honeybee", name: "Sunlit Honeybee", icon: "🐝" },
    { id: "ladybug", name: "Garden Ladybug", icon: "🐞" },
    { id: "firefly", name: "Glowing Firefly", icon: "✨" },
    { id: "dragonfly", name: "Emerald Dragonfly", icon: "🌱" },
    { id: "hummingbird", name: "Ruby Hummingbird", icon: "🐦" }
  ];

  // 8 Pot Styles
  const pots = [
    { id: "ceramic_ribbed", name: "Warm Linen", color: "#ebe1d5" },
    { id: "terracotta", name: "Warm Terracotta", color: "#d3927d" },
    { id: "unglazed_stone", name: "Unglazed Stone", color: "#c7beb3" },
    { id: "celadon_green", name: "Celadon Sage", color: "#a9ad8a" },
    { id: "pastel_rose", name: "Pastel Rose", color: "#f2c4c0" },
    { id: "lavender_glaze", name: "Lavender Glaze", color: "#d4c2e6" },
    { id: "matte_obsidian", name: "Matte Obsidian", color: "#4a483e" },
    { id: "sky_mineral", name: "Sky Mineral", color: "#b8d5db" }
  ];

  // 6 Flower Types
  const flowers = [
    { id: "rose_bud", name: "Tender Rose Bud", icon: "🌹" },
    { id: "cherry_blossom", name: "Cherry Blossom", icon: "🌸" },
    { id: "sunflower", name: "Golden Sunflower", icon: "🌻" },
    { id: "lavender", name: "French Lavender", icon: "🪻" },
    { id: "star_jasmine", name: "Star Jasmine", icon: "⭐" },
    { id: "lotus", name: "Emergent Lotus", icon: "🪷" }
  ];

  const handleSaveName = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      customizePlant({ name: nameInput.trim() });
      setIsEditingName(false);
    }
  };

  const currentCompanion = companions.find(c => c.id === plant.companion) || companions[0];
  const currentFlower = flowers.find(f => f.id === plant.flowerType) || flowers[0];
  const currentPot = pots.find(p => p.id === plant.potStyle) || pots[0];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-8 pb-16">
      {/* ================= TOP SANCTUARY HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-sm pt-4 border-b border-outline-variant/30">
        <div className="space-y-space-xs">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              eco
            </span>
            <span>Botanical Conservatory • Virtual Sanctuary Garden</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-space-sm gap-y-1">
            <h1 className="font-serif text-3xl sm:text-4xl text-on-surface tracking-tight font-medium">
              {user.name.split(" ")[0]}’s Greenhouse Sanctuary
            </h1>
            <span className="text-xl">🌿</span>
          </div>

          <p className="font-serif text-sm sm:text-base text-on-surface-variant italic">
            “Your plant never dies or punishes you for missing a day. It represents personal growth, not another obligation.”
          </p>
        </div>

        {/* Drops Reservoir & Mood State */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <div className="flex items-center gap-space-sm px-space-lg py-space-sm bg-surface-container-lowest rounded-full shadow-xs border border-outline-variant/30">
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed/70 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                water_drop
              </span>
            </div>
            <div className="flex flex-col pr-space-xs">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Stored Drops</span>
              <span className="font-serif text-lg text-primary font-semibold leading-tight">
                {user.waterDrops || 142} 💧
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-semibold shadow-xs hover:bg-primary-container transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">palette</span>
            <span>Customizer Studio 🎨</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN BOTANICAL CONSERVATORY GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: Greenhouse Showcase (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="relative bg-surface-container-low rounded-3xl overflow-hidden shadow-xs border border-outline-variant/30 p-6 sm:p-8">
            {/* Sunbeam SVG overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-50 -50 L400 650 L250 650 L-100 -50 Z" fill="#e8e797" />
                <path d="M120 -50 L650 650 L520 650 L50 -50 Z" fill="#c6caa5" />
                <circle cx="700" cy="80" r="140" fill="#ffdad7" />
              </svg>
            </div>

            {/* Conservatory Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-space-sm pb-space-md border-b border-outline-variant/20 mb-6">
              <div>
                <div className="flex items-center gap-space-xs">
                  {isEditingName ? (
                    <form onSubmit={handleSaveName} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="bg-surface-container-lowest px-3 py-1 rounded-lg text-sm font-serif font-bold text-on-surface border border-primary/50 focus:outline-none"
                      />
                      <button type="submit" className="text-xs bg-primary text-on-primary px-2.5 py-1 rounded-md">
                        Save
                      </button>
                    </form>
                  ) : (
                    <>
                      <h2 className="font-serif text-2xl text-on-surface font-semibold tracking-tight">
                        {plant.name || "Sir Photosynth-is"}
                      </h2>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1 text-on-surface-variant hover:text-primary transition-colors"
                        title="Rename Plant"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-on-surface-variant tracking-wide">
                  <span>Variety: {plant.variety || "Delulu Monstera Variegata"}</span>
                  <span>•</span>
                  <span className="text-primary font-semibold">Pot: {currentPot.name}</span>
                  <span>•</span>
                  <span className="text-secondary font-semibold">Flower: {currentFlower.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container-lowest text-tertiary text-xs shadow-xs border border-outline-variant/20">
                <span className="material-symbols-outlined text-base text-primary">psychiatry</span>
                <span className="font-semibold text-primary">Stage {plant.stage || 3} of 5: {plant.stageTitle || "Flourishing Plant"}</span>
              </div>
            </div>

            {/* Greenhouse Chamber Stage */}
            <div className="relative min-h-[400px] sm:min-h-[460px] flex flex-col items-center justify-end rounded-2xl overflow-hidden bg-gradient-to-b from-surface-container-high/40 via-surface-container-lowest/80 to-surface-container-high/60 shadow-xs border border-outline-variant/20 p-6 sm:p-10">
              {/* Window Muntins & Glass Pattern */}
              <div className="absolute inset-0 flex justify-around pointer-events-none opacity-10">
                <div className="w-px h-full bg-outline" />
                <div className="w-px h-full bg-outline" />
                <div className="w-px h-full bg-outline" />
              </div>

              {/* Floating Companion Anchor */}
              <div
                onClick={() => setCompanionSelectorOpen(!companionSelectorOpen)}
                className="absolute top-8 right-10 z-20 flex flex-col items-center gap-1 transition-all duration-700 hover:scale-110 cursor-pointer"
                title="Click to change companion insect"
              >
                <div className="relative w-12 h-12 rounded-full bg-surface-container-lowest/90 backdrop-blur-xs shadow-xs flex items-center justify-center animate-bounce border border-outline-variant/30">
                  <span className="text-2xl">{currentCompanion.icon}</span>
                </div>
                <span className="text-[10px] bg-surface-container-highest/90 px-2 py-0.5 rounded-full text-on-surface font-semibold shadow-xs">
                  {currentCompanion.name}
                </span>
              </div>

              {/* Companion Quick Popover */}
              {companionSelectorOpen && (
                <div className="absolute top-24 right-8 z-30 bg-surface-container-lowest p-3 rounded-2xl shadow-xl border border-outline-variant/30 space-y-1.5 w-52 animate-in fade-in zoom-in-95">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block px-2">Garden Companion (6)</span>
                  {companions.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        customizePlant({ companion: c.id, companionName: c.name });
                        setCompanionSelectorOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 rounded-xl hover:bg-surface-container text-xs text-left font-medium"
                    >
                      <span className="text-base">{c.icon}</span>
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Vector Botanical Specimen with Pot, Flower & Insect */}
              <div className="relative z-10 flex flex-col items-center">
                <PlantSVG
                  stage={plant.stage || 3}
                  potStyle={plant.potStyle || "ceramic_ribbed"}
                  flowerType={plant.flowerType || "rose_bud"}
                  companion={plant.companion || "butterfly"}
                  size="lg"
                />
              </div>

              {/* Hydration status indicator pill */}
              <div className="relative z-10 mt-3 px-4 py-1.5 rounded-full bg-surface-container-high/90 backdrop-blur-xs text-xs text-on-surface-variant flex items-center gap-2">
                <span>♡ Hydration at {plant.hydration || 78}% • {plant.name} is peaceful</span>
                <span className="text-primary font-bold">+{plant.totalDropsPoured || 162} drops poured</span>
              </div>
            </div>

            {/* Plant Care Action Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-outline-variant/20">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Water Plant Button */}
                <button
                  onClick={() => waterPlant(10)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-semibold hover:bg-primary-container transition-all active:scale-95 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">water_drop</span>
                  <span>Water {plant.name} (-10 💧)</span>
                </button>

                {/* Pot Style Quick Trigger */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setPotSelectorOpen(!potSelectorOpen);
                      setFlowerSelectorOpen(false);
                      setCompanionSelectorOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold text-on-surface transition-colors"
                  >
                    <span className="w-3 h-3 rounded-full border border-outline-variant/40" style={{ backgroundColor: currentPot.color }} />
                    <span>Pot: {currentPot.name}</span>
                    <span className="material-symbols-outlined text-sm">expand_more</span>
                  </button>

                  {potSelectorOpen && (
                    <div className="absolute left-0 bottom-12 z-30 bg-surface-container-lowest p-3 rounded-2xl shadow-xl border border-outline-variant/30 space-y-1.5 w-52 animate-in fade-in zoom-in-95">
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant block px-2">8 Pot Finishes</span>
                      {pots.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            customizePlant({ potStyle: p.id });
                            setPotSelectorOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-xl hover:bg-surface-container text-xs text-left"
                        >
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.color }} />
                          <span className="font-medium">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Flower Type Quick Trigger */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setFlowerSelectorOpen(!flowerSelectorOpen);
                      setPotSelectorOpen(false);
                      setCompanionSelectorOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold text-on-surface transition-colors"
                  >
                    <span>{currentFlower.icon}</span>
                    <span>Flower: {currentFlower.name}</span>
                    <span className="material-symbols-outlined text-sm">expand_more</span>
                  </button>

                  {flowerSelectorOpen && (
                    <div className="absolute left-0 bottom-12 z-30 bg-surface-container-lowest p-3 rounded-2xl shadow-xl border border-outline-variant/30 space-y-1.5 w-52 animate-in fade-in zoom-in-95">
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant block px-2">6 Flower Types</span>
                      {flowers.map(f => (
                        <button
                          key={f.id}
                          onClick={() => {
                            customizePlant({ flowerType: f.id });
                            setFlowerSelectorOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-xl hover:bg-surface-container text-xs text-left"
                        >
                          <span className="text-base">{f.icon}</span>
                          <span className="font-medium">{f.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Soundscape Capsule Player */}
              <button
                onClick={() => toggleSoundscape("rain")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-xs ${
                  isAudioPlaying
                    ? "bg-secondary-container text-on-secondary-container"
                    : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {isAudioPlaying ? "pause_circle" : "play_circle"}
                </span>
                <span>Rain on Glass • 528Hz</span>
                <span className="material-symbols-outlined text-sm text-tertiary">graphic_eq</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Growth Journey & Medals (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Growth Journey Milestones */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xs border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg text-on-surface font-semibold">Growth Journey 🌱</h3>
                <p className="text-[11px] text-on-surface-variant">Your plant thrives on presence, not perfection.</p>
              </div>
              <span className="text-[10px] uppercase font-bold text-primary bg-primary-fixed/40 px-2.5 py-0.5 rounded-full">
                Non-punitive
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-on-surface pb-1">
                <span>Flourishing Stage</span>
                <span className="text-primary">{plant.hydration || 78}% Progress</span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${plant.hydration || 78}%` }} />
              </div>
            </div>

            {/* Stages List */}
            <div className="space-y-3 pt-2">
              {[
                { stage: 1, title: "1. Seed of Intention", desc: "Planted on Nov 12 • 2 leaves unfurled", completed: true },
                { stage: 2, title: "2. Root System Grounding", desc: "Strong stems • 5 Offline Sessions", completed: true },
                { stage: 3, title: "3. Flourishing Plant (Current)", desc: "Delulu Monstera with rare rose buds", completed: true, isCurrent: true },
                { stage: 4, title: "4. Blooming Garden Canopy", desc: "Unlocks greenhouse glass conservatory tint", completed: false },
                { stage: 5, title: "5. Ancient Botanical Grove", desc: "Mastery tree • Infinite peaceful shade", completed: false }
              ].map((m) => (
                <div
                  key={m.stage}
                  className={`p-3 rounded-2xl transition-all ${
                    m.isCurrent
                      ? "bg-primary-fixed/30 border border-primary/30"
                      : m.completed
                      ? "bg-surface-container-low"
                      : "opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-on-surface">{m.title}</span>
                    <span className="material-symbols-outlined text-sm text-primary">
                      {m.completed ? "check_circle" : "lock"}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Clay Medals & Decor Inventory */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xs border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg text-on-surface font-semibold">Unlocked Garden Decor</h3>
              <span className="text-[11px] text-on-surface-variant">3 Clay Badges</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(user.medals || []).map((medal) => (
                <div
                  key={medal.id}
                  className="p-3 rounded-2xl bg-surface-container-low flex flex-col items-center text-center gap-1 hover:bg-surface-container-high transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-base">{medal.icon}</span>
                  </div>
                  <span className="text-[10px] font-bold text-on-surface leading-tight mt-1">
                    {medal.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gentle Botanical Promise Box */}
          <div className="p-4 rounded-2xl bg-secondary-container/40 border border-secondary-container space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-secondary">
              <span className="material-symbols-outlined text-sm">shield_heart</span>
              <span>Gentle Botanical Promise</span>
            </div>
            <p className="text-xs text-on-secondary-container leading-relaxed">
              Your plant never dies or loses leaves if you step away. No peace has an expiration date. Return whenever your soul seeks shade.
            </p>
          </div>
        </div>
      </div>

      {/* Botanical Customizer Studio Modal */}
      <PlantCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
      />
    </div>
  );
};
