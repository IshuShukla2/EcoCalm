import React, { useState } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";
import { PlantSVG } from "./PlantSVG";

export const PlantCustomizerModal = ({ isOpen, onClose }) => {
  const { plant, customizePlant, triggerCelebration, showToast } = useEcoCalm();

  const [activeTab, setActiveTab] = useState("pots"); // "pots", "flowers", "insects", "profile"
  const [selectedPot, setSelectedPot] = useState(plant.potStyle || "ceramic_ribbed");
  const [selectedFlower, setSelectedFlower] = useState(plant.flowerType || "rose_bud");
  const [selectedCompanion, setSelectedCompanion] = useState(plant.companion || "butterfly");
  const [plantName, setPlantName] = useState(plant.name || "Sir Photosynth-is");

  if (!isOpen) return null;

  // 8 Pot styles & colors
  const pots = [
    { id: "ceramic_ribbed", name: "Warm Linen", color: "#ebe1d5", desc: "Ribbed organic porcelain" },
    { id: "terracotta", name: "Warm Terracotta", color: "#d3927d", desc: "Sunbaked porous clay" },
    { id: "unglazed_stone", name: "Unglazed Stone", color: "#c7beb3", desc: "Rough river stone texture" },
    { id: "celadon_green", name: "Celadon Sage", color: "#a9ad8a", desc: "Traditional cracked jade glaze" },
    { id: "pastel_rose", name: "Pastel Rose", color: "#f2c4c0", desc: "Soft rosy earthenware" },
    { id: "lavender_glaze", name: "Lavender Glaze", color: "#d4c2e6", desc: "Dreamy lilac mineral ceramic" },
    { id: "matte_obsidian", name: "Matte Obsidian", color: "#4a483e", desc: "Smoky charcoal volcanic finish" },
    { id: "sky_mineral", name: "Sky Mineral", color: "#b8d5db", desc: "Cool powder blue slip cast" }
  ];

  // 6 Flower types
  const flowers = [
    { id: "rose_bud", name: "Tender Rose Bud", emoji: "🌹", desc: "Soft blush petals with gentle morning dew" },
    { id: "cherry_blossom", name: "Cherry Blossom (Sakura)", emoji: "🌸", desc: "Five-petal ephemeral spring bloom" },
    { id: "sunflower", name: "Golden Sunflower", emoji: "🌻", desc: "Radiant sunny rays facing the morning light" },
    { id: "lavender", name: "French Lavender", emoji: "🪻", desc: "Calming purple floral spikes with soothing aroma" },
    { id: "star_jasmine", name: "Star Jasmine", emoji: "⭐", desc: "Sweet night-blooming radiant white petals" },
    { id: "lotus", name: "Emergent Lotus", emoji: "🪷", desc: "Graceful water bloom symbolizing mindful resilience" }
  ];

  // 6 Insects & Garden Companions
  const companions = [
    { id: "butterfly", name: "Blue Morpho Butterfly", emoji: "🦋", desc: "Iridescent azure wings fluttering gently" },
    { id: "honeybee", name: "Sunlit Honeybee", emoji: "🐝", desc: "Fuzzy pollinator seeking sweet flower nectar" },
    { id: "ladybug", name: "Garden Ladybug", emoji: "🐞", desc: "Polka-dot luck charm resting on the stem" },
    { id: "firefly", name: "Glowing Firefly", emoji: "✨", desc: "Warm luminescent beacon pulsing at dusk" },
    { id: "dragonfly", name: "Emerald Dragonfly", emoji: "🌱", desc: "Speedy gossamer-winged sanctuary guardian" },
    { id: "hummingbird", name: "Ruby Hummingbird", emoji: "🐦", desc: "Fast-hovering emerald nectar lover" }
  ];

  const handleSave = () => {
    customizePlant({
      name: plantName.trim() || plant.name,
      potStyle: selectedPot,
      flowerType: selectedFlower,
      companion: selectedCompanion,
      companionName: companions.find(c => c.id === selectedCompanion)?.name || "Blue Morpho"
    });
    triggerCelebration();
    showToast("Sanctuary conservatory updated with your style! ✨", "palette");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl">palette</span>
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-on-surface font-semibold">
                Conservatory Customizer 🪴
              </h2>
              <p className="text-xs text-on-surface-variant">
                Personalize your pot color, flower variety, and garden insect companion.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Body Grid: Left Preview + Right Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto flex-1">
          {/* Left Preview Pane (5 cols) */}
          <div className="md:col-span-5 bg-surface-container-low p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-outline-variant/30 text-center">
            <div className="mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary-fixed/40 px-2.5 py-1 rounded-full">
                Live Botanical Preview
              </span>
            </div>

            {/* Live Plant SVG with instant updates */}
            <div className="py-2">
              <PlantSVG
                stage={plant.stage || 3}
                potStyle={selectedPot}
                flowerType={selectedFlower}
                companion={selectedCompanion}
                size="md"
              />
            </div>

            <div className="mt-2 space-y-1">
              <h3 className="font-serif text-lg font-bold text-on-surface">
                {plantName || "Sir Photosynth-is"}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Stage {plant.stage || 3}: {plant.stageTitle || "Flourishing Sapling"}
              </p>
            </div>

            {/* Selected Summary Pill */}
            <div className="mt-4 p-3 rounded-2xl bg-surface-container-lowest/80 text-[11px] text-left w-full space-y-1 border border-outline-variant/20">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Pot:</span>
                <span className="font-semibold text-on-surface capitalize">{pots.find(p => p.id === selectedPot)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Flower:</span>
                <span className="font-semibold text-on-surface capitalize">{flowers.find(f => f.id === selectedFlower)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Companion:</span>
                <span className="font-semibold text-on-surface capitalize">{companions.find(c => c.id === selectedCompanion)?.name}</span>
              </div>
            </div>
          </div>

          {/* Right Customization Controls (7 cols) */}
          <div className="md:col-span-7 p-5 sm:p-6 flex flex-col">
            {/* Category Sub-tabs */}
            <div className="grid grid-cols-4 p-1 bg-surface-container-low rounded-2xl mb-5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("pots")}
                className={`py-2 rounded-xl transition-all ${
                  activeTab === "pots"
                    ? "bg-surface-container-lowest text-primary shadow-xs font-bold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Pot Color (8)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("flowers")}
                className={`py-2 rounded-xl transition-all ${
                  activeTab === "flowers"
                    ? "bg-surface-container-lowest text-primary shadow-xs font-bold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Flowers (6)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("insects")}
                className={`py-2 rounded-xl transition-all ${
                  activeTab === "insects"
                    ? "bg-surface-container-lowest text-primary shadow-xs font-bold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Insects (6)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`py-2 rounded-xl transition-all ${
                  activeTab === "profile"
                    ? "bg-surface-container-lowest text-primary shadow-xs font-bold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Name 🏷️
              </button>
            </div>

            {/* Tab: Pots */}
            {activeTab === "pots" && (
              <div className="space-y-4">
                <p className="text-xs text-on-surface-variant">
                  Select an artisanal planter ceramic finish to complement your sanctuary aesthetic:
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {pots.map((pot) => {
                    const isSelected = selectedPot === pot.id;
                    return (
                      <button
                        type="button"
                        key={pot.id}
                        onClick={() => setSelectedPot(pot.id)}
                        className={`flex items-start gap-3 p-3 rounded-2xl text-left transition-all ${
                          isSelected
                            ? "bg-primary-container/20 ring-2 ring-primary shadow-xs"
                            : "bg-surface-container-low hover:bg-surface-container"
                        }`}
                      >
                        <div
                          className="w-7 h-7 rounded-full shadow-inner shrink-0 mt-0.5 border border-outline-variant/40"
                          style={{ backgroundColor: pot.color }}
                        />
                        <div>
                          <div className="text-xs font-bold text-on-surface">{pot.name}</div>
                          <div className="text-[10px] text-on-surface-variant leading-tight mt-0.5">{pot.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Flowers */}
            {activeTab === "flowers" && (
              <div className="space-y-4">
                <p className="text-xs text-on-surface-variant">
                  Select the terminal apex blossom that blooms atop your virtual plant:
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {flowers.map((fl) => {
                    const isSelected = selectedFlower === fl.id;
                    return (
                      <button
                        type="button"
                        key={fl.id}
                        onClick={() => setSelectedFlower(fl.id)}
                        className={`flex items-start gap-3 p-3 rounded-2xl text-left transition-all ${
                          isSelected
                            ? "bg-secondary-container/30 ring-2 ring-secondary shadow-xs"
                            : "bg-surface-container-low hover:bg-surface-container"
                        }`}
                      >
                        <span className="text-2xl shrink-0">{fl.emoji}</span>
                        <div>
                          <div className="text-xs font-bold text-on-surface">{fl.name}</div>
                          <div className="text-[10px] text-on-surface-variant leading-tight mt-0.5">{fl.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Insects & Companions */}
            {activeTab === "insects" && (
              <div className="space-y-4">
                <p className="text-xs text-on-surface-variant">
                  Invite a gentle garden companion or friendly insect to pollinate your greenhouse:
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {companions.map((comp) => {
                    const isSelected = selectedCompanion === comp.id;
                    return (
                      <button
                        type="button"
                        key={comp.id}
                        onClick={() => setSelectedCompanion(comp.id)}
                        className={`flex items-start gap-3 p-3 rounded-2xl text-left transition-all ${
                          isSelected
                            ? "bg-tertiary-fixed/40 ring-2 ring-tertiary shadow-xs"
                            : "bg-surface-container-low hover:bg-surface-container"
                        }`}
                      >
                        <span className="text-2xl shrink-0">{comp.emoji}</span>
                        <div>
                          <div className="text-xs font-bold text-on-surface">{comp.name}</div>
                          <div className="text-[10px] text-on-surface-variant leading-tight mt-0.5">{comp.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab: Plant Name */}
            {activeTab === "profile" && (
              <div className="space-y-4">
                <p className="text-xs text-on-surface-variant">
                  Give your plant companion a playful Gen Z nickname:
                </p>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-on-surface" htmlFor="custom-plant-name">
                    Plant Nickname:
                  </label>
                  <input
                    id="custom-plant-name"
                    type="text"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    className="w-full bg-surface-container-low px-4 py-3 rounded-2xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-on-surface-variant block mb-2">
                    Popular Gen Z suggestions:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["Boba", "Delulu Fern", "Sir Photosynth-is", "Matcha Latte", "Sprout McQueen", "Fernie Sanders"].map(name => (
                      <button
                        type="button"
                        key={name}
                        onClick={() => setPlantName(name)}
                        className="px-3 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant hover:bg-surface-container-high transition-colors"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-outline-variant/30 bg-surface-container-lowest flex items-center justify-between">
          <span className="text-xs text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-primary">spa</span>
            Free cosmetic customization • Always unlocked
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container shadow-xs active:scale-95 transition-all"
            >
              Save Customizations ✨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
