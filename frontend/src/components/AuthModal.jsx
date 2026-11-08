import React, { useState, useEffect } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const AuthModal = ({ isOpen, onClose, initialMode = "login" }) => {
  const { loginUser, showToast, triggerCelebration } = useEcoCalm();
  const [mode, setMode] = useState(initialMode); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMode(initialMode === "signup" ? "signup" : "login");
    setError("");
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const isSignup = mode === "signup";
    const endpoint = isSignup ? "/api/auth/register" : "/api/auth/login";
    const cleanEmail = email.trim().toLowerCase();
    const isAdmin = cleanEmail === "hemal.au123@gmail.com";

    const payload = isSignup
      ? { name: name.trim(), email: cleanEmail, password, role: isAdmin ? "admin" : "user" }
      : { email: cleanEmail, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.user) {
        loginUser(data.user, data.token);
        triggerCelebration();
        onClose();
      } else {
        setError(data.error || "Unable to complete request. Please verify your details.");
      }
    } catch (err) {
      // Offline fallback login with role detection based on email ID
      if (isAdmin) {
        if (password !== "hemal@admin") {
          setError("Invalid password for Hemal Admin account.");
          setLoading(false);
          return;
        }
        const fallbackAdmin = {
          id: "user_hemal_admin",
          email: "hemal.au123@gmail.com",
          role: "admin",
          name: "Hemal (Admin)",
          tagline: "EcoCalm Groundskeeper",
          waterDrops: 999,
          offlineMinutesToday: 120,
          questsCompletedToday: 5,
          calmStreakDays: 30,
          dailyAffirmation: "Nurturing safe digital spaces for everyone.",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
        };
        loginUser(fallbackAdmin, "jwt_hemal_admin_token_offline");
      } else {
        const derivedName = cleanEmail ? cleanEmail.split("@")[0].replace(/[._]/g, " ") : "Mindful Soul";
        const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
        const fallbackUser = {
          id: `user_${Date.now()}`,
          name: name.trim() || formattedName,
          role: "user",
          tagline: "Mindful Gardener",
          email: cleanEmail || `guest_${Date.now()}@ecocalm.app`,
          waterDrops: 50,
          offlineMinutesToday: 0,
          questsCompletedToday: 0,
          calmStreakDays: 1,
          dailyAffirmation: "Your soft life starts here.",
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail || "mindful")}`
        };
        loginUser(fallbackUser, "jwt_user_token_offline");
      }
      triggerCelebration();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "maya@ecocalm.app", password: "peaceful123" })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        loginUser(data.user, data.token);
      } else {
        loginFallbackDemo();
      }
    } catch (err) {
      loginFallbackDemo();
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const loginFallbackDemo = () => {
    const demo = {
      id: "user_maya",
      name: "Maya Chen",
      role: "user",
      tagline: "Gentle Pacer",
      email: "maya@ecocalm.app",
      waterDrops: 142,
      offlineMinutesToday: 45,
      questsCompletedToday: 2,
      calmStreakDays: 6,
      dailyAffirmation: "Your soft life starts here.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2whyhBjn4A9SnEMzocCRmpZP4ZEqmpJ-zWeW23kmuur800au6BqfdYcmvuwTzO79WzC_neRaecdYdFzxrWI45DuCG6rwzNFEUzVaqidljRlDiMlGT_MSXJq5Bqg6DCHCsacno2GMG-rbsJe5Cv7KQB01D4qvRh7qT9Dvw6fh49e89ImV44CfxDLOv6nk-_mdQir7iuP4e_KzmsrZPEM-PNjQETIJFP7OenqynM0Hg6_y8eiUn2A1B_w"
    };
    loginUser(demo, "jwt_token_demo_maya");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-secondary-container/40 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          title="Close"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_florist
            </span>
          </div>
          <h2 className="font-serif text-2xl text-on-surface font-semibold tracking-tight">
            {mode === "signup" ? "Begin Your Sanctuary" : "Welcome to EcoCalm"}
          </h2>
          <p className="text-xs text-on-surface-variant">
            “Your soft life starts here.” Less doomscrolling. More growing. 🌱
          </p>
        </div>

        {/* 2 Tabs: Log In and Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-2xl mb-6 text-xs font-semibold gap-1">
          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); }}
            className={`py-2 rounded-xl transition-all text-center ${mode === "login"
                ? "bg-surface-container-lowest text-primary shadow-xs font-bold"
                : "text-on-surface-variant hover:text-on-surface"
              }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(""); }}
            className={`py-2 rounded-xl transition-all text-center ${mode === "signup"
                ? "bg-surface-container-lowest text-primary shadow-xs font-bold"
                : "text-on-surface-variant hover:text-on-surface"
              }`}
          >
            Sign Up 🌱
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-error-container/40 text-on-error-container text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface" htmlFor="auth-name">
                Your Preferred Name / Nickname
              </label>
              <input
                id="auth-name"
                type="text"
                required
                placeholder="e.g. Maya Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface" htmlFor="auth-email">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              required
              placeholder="you@sanctuary.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface" htmlFor="auth-password">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-semibold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-container"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === "signup" ? "Create Free Account (+50 Drops)" : "Enter Sanctuary"}
                </span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Demo One-Click Login for regular visitor */}
        <div className="mt-5 pt-4 border-t border-outline-variant/20 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-semibold text-xs transition-colors flex items-center justify-center gap-2 border border-secondary/30 shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">spa</span>
            <span>Explore as Quick Visitor Demo</span>
          </button>

          <p className="text-[11px] text-center text-on-surface-variant pt-1">
            🔒 Log in with your email. Only administrator accounts access the feedback dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};
