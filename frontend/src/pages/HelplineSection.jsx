import React, { useState } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const HelplineSection = () => {
  const { showToast, setActiveTab } = useEcoCalm();
  const [copiedNumber, setCopiedNumber] = useState(null);

  const helplines = [
    {
      id: "telemanas",
      name: "Tele-MANAS (Govt. of India)",
      badge: "24/7 National Mental Health",
      number: "14416",
      altNumber: "1800-891-4416",
      desc: "Free, comprehensive, 24/7 mental health and psychological support counseling across India in 20+ languages.",
      whenToCall: "Crisis counseling, acute distress, overwhelming anxiety, grief, depressive episodes."
    },
    {
      id: "vandrevala",
      name: "Vandrevala Foundation Helpline",
      badge: "24/7 Free Crisis Support",
      number: "+91 9999 666 555",
      desc: "Dedicated compassionate psychological support available round the clock by experienced counselors.",
      whenToCall: "Severe mental distress, suicidal thoughts, emotional breakdown, panic."
    },
    {
      id: "icall",
      name: "iCall Psychosocial Helpline (TISS)",
      badge: "Mon-Sat • 8 AM to 10 PM",
      number: "+91 9152987821",
      desc: "Free confidential telephonic and email-based counseling run by the Tata Institute of Social Sciences.",
      whenToCall: "Relationship strain, academic stress, LGBTQIA+ affirmative guidance, work burnout."
    },
    {
      id: "kiran",
      name: "KIRAN Helpline",
      badge: "24/7 Toll-Free",
      number: "1800-599-0019",
      desc: "Mental health rehabilitation helpline providing early screening, psychological first aid, and support.",
      whenToCall: "Depression, trauma recovery, addiction support, rehabilitation assistance."
    },
    {
      id: "international",
      name: "International 988 Crisis & Suicide Lifeline",
      badge: "US / Canada / Global",
      number: "988",
      desc: "Immediate 24/7 support for anyone in suicidal crisis or emotional distress across the US and Canada (Dial 111 in UK).",
      whenToCall: "Immediate emergency crisis, acute hopelessness, self-harm prevention."
    }
  ];

  const handleCopy = (num) => {
    navigator.clipboard?.writeText(num.replace(/[^0-9+]/g, ""));
    setCopiedNumber(num);
    showToast(`Number ${num} copied to clipboard 💚`, "check_circle");
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-6 pb-20 pt-2 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/30">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-1">
            <span className="material-symbols-outlined text-sm">support_agent</span>
            <span>Verified 24/7 Mental Health Resources</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold tracking-tight">
            Mental Health Helplines & Support
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl">
            You never have to carry overwhelming feelings alone. All services below are free, confidential, and verified.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("plant")}
          className="self-start sm:self-auto px-4 py-2 rounded-full bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors"
        >
          Back to Plant Sanctuary 🌱
        </button>
      </div>

      {/* Directory of Helplines */}
      <div className="space-y-4">
        {helplines.map((item) => (
          <div
            key={item.id}
            className="p-5 sm:p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-primary/40 transition-all"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {item.badge}
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-on-surface">
                  {item.name}
                </h3>
              </div>

              <p className="text-xs text-on-surface-variant leading-relaxed">
                {item.desc}
              </p>

              <div className="text-[11px] text-primary/90 font-medium">
                <span className="font-bold">When to call:</span> {item.whenToCall}
              </div>
            </div>

            {/* Call and Copy Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href={`tel:${item.number.replace(/[^0-9+]/g, "")}`}
                className="px-5 py-2.5 rounded-full bg-[#2d552a] text-white text-xs font-bold shadow-xs hover:bg-[#1f3a1c] transition-all flex items-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">call</span>
                <span>Call {item.number}</span>
              </a>

              <button
                onClick={() => handleCopy(item.number)}
                className="p-2.5 rounded-full bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                title="Copy number"
              >
                <span className="material-symbols-outlined text-base">
                  {copiedNumber === item.number ? "check" : "content_copy"}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Compassionate Note Card */}
      <div className="p-6 rounded-3xl bg-primary-container/20 border border-primary/20 text-center space-y-2">
        <span className="text-3xl">🕊️</span>
        <h4 className="font-serif text-base font-bold text-on-surface">
          Remember: Reaching out is an act of deep courage.
        </h4>
        <p className="text-xs text-on-surface-variant max-w-lg mx-auto">
          Trained counselors are waiting on the other side of these lines without judgment. If you or someone you know is in acute danger, please contact local emergency medical services immediately.
        </p>
      </div>
    </div>
  );
};

