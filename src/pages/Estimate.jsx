import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Calendar, Rocket, Layers, Code2, 
  ChevronDown, Star, Zap, Clock, CheckCircle2 
} from "lucide-react";

// ── Data ───────────────────────────────────────────────────────────────────────
const phases = [
  {
    num: "01", label: "MVP Alpha Core", weeks: "Wks 1–4", priority: "Critical",
    priorityColor: "text-red-600", priorityBg: "bg-red-50",
    accent: "bg-red-600",
    pages: [
      { name: "Login / Signup", core: ["Email auth", "Google OAuth"], addons: ["Animated mesh bg", "Micro-form UX"], days: 3, pct: 30 },
      { name: "Onboarding", core: ["Subject select", "Goal slider"], addons: ["3-step animated", "No quiz UX"], days: 2, pct: 20 },
      { name: "Dashboard", core: ["Subject cards", "Weekly chart", "Streak"], addons: ["AI Insights panel", "Quick Attempt", "Mastery sparklines"], days: 6, pct: 60 },
      { name: "Session Page ⭐", core: ["MCQ", "Timer bar", "Explanation panel"], addons: ["Mastery Meter", "Hint system", "Confidence slider", "Hesitation prompt"], days: 10, pct: 95 },
    ]
  },
  {
    num: "02", label: "Learning & Progress", weeks: "Wks 5–8", priority: "High",
    priorityColor: "text-orange-600", priorityBg: "bg-orange-50",
    accent: "bg-orange-500",
    pages: [
      { name: "Learning Hub", core: ["Topic list", "Mastery bars", "Practice CTA"], addons: ["Concept Map graph", "Spaced repetition", "Study Mode"], days: 8, pct: 75 },
      { name: "Progress Page", core: ["Mastery radial", "Session history", "Weak areas"], addons: ["Confusion heatmap", "PDF export", "Goal setting"], days: 7, pct: 65 },
    ]
  },
  {
    num: "03", label: "Profile & Polish", weeks: "Wks 9–12", priority: "Medium",
    priorityColor: "text-blue-600", priorityBg: "bg-blue-50",
    accent: "bg-blue-600",
    pages: [
      { name: "Profile", core: ["Stats", "Badges", "Edit"], addons: ["Level progression bar"], days: 3, pct: 30 },
      { name: "Settings", core: ["Account", "Theme", "Notifications"], addons: ["Explanation style picker", "Study reminder"], days: 4, pct: 40 },
      { name: "Polish & QA", core: ["Mobile responsive", "Loading states", "Error states"], addons: ["Framer Motion polish", "Dark/light toggle"], days: 7, pct: 70 },
    ]
  },
];

const stats = [
  { label: "Total Pages", value: "8", unit: "pages", sub: "+ reusable components", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Est. Timeline", value: "8–12", unit: "wks", sub: "Solo dev (full-time)", color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Components", value: "12+", unit: "", sub: "Reusable UI pieces", color: "text-orange-600", bg: "bg-orange-50" },
  { label: "New Features", value: "15+", unit: "", sub: "Beyond current UI", color: "text-violet-600", bg: "bg-violet-50" },
];

const stack = [
  { cat: "Framework", items: [{ label: "React 18", color: "text-sky-500" }, { label: "Vite 7", color: "text-violet-500" }, { label: "Tailwind CSS", color: "text-cyan-500" }] },
  { cat: "Animation", items: [{ label: "Framer Motion", color: "text-rose-500" }, { label: "Lucide Icons", color: "text-slate-600" }] },
  { cat: "State", items: [{ label: "React Context", color: "text-blue-500" }, { label: "Local Storage", color: "text-amber-600" }] },
];

const gantt = [
  { label: "Auth & Onboarding", left: 0, width: 17, color: "bg-red-300", text: "text-red-900" },
  { label: "Dashboard", left: 17, width: 16, color: "bg-orange-300", text: "text-orange-900" },
  { label: "Session Page ⭐", left: 17, width: 25, color: "bg-violet-300", text: "text-violet-900" },
  { label: "Learning Hub", left: 42, width: 25, color: "bg-blue-300", text: "text-blue-900" },
  { label: "Progress", left: 50, width: 25, color: "bg-emerald-300", text: "text-emerald-900" },
  { label: "Profile + Settings", left: 67, width: 17, color: "bg-pink-300", text: "text-pink-900" },
  { label: "Polish & QA", left: 75, width: 25, color: "bg-slate-300", text: "text-slate-900" },
];

function ProgressBar({ pct, accent }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 300); return () => clearTimeout(t); }, [pct]);
  return (
    <div className="h-1.5 bg-slate-100 rounded-full mt-2 w-full overflow-hidden shadow-inner">
      <motion.div initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${accent} rounded-full transition-all duration-1000`} />
    </div>
  );
}

function PhaseCard({ phase }) {
  const [open, setOpen] = useState(phase.num === "01");
  return (
    <div className={`group bg-white border border-slate-200 rounded-[2rem] overflow-hidden mb-4 transition-all duration-300 ${open ? 'shadow-2xl shadow-primary-600/5' : 'shadow-sm hover:shadow-lg'}`}>
      <div onClick={() => setOpen(!open)} className={`flex items-center gap-6 p-6 cursor-pointer select-none transition-colors ${open ? 'bg-slate-50' : 'bg-white'}`}>
        <div className={`w-12 h-12 rounded-2xl ${phase.priorityBg} ${phase.priorityColor} flex items-center justify-center font-mono font-black text-sm shadow-sm`}>
          {phase.num}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-slate-900 tracking-tight italic uppercase">{phase.label}</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{phase.weeks} · {phase.pages.length} components</p>
        </div>
        <span className={`${phase.priorityBg} ${phase.priorityColor} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest hidden sm:block`}>
          {phase.priority}
        </span>
        <ChevronDown size={20} className={`text-slate-300 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-6 border-t border-slate-100 flex flex-col gap-4">
              {phase.pages.map((p, i) => (
                <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="text-sm font-black text-slate-900 uppercase italic tracking-tight mb-3">{p.name}</div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.core.map((t, j) => (
                          <span key={j} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{t}</span>
                        ))}
                        {p.addons.map((t, j) => (
                          <span key={j} className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-lg text-[10px] font-black text-emerald-600 uppercase tracking-tighter flex items-center gap-1">
                             <Sparkles size={10} /> {t}
                          </span>
                        ))}
                      </div>
                      <ProgressBar pct={p.pct} accent={phase.accent} />
                    </div>
                    <div className="text-right">
                      <div className={`font-mono font-black text-2xl ${phase.priorityColor}`}>{p.days}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Days</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Estimate() {
  const [activeTab, setActiveTab] = useState("estimate");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 font-sans text-slate-900 relative overflow-hidden pb-16">
      
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-[1100px] mx-auto px-6 pt-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <Link to="/" className="flex items-center gap-4 group no-underline">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center text-3xl shadow-xl shadow-primary-600/20 group-hover:scale-110 transition-transform">⚡</div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">ARVIONA</h1>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[2px] mt-1">Foundational Build Estimate v1.4</p>
            </div>
          </Link>

          <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-white gap-1 shadow-sm">
            {["estimate", "timeline", "stack"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} 
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl shadow-slate-950/20' : 'text-slate-400 hover:text-slate-600'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ESTIMATE TAB */}
        {activeTab === "estimate" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((s, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-primary-600/5 transition-all">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 inline-block px-2 py-0.5 bg-slate-50 rounded italic whitespace-nowrap">{s.label}</div>
                  <div className="flex items-baseline gap-2">
                    <span className={`font-mono font-black text-4xl ${s.color}`}>{s.value}</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{s.unit}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-400 mt-2 mb-6">{s.sub}</div>
                  <div className={`h-1 rounded-full ${s.bg}`}>
                    <div className={`h-full w-2/3 ${s.color.replace('text-', 'bg-')} rounded-full opacity-60`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-lg font-black tracking-tight uppercase italic text-slate-900 whitespace-nowrap">Core Engineering Phases</h2>
              <div className="h-px bg-slate-200 w-full" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                <Clock size={14} /> Expand to View
              </div>
            </div>

            {phases.map((p, i) => <PhaseCard key={i} phase={p} />)}

            <div className="mt-12 p-10 rounded-[3rem] bg-gradient-to-br from-primary-950 to-indigo-950 text-white shadow-2xl shadow-primary-900/20 relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-white/5 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000" />
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Star size={24} className="text-primary-400" />
                    </div>
                    <h4 className="text-xl font-black uppercase italic tracking-tight underline transform -skew-x-12">Strategic Engineering Note</h4>
                </div>
                <p className="text-base text-primary-200/80 font-bold leading-relaxed italic mb-0">
                    "The <strong>Session Page</strong> is the architectural bottleneck. It contains the Mastery Meter, Hesitation Detector, and Explanation Engine. We recommend dedicating 40% of the initial sprint to this module to ensure true adaptivity."
                </p>
            </div>
          </motion.div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === "timeline" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl shadow-primary-600/5">
            <h3 className="text-xl font-black text-slate-900 mb-10 tracking-tight uppercase italic flex items-center gap-3">
              <Calendar size={24} /> 12-Week Alpha Execution Roadmap
            </h3>

            {/* Week labels */}
            <div className="flex gap-1 mb-8 pl-36">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="flex-1 text-center font-mono text-[9px] font-black text-slate-400">W{i + 1}</div>
              ))}
            </div>

            <div className="flex flex-col gap-6">
              {gantt.map((row, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="w-32 text-right text-[11px] font-black text-slate-400 uppercase tracking-tighter">{row.label}</div>
                  <div className="flex-1 h-12 bg-slate-50 rounded-2xl relative overflow-hidden shadow-inner">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${row.width}%`, left: `${row.left}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                      className={`absolute h-full ${row.color} rounded-2xl flex items-center px-4 font-black text-[10px] ${row.text} uppercase italic shadow-sm`}>
                      {row.label.split(' ')[0]}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 italic">
              <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-widest">
                <strong className="text-slate-900 mr-2">Concurrency Alert:</strong> Progress and Profile modules are scheduled in parallel during weeks 7–10 to maximize speed. Mobile optimization is baked into the final QA phase.
              </p>
            </div>
          </motion.div>
        )}

        {/* STACK TAB */}
        {activeTab === "stack" && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {stack.map((s, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-3xl p-10 hover:shadow-2xl hover:shadow-primary-600/5 transition-all">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-3 py-1 bg-slate-50 rounded-lg inline-block">{s.cat}</div>
                  <div className="flex flex-col gap-4">
                    {s.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                        <span className={`text-base font-black uppercase tracking-tight italic ${item.color}`}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-10 tracking-tight uppercase italic flex items-center gap-3">
                <Rocket size={24} className="text-primary-600" /> Engineering Sequencing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { step: "01", label: "Auth & Identity Flow", badge: "Day 1–3", color: "text-red-600", bg: "bg-red-50" },
                  { step: "02", label: "Multi-Step Onboarding", badge: "Day 4–5", color: "text-orange-600", bg: "bg-orange-50" },
                  { step: "03", label: "The Dashboard Hub", badge: "Day 6-11", color: "text-amber-600", bg: "bg-amber-50" },
                  { step: "04", label: "Adaptive Session Engine", badge: "Day 12-21", color: "text-violet-600", bg: "bg-violet-50" },
                  { step: "05", label: "Learning Map Logic", badge: "Week 5-6", color: "text-blue-600", bg: "bg-blue-50" },
                  { step: "06", label: "Analytics Pipelines", badge: "Week 7-8", color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map((item, i) => (
                    <motion.div key={i} whileHover={{ x: 10 }} className="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100 group transition-all">
                        <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center font-mono font-black text-xs`}>{item.step}</div>
                        <div className="flex-1 text-sm font-black text-slate-900 uppercase italic tracking-tight">{item.label}</div>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${item.bg} ${item.color}`}>{item.badge}</span>
                    </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
