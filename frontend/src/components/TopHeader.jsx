import React, { useState } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const TopHeader = () => {
  const {
    user,
    plant,
    isAdmin,
    activeTab,
    setMobileMenuOpen,
    setActiveTab,
    isAudioPlaying,
    currentSound,
    toggleSoundscape,
    showToast,
    logoutUser,
    openAvatarModal,
    openHelpline,
    openFeedback
  } = useEcoCalm();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: `${plant?.name || "Your plant"} is growing nicely`, time: "Just now", icon: "potted_plant" },
    { id: 2, title: `Offline streak: ${user?.calmStreakDays || 1} day active`, time: "1h ago", icon: "eco" },
    { id: 3, title: "Mindful water drops ready to hydrate", time: "2h ago", icon: "water_drop" }
  ];

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-40 flex items-center justify-between px-gutter md:px-gutter-md border-b border-outline-variant/30 transition-all">
      {/* Left: Mobile hamburger + Sanctuary status */}
      <div className="flex items-center gap-space-sm sm:gap-space-md">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <div className="flex items-center gap-space-xs font-sans text-xs sm:text-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-tertiary text-base sm:text-lg">spa</span>
          <span className="hidden sm:inline">EcoCalm Sanctuary</span>
          <span className="hidden sm:inline text-outline-variant">/</span>
          <span className="text-on-surface font-semibold truncate max-w-[140px] sm:max-w-none">
            {activeTab === "admin" ? "Admin Control Room" : "Present Space"}
          </span>
        </div>

        <div className="hidden md:block h-4 w-px bg-outline-variant/60" />

        <div className="hidden md:inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-surface-container-high">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-sans text-[11px] text-on-surface-variant font-medium">
            {isAdmin ? "Admin Active 🛡️" : "Resting Flow State"}
          </span>
        </div>
      </div>

      {/* Right Controls in Navbar */}
      <div className="flex items-center gap-space-xs sm:gap-space-sm md:gap-space-md">
        {/* Helpline Popup Button (Prominent mental health support) */}
        <button
          onClick={openHelpline}
          title="Tele-MANAS 24/7 Mental Health Helpline Support"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#eaf3eb] text-[#2d552a] hover:bg-[#d8ebd9] border border-[#cbe1ce] shadow-xs active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-sm text-[#2d552a]">call</span>
          <span>Helpline</span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#3b6637] animate-ping" />
        </button>

        {/* Feedback Popup Button (Help Us Grow) */}
        <button
          onClick={openFeedback}
          title="Help Us Grow! Share Your Feedback"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-outline-variant/40 shadow-xs active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-sm text-primary">rate_review</span>
          <span className="hidden sm:inline">Feedback</span>
        </button>

        {/* Admin Dashboard shortcut if admin */}
        {isAdmin && (
          <button
            onClick={() => setActiveTab("admin")}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${activeTab === "admin"
                ? "bg-[#3b6637] text-white"
                : "bg-surface-container text-[#3b6637] hover:bg-surface-container-high border border-[#3b6637]/30"
              }`}
          >
            <span className="material-symbols-outlined text-sm">shield</span>
            <span>Admin</span>
          </button>
        )}

        {/* Soundscape Quick Play Pill */}
        <button
          onClick={() => toggleSoundscape(currentSound)}
          title={isAudioPlaying ? "Pause Soundscape" : "Play Gentle Soundscape"}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isAudioPlaying
              ? "bg-primary-container text-on-primary-container shadow-xs animate-pulse"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
        >
          <span className="material-symbols-outlined text-sm">
            {isAudioPlaying ? "volume_up" : "volume_off"}
          </span>
          <span className="hidden lg:inline">
            {isAudioPlaying ? "Playing Aura" : "Play Calm"}
          </span>
        </button>

        {/* Drops Badge */}
        <button
          onClick={() => {
            setActiveTab("garden");
            showToast(`${user.name.split(" ")[0]}'s Stored Water Drops`, "water_drop");
          }}
          className="flex items-center gap-1 px-2.5 sm:px-space-sm py-1 rounded-full bg-surface-container text-tertiary shadow-xs hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-sm sm:text-base text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
            water_drop
          </span>
          <span className="font-sans text-xs sm:text-sm font-bold">
            {user.waterDrops || 142}
          </span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/40 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 mb-2">
                <span className="font-serif text-sm font-semibold text-on-surface">Sanctuary Whispers</span>
                <span className="text-[11px] text-primary font-medium">3 unread</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-surface-container-low transition-colors text-left">
                    <span className="material-symbols-outlined text-tertiary text-lg mt-0.5">{n.icon}</span>
                    <div className="flex flex-col flex-1">
                      <span className="text-xs font-medium text-on-surface leading-tight">{n.title}</span>
                      <span className="text-[10px] text-on-surface-variant mt-0.5">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="relative flex items-center">
          <button
            onClick={() => setActiveTab("profile")}
            className="flex items-center gap-space-xs pl-space-xs pr-space-sm py-space-xs rounded-full bg-surface-container hover:bg-surface-container-high transition-colors group"
            title="My Profile & Well-Being Journey"
          >
            <div className="relative">
              <img
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/60 transition-all"
                src={user.avatar}
              />
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  openAvatarModal();
                }}
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center hover:scale-115 transition-transform shadow-xs cursor-pointer"
                title="Change Avatar"
              >
                <span className="material-symbols-outlined text-[10px]">photo_camera</span>
              </span>
            </div>
            <span className="hidden xl:inline font-sans text-xs text-on-surface font-semibold">
              {user.name.split(" ")[0]}
            </span>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={logoutUser}
          className="p-2 rounded-full text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors flex items-center justify-center"
          title="Log Out of Sanctuary"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
        </button>
      </div>
    </header>
  );
};
