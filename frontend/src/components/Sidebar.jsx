import React from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    user,
    plant,
    isAdmin,
    mobileMenuOpen,
    setMobileMenuOpen,
    logoutUser,
    openAvatarModal,
    openHelpline,
    openFeedback
  } = useEcoCalm();

  // The EXACT 6 required main navigation items in precise order
  const mainNavItems = [
    { id: "plant", label: "Plant", icon: "potted_plant" },
    { id: "vibe_before", label: "Vibe Check (Before)", icon: "favorite_border" },
    { id: "breathe", label: "Breathe", icon: "air" },
    { id: "news", label: "Daily News", icon: "newspaper" },
    { id: "hobbies", label: "Hobbies", icon: "palette" },
    { id: "vibe_after", label: "Vibe Check (After)", icon: "ecg_heart" }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex-col justify-between p-space-md border-r border-outline-variant/30">
        <div className="flex flex-col gap-space-sm overflow-y-auto pr-1">
          {/* Brand Logo & Tagline */}
          <button
            onClick={() => handleNavClick("plant")}
            className="flex items-center gap-space-sm px-space-sm py-space-xs text-left group"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_florist
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl text-primary tracking-tight font-semibold leading-none">
                  EcoCalm
                </span>
                {isAdmin && (
                  <span className="text-[10px] bg-[#3b6637] text-white font-bold px-1.5 py-0.2 rounded uppercase">
                    Admin
                  </span>
                )}
              </div>
              <span className="font-sans text-[11px] text-on-surface-variant tracking-wider uppercase mt-0.5 font-medium">
                Mindful Haven
              </span>
            </div>
          </button>

          {/* Stored Drops Capsule Pill */}
          <div className="mx-space-xs px-space-md py-2.5 rounded-full bg-tertiary-fixed/60 flex items-center justify-between shadow-[0_2px_10px_-2px_rgba(65,67,33,0.08)]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                water_drop
              </span>
              <span className="font-sans text-xs text-tertiary font-bold tracking-tight">
                {user?.waterDrops || 0} drops
              </span>
            </div>
            <span className="font-sans text-[10px] text-on-tertiary-fixed-variant bg-surface-container-lowest px-2 py-0.5 rounded-full font-semibold">
              {isAdmin ? "Overseer 🌿" : "Growing 🌱"}
            </span>
          </div>

          {/* Selected Plant Mini Widget */}
          <div
            onClick={() => handleNavClick("plant")}
            className="mx-space-xs p-3 rounded-2xl bg-surface-container border border-outline-variant/30 cursor-pointer hover:border-primary/40 hover:bg-surface-container-high transition-all group"
            title="View your plant companion"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-base">🪴</span>
                <span className="font-serif text-xs font-bold text-on-surface truncate max-w-[120px]">
                  {plant?.name || "My Plant"}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-primary bg-primary-fixed/40 px-2 py-0.5 rounded-full">
                Stage {plant?.stage || 1}/5
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, plant?.hydration || 50)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-on-surface-variant font-medium">
              <span>{plant?.stageTitle || "Tender Seedling"}</span>
              <span className="text-primary font-bold">{plant?.hydration || 50}%</span>
            </div>
          </div>

          {/* Quick Wellbeing Action Buttons (Helpline & Feedback) */}
          <div className="mx-space-xs grid grid-cols-2 gap-2 mt-0.5">
            <button
              onClick={openHelpline}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#eaf3eb] hover:bg-[#d8ebd9] text-[#2d552a] border border-[#cbe1ce] text-xs font-bold transition-all shadow-2xs active:scale-95"
              title="Open 24/7 Mental Health Helpline Support"
            >
              <span className="material-symbols-outlined text-sm">call</span>
              <span>Helpline</span>
            </button>
            <button
              onClick={openFeedback}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30 text-xs font-semibold transition-all shadow-2xs active:scale-95"
              title="Share Feedback Survey"
            >
              <span className="material-symbols-outlined text-sm text-primary">rate_review</span>
              <span>Feedback</span>
            </button>
          </div>

          {/* The Six Main Navigation Links */}
          <nav className="flex flex-col gap-1 mt-2">
            {mainNavItems.map((item, index) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-space-md py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                    isActive
                      ? "bg-primary-container text-on-primary-container font-bold shadow-xs scale-[1.01]"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  <div className="flex items-center gap-space-sm">
                    <span
                      className={`material-symbols-outlined text-[20px] transition-transform ${
                        isActive ? "scale-110 text-primary font-bold" : ""
                      }`}
                      style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/70 font-mono">
                    0{index + 1}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Optional Admin Panel trigger if user is Admin */}
          {isAdmin && (
            <div className="mt-2 pt-2 border-t border-outline-variant/20 mx-space-xs">
              <button
                onClick={() => handleNavClick("admin")}
                className={`w-full flex items-center justify-between px-space-md py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "admin"
                    ? "bg-[#3b6637] text-white"
                    : "bg-surface-container text-[#3b6637] hover:bg-surface-container-high border border-[#3b6637]/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">shield</span>
                  <span>Admin Feedback Center</span>
                </div>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-bold">Admin</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Profile Card */}
        <div className="flex flex-col gap-space-sm pt-space-sm border-t border-outline-variant/30">
          <div className="p-space-sm rounded-xl bg-surface-container flex items-center justify-between hover:bg-surface-container-high transition-colors">
            <div
              className="flex items-center gap-space-sm cursor-pointer flex-1 min-w-0"
              onClick={() => handleNavClick("plant")}
            >
              <img
                alt={user?.name || "User"}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
                src={user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=ecocalm"}
              />
              <div className="flex flex-col min-w-0">
                <span className="font-sans text-sm text-on-surface font-semibold leading-tight truncate">
                  {user?.name || "Mindful Soul"}
                </span>
                <span className="font-sans text-xs text-on-surface-variant truncate">
                  {isAdmin ? "Sanctuary Admin" : user?.tagline || "Mindful Gardener"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={openAvatarModal}
                title="Change Profile Picture"
                className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-highest rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </button>
              <button
                onClick={logoutUser}
                title="Log Out of Sanctuary"
                className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg transition-colors flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE SLIDE-OVER DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-on-surface/30 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-surface-container-low shadow-2xl h-full flex flex-col justify-between p-space-md overflow-y-auto">
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">local_florist</span>
                  <span className="font-serif text-lg text-primary font-bold">EcoCalm</span>
                  {isAdmin && (
                    <span className="text-[10px] bg-[#3b6637] text-white font-bold px-1.5 py-0.2 rounded uppercase">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-on-surface-variant hover:text-on-surface rounded-full"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              {/* Water Drops */}
              <div className="px-space-md py-2 rounded-full bg-tertiary-fixed/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-tertiary text-base">water_drop</span>
                  <span className="text-xs text-tertiary font-bold">{user?.waterDrops || 0} drops</span>
                </div>
                <span className="text-[10px] bg-surface-container-lowest px-2 py-0.5 rounded-full">
                  {plant?.name || "Plant"} 🌱
                </span>
              </div>

              {/* Quick Mobile Buttons for Helpline & Feedback */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openHelpline();
                  }}
                  className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-[#eaf3eb] text-[#2d552a] border border-[#cbe1ce] text-xs font-bold"
                >
                  <span className="material-symbols-outlined text-sm">call</span>
                  <span>Helpline</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openFeedback();
                  }}
                  className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold"
                >
                  <span className="material-symbols-outlined text-sm text-primary">rate_review</span>
                  <span>Feedback</span>
                </button>
              </div>

              {/* Six Main Navigation Links */}
              <nav className="flex flex-col gap-1">
                {mainNavItems.map((item, index) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center justify-between px-space-md py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                        isActive
                          ? "bg-primary-container text-on-primary-container font-bold"
                          : "text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      <div className="flex items-center gap-space-sm">
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant/70 font-mono">
                        0{index + 1}
                      </span>
                    </button>
                  );
                })}
              </nav>

              {isAdmin && (
                <button
                  onClick={() => handleNavClick("admin")}
                  className={`flex items-center justify-between px-space-md py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === "admin"
                      ? "bg-[#3b6637] text-white"
                      : "bg-surface-container text-[#3b6637] border border-[#3b6637]/30"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">shield</span>
                    <span>Admin Feedback</span>
                  </span>
                  <span className="text-[10px] bg-white/20 px-1 rounded">Admin</span>
                </button>
              )}
            </div>

            {/* Profile */}
            <div className="pt-space-md border-t border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  alt={user?.name || "User"}
                  className="w-8 h-8 rounded-full object-cover"
                  src={user?.avatar || "https://api.dicebear.com/7.x/bottts/svg?seed=ecocalm"}
                />
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-on-surface">{user?.name || "User"}</span>
                  <span className="text-on-surface-variant">{isAdmin ? "Admin" : user?.tagline}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutUser();
                  }}
                  className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg"
                  title="Log Out"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MOBILE BOTTOM NAVIGATION DOCK ================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/40 z-40 px-2 flex items-center justify-around shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
        <button
          onClick={() => handleNavClick("plant")}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
            activeTab === "plant" ? "text-primary font-bold" : "text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined text-xl">potted_plant</span>
          <span className="text-[10px]">Plant</span>
        </button>

        <button
          onClick={() => handleNavClick("vibe_before")}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
            activeTab === "vibe_before" ? "text-primary font-bold" : "text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined text-xl">favorite_border</span>
          <span className="text-[10px]">Vibe (Pre)</span>
        </button>

        {/* Center Breathe / Core Exercise Button */}
        <button
          onClick={() => handleNavClick("breathe")}
          className="flex flex-col items-center justify-center w-12 h-12 -mt-5 rounded-full bg-primary text-on-primary shadow-[0_4px_16px_rgba(59,102,55,0.4)] active:scale-90 transition-transform"
          title="Breathe"
        >
          <span className="material-symbols-outlined text-xl leading-none">air</span>
          <span className="text-[8px] font-bold mt-0.5">Breathe</span>
        </button>

        <button
          onClick={() => handleNavClick("news")}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
            activeTab === "news" ? "text-primary font-bold" : "text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined text-xl">newspaper</span>
          <span className="text-[10px]">News</span>
        </button>

        <button
          onClick={() => handleNavClick("hobbies")}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
            activeTab === "hobbies" ? "text-primary font-bold" : "text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined text-xl">palette</span>
          <span className="text-[10px]">Hobbies</span>
        </button>

        <button
          onClick={() => handleNavClick("vibe_after")}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
            activeTab === "vibe_after" ? "text-primary font-bold" : "text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined text-xl">ecg_heart</span>
          <span className="text-[10px]">Vibe (Post)</span>
        </button>
      </nav>
    </>
  );
};
