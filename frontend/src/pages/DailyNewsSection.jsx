import React, { useState, useEffect } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const DailyNewsSection = () => {
  const { setActiveTab, showToast, newsArticles } = useEcoCalm();
  const [articles, setArticles] = useState(newsArticles || []);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchFreshNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setArticles(data);
          showToast("Refreshed with today's positive headlines ☀️", "newspaper");
        }
      }
    } catch (err) {
      // Retain current articles gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (articles.length === 0) {
      fetchFreshNews();
    }
  }, []);

  const filteredArticles = articles.filter((art) => {
    if (filter === "all") return true;
    return art.category?.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-6 pb-20 pt-2 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-1">
            <span className="material-symbols-outlined text-sm">newspaper</span>
            <span>Step 4 of 6 • Daily Positive News</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold tracking-tight">
            Uplifting Global Headlines
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl">
            A small, verified digest of restorative science, mental wellness, and healing nature.
          </p>
        </div>

        {/* Refresh Live Feed Button */}
        <button
          onClick={fetchFreshNews}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/30 shadow-2xs active:scale-95 transition-all"
        >
          <span className={`material-symbols-outlined text-sm text-primary ${loading ? "animate-spin" : ""}`}>
            refresh
          </span>
          <span>{loading ? "Checking feeds..." : "Check Live Updates"}</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: "all", label: "All Curated" },
          { id: "nature", label: "Nature & Rewilding 🌱" },
          { id: "wellness", label: "Mental Wellness 🧠" },
          { id: "lifestyle", label: "Lifestyle 🪴" }
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setFilter(chip.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filter === chip.id
                ? "bg-primary text-on-primary font-bold shadow-2xs"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-outline-variant/30"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Small Selection of News Cards (4 to 5 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArticles.slice(0, 4).map((item) => (
          <article
            key={item.id}
            className="bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:border-primary/40 hover:shadow-sm transition-all group"
          >
            <div className="relative h-44 overflow-hidden bg-surface-container-low">
              <img
                src={item.image}
                alt={item.headline}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-xs text-[10px] font-bold text-on-surface shadow-2xs">
                {item.category || "Good News"}
              </span>
            </div>

            <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
              <div className="space-y-1.5">
                <h3 className="font-serif text-base sm:text-lg font-bold text-on-surface leading-snug group-hover:text-primary transition-colors">
                  {item.headline}
                </h3>
                <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
                <span>{item.source || "Positive Journal"}</span>
                <a
                  href={item.url || "https://goodnewsnetwork.org"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                >
                  <span>Read Article</span>
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Seamless Journey Next Step Card */}
      <div className="p-5 rounded-2xl bg-secondary-container/40 border border-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined text-xl">palette</span>
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-on-surface">
              Next in your journey: Mindful Hobbies & Play
            </h3>
            <p className="text-xs text-on-surface-variant">
              Step 5: Engage in tactile, creative activities without pressure or deadlines.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveTab("hobbies");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 self-end sm:self-auto shrink-0 active:scale-95"
        >
          <span>Continue to Mindful Hobbies</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

