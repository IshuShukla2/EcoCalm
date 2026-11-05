import React, { useState } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const HelplineModal = ({ isOpen, onClose }) => {
  const { showToast } = useEcoCalm();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyNumber = () => {
    navigator.clipboard?.writeText("14416");
    setCopied(true);
    showToast("Helpline number 14416 copied to clipboard 💚", "check_circle");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Dimmed Calm Backdrop */}
      <div
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#ffffff] rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden z-10 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-surface-container/80 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors shadow-xs"
          aria-label="Close helpline modal"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Scrollable Content Container */}
        <div className="max-h-[90vh] overflow-y-auto px-5 sm:px-7 py-6 text-center">
          {/* Header Artwork: Soft watercolor hands cradling tender sprout */}
          <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-6 bg-gradient-to-b from-[#f5f2e8] via-[#e8efe4] to-[#dfebe0] flex items-center justify-center shadow-inner">
            {/* SVG Art mimicking the serene watercolor illustration */}
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 400 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d5e3cf" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#bfd5b7" stopOpacity="0.5" />
                </linearGradient>
                <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e7edd8" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#cfe0c6" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="stemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#4a6b47" />
                  <stop offset="100%" stopColor="#759970" />
                </linearGradient>
              </defs>

              {/* Serene organic contour ribbons */}
              <path
                d="M -20,60 Q 80,10 180,70 T 420,40 L 420,240 L -20,240 Z"
                fill="url(#waveGrad1)"
              />
              <path
                d="M -20,110 Q 120,40 220,120 T 420,90 L 420,240 L -20,240 Z"
                fill="url(#waveGrad2)"
              />
              <path
                d="M -10,150 Q 100,120 200,160 T 420,130 L 420,240 L -10,240 Z"
                fill="#cadcc2"
                opacity="0.6"
              />

              {/* Left gentle hand line art */}
              <path
                d="M 20,160 C 70,150 120,140 160,148 C 178,152 195,142 205,130 C 190,132 170,132 150,135 C 110,140 60,150 20,170"
                stroke="#637c60"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="#f5ece1"
                fillOpacity="0.5"
              />
              <path
                d="M 80,155 C 120,145 165,140 195,124"
                stroke="#637c60"
                strokeWidth="1.4"
                strokeLinecap="round"
              />

              {/* Right gentle hand line art */}
              <path
                d="M 380,160 C 330,150 280,140 240,148 C 222,152 205,142 195,130 C 210,132 230,132 250,135 C 290,140 340,150 380,170"
                stroke="#637c60"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="#f5ece1"
                fillOpacity="0.5"
              />
              <path
                d="M 320,155 C 280,145 235,140 205,124"
                stroke="#637c60"
                strokeWidth="1.4"
                strokeLinecap="round"
              />

              {/* Central growing sprout */}
              <path
                d="M 200,140 Q 200,90 200,55"
                stroke="url(#stemGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Central leaf */}
              <path
                d="M 200,55 Q 192,35 200,25 Q 208,35 200,55 Z"
                fill="#557c51"
              />
              {/* Left leaves */}
              <path
                d="M 200,75 Q 175,65 170,50 Q 185,55 200,68"
                fill="#6e9669"
              />
              <path
                d="M 200,105 Q 165,95 160,80 Q 180,85 200,98"
                fill="#7da578"
              />
              {/* Right leaves */}
              <path
                d="M 200,70 Q 225,60 230,45 Q 215,50 200,63"
                fill="#6e9669"
              />
              <path
                d="M 200,100 Q 235,90 240,75 Q 220,80 200,93"
                fill="#7da578"
              />
            </svg>

            {/* Credit Tag in bottom-left */}
            <span className="absolute bottom-2 left-2.5 px-2.5 py-0.5 rounded-full bg-black/40 text-[10px] font-medium text-white/90 backdrop-blur-xs tracking-wide">
              laurent-marchal-sexologo
            </span>
          </div>

          {/* Heading Section */}
          <div className="flex items-center justify-center gap-1.5 text-[#3b6637] font-semibold text-lg sm:text-xl">
            <span className="text-xl">🌿</span>
            <h2>A Little Reminder from EcoCalm</h2>
          </div>

          <h3 className="font-serif text-2xl sm:text-[26px] font-bold text-[#1a1c18] mt-2 mb-3 tracking-tight">
            You deserve care, too.
          </h3>

          <p className="font-sans text-sm sm:text-[15px] text-[#43483f] leading-relaxed max-w-sm mx-auto">
            You've spent time nurturing your little plant. Remember to nurture yourself, too. 💚
          </p>

          <p className="font-sans text-sm sm:text-[15px] text-[#43483f] leading-relaxed max-w-sm mx-auto mt-3">
            It's okay to feel overwhelmed. It's okay to take a break. And it's absolutely okay to ask for help.
          </p>

          {/* Subtle Divider */}
          <div className="my-6 h-px w-full bg-[#d6dfd2]" />

          {/* Middle Section */}
          <h4 className="font-serif text-lg sm:text-xl font-bold text-[#1a1c18] leading-snug">
            Your feelings matter. Your mental health matters.
          </h4>

          <p className="font-sans text-sm sm:text-[15px] text-[#43483f] mt-2 mb-5">
            Whenever life feels a little too heavy, support is just a call away.
          </p>

          {/* Tele-MANAS Featured Support Card */}
          <div className="rounded-2xl bg-[#eaf3eb] p-5 border border-[#cbe1ce] text-center shadow-xs">
            <div className="flex items-center justify-center gap-2 text-[#2d552a] font-semibold text-base sm:text-lg">
              <span className="material-symbols-outlined text-xl">call</span>
              <span>Tele-MANAS</span>
            </div>

            <a
              href="tel:14416"
              className="block font-mono text-3xl sm:text-4xl font-extrabold text-[#244b21] my-2 hover:scale-105 transition-transform tracking-wider focus:outline-none focus:ring-2 focus:ring-[#3b6637] rounded-lg"
              title="Click to call Tele-MANAS directly"
            >
              14416
            </a>

            <p className="text-xs sm:text-sm text-[#435c40] font-medium leading-relaxed">
              Free, 24/7 mental health support across India.
            </p>

            {/* Quick Actions */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <a
                href="tel:14416"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3b6637] hover:bg-[#2d522a] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">phone_in_talk</span>
                <span>Call 14416</span>
              </a>

              <button
                onClick={handleCopyNumber}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#f2f7f1] text-[#2d552a] border border-[#bcd3be] text-xs font-semibold transition-all shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">
                  {copied ? "check" : "content_copy"}
                </span>
                <span>{copied ? "Copied!" : "Copy Number"}</span>
              </button>
            </div>
          </div>

          {/* Closing Quote */}
          <div className="mt-6 mb-2">
            <p className="italic font-serif text-sm sm:text-base text-[#466642] leading-relaxed">
              “You don't have to bloom every day. Just keep giving yourself a chance.”
            </p>
            <div className="text-2xl mt-1.5">🌱</div>
          </div>
        </div>
      </div>
    </div>
  );
};
