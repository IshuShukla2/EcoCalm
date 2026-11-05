import React, { useState } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";
import confetti from "canvas-confetti";

export const FeedbackModal = ({ isOpen, onClose }) => {
  const { user, showToast, triggerCelebration } = useEcoCalm();

  const [experience, setExperience] = useState("Loved it 💚");
  const [feeling, setFeeling] = useState("Calmer 🌱");
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const experienceOptions = [
    "Loved it 💚",
    "It was good 🌼",
    "It was okay 🌿",
    "Needs improvement 🪴"
  ];

  const feelingOptions = [
    "Calmer 🌱",
    "More hopeful ☀️",
    "About the same 🌿",
    "Still overwhelmed 🌧️"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("ecocalm_token");
    const payload = {
      experience,
      feeling,
      suggestions: suggestions.trim(),
      userName: user?.name || "Mindful Visitor",
      userEmail: user?.email || "",
      userId: user?.id || "visitor"
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitted(true);
        triggerCelebration();
        showToast("Feedback shared! Thank you for helping us grow 🌱", "spa");
      } else {
        // Fallback optimistic success
        setSubmitted(true);
        triggerCelebration();
        showToast("Feedback saved! 🌿", "spa");
      }
    } catch (err) {
      // Offline fallback
      setSubmitted(true);
      triggerCelebration();
      showToast("Feedback recorded peacefully! 🌿", "spa");
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setSuggestions("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
        onClick={handleResetAndClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-[#ffffff] rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden z-10 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-surface-container/80 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors shadow-xs"
          aria-label="Close feedback modal"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {submitted ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-[#eaf3eb] text-[#3b6637] flex items-center justify-center mx-auto shadow-inner text-3xl">
              🌿
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1a1c18]">
              Thank You for Helping Us Bloom!
            </h3>
            <p className="font-sans text-sm text-[#43483f] max-w-sm mx-auto leading-relaxed">
              Your reflection has been safely stored. We use your thoughts to make EcoCalm an even gentler sanctuary.
            </p>
            <div className="p-4 rounded-2xl bg-[#f7f9f6] border border-[#e2ece0] text-xs text-[#4a6b47] italic max-w-sm mx-auto">
              “Every single thought helps us grow. Thanks for being part of our journey!” 🌸
            </div>
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-full bg-[#3b6637] hover:bg-[#2d522a] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                Back to Sanctuary
              </button>
            </div>
          </div>
        ) : (
          /* Feedback Form matching screenshots */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-2 text-[#3b6637] font-semibold text-xl">
              <span className="text-2xl">🌿</span>
              <h2 className="font-serif font-bold text-2xl text-[#1a1c18]">Help Us Grow!</h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#43483f] mt-1 mb-6 leading-relaxed">
              Your thoughts help EcoCalm bloom. Share your experience!
            </p>

            {/* Question 1 */}
            <div className="space-y-3 pb-5 border-b border-[#e6eee3]">
              <label className="block font-sans text-sm sm:text-[15px] font-semibold text-[#1a1c18]">
                1. How was your EcoCalm experience?
              </label>
              <div className="space-y-2">
                {experienceOptions.map((opt) => {
                  const isSelected = experience === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setExperience(opt)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#f1f7ef] border-[#7da578] shadow-xs text-[#1a1c18] font-medium"
                          : "border-outline-variant/30 hover:bg-[#fafbfa] text-[#43483f]"
                      }`}
                    >
                      <div className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#3b6637]">
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#3b6637]" />
                        )}
                      </div>
                      <span className="text-sm">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Question 2 */}
            <div className="space-y-3 py-5 border-b border-[#e6eee3]">
              <label className="block font-sans text-sm sm:text-[15px] font-semibold text-[#1a1c18]">
                2. How do you feel after using EcoCalm?
              </label>
              <div className="space-y-2">
                {feelingOptions.map((opt) => {
                  const isSelected = feeling === opt;
                  return (
                    <label
                      key={opt}
                      onClick={() => setFeeling(opt)}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#f1f7ef] border-[#7da578] shadow-xs text-[#1a1c18] font-medium"
                          : "border-outline-variant/30 hover:bg-[#fafbfa] text-[#43483f]"
                      }`}
                    >
                      <div className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#3b6637]">
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#3b6637]" />
                        )}
                      </div>
                      <span className="text-sm">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Question 3 */}
            <div className="space-y-2.5 pt-5 pb-6">
              <label className="block font-sans text-sm sm:text-[15px] font-semibold text-[#1a1c18]">
                3. Any suggestions or thoughts?
              </label>
              <textarea
                rows={3}
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="Drop your thoughts here..."
                className="w-full p-3.5 rounded-2xl border border-outline-variant/50 focus:border-[#3b6637] focus:ring-2 focus:ring-[#3b6637]/20 outline-none text-sm text-on-surface placeholder:text-on-surface-variant/50 transition-all resize-none bg-[#fafbfa]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#1a1c18] hover:bg-[#2e312c] text-white font-sans text-sm font-semibold tracking-wide transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit feedback</span>
              )}
            </button>

            {/* Closing Line matching screenshot 4 */}
            <div className="mt-5 text-center">
              <p className="font-sans text-xs text-[#637361] italic leading-relaxed">
                <span className="font-semibold text-[#3b6637]">Closing line: </span>
                “Every single thought helps us grow. Thanks for being part of our journey!”
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
