import React, { useState, useRef } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const AvatarPickerModal = ({ isOpen, onClose }) => {
  const { user, updateUserAvatar } = useEcoCalm();

  // Curated preset avatars across mindful aesthetics
  const presetAvatars = [
    {
      id: "maya_original",
      name: "Maya Chen",
      vibe: "Sanctuary Founder",
      category: "Botanical",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2whyhBjn4A9SnEMzocCRmpZP4ZEqmpJ-zWeW23kmuur800au6BqfdYcmvuwTzO79WzC_neRaecdYdFzxrWI45DuCG6rwzNFEUzVaqidljRlDiMlGT_MSXJq5Bqg6DCHCsacno2GMG-rbsJe5Cv7KQB01D4qvRh7qT9Dvw6fh49e89ImV44CfxDLOv6nk-_mdQir7iuP4e_KzmsrZPEM-PNjQETIJFP7OenqynM0Hg6_y8eiUn2A1B_w"
    },
    {
      id: "flora_plant",
      name: "Flora",
      vibe: "Plant Parent",
      category: "Botanical",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "kai_fern",
      name: "Kai",
      vibe: "Fern Explorer",
      category: "Botanical",
      url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "sage_forest",
      name: "Sage",
      vibe: "Forest Whisperer",
      category: "Botanical",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "willow_tea",
      name: "Willow",
      vibe: "Tea & Journal",
      category: "Cozy",
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "river_gold",
      name: "River",
      vibe: "Golden Hour Crafter",
      category: "Cozy",
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "milo_books",
      name: "Milo",
      vibe: "Slow Bookworm",
      category: "Cozy",
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "aria_potter",
      name: "Aria",
      vibe: "Clay Potter",
      category: "Cozy",
      url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "luna_zen",
      name: "Luna",
      vibe: "Somatic Meditator",
      category: "Zen",
      url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "saffron_dew",
      name: "Saffron",
      vibe: "Morning Dew Sprite",
      category: "Zen",
      url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "rowan_bonsai",
      name: "Rowan",
      vibe: "Bonsai Grounding",
      category: "Zen",
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "celeste_stars",
      name: "Celeste",
      vibe: "Starry Night Peace",
      category: "Zen",
      url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80"
    }
  ];

  const [activeTab, setActiveTab] = useState("presets"); // "presets" | "gallery"
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const [filterCategory, setFilterCategory] = useState("All");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Filter presets
  const filteredPresets = filterCategory === "All"
    ? presetAvatars
    : presetAvatars.filter(p => p.category === filterCategory);

  // File upload handler (device gallery / photo picker)
  const handleFileProcess = (file) => {
    setErrorMsg("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file (JPG, PNG, WebP, GIF).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 8MB. Please choose a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedAvatar(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setSelectedAvatar(customUrlInput.trim());
    setCustomUrlInput("");
  };

  const handleSaveAvatar = () => {
    updateUserAvatar(selectedAvatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/30 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Glow decorative blurs */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-secondary-container/40 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors z-20"
          title="Close"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 z-10">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              face
            </span>
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-on-surface font-semibold tracking-tight">
              Change Profile Picture
            </h2>
            <p className="text-xs text-on-surface-variant">
              Choose from mindful preset avatars or upload any photo from your gallery.
            </p>
          </div>
        </div>

        {/* Live Avatar Preview Card */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 mb-5 z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={selectedAvatar}
                alt="Selected Avatar Preview"
                className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/30 shadow-md transition-transform hover:scale-105"
                onError={(e) => {
                  e.target.src = user.avatar;
                }}
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[10px] shadow-xs">
                ✨
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Preview</span>
              <p className="text-sm font-semibold text-on-surface">{user.name}</p>
              <p className="text-[11px] text-on-surface-variant">
                {selectedAvatar === user.avatar ? "Current Profile Picture" : "New Selected Avatar (Unsaved)"}
              </p>
            </div>
          </div>

          {selectedAvatar !== user.avatar && (
            <button
              onClick={() => setSelectedAvatar(user.avatar)}
              className="text-xs text-on-surface-variant hover:text-error px-2.5 py-1 rounded-lg hover:bg-surface-container transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Tabs: Presets vs Gallery */}
        <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-2xl mb-4 text-xs font-semibold z-10">
          <button
            type="button"
            onClick={() => setActiveTab("presets")}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === "presets"
                ? "bg-surface-container-lowest text-primary shadow-xs font-bold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-sm">palette</span>
            <span>Mindful Presets ({presetAvatars.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("gallery")}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === "gallery"
                ? "bg-surface-container-lowest text-primary shadow-xs font-bold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-sm">photo_library</span>
            <span>Choose from Gallery</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 z-10 space-y-4 max-h-[46vh]">
          {activeTab === "presets" ? (
            <div>
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 text-xs">
                {["All", "Botanical", "Cozy", "Zen"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1 rounded-full font-medium transition-colors ${
                      filterCategory === cat
                        ? "bg-primary text-on-primary font-bold shadow-xs"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {filteredPresets.map((preset) => {
                  const isSelected = selectedAvatar === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedAvatar(preset.url)}
                      className={`relative flex flex-col items-center p-2 rounded-2xl border transition-all text-left ${
                        isSelected
                          ? "bg-primary-container/20 border-primary ring-2 ring-primary/40 shadow-xs scale-102"
                          : "bg-surface-container-low hover:bg-surface-container border-outline-variant/30 hover:scale-101"
                      }`}
                    >
                      <div className="relative mb-2">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shadow-sm"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-xl font-bold bg-surface-container-lowest rounded-full p-0.5 shadow-sm">
                              check_circle
                            </span>
                          </div>
                        )}
                      </div>

                      <span className="font-semibold text-xs text-on-surface truncate w-full text-center">
                        {preset.name}
                      </span>
                      <span className="text-[10px] text-on-surface-variant truncate w-full text-center">
                        {preset.vibe}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Gallery & Custom Upload Tab */
            <div className="space-y-4">
              {/* Drag and Drop / Choose from Gallery Box */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-primary bg-primary-container/20 scale-101"
                    : "border-outline-variant/50 hover:border-primary/60 bg-surface-container-low hover:bg-surface-container"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="avatar-file-gallery"
                />

                <div className="w-14 h-14 rounded-2xl bg-secondary-container/60 flex items-center justify-center text-on-secondary-container mb-3 shadow-xs">
                  <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                </div>

                <h3 className="text-sm font-bold text-on-surface mb-1">
                  Click to open Gallery or drop photo here
                </h3>
                <p className="text-xs text-on-surface-variant max-w-xs mb-3">
                  Upload a selfie, mindful drawing, pet picture, or nature snapshot from your phone or device.
                </p>

                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary font-semibold text-xs shadow-xs hover:bg-primary-container active:scale-95 transition-all">
                  <span className="material-symbols-outlined text-sm">photo_library</span>
                  <span>Select from Photos / Gallery</span>
                </div>

                <span className="text-[10px] text-on-surface-variant mt-3">
                  Supports PNG, JPG, GIF, WebP (up to 8MB)
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-error-container/40 text-on-error-container text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Or paste custom URL */}
              <div className="pt-2 border-t border-outline-variant/30 space-y-2">
                <label className="text-xs font-semibold text-on-surface block" htmlFor="custom-avatar-url">
                  Or Paste an Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    id="custom-avatar-url"
                    type="url"
                    placeholder="https://example.com/my-photo.jpg"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="flex-1 bg-surface-container-low px-4 py-2 rounded-xl text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-5 pt-4 border-t border-outline-variant/20 flex items-center justify-end gap-3 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveAvatar}
            className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-semibold text-xs shadow-md hover:bg-primary-container active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">check</span>
            <span>Save Profile Picture</span>
          </button>
        </div>
      </div>
    </div>
  );
};
