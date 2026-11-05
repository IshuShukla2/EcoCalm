import React from "react";

export const PlantSVG = ({
  stage = 3,
  potStyle = "ceramic_ribbed",
  flowerType = "rose_bud",
  companion = "butterfly",
  size = "md", // sm, md, lg
  className = ""
}) => {
  // Pot color palettes
  const potStyles = {
    ceramic_ribbed: { body: "#ebe1d5", stripes: "#cac7b6", rim: "#f1e7db", name: "Warm Linen" },
    terracotta: { body: "#d3927d", stripes: "#b8705a", rim: "#de9d89", name: "Warm Terracotta" },
    unglazed_stone: { body: "#c7beb3", stripes: "#ab9e90", rim: "#d4cdc4", name: "Unglazed Stone" },
    celadon_green: { body: "#a9ad8a", stripes: "#8f946e", rim: "#b8bc9a", name: "Celadon Sage" },
    pastel_rose: { body: "#f2c4c0", stripes: "#d89f9b", rim: "#fae4e2", name: "Pastel Rose" },
    lavender_glaze: { body: "#d4c2e6", stripes: "#b39bc9", rim: "#ebe3f5", name: "Lavender Glaze" },
    matte_obsidian: { body: "#4a483e", stripes: "#36342b", rim: "#5c594d", name: "Matte Obsidian" },
    sky_mineral: { body: "#b8d5db", stripes: "#8faeb5", rim: "#d1e6ea", name: "Sky Mineral" }
  };

  const currentPot = potStyles[potStyle] || potStyles.ceramic_ribbed;

  const sizeClasses = {
    sm: "w-40 h-40",
    md: "w-64 h-64 sm:w-72 sm:h-72",
    lg: "w-72 h-72 sm:w-84 sm:h-84"
  };

  // Render selected flower type at apex
  const renderFlower = () => {
    switch (flowerType) {
      case "cherry_blossom":
        return (
          <g transform="translate(120, 52)">
            {/* 5 Petal Sakura */}
            <circle cx="-6" cy="-6" r="6" fill="#ffd6e0" />
            <circle cx="6" cy="-6" r="6" fill="#ffd6e0" />
            <circle cx="-8" cy="4" r="6" fill="#ffd6e0" />
            <circle cx="8" cy="4" r="6" fill="#ffd6e0" />
            <circle cx="0" cy="8" r="6" fill="#ffd6e0" />
            <circle cx="0" cy="0" r="4" fill="#ff9ebb" />
            <circle cx="0" cy="0" r="2" fill="#fff8f3" />
          </g>
        );
      case "sunflower":
        return (
          <g transform="translate(120, 52)">
            {/* Golden Sunflower */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <ellipse
                key={deg}
                cx="0"
                cy="0"
                rx="4"
                ry="11"
                transform={`rotate(${deg})`}
                fill="#f8df65"
              />
            ))}
            <circle cx="0" cy="0" r="7" fill="#6d522e" />
            <circle cx="0" cy="0" r="5" fill="#4a371c" />
          </g>
        );
      case "lavender":
        return (
          <g transform="translate(120, 50)">
            {/* Lavender floral spike */}
            <ellipse cx="-4" cy="8" rx="4" ry="5" fill="#cbaff3" />
            <ellipse cx="4" cy="8" rx="4" ry="5" fill="#cbaff3" />
            <ellipse cx="-3.5" cy="0" rx="3.5" ry="5" fill="#b993ec" />
            <ellipse cx="3.5" cy="0" rx="3.5" ry="5" fill="#b993ec" />
            <ellipse cx="0" cy="-7" rx="3" ry="5" fill="#a475e4" />
            <ellipse cx="0" cy="-14" rx="2.5" ry="4" fill="#8d61cc" />
          </g>
        );
      case "star_jasmine":
        return (
          <g transform="translate(120, 52)">
            {/* Radiant Star Jasmine */}
            <circle cx="0" cy="0" r="14" fill="#fcf2e6" fillOpacity="0.4" />
            {[0, 72, 144, 216, 288].map((deg) => (
              <path
                key={deg}
                d="M0 0 L-3 -11 L0 -14 L3 -11 Z"
                transform={`rotate(${deg})`}
                fill="#ffffff"
                stroke="#ebe1d5"
                strokeWidth="0.5"
              />
            ))}
            <circle cx="0" cy="0" r="3.5" fill="#e8e797" />
          </g>
        );
      case "lotus":
        return (
          <g transform="translate(120, 54)">
            {/* Emergent Lotus Bloom */}
            <ellipse cx="-7" cy="0" rx="6" ry="11" transform="rotate(-20)" fill="#ffa59e" />
            <ellipse cx="7" cy="0" rx="6" ry="11" transform="rotate(20)" fill="#ffa59e" />
            <ellipse cx="0" cy="-3" rx="7" ry="12" fill="#ffd1cc" />
            <ellipse cx="0" cy="-1" rx="4" ry="8" fill="#fff8f3" />
            <circle cx="0" cy="-1" r="2.5" fill="#f5f4a4" />
          </g>
        );
      case "rose_bud":
      default:
        return (
          <g transform="translate(120, 56)">
            {/* Tender Pink Rose Bud */}
            <ellipse cx="0" cy="0" rx="9" ry="12" fill="#ffcfcb" />
            <path d="M-6 4 C-4 -6 0 -11 0 -11 C0 -11 4 -6 6 4" fill="#ffdad7" fillOpacity="0.85" />
            <path d="M-1 -12 C1 -14 3 -12 3 -10 C3 -7 1 -4 -1 -4 Z" fill="#eabbb8" />
            <path
              d="M-7 5 C-4 2 -1 6 0 10 C1 6 4 2 7 5 C5 10 0 12 0 12 C0 12 -5 10 -7 5 Z"
              fill="#575718"
            />
          </g>
        );
    }
  };

  // Render selected companion / insect
  const renderInsect = () => {
    switch (companion) {
      case "honeybee":
        return (
          <g transform="translate(170, 75)" className="animate-pulse">
            <ellipse cx="0" cy="0" rx="6" ry="4" fill="#f5c23e" />
            <line x1="-3" y1="-3" x2="-3" y2="3" stroke="#222" strokeWidth="1.2" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#222" strokeWidth="1.2" />
            <line x1="3" y1="-3" x2="3" y2="3" stroke="#222" strokeWidth="1.2" />
            {/* Wings */}
            <ellipse cx="-2" cy="-6" rx="3" ry="5" fill="#ffffff" fillOpacity="0.8" transform="rotate(-20)" />
            <ellipse cx="2" cy="-6" rx="3" ry="5" fill="#ffffff" fillOpacity="0.8" transform="rotate(20)" />
          </g>
        );
      case "ladybug":
        return (
          <g transform="translate(148, 126)">
            {/* Red Ladybug crawling on stem */}
            <circle cx="0" cy="0" r="5" fill="#e53935" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke="#111" strokeWidth="0.8" />
            <circle cx="-2" cy="-1" r="0.8" fill="#111" />
            <circle cx="2" cy="-1" r="0.8" fill="#111" />
            <circle cx="-2" cy="2" r="0.8" fill="#111" />
            <circle cx="2" cy="2" r="0.8" fill="#111" />
            <circle cx="0" cy="-4" r="1.5" fill="#111" />
          </g>
        );
      case "firefly":
        return (
          <g transform="translate(68, 65)">
            {/* Glowing Firefly */}
            <circle cx="0" cy="0" r="8" fill="#f5f4a4" fillOpacity="0.6" className="animate-ping" style={{ animationDuration: "2.5s" }} />
            <ellipse cx="0" cy="0" rx="3" ry="5" fill="#333" />
            <ellipse cx="0" cy="3" rx="3" ry="3" fill="#e8e797" />
          </g>
        );
      case "dragonfly":
        return (
          <g transform="translate(172, 60)">
            {/* Emerald Dragonfly */}
            <line x1="-8" y1="-3" x2="8" y2="-3" stroke="#80deea" strokeWidth="1.5" strokeOpacity="0.8" />
            <line x1="-7" y1="1" x2="7" y2="1" stroke="#80deea" strokeWidth="1.2" strokeOpacity="0.8" />
            <line x1="0" y1="-6" x2="0" y2="8" stroke="#00897b" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="0" cy="-6" r="1.5" fill="#004d40" />
          </g>
        );
      case "hummingbird":
        return (
          <g transform="translate(176, 52)">
            {/* Ruby Hummingbird */}
            <ellipse cx="0" cy="0" rx="7" ry="5" fill="#2e7d32" />
            <circle cx="-6" cy="-2" r="3" fill="#d32f2f" />
            <line x1="-8" y1="-2" x2="-16" y2="1" stroke="#333" strokeWidth="1" />
            <ellipse cx="2" cy="-5" rx="5" ry="2" fill="#81c784" transform="rotate(-30)" />
          </g>
        );
      case "butterfly":
      default:
        return (
          <g transform="translate(174, 64)" className="hover:scale-110 transition-transform">
            {/* Blue Morpho Butterfly */}
            <path d="M0 0 C4 -10 14 -10 14 -2 C14 4 4 6 0 0 Z" fill="#42a5f5" />
            <path d="M0 0 C4 2 12 4 12 10 C12 14 4 12 0 0 Z" fill="#1e88e5" />
            <path d="M0 0 C-4 -10 -14 -10 -14 -2 C-14 4 -4 6 0 0 Z" fill="#42a5f5" />
            <path d="M0 0 C-4 2 -12 4 -12 10 C-12 14 -4 12 0 0 Z" fill="#1e88e5" />
            <line x1="0" y1="-6" x2="0" y2="8" stroke="#1f1b14" strokeWidth="1.5" />
          </g>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      {/* Gentle ambient glow */}
      <div className="absolute inset-4 rounded-full bg-primary-fixed/20 animate-pulse pointer-events-none" />

      <svg
        className="relative w-full h-full drop-shadow-[0_8px_24px_rgba(87,87,24,0.12)] transition-transform duration-700 hover:scale-105"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soil mound */}
        <ellipse cx="120" cy="174" rx="42" ry="7" fill="#48473a" fillOpacity="0.25" />

        {/* Planter Body */}
        <path
          d="M78 172 L86 216 Q88 222 96 222 L144 222 Q152 222 154 216 L162 172 Z"
          fill={currentPot.body}
        />

        {/* Ribbed texture stripes */}
        <path d="M92 174 L97 218" stroke={currentPot.stripes} strokeWidth="1.75" strokeLinecap="round" />
        <path d="M106 174 L109 220" stroke={currentPot.stripes} strokeWidth="1.75" strokeLinecap="round" />
        <path d="M120 174 L120 220" stroke={currentPot.stripes} strokeWidth="1.75" strokeLinecap="round" />
        <path d="M134 174 L131 220" stroke={currentPot.stripes} strokeWidth="1.75" strokeLinecap="round" />
        <path d="M148 174 L143 218" stroke={currentPot.stripes} strokeWidth="1.75" strokeLinecap="round" />

        {/* Planter Rim */}
        <rect x="73" y="166" width="94" height="8" rx="4" fill={currentPot.rim} />

        {/* Main Central Stem */}
        <path
          d="M120 166 C120 128 116 100 120 62"
          stroke="#575718"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Left Leaf (Broad Monstera Style) */}
        <path
          d="M118 132 C92 126 62 108 58 78 C56 64 68 62 82 72 C94 82 108 104 118 120"
          fill="#70702e"
        />
        <path
          d="M118 132 C94 122 76 96 70 76"
          stroke="#f5f4a4"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />
        {/* Leaf Fenestrations */}
        <ellipse cx="80" cy="94" rx="3" ry="8" transform="rotate(-30 80 94)" fill="#fff8f3" />
        <ellipse cx="94" cy="110" rx="2.5" ry="6" transform="rotate(-20 94 110)" fill="#fff8f3" />

        {/* Right Leaf */}
        <path
          d="M120 114 C146 104 176 92 182 66 C186 52 174 48 158 58 C144 68 130 90 120 106"
          fill="#575718"
        />
        <path
          d="M120 114 C144 102 162 76 170 58"
          stroke="#cbca7e"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />
        <ellipse cx="160" cy="78" rx="3" ry="7" transform="rotate(28 160 78)" fill="#fff8f3" />

        {/* Upper Leaves */}
        {stage >= 2 && (
          <>
            <path d="M120 90 C100 80 88 55 95 38 C102 28 114 36 120 54" fill="#6c7051" />
            <path d="M120 90 C138 78 152 50 145 36 C138 26 128 36 120 54" fill="#7a5553" />
          </>
        )}

        {/* Custom Flower at Terminal Apex */}
        {stage >= 3 && renderFlower()}

        {/* Custom Insect / Companion */}
        {renderInsect()}

        {/* Hydration dew droplets */}
        <circle cx="148" cy="138" r="4.5" fill="#70702e" fillOpacity="0.25" />
        <circle cx="150" cy="136" r="3" fill="#6c7051" />
        <circle cx="90" cy="56" r="2.5" fill="#e8e797" />
      </svg>
    </div>
  );
};
