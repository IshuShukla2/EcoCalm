import React, { useState, useEffect } from "react";
import { useEcoCalm } from "../context/EcoCalmContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const AdminDashboard = () => {
  const { user, showToast } = useEcoCalm();
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    satisfactionRate: 100,
    calmRate: 100,
    experienceCounts: {},
    feelingCounts: {}
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterExp, setFilterExp] = useState("all");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const fetchFeedbackData = async () => {
    setLoading(true);
    const token = localStorage.getItem("ecocalm_token");
    try {
      const res = await fetch("/api/admin/feedback", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.feedbacks || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load admin feedback", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback entry?")) return;
    const token = localStorage.getItem("ecocalm_token");
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        setFeedbacks(prev => prev.filter(f => f.id !== id));
        showToast("Feedback removed from database", "delete");
      }
    } catch (e) {
      showToast("Unable to delete entry", "error");
    }
  };

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter(item => {
    const matchesSearch =
      (item.userName && item.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.userEmail && item.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.suggestions && item.suggestions.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesExp = filterExp === "all" || item.experience === filterExp;
    return matchesSearch && matchesExp;
  });

  // Export to PDF function
  const handleDownloadPDF = () => {
    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF("p", "pt", "a4");

      // Brand Header Banner
      doc.setFillColor(59, 102, 55); // #3b6637 (Olive Grove Green)
      doc.rect(0, 0, 595.28, 80, "F");

      // Title & Subtitle in White
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("EcoCalm Sanctuary - User Feedback Report", 40, 42);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(230, 240, 228);
      const dateStr = new Date().toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      doc.text(`Generated on: ${dateStr}  |  Platform Administrator: ${user?.name || "Admin"}`, 40, 62);

      // Section 1: Executive Summary
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(30, 45, 30);
      doc.text("1. Executive Summary & Well-Being Metrics", 40, 115);

      const summaryData = [
        ["Total Responses Logged", `${stats.total} submissions`],
        ["Sanctuary Satisfaction (Loved it / Good)", `${stats.satisfactionRate}%`],
        ["Positive Nervous System Shift (Calmer / Hopeful)", `${stats.calmRate}%`],
        ["Status", "Healthy & Growing 🌿"]
      ];

      autoTable(doc, {
        startY: 125,
        margin: { left: 40, right: 40 },
        theme: "striped",
        headStyles: { fillColor: [85, 124, 81] },
        body: summaryData,
        styles: { fontSize: 10, cellPadding: 6 }
      });

      // Section 2: Question Breakdown Tables
      let currentY = doc.lastAutoTable.finalY + 25;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(30, 45, 30);
      doc.text("2. Feedback Categorical Breakdown", 40, currentY);

      const expCounts = stats.experienceCounts || {};
      const feelCounts = stats.feelingCounts || {};

      const expTable = [
        ["Loved it", `${expCounts["Loved it 💚"] || 0} (${stats.total ? Math.round(((expCounts["Loved it 💚"] || 0) / stats.total) * 100) : 0}%)`],
        ["It was good", `${expCounts["It was good 🌼"] || 0} (${stats.total ? Math.round(((expCounts["It was good 🌼"] || 0) / stats.total) * 100) : 0}%)`],
        ["It was okay", `${expCounts["It was okay 🌿"] || 0} (${stats.total ? Math.round(((expCounts["It was okay 🌿"] || 0) / stats.total) * 100) : 0}%)`],
        ["Needs improvement", `${expCounts["Needs improvement 🪴"] || 0} (${stats.total ? Math.round(((expCounts["Needs improvement 🪴"] || 0) / stats.total) * 100) : 0}%)`]
      ];

      const feelTable = [
        ["Calmer", `${feelCounts["Calmer 🌱"] || 0} (${stats.total ? Math.round(((feelCounts["Calmer 🌱"] || 0) / stats.total) * 100) : 0}%)`],
        ["More hopeful", `${feelCounts["More hopeful ☀️"] || 0} (${stats.total ? Math.round(((feelCounts["More hopeful ☀️"] || 0) / stats.total) * 100) : 0}%)`],
        ["About the same", `${feelCounts["About the same 🌿"] || 0} (${stats.total ? Math.round(((feelCounts["About the same 🌿"] || 0) / stats.total) * 100) : 0}%)`],
        ["Still overwhelmed", `${feelCounts["Still overwhelmed 🌧️"] || 0} (${stats.total ? Math.round(((feelCounts["Still overwhelmed 🌧️"] || 0) / stats.total) * 100) : 0}%)`]
      ];

      autoTable(doc, {
        startY: currentY + 10,
        margin: { left: 40, right: 40 },
        head: [["Question 1: Overall Experience", "Count (% of Total)"]],
        headStyles: { fillColor: [85, 124, 81] },
        body: expTable,
        styles: { fontSize: 9, cellPadding: 5 }
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 15,
        margin: { left: 40, right: 40 },
        head: [["Question 2: Post-Session Feeling", "Count (% of Total)"]],
        headStyles: { fillColor: [85, 124, 81] },
        body: feelTable,
        styles: { fontSize: 9, cellPadding: 5 }
      });

      // Section 3: Submissions Log
      doc.addPage();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(30, 45, 30);
      doc.text("3. Individual Visitor Responses & Suggestions", 40, 40);

      const submissionsRows = feedbacks.map((item, idx) => {
        const dateFormatted = item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "Recently";
        return [
          `#${idx + 1}`,
          dateFormatted,
          item.userName || "Mindful Visitor",
          item.experience || "N/A",
          item.feeling || "N/A",
          item.suggestions || "No written suggestions."
        ];
      });

      autoTable(doc, {
        startY: 55,
        margin: { left: 40, right: 40 },
        head: [["#", "Date", "Visitor", "Experience", "Post Feeling", "Suggestions & Reflections"]],
        headStyles: { fillColor: [59, 102, 55] },
        body: submissionsRows,
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 65 },
          2: { cellWidth: 85 },
          3: { cellWidth: 85 },
          4: { cellWidth: 85 },
          5: { cellWidth: 170 }
        },
        styles: { fontSize: 8.5, cellPadding: 6, overflow: "linebreak" }
      });

      // Save the PDF
      const filename = `EcoCalm_Feedback_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);
      showToast("Feedback PDF downloaded successfully! 📄", "download_done");
    } catch (err) {
      console.error("PDF generation failed:", err);
      showToast("Error generating PDF document", "error");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-low p-6 sm:p-8 border border-outline-variant/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">shield</span>
            <span>Administrator Control Center</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
            Visitor Feedback & Well-Being Analytics
          </h1>
          <p className="font-sans text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Monitor community feedback from the 3-question survey, evaluate satisfaction, and download official PDF reports for stakeholders.
          </p>
        </div>

        {/* Download PDF Button */}
        <div className="relative z-10 flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={fetchFeedbackData}
            className="p-3 rounded-2xl bg-surface-container-highest hover:bg-surface-variant text-on-surface-variant transition-colors"
            title="Refresh Feedback Data"
          >
            <span className={`material-symbols-outlined text-xl ${loading ? "animate-spin" : ""}`}>
              refresh
            </span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf || feedbacks.length === 0}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#3b6637] hover:bg-[#2d522a] text-white font-sans text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">
              {isGeneratingPdf ? "hourglass_empty" : "picture_as_pdf"}
            </span>
            <span>{isGeneratingPdf ? "Generating..." : "Download as PDF"}</span>
          </button>
        </div>
      </div>

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">rate_review</span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant font-medium">Total Feedback Responses</span>
            <div className="text-2xl font-bold text-on-surface">{stats.total}</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/60 text-tertiary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">sentiment_satisfied</span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant font-medium">Satisfaction Rate</span>
            <div className="text-2xl font-bold text-on-surface">{stats.satisfactionRate}%</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary-container/60 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">spa</span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant font-medium">Calm / Hopeful Shift</span>
            <div className="text-2xl font-bold text-on-surface">{stats.calmRate}%</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
          </div>
          <div>
            <span className="text-xs text-on-surface-variant font-medium">Active Administrator</span>
            <div className="text-sm font-bold text-on-surface truncate">{user?.name || "Admin"}</div>
          </div>
        </div>
      </div>

      {/* Categorical Distribution Visual Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Question 1 Bars */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base sm:text-lg text-on-surface">
              1. Experience Distribution
            </h3>
            <span className="text-xs font-medium text-on-surface-variant">Question 1</span>
          </div>

          <div className="space-y-3">
            {[
              { label: "Loved it 💚", count: stats.experienceCounts?.["Loved it 💚"] || 0, color: "bg-[#3b6637]" },
              { label: "It was good 🌼", count: stats.experienceCounts?.["It was good 🌼"] || 0, color: "bg-[#7da578]" },
              { label: "It was okay 🌿", count: stats.experienceCounts?.["It was okay 🌿"] || 0, color: "bg-[#b3cca7]" },
              { label: "Needs improvement 🪴", count: stats.experienceCounts?.["Needs improvement 🪴"] || 0, color: "bg-[#e5a075]" }
            ].map(item => {
              const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-on-surface">
                    <span>{item.label}</span>
                    <span className="text-on-surface-variant">{item.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question 2 Bars */}
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base sm:text-lg text-on-surface">
              2. Post-Session Emotional State
            </h3>
            <span className="text-xs font-medium text-on-surface-variant">Question 2</span>
          </div>

          <div className="space-y-3">
            {[
              { label: "Calmer 🌱", count: stats.feelingCounts?.["Calmer 🌱"] || 0, color: "bg-[#3b6637]" },
              { label: "More hopeful ☀️", count: stats.feelingCounts?.["More hopeful ☀️"] || 0, color: "bg-[#e2a838]" },
              { label: "About the same 🌿", count: stats.feelingCounts?.["About the same 🌿"] || 0, color: "bg-[#95b090]" },
              { label: "Still overwhelmed 🌧️", count: stats.feelingCounts?.["Still overwhelmed 🌧️"] || 0, color: "bg-[#7998b3]" }
            ].map(item => {
              const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-on-surface">
                    <span>{item.label}</span>
                    <span className="text-on-surface-variant">{item.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feedback Submissions Table */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-on-surface">
              Visitor Responses Feed
            </h2>
            <p className="text-xs text-on-surface-variant">
              Showing {filteredFeedbacks.length} of {feedbacks.length} recorded entries
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reflections..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface outline-none focus:border-primary"
              />
            </div>

            <select
              value={filterExp}
              onChange={(e) => setFilterExp(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-on-surface outline-none"
            >
              <option value="all">All Experiences</option>
              <option value="Loved it 💚">Loved it 💚</option>
              <option value="It was good 🌼">It was good 🌼</option>
              <option value="It was okay 🌿">It was okay 🌿</option>
              <option value="Needs improvement 🪴">Needs improvement 🪴</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-outline-variant/30 text-on-surface-variant font-semibold">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Visitor</th>
                <th className="py-3 px-3">Experience</th>
                <th className="py-3 px-3">Post Feeling</th>
                <th className="py-3 px-4">Suggestions & Thoughts</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-on-surface-variant italic">
                    No matching feedback responses found.
                  </td>
                </tr>
              ) : (
                filteredFeedbacks.map((item) => {
                  const dateStr = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })
                    : "Today";

                  return (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-3 text-on-surface-variant whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-on-surface">{item.userName || "Mindful Visitor"}</div>
                        {item.userEmail && (
                          <div className="text-[11px] text-on-surface-variant truncate max-w-[130px]">
                            {item.userEmail}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-surface-container font-medium text-on-surface">
                          {item.experience}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-surface-container font-medium text-on-surface">
                          {item.feeling}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-on-surface leading-relaxed max-w-xs">
                        {item.suggestions ? (
                          <p className="italic">"{item.suggestions}"</p>
                        ) : (
                          <span className="text-on-surface-variant italic">None provided</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteFeedback(item.id)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-colors"
                          title="Delete Feedback"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
