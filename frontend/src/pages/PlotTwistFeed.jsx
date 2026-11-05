import React, { useState, useEffect } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const PlotTwistFeed = () => {
  const { stories, toggleStoryBookmark, submitStory, showToast } = useEcoCalm();

  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedStory, setSelectedStory] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [facts, setFacts] = useState([]);
  const [activeFactIdx, setActiveFactIdx] = useState(0);

  // New story form state
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newCategory, setNewCategory] = useState("healing");
  const [newSource, setNewSource] = useState("");

  const categories = [
    { id: "all", label: "All Stories (12 Verified)" },
    { id: "healing", label: "The World Is Healing 🌱" },
    { id: "humanity", label: "Faith in Humanity Restored 🤝" },
    { id: "science", label: "Science Ate 🔬" },
    { id: "nature", label: "Nature's Comeback Era 🦭" },
    { id: "tinywins", label: "Tiny Wins, Big Feelings ☕" }
  ];

  useEffect(() => {
    fetch("/api/facts")
      .then(res => res.json())
      .then(data => setFacts(data))
      .catch(() => {
        setFacts([
          {
            id: "fact_1",
            category: "Nature",
            emoji: "🌲",
            fact: "Trees in ancient forests communicate and share nourishment via subterranean mycorrhizal fungal networks, colloquially known as the 'Wood Wide Web'.",
            source: "Nature Journal / Suzanne Simard",
            sourceUrl: "https://nature.com"
          },
          {
            id: "fact_2",
            category: "Psychology",
            emoji: "🧠",
            fact: "Looking at natural fractals (like leaf veins, ferns, and coastlines) for just 20 seconds reduces physiological stress markers by up to 60%.",
            source: "American Psychological Association",
            sourceUrl: "https://apa.org"
          },
          {
            id: "fact_3",
            category: "Science",
            emoji: "☀️",
            fact: "Solar energy capacity added globally in the past 12 months surpassed all fossil fuels combined, accelerating the planetary energy transition.",
            source: "International Energy Agency",
            sourceUrl: "https://iea.org"
          }
        ]);
      });
  }, []);

  const filteredStories = stories.filter((s) => {
    if (activeCategory !== "all" && s.category !== activeCategory) return false;
    return true;
  });

  const featuredStory = stories.find(s => s.isFeatured) || stories[0];

  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * stories.length);
    setSelectedStory(stories[randomIndex]);
    showToast("Discovered a gentle ray of hope ✨", "auto_awesome");
  };

  const handleShareSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;
    submitStory({
      title: newTitle.trim(),
      summary: newSummary.trim(),
      category: newCategory,
      source: newSource.trim() || "Community Submitter"
    });
    setShareModalOpen(false);
    setNewTitle("");
    setNewSummary("");
    setNewSource("");
  };

  const currentFact = facts[activeFactIdx] || facts[0];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto space-y-8 pb-20 pt-4">
      {/* ================= EDITORIAL TOP BANNER ================= */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
              <span>Slow Journalism Sanctuary • Verified Daily</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-on-surface tracking-tight font-medium leading-tight">
              The Plot Twist Feed <span className="italic font-normal text-primary">🌍</span>
            </h1>

            <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-xl">
              Less doomscrolling. More growing. Verified restorative developments, ecological wins, daily nature facts, and zero algorithmic panic.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={handleSurpriseMe}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-tertiary text-base">auto_awesome</span>
              <span>Surprise Me with Hope ✨</span>
            </button>

            <button
              onClick={() => setShareModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-semibold transition-all shadow-md hover:bg-primary-container active:scale-95"
            >
              <span className="material-symbols-outlined text-base">favorite</span>
              <span>Share Something Good 💌</span>
              <span className="px-2 py-0.5 rounded-full bg-inverse-primary/30 text-on-primary text-[10px] font-bold">
                +25 drops
              </span>
            </button>
          </div>
        </div>

        {/* ================= STEP 7: DAILY NATURE & SCIENCE FACTS WIDGET ================= */}
        {currentFact && (
          <div className="p-5 rounded-3xl bg-surface-container-low border border-outline-variant/30 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-2xl shrink-0">
                {currentFact.emoji || "🌱"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-secondary bg-secondary-container/60 px-2 py-0.5 rounded-full">
                    Daily {currentFact.category} Fact
                  </span>
                  <span className="text-[11px] text-on-surface-variant">• Verified Source</span>
                </div>
                <p className="font-serif text-sm sm:text-base text-on-surface leading-snug">
                  "{currentFact.fact}"
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[11px] text-on-surface-variant">Source: {currentFact.source}</span>
                  {currentFact.sourceUrl && (
                    <a
                      href={currentFact.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-primary font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <span>Read Verification</span>
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => setActiveFactIdx(prev => (prev > 0 ? prev - 1 : facts.length - 1))}
                className="p-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface"
                title="Previous Fact"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <span className="text-[10px] text-on-surface-variant font-semibold">
                {activeFactIdx + 1} / {facts.length}
              </span>
              <button
                onClick={() => setActiveFactIdx(prev => (prev < facts.length - 1 ? prev + 1 : 0))}
                className="p-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface"
                title="Next Fact"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ================= CATEGORY FILTER PILLS ================= */}
      <section className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => {
          const isActive = activeCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap shadow-xs ${
                isActive
                  ? "bg-primary text-on-primary font-bold scale-102"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/30"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </section>

      {/* ================= FEATURED STORY HERO CARD ================= */}
      {featuredStory && (
        <section>
          <article className="relative overflow-hidden rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row transition-all hover:shadow-md">
            {/* Visual Column */}
            <div className="relative lg:w-5/12 min-h-[260px] lg:min-h-full overflow-hidden bg-surface-container-high">
              <img
                src={featuredStory.image}
                alt={featuredStory.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-surface/90 backdrop-blur-xs text-[11px] font-bold text-primary tracking-wide uppercase">
                  Featured Slow News
                </span>
                <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary text-[11px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">water_drop</span> +{featuredStory.dropsReward} Drops
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-surface text-[11px] font-medium">
                <span>{featuredStory.source}</span>
                <span>{featuredStory.location}</span>
              </div>
            </div>

            {/* Editorial Details */}
            <div className="lg:w-7/12 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-semibold">
                    <span className="material-symbols-outlined text-xs">nest_eco_leaf</span>
                    {featuredStory.categoryLabel}
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span className="text-xs text-on-surface-variant font-medium">{featuredStory.readTime}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold leading-snug">
                  {featuredStory.title}
                </h2>

                {featuredStory.quote && (
                  <div className="p-4 rounded-2xl bg-surface-container-low border-l-4 border-primary">
                    <p className="font-serif text-xs sm:text-sm text-on-surface italic">
                      "{featuredStory.quote}"
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-1">— {featuredStory.quoteAuthor}</p>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                  {featuredStory.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleStoryBookmark(featuredStory.id)}
                    className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface"
                  >
                    <span
                      className={`material-symbols-outlined text-lg ${featuredStory.bookmarked ? "text-primary" : ""}`}
                      style={featuredStory.bookmarked ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      bookmark
                    </span>
                    <span>{featuredStory.bookmarked ? "Saved" : "Save Story"}</span>
                  </button>

                  {featuredStory.sourceUrl && (
                    <a
                      href={featuredStory.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-on-surface-variant hover:text-primary flex items-center gap-1"
                    >
                      <span>Source</span>
                      <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setSelectedStory(featuredStory)}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container shadow-xs active:scale-95 transition-all"
                >
                  <span>Read Full Story</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* ================= CURATED SIGNALS OF HOPE GRID ================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-2xl font-semibold text-on-surface">Curated Signals of Hope</h3>
            <span className="text-xs text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-full">
              Non-Urgent • Hand-Verified
            </span>
          </div>
          <span className="text-xs text-on-surface-variant">Selected for peaceful balance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.filter(s => s.id !== featuredStory.id).map((story) => (
            <article
              key={story.id}
              className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 shadow-xs border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div className="space-y-3">
                {story.image && (
                  <div className="h-44 rounded-2xl overflow-hidden bg-surface-container">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span className="font-semibold text-primary">{story.categoryLabel}</span>
                  <span>{story.readTime}</span>
                </div>

                <h4 className="font-serif text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  {story.title}
                </h4>

                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                  {story.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-outline-variant/20">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <button
                    onClick={() => toggleStoryBookmark(story.id)}
                    className="p-1 rounded-full hover:bg-surface-container"
                    title="Bookmark"
                  >
                    <span
                      className={`material-symbols-outlined text-base ${story.bookmarked ? "text-primary" : ""}`}
                      style={story.bookmarked ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      bookmark
                    </span>
                  </button>

                  {story.sourceUrl && (
                    <a
                      href={story.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:text-primary"
                      title="External Source"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setSelectedStory(story)}
                  className="text-primary font-bold hover:underline flex items-center gap-1 text-xs"
                >
                  <span>Read Story</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </article>
          ))}

          {/* Submit Local Quiet Win Card */}
          <div className="bg-secondary-container/20 rounded-3xl p-6 border border-dashed border-secondary/40 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="material-symbols-outlined text-2xl text-secondary">mark_email_read</span>
              <h4 className="font-serif text-xl text-on-surface font-semibold">
                Know of something wholesome happening near you?
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Silent book clubs, pet cafes, community gardens, or acts of quiet courage. Our team verifies every story with zero sensationalism.
              </p>
            </div>

            <button
              onClick={() => setShareModalOpen(true)}
              className="mt-4 px-5 py-2.5 rounded-full bg-surface-container-lowest text-on-surface font-semibold text-xs hover:bg-surface-container-high shadow-xs border border-outline-variant/40 transition-colors"
            >
              Submit a Local Quiet Win 💌
            </button>
          </div>
        </div>
      </section>

      {/* ================= FULL STORY READER MODAL ================= */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold">
                +{selectedStory.dropsReward} Water Drops Earned
              </span>
              <button onClick={() => setSelectedStory(null)} className="p-1 text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {selectedStory.image && (
              <div className="h-60 rounded-2xl overflow-hidden bg-surface-container-high">
                <img src={selectedStory.image} alt={selectedStory.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>{selectedStory.source} • {selectedStory.location} • {selectedStory.timeAgo}</span>
                {selectedStory.sourceUrl && (
                  <a
                    href={selectedStory.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Original Source</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                )}
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-on-surface">
                {selectedStory.title}
              </h2>

              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                {selectedStory.summary}
              </p>

              {selectedStory.quote && (
                <blockquote className="p-4 rounded-2xl bg-surface-container-low border-l-4 border-primary text-xs sm:text-sm font-serif italic">
                  "{selectedStory.quote}"
                  <span className="block not-italic text-xs text-on-surface-variant mt-1">— {selectedStory.quoteAuthor}</span>
                </blockquote>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
              <button
                onClick={() => {
                  toggleStoryBookmark(selectedStory.id);
                  showToast("Story saved to quiet reading journal! ✨");
                }}
                className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">bookmark</span>
                <span>{selectedStory.bookmarked ? "Saved" : "Save Story"}</span>
              </button>

              <button
                onClick={() => setSelectedStory(null)}
                className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container shadow-xs"
              >
                Close Story Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SHARE GOOD NEWS MODAL ================= */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-semibold">Share Something Good 💌</h3>
              <button onClick={() => setShareModalOpen(false)} className="p-1 text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleShareSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Community reclaims empty parking lot for native bees"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-surface-container-low p-2.5 rounded-xl text-xs text-on-surface border border-outline-variant/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-surface-container-low p-2.5 rounded-xl text-xs text-on-surface border border-outline-variant/30"
                >
                  <option value="healing">🌱 The World Is Healing</option>
                  <option value="humanity">🤝 Faith in Humanity Restored</option>
                  <option value="science">🔬 Science Ate</option>
                  <option value="nature">🦭 Nature's Comeback Era</option>
                  <option value="tinywins">☕ Tiny Wins, Big Feelings</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Summary of Hope</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What happened? Why does it bring you peace?"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full bg-surface-container-low p-2.5 rounded-xl text-xs text-on-surface border border-outline-variant/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Source / Verification Link</label>
                <input
                  type="text"
                  placeholder="e.g. Local neighborhood paper or link"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full bg-surface-container-low p-2.5 rounded-xl text-xs text-on-surface border border-outline-variant/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShareModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container shadow-xs"
                >
                  Submit Story (+25 Drops)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
