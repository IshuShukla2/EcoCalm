import React from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    user,
    isAdmin,
    mobileMenuOpen,
    setMobileMenuOpen,
    setIsDoomscrollOpen,
    logoutUser,
    openAvatarModal,
    openHelpline,
    openFeedback
  } = useEcoCalm();

  const baseNavItems = [
    { id: "home", label: "Home Dashboard", icon: "home" },
    { id: "vibe", label: "Vibe Check", icon: "favorite" },
    { id: "breathe", label: "Breathe", icon: "air" },
    { id: "hobbies", label: "Explore Hobbies", icon: "explore" },
    { id: "plottwist", label: "Plot Twist Feed", icon: "wb_sunny" },
    { id: "hobbyverse", label: "Hobbyverse", icon: "group" },
    { id: "garden", label: "My Garden", icon: "potted_plant" },
    { id: "profile", label: "Profile & Journey", icon: "person" }
  ];

  // If user is Admin, add Admin Feedback Dashboard item at top or high priority
  const navItems = isAdmin
    ? [
        { id: "admin", label: "Admin & Feedback", icon: "shield", badge: "Admin" },
        ...baseNavItems,
        { id: "landing", label: "Overview & Adoption", icon: "spa" }
      ]
    : [
        ...baseNavItems,
        { id: "landing", label: "Overview & Adoption", icon: "spa" }
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
        <div className="flex flex-col gap-space-sm overflow-y-auto">
          {/* Brand Logo & Tagline */}
          <button
            onClick={() => handleNavClick("home")}
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
                {user.waterDrops || 142} drops
              </span>
            </div>
            <span className="font-sans text-[10px] text-on-tertiary-fixed-variant bg-surface-container-lowest px-2 py-0.5 rounded-full font-semibold">
              {isAdmin ? "Overseer 🌿" : "Growing 🌱"}
            </span>
          </div>

          {/* Quick Wellbeing Action Buttons (Helpline & Feedback) */}
          <div className="mx-space-xs grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={openHelpline}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#eaf3eb] hover:bg-[#d8ebd9] text-[#2d552a] border border-[#cbe1ce] text-xs font-bold transition-all shadow-2xs active:scale-95"
              title="Open 24/7 Mental Health Helpline Popup"
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

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 mt-space-xs">
            {navItems.map((item) => {
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
                        isActive ? "scale-110" : ""
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#3b6637] text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Card */}
        <div className="flex flex-col gap-space-sm pt-space-md border-t border-outline-variant/30">
          <div
            onClick={() => handleNavClick(isAdmin ? "admin" : "profile")}
            className="p-space-sm rounded-xl bg-surface-container flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors"
          >
            <div className="flex items-center gap-space-sm">
              <img
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20"
                src={user.avatar}
              />
              <div className="flex flex-col">
                <span className="font-sans text-sm text-on-surface font-semibold leading-tight">
                  {user.name}
                </span>
                <span className="font-sans text-xs text-on-surface-variant">
                  {isAdmin ? "Sanctuary Admin" : user.tagline}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openAvatarModal();
                }}
                title="Change Profile Picture"
                className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-highest rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  logoutUser();
                }}
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
                  <span className="text-xs text-tertiary font-bold">{user.waterDrops} drops</span>
                </div>
                <span className="text-[10px] bg-surface-container-lowest px-2 py-0.5 rounded-full">
                  {isAdmin ? "Admin Active" : "Growing 🌱"}
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

              {/* Links */}
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
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
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3b6637] text-white font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Profile */}
            <div className="pt-space-md border-t border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img alt={user.name} className="w-8 h-8 rounded-full object-cover" src={user.avatar} />
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-on-surface">{user.name}</span>
                  <span className="text-on-surface-variant">{isAdmin ? "Admin" : user.tagline}</span>
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
          onClick={() => handleNavClick("home")}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
            activeTab === "home" ? "text-primary font-bold" : "text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined text-xl">home</span>
          <span className="text-[10px]">Home</span>
        </button>

        {isAdmin ? (
          <button
            onClick={() => handleNavClick("admin")}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
              activeTab === "admin" ? "text-[#3b6637] font-bold" : "text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-xl">shield</span>
            <span className="text-[10px]">Admin</span>
          </button>
        ) : (
          <button
            onClick={() => handleNavClick("breathe")}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
              activeTab === "breathe" ? "text-primary font-bold" : "text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-xl">air</span>
            <span className="text-[10px]">Breathe</span>
          </button>
        )}

        {/* Center Helpline Support Trigger */}
        <button
          onClick={openHelpline}
          className="flex flex-col items-center justify-center w-12 h-12 -mt-5 rounded-full bg-[#3b6637] text-white shadow-[0_4px_16px_rgba(59,102,55,0.4)] active:scale-90 transition-transform"
          title="Tele-MANAS Helpline"
        >
          <span className="material-symbols-outlined text-xl leading-none">call</span>
          <span className="text-[8px] font-bold mt-0.5">Help</span>
        </button>

        <button
          onClick={openFeedback}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors text-on-surface-variant hover:text-primary"
        >
          <span className="material-symbols-outlined text-xl">rate_review</span>
          <span className="text-[10px]">Feedback</span>
        </button>

        <button
          onClick={() => handleNavClick("garden")}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
            activeTab === "garden" ? "text-primary font-bold" : "text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined text-xl">potted_plant</span>
          <span className="text-[10px]">Garden</span>
        </button>
      </nav>
    </>
  );
};
