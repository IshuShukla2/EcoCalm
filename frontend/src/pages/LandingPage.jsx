import React, { useState } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";
import { AuthModal } from "../components/AuthModal";

export const LandingPage = () => {
  const { setActiveTab, adoptPlant, user, isAuthenticated, openAuthModal, isAuthModalOpen, closeAuthModal, authModalMode } = useEcoCalm();

  const [selectedPlant, setSelectedPlant] = useState({
    id: "monstera",
    name: "Monstera Deliciosa",
    tagline: "The Delulu Dreamer"
  });

  const [plantCustomName, setPlantCustomName] = useState("Sir Photosynth-is");
  const [selectedIntention, setSelectedIntention] = useState("🌿 10 mins phone-free");
  const [selectedPot, setSelectedPot] = useState("ceramic_ribbed");
  const [selectedCompanion, setSelectedCompanion] = useState("butterfly");

  const seedlings = [
    {
      id: "monstera",
      name: "Monstera Deliciosa",
      tagline: "The Delulu Dreamer",
      desc: "Broad green leaves, steady slow growth. Loves big aspirations and unhurried afternoons.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnPVq7LAffsT4yj5oJUdYb4zkmyQzt3W-i7WHWj07H4z-EGNrOQAzhbmEMoWefssdDJn2Uequt52Lkj-_y5FAion_A1pTTrr8ZN-psyD3NQRN5BTgz_32eNP6_hl_0i6zb_wWuMFtyGulTtLQasrcXGISOjlRCLUyjiitu7h8t99NEtqlwZkoXy7iH35GXNn_0iGF3SRLiAVaDCjYX3ctBSSyJtLhqTJaq_QWmCop-lUKF9gi7O310pQ"
    },
    {
      id: "sunflower",
      name: "Wild Sunflower",
      tagline: "Sunny Optimist",
      desc: "Golden warm blooms. Loves sunlight, hydration pauses, and neighborhood walking quests.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBciM9s5DW5sIjkue7zFk67NEX71dllfgNpLtesYYiYB07OzMr4WJAEVf1R2fa3nx2YkWUVefqviI1FkHAJjdMDAcOJASl4u4z9QSkKiveAxiDawqqgtv26mL4K8Oyh-MskAlB5VAKcHFf1pHQq9_h32vw2tBkHqWrsStQcRLrZrnbBuG_uz1QYnv4M0MuggX_9Zc_oyAUn2uz6kQ2QLEOLktqFeSEXSURHSFpSKKyQx54TO3YHGma7_A"
    },
    {
      id: "lavender",
      name: "French Lavender",
      tagline: "Somatic Soother",
      desc: "Calming aromatic lavender spikes. Harmonizes beautifully with 4-7-8 breathing sessions.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_vjc1P4UJR99Kx4DP4_B8v4tygAHdXzVBGsWEJPAuSNyu7ayh8wpPN18-X9kzcjbk7SSlXUcVjzOHmwvL6hKP_9mHRB0BPTHbxV9RDGp7Yh8myFpeyxqnr_slljigPvblCzMHTBnaT6riVy0m7kV0MX67jPAn8lI69ylzBExNyfvqIwkpYnKi4tAHbyXY7IlIvSvj-W8XQCCd-XyU3cbSXaGnXE5YrQe0Y68S8rdiHqjiU6B4OsrKjw"
    },
    {
      id: "ficus",
      name: "Tiny Ficus",
      tagline: "The Gentle Pacer",
      desc: "Bonsai resilience. Survives anything, stays unfazed, teaches the art of unhurried patience.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8fQSBn3BkdwwJUKH1SsXjSe0crTtGnIgY4MZoYzAtXtF8Z0T3-CoDduO6tzoG1GiA-wK27ofCwli6wtqvQhqqoGamxP0jkgZtcRwPP43XLZDPec0L7r3o5HesUbqwk6Qx2G6RQgRVU6ld2Cfuyp8735vKPFCt6lxOgWcxqHvEA7yfeV0B83MMq-Pas2ESo3a1MTiYaCbL0Fus2ap_3pYjOXerTGby68JWavYIj7aBKRuPG_TvSfTkrQ"
    }
  ];

  const intentions = [
    "🌿 10 mins phone-free",
    "🫁 1 mindful breath break",
    "📖 Read 5 pages",
    "✨ Zero pressure today"
  ];

  const handleFinishAdoption = () => {
    const adoptionPayload = {
      plantType: selectedPlant.id,
      name: plantCustomName,
      variety: selectedPlant.name,
      intention: selectedIntention,
      potStyle: selectedPot,
      companion: selectedCompanion
    };

    if (!isAuthenticated) {
      // User must log in or sign up to finalize adoption and enter dashboard
      adoptPlant(adoptionPayload);
      openAuthModal("signup");
    } else {
      adoptPlant(adoptionPayload);
      setActiveTab("home");
    }
  };

  return (
    <div className="w-full min-h-screen bg-background text-on-surface">
      {/* Decorative ambient background glows */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full bg-tertiary-fixed/30 blur-3xl pointer-events-none" />

        {/* HERO SECTION */}
        <section className="relative max-w-7xl mx-auto px-gutter-md md:px-gutter-lg pt-10 pb-20 md:pt-16 md:pb-28 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column: Copy & CTAs */}
          <div className="w-full lg:w-7/12 flex flex-col items-start z-10">
            <div className="inline-flex items-center gap-2 px-space-md py-1 rounded-full bg-surface-container-high text-primary font-sans text-xs uppercase tracking-wider font-semibold shadow-xs mb-6">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                spa
              </span>
              <span>Anti-Burnout Sanctuary • Sign up or login to enter</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-on-surface tracking-tight mb-6 max-w-2xl leading-[1.1]">
              Your soft life <span className="italic text-primary font-normal">starts here.</span>
            </h1>

            <p className="font-sans text-base sm:text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
              Less doomscrolling, more living. Find your calm, discover your next offline obsession, and grow a little every day—without shame streaks or pushy alerts. Log in or create an account to unlock your personalized sanctuary.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <a
                href="#interactive-onboarding"
                className="inline-flex items-center justify-center gap-2 px-space-xl py-3.5 rounded-full bg-primary-container text-surface-container-lowest font-sans text-sm font-semibold shadow-sm hover:opacity-95 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-base">potted_plant</span>
                <span>Adopt Your Plant Seedling 🌱</span>
              </a>

              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="inline-flex items-center justify-center gap-2 px-space-lg py-3.5 rounded-full bg-surface-container text-on-surface font-sans text-sm font-semibold hover:bg-surface-container-high transition-all border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-base text-primary">login</span>
                <span>Log In / Sign Up</span>
              </button>

              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-full bg-secondary-container/40 text-on-secondary-container text-xs font-bold hover:bg-secondary-container transition-all"
              >
                <span>Quick Demo Visitor</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* Micro Social Proof */}
            <div className="mt-12 flex items-center gap-4 pt-4 text-on-surface-variant font-sans text-xs sm:text-sm">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container shadow-xs text-xs">
                  L
                </div>
                <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center font-bold text-on-tertiary-fixed shadow-xs text-xs">
                  M
                </div>
                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-on-primary-fixed shadow-xs text-xs">
                  K
                </div>
              </div>
              <span>
                Joined by <strong>42,000+</strong> peaceful souls pausing daily
              </span>
            </div>
          </div>

          {/* Right Column: Visual Botanical Scrapbook */}
          <div className="w-full lg:w-5/12 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl bg-surface-container-low shadow-xl overflow-hidden p-6 flex flex-col justify-between border border-outline-variant/40">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-container-lowest/30 to-surface-container-high/60 pointer-events-none" />

              {/* Top corner stamp */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-xs text-primary text-xs uppercase tracking-wider font-bold shadow-xs">
                  Batch #04 • Pure Presence
                </div>
                <span className="material-symbols-outlined text-primary/70">water_drop</span>
              </div>

              {/* Hero Image */}
              <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden my-auto shadow-md">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3-R-k0PsFtGnH6nNYH5oAwi-RZtBfmu7tLa7NDfT5J_Ng-QzqbTr_8-JXJDc8PZ5T64wf1pBuB-NfoZ9Q-FqRhSHyqBmDjIACuob2LlW8fDFbVGS4TIZPp7AkwGkyTbzTUvY8SKURBd6pcmGYSjuTeirgnm0a1gRRBjjSN0-Zp_kFXjzS5Omtl_UhKt7RqkcfotOiYoRWaoXXaTMQLEunQZeYMedlHs8Nx45VnvwBu81k1H2E_9gR9A"
                  alt="Delicate indoor Monstera in earthen pot"
                />
              </div>

              <div className="relative z-10 flex items-center justify-between text-xs text-on-surface-variant pt-2">
                <span>Botanical ID: Monstera Deliciosa</span>
                <span className="text-primary font-bold">Hydration: 92%</span>
              </div>
            </div>

            {/* Floating Micro-Card Overlap */}
            <div className="absolute -bottom-6 -left-2 sm:-left-6 max-w-xs bg-surface-container-lowest p-5 rounded-2xl shadow-xl z-20 border border-outline-variant/30 transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex p-1 rounded-full bg-secondary-container text-on-secondary-container">
                  <span className="material-symbols-outlined text-sm">spa</span>
                </span>
                <span className="text-xs text-on-surface font-semibold">Today's tiny win 🌱</span>
              </div>
              <p className="font-serif text-lg text-primary">10 minutes offline.</p>
              <p className="text-xs text-on-surface-variant mt-0.5">A little more you, a little less feed.</p>
            </div>

            {/* Floating Dew Badge */}
            <div className="absolute -top-4 -right-2 sm:-right-4 bg-surface-container-lowest px-4 py-2.5 rounded-full shadow-lg z-20 flex items-center gap-2 border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                eco
              </span>
              <span className="text-xs text-on-surface font-bold">+15 mins sunlight logged</span>
            </div>
          </div>
        </section>

        {/* 3-STEP RHYTHM */}
        <section className="relative max-w-7xl mx-auto px-gutter-md md:px-gutter-lg py-16" id="three-step-rhythm">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider text-primary font-bold">The Soft Rhythm</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-on-surface mt-2 mb-4">
              How EcoCalm breathes with you
            </h2>
            <p className="font-sans text-sm sm:text-base text-on-surface-variant">
              No harsh streaks, no guilt notifications, no leaderboard anxiety. Just three gentle loops to ground your attention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between border border-outline-variant/30">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary mb-6">
                  <span className="material-symbols-outlined text-2xl">potted_plant</span>
                </div>
                <div className="text-xs text-primary uppercase font-bold tracking-widest mb-1">Step 01</div>
                <h3 className="font-serif text-xl text-on-surface mb-3">Adopt a Gentle Plant</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Choose a calm virtual companion that thrives with your real-world offline minutes. Best part? It never withers or scolds you if life gets busy.
                </p>
              </div>
              <div className="mt-8 pt-4 flex items-center gap-2 text-primary text-xs font-bold">
                <span>Non-punitive growth</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between border border-outline-variant/30">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-6">
                  <span className="material-symbols-outlined text-2xl">air</span>
                </div>
                <div className="text-xs text-secondary uppercase font-bold tracking-widest mb-1">Step 02</div>
                <h3 className="font-serif text-xl text-on-surface mb-3">Take a Breather</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Guided somatic cadences, 5-4-3-2-1 sensory groundings, and forest soundscapes that soothe your nervous system whenever algorithm noise peaks.
                </p>
              </div>
              <div className="mt-8 pt-4 flex items-center gap-2 text-secondary text-xs font-bold">
                <span>Somatic resets in 60s</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between border border-outline-variant/30">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed mb-6">
                  <span className="material-symbols-outlined text-2xl">park</span>
                </div>
                <div className="text-xs text-tertiary uppercase font-bold tracking-widest mb-1">Step 03</div>
                <h3 className="font-serif text-xl text-on-surface mb-3">Touch Grass & Make</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Low-stakes tactile quests, pottery cues, pressed flowers, and quiet community whispers that guide your hands away from glowing glass and into reality.
                </p>
              </div>
              <div className="mt-8 pt-4 flex items-center gap-2 text-tertiary text-xs font-bold">
                <span>Hobbyverse access</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE ONBOARDING SANCTUARY */}
        <section className="relative max-w-5xl mx-auto px-gutter-md md:px-gutter-lg py-16 scroll-mt-20" id="interactive-onboarding">
          <div className="bg-surface-container rounded-3xl p-6 sm:p-12 shadow-xl border border-outline-variant/40">
            {/* Progress Bar & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs uppercase tracking-wider text-primary font-bold">Interactive Adoption</span>
                <h2 className="font-serif text-2xl sm:text-3xl text-on-surface">Welcome to your little corner of calm</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-3/4 rounded-full transition-all duration-500" />
                </div>
                <span className="text-xs text-on-surface-variant font-bold">Step 3 of 4</span>
              </div>
            </div>

            {/* Prompt Question */}
            <div className="mb-6">
              <p className="font-serif text-xl text-on-surface">Select your companion seedling:</p>
              <p className="text-xs sm:text-sm text-on-surface-variant">Each plant brings a unique sensory vibe to your sanctuary dashboard.</p>
            </div>

            {/* Seedlings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {seedlings.map((seedling) => {
                const isSelected = selectedPlant.id === seedling.id;
                return (
                  <div
                    key={seedling.id}
                    onClick={() => setSelectedPlant(seedling)}
                    className={`cursor-pointer p-5 rounded-2xl shadow-xs transition-all duration-200 flex flex-col justify-between ${isSelected
                        ? "bg-surface-container-lowest ring-2 ring-primary shadow-md scale-[1.02]"
                        : "bg-surface-container-lowest/80 hover:bg-surface-container-lowest hover:shadow-xs"
                      }`}
                  >
                    <div>
                      <div className="w-full h-32 rounded-xl overflow-hidden mb-4 bg-surface-container-high">
                        <img className="w-full h-full object-cover" src={seedling.img} alt={seedling.name} />
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-sans text-sm font-bold text-on-surface">{seedling.name}</span>
                        <span
                          className={`material-symbols-outlined text-base ${isSelected ? "text-primary" : "text-outline-variant"
                            }`}
                          style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}
                        >
                          {isSelected ? "check_circle" : "radio_button_unchecked"}
                        </span>
                      </div>
                      <p className="text-xs text-primary font-semibold mb-2">"{seedling.tagline}"</p>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{seedling.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 4 Details Card: Name & Daily Intention */}
            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-xs mb-8 border border-outline-variant/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Plant Naming */}
                <div className="flex flex-col">
                  <label className="text-xs sm:text-sm text-on-surface font-semibold mb-2 flex items-center justify-between" htmlFor="plant-name-input">
                    <span>Name your botanical companion:</span>
                    <span className="text-[10px] text-on-surface-variant font-normal">You can rename anytime</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="plant-name-input"
                      type="text"
                      value={plantCustomName}
                      onChange={(e) => setPlantCustomName(e.target.value)}
                      className="w-full bg-surface-container-low px-4 py-3 rounded-xl text-on-surface text-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                    <span className="material-symbols-outlined absolute right-3 text-on-surface-variant text-lg pointer-events-none">
                      edit
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-2">
                    Currently selected: <span className="text-primary font-semibold">{selectedPlant.name} ("{selectedPlant.tagline}")</span>
                  </p>
                </div>

                {/* Daily Intention */}
                <div className="flex flex-col">
                  <label className="text-xs sm:text-sm text-on-surface font-semibold mb-2">
                    Choose your daily gentle intention:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {intentions.map((intent) => {
                      const isActive = selectedIntention === intent;
                      return (
                        <button
                          key={intent}
                          type="button"
                          onClick={() => setSelectedIntention(intent)}
                          className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${isActive
                              ? "bg-secondary-container text-on-secondary-container shadow-xs scale-105"
                              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                            }`}
                        >
                          {intent}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Completion Call to Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-semibold">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  water_drop
                </span>
                <span>Unlocks: <strong>+25 Welcome Water Drops</strong></span>
              </div>
              <button
                type="button"
                onClick={handleFinishAdoption}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-space-xl py-4 rounded-full bg-primary text-on-primary font-sans text-sm font-semibold shadow-md hover:bg-primary-container active:scale-95 transition-all"
              >
                <span>{isAuthenticated ? "Enter Your Sanctuary" : "Sign Up / Log In to Enter"}</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* COMPARISON: REALITY VS DOOMSCROLL */}
        <section className="max-w-7xl mx-auto px-gutter-md md:px-gutter-lg py-16">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">The Shift</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-on-surface mt-2 mb-4">
              Replace nervous scrolling with quiet grounding
            </h2>
            <p className="font-sans text-sm sm:text-base text-on-surface-variant">
              Social feeds are engineered for addiction and outrage. EcoCalm is handcrafted for your nervous system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* The Algorithmic Spiral */}
            <div className="p-8 rounded-3xl bg-surface-container-low border border-error/20 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error-container text-on-error-container text-xs font-bold uppercase">
                <span>The Algorithmic Spiral</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-on-surface-variant">
                <li className="flex items-start gap-2">
                  <span className="text-error font-bold">✗</span>
                  <span>Phantom vibrations & endless refreshes craving simulated dopamine</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error font-bold">✗</span>
                  <span>Comparison trap: Everyone else is succeeding while you scroll</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error font-bold">✗</span>
                  <span>Cognitive fog: Multiple open tabs leaving you exhausted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error font-bold">✗</span>
                  <span>Shame penalties: Guilt alerts breaking your streak when life happens</span>
                </li>
              </ul>
            </div>

            {/* The Mindful Sanctuary */}
            <div className="p-8 rounded-3xl bg-surface-container-lowest border border-primary/20 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-bold uppercase">
                <span>The Mindful Sanctuary</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-on-surface">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Gentle botanical companion that never withers or punishes you</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Tactile offline hobby quests with zero screen pressure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Plot Twist Feed: Verified slow good news with zero rage-bait</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>Kindness-first community sharing honest unfinished experiments</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="max-w-5xl mx-auto px-gutter-md md:px-gutter-lg pb-24">
          <div className="bg-primary-container text-surface-container-lowest rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-xl">
            <span className="material-symbols-outlined text-4xl text-on-primary-container">spa</span>
            <h2 className="font-serif text-3xl sm:text-4xl max-w-xl mx-auto">
              Ready to reclaim your quiet hours?
            </h2>
            <p className="text-sm sm:text-base opacity-90 max-w-lg mx-auto">
              Your seedling is resting, ready for you. Take your first phone-free breath today.
            </p>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal("login");
                } else {
                  setActiveTab("home");
                }
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-surface-container-lowest text-primary font-semibold text-sm hover:opacity-95 active:scale-95 shadow-md transition-all"
            >
              <span>{isAuthenticated ? "Enter Sanctuary Dashboard" : "Log In to Enter Sanctuary"}</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </section>
      </div>

      {/* Global Auth Modal for Login & Signup */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={closeAuthModal}
      />
    </div>
  );
};
