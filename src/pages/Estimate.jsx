import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ── Data ───────────────────────────────────────────────────────────────────────
const phases = [
  {
    num: "01", label: "MVP Alpha Core", weeks: "Wks 1–4", priority: "Critical",
    priorityColor: "#EF4444", priorityBg: "#FEF2F2",
    accent: "#EF4444",
    pages: [
      { name: "Login / Signup", core: ["Email auth", "Google OAuth"], addons: ["Animated mesh bg", "Micro-form UX"], days: 3, pct: 30 },
      { name: "Onboarding", core: ["Subject select", "Goal slider"], addons: ["3-step animated", "No quiz UX"], days: 2, pct: 20 },
      { name: "Dashboard", core: ["Subject cards", "Weekly chart", "Streak"], addons: ["AI Insights panel", "Quick Attempt", "Mastery sparklines"], days: 6, pct: 60 },
      { name: "Session Page ⭐", core: ["MCQ", "Timer bar", "Explanation panel"], addons: ["Mastery Meter", "Hint system", "Confidence slider", "Hesitation prompt"], days: 10, pct: 95 },
    ]
  },
  {
    num: "02", label: "Learning & Progress", weeks: "Wks 5–8", priority: "High",
    priorityColor: "#D97706", priorityBg: "#FFFBEB",
    accent: "#F59E0B",
    pages: [
      { name: "Learning Hub", core: ["Topic list", "Mastery bars", "Practice CTA"], addons: ["Concept Map graph", "Spaced repetition", "Study Mode"], days: 8, pct: 75 },
      { name: "Progress Page", core: ["Mastery radial", "Session history", "Weak areas"], addons: ["Confusion heatmap", "PDF export", "Goal setting"], days: 7, pct: 65 },
    ]
  },
  {
    num: "03", label: "Profile & Polish", weeks: "Wks 9–12", priority: "Medium",
    priorityColor: "#2563EB", priorityBg: "#EFF6FF",
    accent: "#2563EB",
    pages: [
      { name: "Profile", core: ["Stats", "Badges", "Edit"], addons: ["Level progression bar"], days: 3, pct: 30 },
      { name: "Settings", core: ["Account", "Theme", "Notifications"], addons: ["Explanation style picker", "Study reminder"], days: 4, pct: 40 },
      { name: "Polish & QA", core: ["Mobile responsive", "Loading states", "Error states"], addons: ["Framer Motion polish", "Dark/light toggle"], days: 7, pct: 70 },
    ]
  },
];

const stats = [
  { label: "Total Pages", value: "8", unit: "pages", sub: "+ reusable components", color: "#2563EB", bg: "#EFF6FF" },
  { label: "Est. Timeline", value: "8–12", unit: "wks", sub: "Solo dev (full-time)", color: "#059669", bg: "#ECFDF5" },
  { label: "Components", value: "12+", unit: "", sub: "Reusable UI pieces", color: "#D97706", bg: "#FFFBEB" },
  { label: "New Features", value: "15+", unit: "", sub: "Beyond current UI", color: "#7C3AED", bg: "#F5F3FF" },
];

const stack = [
  { cat: "Framework", items: [{ label: "Next.js 14", color: "#000" }, { label: "React 18", color: "#0EA5E9" }, { label: "TypeScript", color: "#3B82F6" }] },
  { cat: "Styling", items: [{ label: "Tailwind CSS", color: "#06B6D4" }, { label: "shadcn/ui", color: "#111" }, { label: "Framer Motion", color: "#E11D48" }] },
  { cat: "Charts", items: [{ label: "Recharts", color: "#8B5CF6" }, { label: "D3.js", color: "#F97316" }] },
  { cat: "State / Auth", items: [{ label: "Zustand", color: "#F59E0B" }, { label: "NextAuth.js", color: "#2563EB" }, { label: "React Query", color: "#EF4444" }] },
  { cat: "Fonts", items: [{ label: "Cabinet Grotesk", color: "#374151" }, { label: "DM Sans", color: "#374151" }, { label: "JetBrains Mono", color: "#374151" }] },
  { cat: "Deploy", items: [{ label: "Vercel", color: "#000" }, { label: "Supabase", color: "#3ECF8E" }] },
];

const gantt = [
  { label: "Auth & Onboarding", left: 0, width: 17, color: "#FCA5A5", text: "#B91C1C" },
  { label: "Dashboard", left: 17, width: 16, color: "#FCD34D", text: "#92400E" },
  { label: "Session Page ⭐", left: 17, width: 25, color: "#C4B5FD", text: "#5B21B6" },
  { label: "Learning Hub", left: 42, width: 25, color: "#93C5FD", text: "#1E40AF" },
  { label: "Progress", left: 50, width: 25, color: "#6EE7B7", text: "#065F46" },
  { label: "Profile + Settings", left: 67, width: 17, color: "#FBCFE8", text: "#9D174D" },
  { label: "Polish & QA", left: 75, width: 25, color: "#E2E8F0", text: "#475569" },
];

// ── Animated Progress Bar ──────────────────────────────────────────────────────
function ProgressBar({ pct, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 300); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ height: 5, background: "#F1F5F9", borderRadius: 99, overflow: "hidden", marginTop: 6, width: "100%" }}>
      <div style={{
        height: "100%", width: `${w}%`, background: color,
        borderRadius: 99, transition: "width 1s cubic-bezier(0.4,0,0.2,1)"
      }} />
    </div>
  );
}

// ── Phase Card ────────────────────────────────────────────────────────────────
function PhaseCard({ phase }) {
  const [open, setOpen] = useState(phase.num === "01");
  return (
    <div className="phase-card" style={{
      background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 18,
      overflow: "hidden", marginBottom: 14,
      boxShadow: open ? "0 8px 32px rgba(37,99,235,0.07)" : "0 2px 8px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.3s",
    }}>
      {/* Header */}
      <div  onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: 16, padding: "20px 24px",
        userSelect: "none",
        background: open ? "#FAFBFF" : "#fff",
        transition: "background 0.2s",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: phase.priorityBg, color: phase.priorityColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13,
        }}>{phase.num}</div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#0F172A" }}>{phase.label}</div>
          <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>{phase.weeks} · {phase.pages.length} pages</div>
        </div>

        <span style={{
          padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.6px",
          background: phase.priorityBg, color: phase.priorityColor,
        }}>{phase.priority}</span>

        <div style={{
          width: 28, height: 28, borderRadius: 8, background: "#F1F5F9",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#64748B", fontSize: 11, transition: "transform 0.3s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }}>▼</div>
      </div>

      {/* Body */}
      <div style={{
        maxHeight: open ? 1000 : 0, overflow: "hidden",
        transition: "max-height 0.5s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ borderTop: "1px solid #F1F5F9", padding: "20px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {phase.pages.map((p, i) => (
              <div key={i} style={{
                background: "#FAFBFF", border: "1px solid #EEF2FF",
                borderRadius: 14, padding: "16px 20px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", marginBottom: 8 }}>{p.name}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }}>
                      {p.core.map((t, j) => (
                        <span key={j} style={{ padding: "3px 9px", background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 11, color: "#64748B" }}>{t}</span>
                      ))}
                      {p.addons.map((t, j) => (
                        <span key={j} style={{ padding: "3px 9px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 6, fontSize: 11, color: "#15803D", fontWeight: 600 }}>✦ {t}</span>
                      ))}
                    </div>
                    <ProgressBar pct={p.pct} color={phase.accent} />
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 18, color: phase.priorityColor }}>{p.days}</div>
                    <div style={{ fontSize: 10, color: "#94A3B8" }}>days</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function Estimate() {
  const [activeTab, setActiveTab] = useState("estimate");

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F8FAFF 0%, #EEF4FF 40%, #FFF8F0 100%)",
      fontFamily: "'DM Sans', sans-serif",
      color: "#0F172A",
    }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F1F5F9; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        body { overflow-x: hidden; }
      `}</style>

      {/* Decorative blobs */}
      <div style={{ position: "fixed", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -100, left: -50, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "48px 24px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
          <Link to="/" data-hover style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
            }}>⚡</div>
            <div>
              <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.8px", color: "#0F172A" }}>ARVIONA</h1>
              <div style={{ fontSize: 14, color: "#64748B", marginTop: 2 }}>Frontend Build Estimate — Alpha Release</div>
            </div>
          </Link>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {["estimate", "timeline", "stack"].map(tab => (
              <button key={tab} data-hover onClick={() => setActiveTab(tab)} style={{
                padding: "8px 18px", borderRadius: 10, border: "none",
                background: activeTab === tab ? "#2563EB" : "#F1F5F9",
                color: activeTab === tab ? "#fff" : "#64748B",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                fontSize: 13, cursor: "none",
                transition: "all 0.2s",
                boxShadow: activeTab === tab ? "0 4px 12px rgba(37,99,235,0.25)" : "none",
              }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
            ))}
          </div>
        </div>

        {/* ESTIMATE TAB */}
        {activeTab === "estimate" && (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }}>
              {stats.map((s, i) => (
                <div key={i} className="stat-card" data-hover style={{
                  background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 18,
                  padding: "22px 20px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  transition: "transform 0.25s, box-shadow 0.25s",
                }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>{s.label}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 34, color: s.color }}>{s.value}</span>
                    {s.unit && <span style={{ fontSize: 14, color: "#94A3B8" }}>{s.unit}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>{s.sub}</div>
                  <div style={{ height: 3, borderRadius: 99, background: s.bg, marginTop: 12 }}>
                    <div style={{ height: 3, width: "60%", background: s.color, borderRadius: 99, opacity: 0.6 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Section header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>📦 Build Phases</span>
              <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
              <span style={{ fontSize: 12, color: "#94A3B8", fontFamily: "'JetBrains Mono', monospace" }}>click to expand</span>
            </div>

            {phases.map((p, i) => <PhaseCard key={i} phase={p} />)}

            {/* Note */}
            <div style={{
              marginTop: 32, background: "linear-gradient(135deg, #EFF6FF, #F5F3FF)",
              border: "1.5px solid #BFDBFE", borderRadius: 16, padding: "18px 22px",
              fontSize: 13, color: "#475569", lineHeight: 1.7,
            }}>
              <strong style={{ color: "#1E40AF" }}>⭐ Most critical page:</strong> The <strong>Session / Assessment Page</strong> is your core differentiator — the mastery meter, hesitation detector, confidence slider, and explanation panel make ARVIONA feel <em>actually adaptive</em>. Invest ~40% of Phase 1 time here.
            </div>
          </>
        )}

        {/* TIMELINE TAB */}
        {activeTab === "timeline" && (
          <div style={{ background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 20, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 24, color: "#0F172A" }}>📅 Gantt Timeline — 12 Weeks</div>

            {/* Week labels */}
            <div style={{ display: "flex", gap: 4, marginBottom: 8, paddingLeft: 148 }}>
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#94A3B8", fontFamily: "'JetBrains Mono', monospace" }}>W{i + 1}</div>
              ))}
            </div>

            {gantt.map((row, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 136, textAlign: "right", fontSize: 12, color: "#64748B", flexShrink: 0, fontWeight: 500 }}>{row.label}</div>
                <div style={{ flex: 1, height: 32, background: "#F8FAFC", borderRadius: 8, position: "relative", overflow: "hidden" }}>
                  <div style={{
                    position: "absolute", left: `${row.left}%`, width: `${row.width}%`,
                    height: "100%", background: row.color, borderRadius: 8,
                    display: "flex", alignItems: "center", paddingLeft: 10,
                    fontSize: 11, fontWeight: 700, color: row.text,
                    whiteSpace: "nowrap",
                  }}>{row.label.split(" ")[0]}</div>
                </div>
              </div>
            ))}

            {/* Legend */}
            <div style={{ marginTop: 24, padding: "14px 18px", background: "#F8FAFC", borderRadius: 12, fontSize: 12, color: "#64748B" }}>
              <strong style={{ color: "#374151" }}>Priority order:</strong> Session Page is the longest single build at ~10 days — it's the product's heart. Auth & Onboarding is a fast 5 days. All phases overlap slightly to allow iterative polish.
            </div>
          </div>
        )}

        {/* STACK TAB */}
        {activeTab === "stack" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
              {stack.map((s, i) => (
                <div key={i} data-hover style={{
                  background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 16,
                  padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 12 }}>{s.cat}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {s.items.map((item, j) => (
                      <span key={j} style={{
                        padding: "5px 11px", borderRadius: 8,
                        background: "#F8FAFC", border: "1.5px solid #E2E8F0",
                        fontSize: 12, fontWeight: 600, color: item.color,
                      }}>{item.label}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Build order */}
            <div style={{ background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 18, padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, color: "#0F172A" }}>🚦 Recommended Build Order</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { step: "01", label: "Auth Pages (Login + Signup)", badge: "Day 1–3", color: "#EF4444", bg: "#FEF2F2" },
                  { step: "02", label: "Onboarding Flow (3 steps)", badge: "Day 4–5", color: "#F97316", bg: "#FFF7ED" },
                  { step: "03", label: "Dashboard + Layout Shell", badge: "Day 6–11", color: "#D97706", bg: "#FFFBEB" },
                  { step: "04", label: "Session / Assessment Page ⭐", badge: "Day 12–21", color: "#7C3AED", bg: "#F5F3FF" },
                  { step: "05", label: "Learning Hub + Concept Map", badge: "Wk 5–6", color: "#2563EB", bg: "#EFF6FF" },
                  { step: "06", label: "Progress Analytics", badge: "Wk 7–8", color: "#059669", bg: "#ECFDF5" },
                  { step: "07", label: "Profile + Settings", badge: "Wk 9–10", color: "#0EA5E9", bg: "#F0F9FF" },
                  { step: "08", label: "Polish, QA, Responsiveness", badge: "Wk 11–12", color: "#64748B", bg: "#F8FAFC" },
                ].map((item, i) => (
                  <div key={i} data-hover style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "12px 16px", background: "#FAFBFF",
                    border: "1px solid #EEF2FF", borderRadius: 12,
                    transition: "background 0.2s",
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 9, background: item.bg,
                      color: item.color, fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700, fontSize: 12, display: "flex",
                      alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>{item.step}</div>
                    <div style={{ flex: 1, fontWeight: 600, fontSize: 14, color: "#1E293B" }}>{item.label}</div>
                    <span style={{ padding: "4px 10px", borderRadius: 20, background: item.bg, color: item.color, fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{item.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{ marginTop: 48, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", paddingTop: 24 }}>
          <div style={{ fontSize: 12, color: "#94A3B8" }}>ARVIONA Alpha · Frontend Estimate v1.0</div>
          <div style={{ display: "flex", gap: 6 }}>
            {["React", "Next.js", "Tailwind"].map(t => (
              <span key={t} style={{ padding: "4px 10px", background: "#F1F5F9", borderRadius: 6, fontSize: 11, color: "#64748B", fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
