import React, { useState } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const ExploreHobbies = () => {
  const { quests, completeQuest, submitQuest, showToast } = useEcoCalm();

  const [activeCategory, setActiveCategory] = useState("all");
  const [timeFilter, setTimeFilter] = useState("Any");
  const [costFilter, setCostFilter] = useState("Any");
  const [settingFilter, setSettingFilter] = useState("Any");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeQuestModal, setActiveQuestModal] = useState(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  // New quest form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("crafts");
  const [newDuration, setNewDuration] = useState("15 mins");

  const categories = [
    { id: "all", label: "All Quests", count: quests.length },
    { id: "crafts", label: "Arts & Crafts 🧶" },
    { id: "reading", label: "Reading & Writing 📖" },
    { id: "games", label: "Games & Puzzles ♟️" },
    { id: "movement", label: "Sports & Movement 🏃" },
    { id: "nature", label: "Nature & Environment 🌿" },
    { id: "wellness", label: "Everyday Wellness 🍵" }
  ];

  const filteredQuests = quests.filter((q) => {
    if (activeCategory !== "all" && q.category !== activeCategory) return false;
    if (timeFilter !== "Any" && q.timeBucket !== timeFilter) return false;
    if (costFilter !== "Any" && q.costBucket !== costFilter) return false;
    if (settingFilter !== "Any" && q.setting.toLowerCase() !== settingFilter.toLowerCase()) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return q.title.toLowerCase().includes(term) || q.description.toLowerCase().includes(term);
    }
    return true;
  });

  const handleCreateQuest = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    submitQuest({
      title: newTitle.trim(),
      description: newDesc.trim() || "An unhurried offline craft.",
      category: newCategory,
      duration: newDuration,
      dropsReward: 25
    });
    setSubmitModalOpen(false);
    setNewTitle("");
    setNewDesc("");
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-6 pb-20 pt-4">
      {/* ================= HEADER & DIRECTORY ================= */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container text-tertiary">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_florist
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold">Side Quest Directory • Vol. 04</span>
          </div>

          <div className="inline-flex items-center gap-2 px-space-md py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>{quests.length} curated offline activities ready today</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8 space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl text-on-surface tracking-tight font-medium">
              Find your next <span className="italic text-primary">offline obsession.</span>
            </h1>
            <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
              Curated low-pressure side quests that don't involve a screen. Earn water drops for every tiny craft and nurture your mindful garden.
            </p>
          </div>

          <div className="lg:col-span-4 flex items-center justify-start lg:justify-end">
            <div className="bg-surface-container-low p-4 rounded-2xl shadow-xs border border-outline-variant/30 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">eco</span>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">Daily Screen Breaker</p>
                <p className="font-serif text-lg text-primary font-semibold">45m Saved Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tactile Search Bar */}
        <div className="relative w-full max-w-2xl">
          <div className="relative flex items-center bg-surface-container-lowest rounded-full shadow-xs border border-outline-variant/40 p-1.5 focus-within:shadow-md focus-within:border-primary/50 transition-all">
            <div className="pl-4 pr-2 flex items-center text-on-surface-variant">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hobbies, crafts, outdoor quests... (e.g. crochet, sourdough, stargazing)"
              className="w-full bg-transparent font-sans text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none py-2 pr-3"
            />
            <button
              onClick={() => showToast(`Filtering for: ${searchTerm || "all quests"}`, "search")}
              className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-all active:scale-95"
            >
              Discover
            </button>
          </div>
        </div>

        {/* Filter Matrix */}
        <div className="flex flex-col gap-3 pt-2">
          {/* Main Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap shadow-xs ${
                    isActive
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.count !== undefined && <span className="text-[10px] opacity-80">({cat.count})</span>}
                </button>
              );
            })}
          </div>

          {/* Micro-Filters: Duration, Cost, Setting */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-xl border border-outline-variant/30">
              <span className="text-on-surface-variant flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-sm">schedule</span> Time:
              </span>
              {["Any", "<15", "30", "1hr"].map(t => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={`px-2 py-0.5 rounded-full transition-colors ${
                    timeFilter === t
                      ? "bg-surface-container-highest font-bold text-on-surface"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {t === "<15" ? "< 15m" : t === "30" ? "30m" : t === "1hr" ? "1h+" : "Any"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-xl border border-outline-variant/30">
              <span className="text-on-surface-variant flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-sm">savings</span> Cost:
              </span>
              {["Any", "free", "thrift"].map(c => (
                <button
                  key={c}
                  onClick={() => setCostFilter(c)}
                  className={`px-2 py-0.5 rounded-full transition-colors ${
                    costFilter === c
                      ? "bg-surface-container-highest font-bold text-on-surface"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {c === "free" ? "Free" : c === "thrift" ? "Thrift" : "Any"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-xl border border-outline-variant/30">
              <span className="text-on-surface-variant flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-sm">filter_hdr</span> Setting:
              </span>
              {["Any", "Indoor", "Outdoor"].map(s => (
                <button
                  key={s}
                  onClick={() => setSettingFilter(s)}
                  className={`px-2 py-0.5 rounded-full transition-colors ${
                    settingFilter === s
                      ? "bg-surface-container-highest font-bold text-on-surface"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= ACTIVE QUEST SPOTLIGHT RIBBON ================= */}
      <div className="bg-gradient-to-r from-tertiary-fixed via-surface-container-low to-secondary-container/40 p-5 rounded-2xl shadow-xs border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              flare
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-tertiary">Weekly Community Quest</span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface text-[10px] font-semibold">
                Ends in 2 days
              </span>
            </div>
            <h3 className="font-serif text-lg text-on-surface font-semibold">
              Make a botanical bookmark with pressed kitchen herbs
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1 text-tertiary text-xs font-bold px-2">
            <span className="material-symbols-outlined text-base">water_drop</span>
            <span>+40 drops</span>
          </div>
          <button
            onClick={() => setActiveQuestModal({
              id: "spotlight_1",
              title: "Make a botanical bookmark with pressed kitchen herbs",
              description: "Collect fresh rosemary or mint, press inside a heavy book for an afternoon, and tie with a twine loop.",
              dropsReward: 40,
              instructions: [
                "Find 1 sprig of garden or kitchen herbs",
                "Press between wax or parchment paper inside a book",
                "Write your favorite calming sentence on cardstock",
                "Tie a gentle loop with natural string"
              ]
            })}
            className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container shadow-xs active:scale-95 transition-all"
          >
            Claim 5-Min Task
          </button>
        </div>
      </div>

      {/* ================= CURATED QUEST CARDS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuests.map((quest) => (
          <div
            key={quest.id}
            className="bg-surface-container-lowest rounded-3xl p-6 shadow-xs border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-xs">local_florist</span>
                  {quest.tag || "Offline Respite"}
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-primary">
                  <span className="material-symbols-outlined text-sm">water_drop</span>
                  +{quest.dropsReward}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-xl text-on-surface font-semibold group-hover:text-primary transition-colors">
                  {quest.title}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed line-clamp-3">
                  {quest.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-on-surface-variant pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container">
                  ⏱️ {quest.duration}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container">
                  🏠 {quest.setting}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container">
                  💰 {quest.cost}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-6 mt-2 border-t border-outline-variant/20">
              <button
                onClick={() => completeQuest(quest.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-semibold transition-all active:scale-95 shadow-xs ${
                  quest.completed
                    ? "bg-tertiary text-on-tertiary"
                    : "bg-primary text-on-primary hover:bg-primary-container"
                }`}
              >
                <span>{quest.completed ? "Done! ✓ (+Drops)" : "Start Quest 🌱"}</span>
              </button>

              <button
                onClick={() => setActiveQuestModal(quest)}
                className="p-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant"
                title="View Guide"
              >
                <span className="material-symbols-outlined text-base">visibility</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= GENTLE SUBMIT YOUR OWN HOBBY BANNER ================= */}
      <div className="bg-surface-container-low rounded-3xl p-6 sm:p-8 border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-bold text-tertiary">Gentle Reminder</span>
          <h4 className="font-serif text-xl text-on-surface font-semibold">Have your own weird little hobby?</h4>
          <p className="text-xs text-on-surface-variant max-w-lg">
            From collecting smooth river pebbles to hand-mending vintage socks, share your offline ritual and inspire the community garden.
          </p>
        </div>
        <button
          onClick={() => setSubmitModalOpen(true)}
          className="px-6 py-3 rounded-full bg-surface-container-lowest text-on-surface font-semibold text-xs hover:bg-surface-container-high shadow-xs border border-outline-variant/40 transition-colors whitespace-nowrap"
        >
          Submit a Side Quest ✍️
        </button>
      </div>

      {/* ================= QUEST DETAIL MODAL ================= */}
      {activeQuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-outline-variant/30 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-tertiary font-bold uppercase tracking-wider">Side Quest Guide</span>
              <button onClick={() => setActiveQuestModal(null)} className="p-1 text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-semibold text-on-surface">{activeQuestModal.title}</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                {activeQuestModal.description}
              </p>
            </div>

            {activeQuestModal.instructions && activeQuestModal.instructions.length > 0 && (
              <div className="bg-surface-container-low p-4 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-primary block">Gentle Steps:</span>
                <ol className="space-y-1.5 text-xs text-on-surface list-decimal pl-4">
                  {activeQuestModal.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-primary font-bold">Reward: +{activeQuestModal.dropsReward} Water Drops 💧</span>
              <button
                onClick={() => {
                  completeQuest(activeQuestModal.id);
                  setActiveQuestModal(null);
                }}
                className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container shadow-xs active:scale-95 transition-all"
              >
                Mark Quest Complete ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBMIT SIDE QUEST MODAL ================= */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-semibold text-on-surface">Submit an Offline Side Quest</h3>
              <button onClick={() => setSubmitModalOpen(false)} className="p-1 text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateQuest} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-on-surface block mb-1">Quest Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scent Mapping Your Kitchen Spices"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Brief Description:</label>
                <textarea
                  rows={3}
                  placeholder="What's the gentle offline action?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface"
                  >
                    <option value="crafts">Arts & Crafts</option>
                    <option value="nature">Nature & Outdoors</option>
                    <option value="reading">Reading & Writing</option>
                    <option value="wellness">Everyday Wellness</option>
                    <option value="games">Games & Puzzles</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-on-surface block mb-1">Est. Time:</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-on-surface"
                  >
                    <option value="10 mins">10 mins</option>
                    <option value="15 mins">15 mins</option>
                    <option value="30 mins">30 mins</option>
                    <option value="1 hour">1 hour</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-full text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary-container shadow-xs"
                >
                  Share to Garden (+20 Drops)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
