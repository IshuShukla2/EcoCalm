import React from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const Toast = () => {
  const { toast } = useEcoCalm();
  if (!toast) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-container-lowest text-on-surface shadow-xl border border-primary/20 backdrop-blur-md">
        <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
          <span className="material-symbols-outlined text-lg">{toast.icon || "spa"}</span>
        </div>
        <p className="font-sans text-xs sm:text-sm font-medium">{toast.message}</p>
      </div>
    </div>
  );
};
