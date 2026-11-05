import React from "react";
import { useEcoCalm, EcoCalmProvider } from "./context/EcoCalmContext";
import { Sidebar } from "./components/Sidebar";
import { TopHeader } from "./components/TopHeader";
import { DoomscrollModal } from "./components/DoomscrollModal";
import { Toast } from "./components/Toast";
import { AuthModal } from "./components/AuthModal";
import { AvatarPickerModal } from "./components/AvatarPickerModal";
import { HelplineModal } from "./components/HelplineModal";
import { FeedbackModal } from "./components/FeedbackModal";

import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { SanctuaryGarden } from "./pages/SanctuaryGarden";
import { BreatheChamber } from "./pages/BreatheChamber";
import { ExploreHobbies } from "./pages/ExploreHobbies";
import { Hobbyverse } from "./pages/Hobbyverse";
import { PlotTwistFeed } from "./pages/PlotTwistFeed";
import { VibeCheckPage } from "./pages/VibeCheckPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminDashboard } from "./pages/AdminDashboard";

const MainApp = () => {
  const {
    isAuthenticated,
    activeTab,
    setActiveTab,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    authModalMode,
    isAvatarModalOpen,
    closeAvatarModal,
    isHelplineOpen,
    closeHelpline,
    openHelpline,
    isFeedbackOpen,
    closeFeedback,
    openFeedback,
    isAdmin
  } = useEcoCalm();

  const renderActiveView = () => {
    switch (activeTab) {
      case "landing":
        return <LandingPage />;
      case "home":
        return <Dashboard />;
      case "garden":
        return <SanctuaryGarden />;
      case "breathe":
        return <BreatheChamber />;
      case "hobbies":
        return <ExploreHobbies />;
      case "hobbyverse":
        return <Hobbyverse />;
      case "plottwist":
        return <PlotTwistFeed />;
      case "vibe":
        return <VibeCheckPage />;
      case "profile":
        return <ProfilePage />;
      case "admin":
        return <AdminDashboard />;
      default:
        return isAdmin ? <AdminDashboard /> : <Dashboard />;
    }
  };

  // ================= 1. UNAUTHENTICATED GATED EXPERIENCE =================
  // Without login, the visitor sees the landing page with Helpline, Feedback, and Login/Admin options.
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col selection:bg-secondary-container selection:text-on-secondary-container">
        {/* Toast alerts */}
        <Toast />

        {/* Unauthenticated Landing Navigation Header */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-xs z-40 flex items-center justify-between px-gutter-md md:px-gutter-lg max-w-7xl mx-auto border-b border-outline-variant/30">
          <div className="flex items-center gap-space-sm cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_florist
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl text-primary tracking-tight font-semibold leading-tight">EcoCalm</span>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Digital Sanctuary</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-on-surface-variant">
            <a href="#three-step-rhythm" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#interactive-onboarding" className="hover:text-primary transition-colors">Adopt a Plant</a>

            {/* Helpline trigger on landing */}
            <button
              onClick={openHelpline}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#eaf3eb] text-[#2d552a] hover:bg-[#d8ebd9] border border-[#cbe1ce] font-bold text-[11px] transition-colors"
            >
              <span className="material-symbols-outlined text-sm">call</span>
              <span>24/7 Helpline</span>
            </button>

            {/* Feedback trigger on landing */}
            <button
              onClick={openFeedback}
              className="flex items-center gap-1 hover:text-primary transition-colors text-[11px]"
            >
              <span className="material-symbols-outlined text-sm">rate_review</span>
              <span>Give Feedback</span>
            </button>
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Normal Login */}
            <button
              onClick={() => openAuthModal("login")}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-outline-variant/50 hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm text-primary">login</span>
              <span>Log In</span>
            </button>

            {/* Normal Sign Up */}
            <button
              onClick={() => openAuthModal("signup")}
              className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container shadow-xs active:scale-95 transition-all"
            >
              Sign Up Free 🌱
            </button>
          </div>
        </header>

        {/* Landing Page Content */}
        <main className="pt-16 min-h-screen">
          <LandingPage />
        </main>

        {/* Global Modals */}
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalMode}
          onClose={closeAuthModal}
        />

        <HelplineModal
          isOpen={isHelplineOpen}
          onClose={closeHelpline}
        />

        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={closeFeedback}
        />
      </div>
    );
  }

  // ================= 2. AUTHENTICATED EXPERIENCE =================
  // Logged-in user or admin: dashboard, conservatory, admin panel, and tools are available!
  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Toast notifications */}
      <Toast />

      {activeTab === "landing" ? (
        <>
          {/* Authenticated user viewing landing page overview */}
          <header className="fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-xl shadow-xs z-40 flex items-center justify-between px-gutter-md md:px-gutter-lg max-w-7xl mx-auto border-b border-outline-variant/30">
            <div className="flex items-center gap-space-sm cursor-pointer" onClick={() => setActiveTab(isAdmin ? "admin" : "home")}>
              <span className="material-symbols-outlined text-primary text-2xl">local_florist</span>
              <span className="font-serif text-xl text-primary tracking-tight font-semibold">EcoCalm</span>
              {isAdmin && (
                <span className="text-[10px] bg-[#3b6637] text-white font-bold px-1.5 py-0.2 rounded uppercase">
                  Admin
                </span>
              )}
            </div>

            <nav className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab(isAdmin ? "admin" : "home")}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-primary text-on-primary shadow-xs"
              >
                {isAdmin ? "Back to Admin Dashboard 🛡️" : "Back to Dashboard 🌿"}
              </button>
            </nav>
          </header>

          <main className="pt-16 min-h-screen">
            <LandingPage />
          </main>
        </>
      ) : (
        <>
          {/* Dashboard and App Shell */}
          <Sidebar />
          <div className="lg:pl-72 flex flex-col flex-1">
            <TopHeader />
            <main className="relative pt-20 px-gutter sm:px-gutter-md pb-28 lg:pb-16 flex-1 max-w-7xl w-full mx-auto">
              {renderActiveView()}
            </main>
          </div>
        </>
      )}

      {/* Persistent Emergency Doomscroll Grounding Trigger & Modal */}
      <DoomscrollModal />

      {/* Global Mindful Avatar & Gallery Picker Modal */}
      <AvatarPickerModal
        isOpen={isAvatarModalOpen}
        onClose={closeAvatarModal}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={closeAuthModal}
      />

      {/* 24/7 Mental Health Helpline Modal (Tele-MANAS) */}
      <HelplineModal
        isOpen={isHelplineOpen}
        onClose={closeHelpline}
      />

      {/* Feedback Survey Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={closeFeedback}
      />
    </div>
  );
};

export default function App() {
  return (
    <EcoCalmProvider>
      <MainApp />
    </EcoCalmProvider>
  );
}
