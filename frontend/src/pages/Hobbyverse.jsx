import React, { useState, useEffect } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";

export const Hobbyverse = () => {
  const { user, setUser, posts, createPost, giveDropToPost, addCommentToPost, showToast, triggerCelebration } = useEcoCalm();

  const [activeCircle, setActiveCircle] = useState("all");
  const [activeFeedTab, setActiveFeedTab] = useState("Fresh"); // "Fresh", "In-Progress", "Live Chat"
  const [commentInputs, setCommentInputs] = useState({});
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(null);
  const [roomTimer, setRoomTimer] = useState(25 * 60);

  // Live Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [newChatMessage, setNewChatMessage] = useState("");

  // New post form
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [postCircle, setPostCircle] = useState("crochet");
  const [postImage, setPostImage] = useState("");

  // Moderation Report modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingPostId, setReportingPostId] = useState(null);
  const [reportReason, setReportReason] = useState("Unkind or commercial spam");

  const circles = [
    { id: "all", label: "All Circles", icon: "✨", count: "18k" },
    { id: "crochet", label: "Crochet & Chill", icon: "🧶", count: "4.2k" },
    { id: "books", label: "Bookworms' Corner", icon: "📖", count: "5.8k" },
    { id: "art", label: "The Delulu Artists Club", icon: "🎨", count: "3.1k" },
    { id: "chess", label: "Chess Not Stress", icon: "♟️", count: "1.9k" },
    { id: "plants", label: "The Green Thumb Gang", icon: "🪴", count: "4.7k" },
    { id: "bake", label: "Bake It Till You Make It", icon: "🥖", count: "2.8k" },
    { id: "craft", label: "DIY & Craft Society", icon: "✂️", count: "3.4k" }
  ];

  // Fetch circle chat messages
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const query = activeCircle !== "all" ? `?circle=${activeCircle}` : "";
        const res = await fetch(`/api/community/chat${query}`);
        if (res.ok) {
          const data = await res.json();
          setChatMessages(data);
        }
      } catch (err) {
        // quiet fallback
      }
    };
    fetchChat();
  }, [activeCircle]);

  const filteredPosts = posts.filter((p) => {
    if (activeCircle !== "all" && p.circle !== activeCircle) return false;
    return true;
  });

  const handleCommentSubmit = (postId, e) => {
    e.preventDefault();
    const txt = commentInputs[postId];
    if (!txt || !txt.trim()) return;
    addCommentToPost(postId, txt.trim());
    setCommentInputs({ ...commentInputs, [postId]: "" });
  };

  const handleCreatePostSubmit = (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postText.trim()) return;
    createPost({
      title: postTitle.trim(),
      text: postText.trim(),
      circle: postCircle,
      image: postImage.trim() || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
    });
    setCreateModalOpen(false);
    setPostTitle("");
    setPostText("");
    setPostImage("");
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;
    const msgObj = {
      circle: activeCircle === "all" ? "crochet" : activeCircle,
      text: newChatMessage.trim()
    };
    try {
      const res = await fetch("/api/community/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgObj)
      });
      if (res.ok) {
        const saved = await res.json();
        setChatMessages((prev) => [...prev, saved]);
        setNewChatMessage("");
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `chat_${Date.now()}`,
          author: user.name || "Maya Chen",
          authorAvatar: user.avatar,
          text: newChatMessage.trim(),
          timestamp: new Date().toISOString()
        }
      ]);
      setNewChatMessage("");
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/community/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: reportingPostId, reason: reportReason })
      });
    } catch (err) {
      // quiet fallback
    }
    setReportModalOpen(false);
    showToast("Report submitted to sanctuary moderators. Thank you for protecting our peace.", "verified_user");
  };

  const handleJoinCircle = (circleId) => {
    const joined = user.joinedCircles || ["crochet", "plants", "books"];
    let updated;
    if (joined.includes(circleId)) {
      updated = joined.filter(c => c !== circleId);
      showToast(`Left circle peacefully`, "logout");
    } else {
      updated = [...joined, circleId];
      triggerCelebration();
      showToast(`Joined ${circles.find(c => c.id === circleId)?.label || circleId}! +15 Drops 🌿`, "group_add");
    }
    setUser({ ...user, joinedCircles: updated });
  };

  const handleJoinCozyRoom = (roomName) => {
    if (joinedRoom === roomName) {
      setJoinedRoom(null);
      showToast("Left cozy study room 🌙", "logout");
    } else {
      setJoinedRoom(roomName);
      setRoomTimer(25 * 60);
      showToast(`Joined ${roomName}! Presence logged ☕`, "group");
    }
  };

  const isCurrentCircleJoined = activeCircle !== "all" && (user.joinedCircles || []).includes(activeCircle);

  return (
    <div className="flex flex-col w-full max-w-[1240px] mx-auto space-y-6 pb-20 pt-4">
      {/* ================= TOP EDITORIAL HEADER ================= */}
      <header className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-surface-container-low shadow-xs border border-outline-variant/30">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-72 h-72 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-surface-container-high text-tertiary text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">filter_vintage</span>
              <span className="tracking-wider uppercase">Interest-Based Communities • Zero Comparison</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-on-surface tracking-tight font-medium">
              The Hobbyverse <span className="inline-block transform hover:rotate-12 transition-transform duration-300">🧶</span>
            </h1>

            <p className="font-sans text-sm sm:text-base text-on-surface-variant font-light leading-relaxed">
              Find your quiet corner of the internet. Share honest progress, swap beginner tips, ask questions, and celebrate unfinished experiments with zero perfectionism.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-end">
            {activeCircle !== "all" && (
              <button
                onClick={() => handleJoinCircle(activeCircle)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all active:scale-95 ${
                  isCurrentCircleJoined
                    ? "bg-secondary-container text-on-secondary-container"
                    : "bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary border border-primary/40"
                }`}
              >
                <span className="material-symbols-outlined text-sm">{isCurrentCircleJoined ? "check" : "add"}</span>
                <span>{isCurrentCircleJoined ? "Joined Circle" : "Join Circle (+15 💧)"}</span>
              </button>
            )}

            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-semibold shadow-xs hover:bg-primary-container transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-base">edit_note</span>
              <span>Create Project Post 🌿</span>
            </button>
          </div>
        </div>

        {/* Sanctuary Creed Pill Tape */}
        <div className="relative mt-6 pt-4 border-t border-outline-variant/20">
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 py-2 px-4 rounded-xl bg-surface-container-lowest/80 backdrop-blur-xs text-on-surface-variant text-xs shadow-xs">
            <span className="flex items-center gap-1 text-primary font-bold">
              <span className="material-symbols-outlined text-xs">verified_user</span> Sanctuary Rules:
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Zero comparison culture
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Unfinished & clumsy works loved
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> Zero algorithms or followers
            </span>
            <span className="inline-flex items-center gap-1 text-on-surface font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Moderated safety for all humans
            </span>
          </div>
        </div>
      </header>

      {/* ================= HOBBY CIRCLES TABS ================= */}
      <nav className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {circles.map((c) => {
          const isActive = activeCircle === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCircle(c.id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-xs whitespace-nowrap ${
                isActive
                  ? "bg-primary-container text-on-primary-container font-bold scale-102"
                  : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-outline-variant/30"
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px]">
                {c.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ================= MAIN TWO-COLUMN COMMUNITY VIEW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Community Posts Stream or Live Chat (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Sorting & Mode Bar */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-semibold text-on-surface">
                {activeFeedTab === "Live Chat" ? "Circle Whisper Chat 💬" : "Quiet Stream"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                {activeFeedTab === "Live Chat" ? "Gentle Real-Time Room" : "Unranked • Chronological"}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-surface-container-high px-1 py-0.5 rounded-full text-xs text-on-surface-variant">
              {["Fresh", "Live Chat", "Need Advice"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveFeedTab(t)}
                  className={`px-3 py-1 rounded-full transition-colors flex items-center gap-1 ${
                    activeFeedTab === t
                      ? "bg-surface-container-lowest text-on-surface font-semibold shadow-xs"
                      : "hover:text-on-surface"
                  }`}
                >
                  {t === "Live Chat" && <span className="material-symbols-outlined text-xs text-primary">chat</span>}
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ================= VIEW A: LIVE CIRCLE CHAT ================= */}
          {activeFeedTab === "Live Chat" ? (
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-xs border border-outline-variant/30 flex flex-col h-[520px]">
              <div className="pb-3 border-b border-outline-variant/20 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-on-surface">
                    {circles.find(c => c.id === activeCircle)?.label || "Community"} Cozy Chat
                  </h3>
                  <p className="text-[11px] text-on-surface-variant">
                    Swap quick tips, pattern advice, and encouragement.
                  </p>
                </div>
                <span className="text-[10px] bg-primary-fixed text-on-primary-fixed-variant px-2.5 py-0.5 rounded-full font-bold">
                  24 Online
                </span>
              </div>

              {/* Chat messages viewport */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {chatMessages.length === 0 ? (
                  <p className="text-xs text-on-surface-variant text-center py-10">
                    No whispers yet in this circle. Say hello first! 🌿
                  </p>
                ) : (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3 text-xs">
                      <img
                        src={msg.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"}
                        alt={msg.author}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-outline-variant/40 mt-0.5"
                      />
                      <div className="flex-1 bg-surface-container-low p-3 rounded-2xl">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-on-surface">@{msg.author}</span>
                          <span className="text-[10px] text-on-surface-variant">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-on-surface leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-outline-variant/20 flex items-center gap-2">
                <input
                  type="text"
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  placeholder="Share a gentle tip or ask a question..."
                  className="flex-1 bg-surface-container-low px-4 py-2.5 rounded-2xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold shadow-xs hover:bg-primary-container transition-all"
                >
                  Send 💬
                </button>
              </form>
            </div>
          ) : (
            /* ================= VIEW B: POSTS FEED ================= */
            filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xs border border-outline-variant/30 flex flex-col gap-4 transition-all hover:shadow-md"
              >
                {/* Author Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      alt={post.author}
                      src={post.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-xs sm:text-sm font-bold text-on-surface">
                          @{post.author}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-tertiary text-[10px] font-semibold">
                          {post.circleName}
                        </span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant mt-0.5">{post.timeAgo}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.offlineSprintMinutes && (
                      <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">
                        ⏱️ {post.offlineSprintMinutes}m offline
                      </span>
                    )}

                    {/* Moderation Report Button */}
                    <button
                      onClick={() => {
                        setReportingPostId(post.id);
                        setReportModalOpen(true);
                      }}
                      className="p-1.5 text-on-surface-variant hover:text-error rounded-lg transition-colors"
                      title="Report Post to Moderation"
                    >
                      <span className="material-symbols-outlined text-base">flag</span>
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="space-y-2">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-on-surface">
                    {post.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {post.text}
                  </p>
                </div>

                {/* Project Image */}
                {post.image && (
                  <div className="rounded-2xl overflow-hidden bg-surface-container max-h-[420px]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
                    />
                  </div>
                )}

                {/* Tags */}
                {post.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full bg-surface-container text-[11px] font-medium text-on-surface-variant"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons: Drops Given + Comments */}
                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => giveDropToPost(post.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all active:scale-95 shadow-xs ${
                        post.hasGivenDrop
                          ? "bg-primary-container text-on-primary-container font-bold"
                          : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">water_drop</span>
                      <span>{post.dropsGiven} Drops Given</span>
                    </button>

                    <span className="text-xs flex items-center gap-1 px-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-base">chat_bubble</span>
                      <span>{post.comments ? post.comments.length : 0} Comments</span>
                    </span>
                  </div>

                  <button
                    onClick={() => showToast("Post saved to quiet scrapbox ✨", "bookmark")}
                    className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant"
                    title="Bookmark"
                  >
                    <span className="material-symbols-outlined text-lg">bookmark</span>
                  </button>
                </div>

                {/* Existing Comments list */}
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-outline-variant/10">
                    {post.comments.map((c) => (
                      <div key={c.id} className="p-3 rounded-2xl bg-surface-container-low text-xs space-y-0.5">
                        <span className="font-bold text-on-surface">@{c.author}: </span>
                        <span className="text-on-surface-variant">{c.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input Box */}
                <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Leave a kind, pressure-free whisper..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    className="flex-1 bg-surface-container-low px-4 py-2 rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors shadow-xs"
                  >
                    Send
                  </button>
                </form>
              </article>
            ))
          )}
        </div>

        {/* Right Sidebar: Weekly Prompt & Cozy Rooms (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Weekly Prompt */}
          <div className="bg-secondary-container/30 rounded-3xl p-6 border border-secondary-container/70 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-secondary tracking-wider">Weekly Prompt</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] font-bold">+50 drops</span>
            </div>

            <div>
              <h3 className="font-serif text-2xl text-on-surface font-semibold">"The Imperfect Creation"</h3>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Make something in under 20 minutes with zero correcting, undoing, or checking for symmetry. Shattered ceramics, wobbly stitches, or crumbly dough encouraged.
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1 border-t border-secondary-container/60">
              <span>182 garden members participated</span>
              <span className="font-semibold text-secondary">3 days left</span>
            </div>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="w-full py-2.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold text-xs hover:bg-secondary-fixed transition-colors shadow-xs"
            >
              Post Your 20-Min Mess 🎨
            </button>
          </div>

          {/* Live Cozy Rooms */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-tertiary">nest_cam_indoor</span>
                <h3 className="font-serif text-lg font-semibold text-on-surface">Live Cozy Rooms</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                Live Now
              </span>
            </div>

            <p className="text-xs text-on-surface-variant">
              Zero-pressure audio spaces. No cameras, no mandatory speaking—just ambient background chatter & soothing calm while you work.
            </p>

            <div className="space-y-3">
              {/* Room 1 */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-on-surface">Rainy Attic Lo-Fi & Yarn Untangling</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">23 quiet present</p>
                </div>
                <button
                  onClick={() => handleJoinCozyRoom("Rainy Attic Lo-Fi")}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    joinedRoom === "Rainy Attic Lo-Fi"
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-on-primary shadow-xs"
                  }`}
                >
                  {joinedRoom === "Rainy Attic Lo-Fi" ? "Leave Room" : "Join (Audio)"}
                </button>
              </div>

              {/* Room 2 */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-on-surface">Silent Book Club & Tea Steeping</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">14 quiet present</p>
                </div>
                <button
                  onClick={() => handleJoinCozyRoom("Silent Book Club")}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    joinedRoom === "Silent Book Club"
                      ? "bg-secondary text-on-secondary"
                      : "bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-on-primary shadow-xs"
                  }`}
                >
                  {joinedRoom === "Silent Book Club" ? "Leave Room" : "Join (Audio)"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CREATE POST MODAL ================= */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-semibold">Share with Hobbyverse</h3>
              <button onClick={() => setCreateModalOpen(false)} className="p-1 text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Select Hobby Circle</label>
                <select
                  value={postCircle}
                  onChange={(e) => setPostCircle(e.target.value)}
                  className="w-full bg-surface-container-low p-2.5 rounded-xl text-xs text-on-surface border border-outline-variant/30"
                >
                  <option value="crochet">🧶 Crochet & Chill</option>
                  <option value="books">📖 Bookworms' Corner</option>
                  <option value="art">🎨 The Delulu Artists Club</option>
                  <option value="chess">♟️ Chess Not Stress</option>
                  <option value="plants">🪴 The Green Thumb Gang</option>
                  <option value="bake">🥖 Bake It Till You Make It</option>
                  <option value="craft">✂️ DIY & Craft Society</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My first wonky granny square"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full bg-surface-container-low p-2.5 rounded-xl text-xs text-on-surface border border-outline-variant/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Description / Thoughts</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What did you learn? What felt soft about making this?"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  className="w-full bg-surface-container-low p-2.5 rounded-xl text-xs text-on-surface border border-outline-variant/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={postImage}
                  onChange={(e) => setPostImage(e.target.value)}
                  className="w-full bg-surface-container-low p-2.5 rounded-xl text-xs text-on-surface border border-outline-variant/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container shadow-xs"
                >
                  Share Project (+15 Drops)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODERATION REPORT MODAL ================= */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-3xl p-6 max-w-md w-full shadow-2xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center gap-2 text-error">
              <span className="material-symbols-outlined text-xl">flag</span>
              <h3 className="font-serif text-lg font-semibold text-on-surface">Report Content to Moderators</h3>
            </div>
            <p className="text-xs text-on-surface-variant">
              EcoCalm strictly prohibits harassment, unsolicited advertising, and content harmful to well-being.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">Reason for Report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-surface-container-low p-2.5 rounded-xl text-xs text-on-surface border border-outline-variant/30"
                >
                  <option value="Unkind or commercial spam">Unkind or commercial advertising</option>
                  <option value="Harassment or aggressive tone">Harassment or aggressive tone</option>
                  <option value="Inappropriate media">Inappropriate or non-mindful image</option>
                  <option value="Misleading claim">Misleading claim or spam</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-1.5 rounded-full text-xs text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full bg-error text-on-error text-xs font-semibold shadow-xs"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
