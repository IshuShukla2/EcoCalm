import React, { useState } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";
import { PlantSVG } from "../components/PlantSVG";

export const PlantSection = () => {
  const {
    user,
    plant,
    adoptPlant,
    waterPlant,
    customizePlant,
    setActiveTab,
    triggerCelebration,
    showToast
  } = useEcoCalm();

  const [isSelectingSeed, setIsSelectingSeed] = useState(!plant?.hasSelectedSeed);
  const [selectedSeed, setSelectedSeed] = useState(plant?.plantType || "monstera");
  const [selectedPot, setSelectedPot] = useState(plant?.potStyle || "ceramic_ribbed");
  const [selectedFlower, setSelectedFlower] = useState(plant?.flowerType || "rose_bud");
  const [selectedCompanion, setSelectedCompanion] = useState(plant?.companion || "butterfly");
  const [customName, setCustomName] = useState(plant?.name || "Pip");
  const [intentionText, setIntentionText] = useState(plant?.tagline || "Growing gently without pressure");
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Available Seed Options
  const seedOptions = [
    {
      id: "monstera",
      variety: "Monstera Deliciosa",
      name: "Monstera",
      emoji: "🌿",
      badge: "Resilience",
      desc: "Lush tropical foliage that unfurls gently with patient care."
    },
    {
      id: "sunflower",
      variety: "Golden Sunburst",
      name: "Sunflower",
      emoji: "🌻",
      badge: "Optimism",
      desc: "Radiant golden rays that turn toward light and warmth."
    },
    {
      id: "lavender",
      variety: "French Provence",
      name: "Lavender",
      emoji: "🪻",
      badge: "Deep Calm",
      desc: "Soft purple floral spikes with calming restorative aroma."
    },
    {
      id: "ficus",
      variety: "Zen Bonsai Ficus",
      name: "Bonsai",
      emoji: "🪴",
      badge: "Inner Balance",
      desc: "Grounded ancient stems fostering quiet presence."
    },
    {
      id: "lotus",
      variety: "Emergent Water Lotus",
      name: "Lotus",
      emoji: "🪷",
      badge: "Purity & Grace",
      desc: "Serene aquatic bloom rising above troubled waters."
    },
    {
      id: "fern",
      variety: "Woodland Maidenhair",
      name: "Fern",
      emoji: "🌱",
      badge: "Gentleness",
      desc: "Delicate fronds thriving on soft morning moisture."
    }
  ];

  // 8 Pot styles
  const potOptions = [
    { id: "ceramic_ribbed", name: "Warm Linen", color: "#ebe1d5" },
    { id: "terracotta", name: "Warm Terracotta", color: "#d3927d" },
    { id: "unglazed_stone", name: "Unglazed Stone", color: "#c7beb3" },
    { id: "celadon_green", name: "Celadon Sage", color: "#a9ad8a" },
    { id: "pastel_rose", name: "Pastel Rose", color: "#f2c4c0" },
    { id: "lavender_glaze", name: "Lavender Glaze", color: "#d4c2e6" },
    { id: "matte_obsidian", name: "Matte Obsidian", color: "#4a483e" },
    { id: "sky_mineral", name: "Sky Mineral", color: "#b8d5db" }
  ];

  // Companions
  const companionOptions = [
    { id: "butterfly", name: "Blue Morpho", emoji: "🦋" },
    { id: "honeybee", name: "Honeybee", emoji: "🐝" },
    { id: "ladybug", name: "Ladybug", emoji: "🐞" },
    { id: "firefly", name: "Firefly", emoji: "✨" },
    { id: "dragonfly", name: "Dragonfly", emoji: "🌱" }
  ];

  // Handle Plant Seed Adoption
  const handleAdoptSeed = (e) => {
    e.preventDefault();
    const seed = seedOptions.find((s) => s.id === selectedSeed) || seedOptions[0];
    adoptPlant({
      plantType: seed.id,
      variety: seed.variety,
      name: customName.trim() || seed.name,
      intention: intentionText.trim() || "Growing gently without pressure",
      potStyle: selectedPot,
      flowerType: selectedFlower,
      companion: selectedCompanion,
      companionName: companionOptions.find((c) => c.id === selectedCompanion)?.name || "Blue Morpho"
    });
    setIsSelectingSeed(false);
    triggerCelebration();
    showToast(`Planted ${customName.trim() || seed.name}! Let's begin your wellness journey 🌸`, "potted_plant");
  };

  // Handle Save Customization
  const handleSaveCustomization = (e) => {
    e.preventDefault();
    customizePlant({
      name: customName.trim() || plant?.name,
      potStyle: selectedPot,
      companion: selectedCompanion,
      flowerType: selectedFlower
    });
    setIsCustomizing(false);
    showToast("Plant appearance updated ✨", "palette");
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-6 pb-20 pt-2 animate-in fade-in duration-300">
      {/* Step Indicator & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-1">
            <span className="material-symbols-outlined text-sm">potted_plant</span>
            <span>Step 1 of 6 • Botanical Haven</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold tracking-tight">
            {plant?.hasSelectedSeed && !isSelectingSeed
              ? `${user?.name?.split(" ")[0] || "Your"}’s Mindful Plant`
              : "Choose Your Plant Seed"}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl">
            {plant?.hasSelectedSeed && !isSelectingSeed
              ? "Tend to your companion daily. It grows with every mindful pause you take."
              : "Select a plant seed, choose an artisan pot, and give your companion a name."}
          </p>
        </div>

        {/* Drops indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-2xl bg-tertiary-fixed/60 border border-outline-variant/30">
          <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
            water_drop
          </span>
          <span className="text-xs font-bold text-tertiary">{user?.waterDrops || 0} drops available</span>
        </div>
      </div>

      {/* ================= 1. PLANT SEED SELECTION VIEW ================= */}
      {isSelectingSeed ? (
        <form onSubmit={handleAdoptSeed} className="space-y-6">
          {/* Seeds Selection Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
              1. Choose A Plant Seed 🌱
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {seedOptions.map((seed) => {
                const isSelected = selectedSeed === seed.id;
                return (
                  <div
                    key={seed.id}
                    onClick={() => {
                      setSelectedSeed(seed.id);
                      if (!customName || customName === "Pip") {
                        setCustomName(seed.name);
                      }
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all text-left flex flex-col justify-between gap-3 ${isSelected
                        ? "bg-primary-container/40 border-primary shadow-xs ring-2 ring-primary/30"
                        : "bg-surface-container-low border-outline-variant/40 hover:bg-surface-container"
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-2xl shadow-2xs">
                        {seed.emoji}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                        {seed.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-sm font-bold text-on-surface">{seed.variety}</h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">{seed.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pot Style Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
              2. Select An Artisan Pot 🪴
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {potOptions.map((pot) => {
                const isSelected = selectedPot === pot.id;
                return (
                  <button
                    type="button"
                    key={pot.id}
                    onClick={() => setSelectedPot(pot.id)}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${isSelected
                        ? "bg-surface-container-high border-primary ring-2 ring-primary/40 font-bold"
                        : "bg-surface-container-low border-outline-variant/30 hover:bg-surface-container"
                      }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full shrink-0 border border-black/10 shadow-2xs"
                      style={{ backgroundColor: pot.color }}
                    />
                    <span className="text-xs text-on-surface truncate">{pot.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plant Name & Companion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="plant-name-input" className="text-xs font-bold text-on-surface uppercase tracking-wider">
                3. Name Your Plant
              </label>
              <input
                id="plant-name-input"
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Fernie, Sunny, Serenity"
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                4. Garden Companion
              </label>
              <div className="flex gap-2">
                {companionOptions.map((comp) => (
                  <button
                    type="button"
                    key={comp.id}
                    onClick={() => setSelectedCompanion(comp.id)}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1 border transition-all ${selectedCompanion === comp.id
                        ? "bg-primary-container text-on-primary-container border-primary font-bold"
                        : "bg-surface-container-low border-outline-variant/30 hover:bg-surface-container text-on-surface"
                      }`}
                  >
                    <span>{comp.emoji}</span>
                    <span className="hidden sm:inline text-[11px]">{comp.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2">
            {plant?.hasSelectedSeed && (
              <button
                type="button"
                onClick={() => setIsSelectingSeed(false)}
                className="px-4 py-2 rounded-xl text-xs text-on-surface-variant hover:bg-surface-container"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="ml-auto px-6 py-3 rounded-full bg-primary text-on-primary text-xs font-bold shadow-md hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-2 active:scale-95"
            >
              <span>Plant & Begin Sanctuary (+25 Drops)</span>
              <span className="material-symbols-outlined text-sm">local_florist</span>
            </button>
          </div>
        </form>
      ) : (
        /* ================= 2. ACTIVE PLANT DASHBOARD VIEW ================= */
        <div className="space-y-6">
          {/* Main Plant Showcase Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Visual Plant Art (5 cols) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container-low/60 border border-outline-variant/20 relative">
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface text-primary text-[11px] font-bold shadow-2xs">
                <span>Stage {plant?.stage || 1}</span>
                <span>•</span>
                <span>{plant?.stageTitle || "Tender Seedling"}</span>
              </div>

              <div className="py-4">
                <PlantSVG
                  stage={plant?.stage || 1}
                  potStyle={plant?.potStyle || "ceramic_ribbed"}
                  flowerType={plant?.flowerType || "rose_bud"}
                  companion={plant?.companion || "butterfly"}
                  size="lg"
                />
              </div>

              <div className="text-center mt-2">
                <span className="text-xs text-on-surface-variant font-medium">
                  Companion: {plant?.companionName || "Blue Morpho Butterfly"}
                </span>
              </div>
            </div>

            {/* Plant Care & Info (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-primary">
                    {plant?.variety || "Monstera Deliciosa"}
                  </span>
                  <button
                    onClick={() => setIsCustomizing(!isCustomizing)}
                    className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">tune</span>
                    <span>Customize</span>
                  </button>
                </div>

                <h2 className="font-serif text-3xl font-bold text-on-surface mt-1">
                  {plant?.name || "My Plant"}
                </h2>
                <p className="text-xs text-on-surface-variant italic mt-1">
                  “{plant?.tagline || "Growing gently without pressure"}”
                </p>
              </div>

              {/* Hydration Bar */}
              <div className="space-y-1.5 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">water_drop</span>
                    Hydration Level
                  </span>
                  <span className="font-bold text-primary">{plant?.hydration || 50}%</span>
                </div>
                <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, plant?.hydration || 50)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-on-surface-variant">
                  <span>Last tended: {plant?.lastWatered || "Just now"}</span>
                  <span>{plant?.dropsNeededForNextBloom || 25} drops to next bloom</span>
                </div>
              </div>

              {/* Water Button & Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => waterPlant(10)}
                  disabled={(user?.waterDrops || 0) < 10}
                  className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base">water_drop</span>
                  <span>Water Plant (-10 Drops)</span>
                </button>

                <button
                  onClick={() => setIsSelectingSeed(true)}
                  className="px-4 py-2.5 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high text-xs font-semibold border border-outline-variant/30 transition-colors"
                >
                  Plant Another Seed
                </button>
              </div>

              {/* Inline Customizer Form if active */}
              {isCustomizing && (
                <form
                  onSubmit={handleSaveCustomization}
                  className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-3 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-bold text-on-surface">Change Appearance</span>
                    <button
                      type="button"
                      onClick={() => setIsCustomizing(false)}
                      className="text-xs text-on-surface-variant hover:text-on-surface"
                    >
                      Done
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="rename-plant-input" className="text-[11px] font-medium text-on-surface-variant">
                      Plant Name
                    </label>
                    <input
                      id="rename-plant-input"
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-surface px-3 py-1.5 rounded-lg text-xs text-on-surface border border-outline-variant/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-on-surface-variant">Pot Style</label>
                    <div className="flex flex-wrap gap-1.5">
                      {potOptions.map((p) => (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => setSelectedPot(p.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1.5 border ${selectedPot === p.id
                              ? "bg-primary text-on-primary font-bold"
                              : "bg-surface text-on-surface border-outline-variant/30"
                            }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                          <span>{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-primary text-on-primary text-xs font-bold mt-2"
                  >
                    Save Changes
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Seamless Wellness Journey Next Step Card */}
          <div className="p-5 rounded-2xl bg-secondary-container/40 border border-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-xl">favorite_border</span>
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-on-surface">
                  Ready for today's wellness pause?
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Step 2: Check in with your baseline emotions before guided breathing.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTab("vibe_before");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 self-end sm:self-auto shrink-0 active:scale-95"
            >
              <span>Continue to Vibe Check (Before)</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
