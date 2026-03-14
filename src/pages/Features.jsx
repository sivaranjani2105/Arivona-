import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Brain, Lightbulb, Timer, Unlock, BarChart3, 
  Database, Repeat, Activity, Split, Sparkles, Clipboard,
  ChevronRight, Map, LogOut, ArrowLeft, Target, Bell
} from "lucide-react";

/* ── Data ── */
const FEATURES = [
    {
        id: "F01",
        category: "Core Loop",
        title: "Baseline Probe Engine",
        icon: <Target size={24} />,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
        priority: "P0",
        effort: "3 days",
        status: "build-first",
        description: "The system's first move. No onboarding quiz — just one medium-difficulty concept question to silently observe the user.",
        prompt: `You are ARVIONA's Baseline Probe Engine. When a user selects a subject + topic for the first time...`,
        signals: ["Answer: Right/Wrong", "Time taken (ms)", "Option changes", "Tab focus lost"],
        llm_used: false,
        ml_used: true,
    },
    {
        id: "F02",
        category: "Core Loop",
        title: "Learner State Modeler",
        icon: <Brain size={24} />,
        color: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-100",
        priority: "P0",
        effort: "5 days",
        status: "build-first",
        description: "After every attempt, the ML layer silently updates the learner's dynamic state — mastery probability, speed index, and engagement risk.",
        prompt: `You are ARVIONA's Learner State Modeler (ML layer — no LLM). After each attempt, compute the Learner State object...`,
        signals: ["Mastery score (0–100)", "Speed index", "Engagement risk", "Next action decision"],
        llm_used: false,
        ml_used: true,
    },
    {
        id: "F03",
        category: "Core Loop",
        title: "Adaptive Explanation Generator",
        icon: <Lightbulb size={24} />,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
        priority: "P0",
        effort: "4 days",
        status: "build-first",
        description: "The LLM is ONLY called here — when the decision engine says EXPLAIN. It receives precise instructions on depth and style.",
        prompt: `You are ARVIONA's Explanation Engine. You are a calm, patient tutor...`,
        signals: ["Explanation delivered", "Style used", "User read time", "Did user attempt again?"],
        llm_used: true,
        ml_used: false,
    },
    {
        id: "F04",
        category: "Core Loop",
        title: "Hesitation Detector",
        icon: <Timer size={24} />,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-100",
        priority: "P0",
        effort: "2 days",
        status: "build-first",
        description: "Frontend timer that detects when a student stalls on a question — triggers a soft intervention before frustration sets in.",
        prompt: `FRONTEND LOGIC — Hesitation Detector. Trigger conditions: mouse stillness > 6s...`,
        signals: ["Mouse idle time", "Timer vs expected", "Hint used?", "Auto-hint triggered"],
        llm_used: false,
        ml_used: true,
    },
    {
        id: "F05",
        category: "Core Loop",
        title: "Hint System (3-tier)",
        icon: <Unlock size={24} />,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        priority: "P1",
        effort: "2 days",
        status: "phase-1",
        description: "Three progressive hints per question. Each hint narrows the answer space without giving it away.",
        prompt: `You are ARVIONA's Hint Generator. For each question, generate exactly 3 hints...`,
        signals: ["Hints used (0–3)", "Which hint triggered re-attempt"],
        llm_used: true,
        ml_used: false,
    },
    {
        id: "F06",
        category: "Intelligence",
        title: "Confidence Calibrator",
        icon: <BarChart3 size={24} />,
        color: "text-cyan-600",
        bg: "bg-cyan-50",
        border: "border-cyan-100",
        priority: "P1",
        effort: "1 day",
        status: "phase-1",
        description: "Before submitting, user slides a confidence bar. Trains the system to detect overconfidence/underconfidence.",
        prompt: `FRONTEND + ML LOGIC — Confidence Calibrator. UI: 5-point confidence slider...`,
        signals: ["Declared confidence", "Confidence vs accuracy delta"],
        llm_used: false,
        ml_used: true,
    },
    {
        id: "F07",
        category: "Intelligence",
        title: "Explanation Memory System",
        icon: <Database size={24} />,
        color: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-100",
        priority: "P1",
        effort: "3 days",
        status: "phase-1",
        description: "Tracks which explanation style worked for each student. Locks the default after successes.",
        prompt: `ML LOGIC — Explanation Memory System. TRACK per user per concept_category...`,
        signals: ["Style used", "Post-explanation accuracy"],
        llm_used: false,
        ml_used: true,
    },
    {
        id: "F08",
        category: "Intelligence",
        title: "Spaced Repetition Scheduler",
        icon: <Repeat size={24} />,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
        priority: "P1",
        effort: "3 days",
        status: "phase-1",
        description: "Schedules concept reviews using a modified SM-2 algorithm. Surfaces overdue concepts on user home.",
        prompt: `ML LOGIC — Spaced Repetition Scheduler (Modified SM-2). Mastery-based intervals...`,
        signals: ["Days since last review", "Ease factor"],
        llm_used: false,
        ml_used: true,
    },
    {
        id: "F09",
        category: "Intelligence",
        title: "Mastery Meter (Live Session)",
        icon: <Zap size={24} />,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
        priority: "P0",
        effort: "2 days",
        status: "build-first",
        description: "A live animated gauge in the session view that fills as mastery increases. Real-time visual feedback.",
        prompt: `FRONTEND COMPONENT — Mastery Meter. 0–39%: Red zone, 95–100%: Gold zone...`,
        signals: ["Mastery score live", "Delta per attempt"],
        llm_used: false,
        ml_used: false,
    },
    {
        id: "F10",
        category: "UI/UX",
        title: "Session Flow Controller",
        icon: <Split size={24} />,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        priority: "P0",
        effort: "4 days",
        status: "build-first",
        description: "The state machine that orchestrates the full session: probe → observe → decide → explain → retry.",
        prompt: `STATE MACHINE — Session Flow Controller. States: IDLE, PROBING, OBSERVING...`,
        signals: ["Current state", "Transition triggers"],
        llm_used: false,
        ml_used: false,
    },
    {
        id: "F11",
        category: "Analytics",
        title: "AI Insights Generator",
        icon: <Sparkles size={24} />,
        color: "text-cyan-600",
        bg: "bg-cyan-50",
        border: "border-cyan-100",
        priority: "P2",
        effort: "3 days",
        status: "phase-2",
        description: "Generates 1–3 personalized behavioral insights shown on the dashboard after every 3 sessions.",
        prompt: `You are ARVIONA's Insight Generator. Surface meaningful, specific insights...`,
        signals: ["Insights generated", "User engagement with insight"],
        llm_used: true,
        ml_used: true,
    },
    {
        id: "F12",
        category: "Analytics",
        title: "Session Summary Engine",
        icon: <Clipboard size={24} />,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-100",
        priority: "P1",
        effort: "2 days",
        status: "phase-1",
        description: "Post-session summary card with mastery delta, time, and focus tips for next session.",
        prompt: `You are ARVIONA's Session Summary Engine. One punchy line summarizing...`,
        signals: ["Session accuracy", "Mastery gained"],
        llm_used: true,
        ml_used: false,
    },
    {
        id: "F13",
        category: "UI/UX",
        title: "Concept Map Graph",
        icon: <Map size={24} />,
        color: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-100",
        priority: "P1",
        effort: "5 days",
        status: "phase-1",
        description: "Interactive 2D graph visualization of mastery relationships between concepts.",
        prompt: `FRONTEND LOGIC — Concept Map Graph. Node Size = Importance. Color = Mastery...`,
        signals: ["Nodes explored", "Visual dwell time"],
        llm_used: false,
        ml_used: true,
    },
    {
        id: "F14",
        category: "Core Loop",
        title: "Quick-Start Onboarding",
        icon: <Zap size={24} />,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
        priority: "P0",
        effort: "2 days",
        status: "build-first",
        description: "No friction: just select a goal and jump into the first probe. Profile built utility-first.",
        prompt: `LOGIC SPEC — Quick-Start Onboarding. SELECT Subject + Topic. CTA: [Begin]...`,
        signals: ["Onboarding time", "Intensity selected"],
        llm_used: false,
        ml_used: false,
    },
    {
        id: "F15",
        category: "Analytics",
        title: "Confusion Heatmap",
        icon: <Activity size={24} />,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-100",
        priority: "P2",
        effort: "3 days",
        status: "phase-2",
        description: "Visualizes exact sub-steps within an explanation where the user's dwell time is highest.",
        prompt: `DATA LOGIC — Confusion Heatmap. TRACK: dwell_time, scroll reversals...`,
        signals: ["Dwell time per line", "Friction index score"],
        llm_used: false,
        ml_used: true,
    },
    {
        id: "F16",
        category: "UI/UX",
        title: "Study Mode Controller",
        icon: <Sparkles size={24} />,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        priority: "P1",
        effort: "4 days",
        status: "phase-1",
        description: "Enforces focus. Blocks secondary dashboards and silences distractions during deep work sessions.",
        prompt: `STATE MACHINE — Study Mode Controller. ZEN Mode: Sidebar hidden...`,
        signals: ["Tab focus duration", "Zen completion rate"],
        llm_used: false,
        ml_used: false,
    },
    {
        id: "F17",
        category: "Intelligence",
        title: "Goal-Setting Engine",
        icon: <Target size={24} />,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
        priority: "P1",
        effort: "3 days",
        status: "phase-1",
        description: "Sets dynamic targets based on learner speed and roadmap feasibility.",
        prompt: `You are ARVIONA's Goal Architect. Break goal into daily roadmaps...`,
        signals: ["Goal feasibility", "Roadmap adherence"],
        llm_used: true,
        ml_used: true,
    },
    {
        id: "F18",
        category: "Intelligence",
        title: "Smart Notifications",
        icon: <Bell size={24} />,
        color: "text-cyan-600",
        bg: "bg-cyan-50",
        border: "border-cyan-100",
        priority: "P2",
        effort: "3 days",
        status: "phase-2",
        description: "Hyper-personalized pings focusing on fading mastery or concepts nearly hit to Gold.",
        prompt: `You are ARVIONA's Engagement Engine. Every ping must include ONE data point...`,
        signals: ["CTR", "Session start via ping"],
        llm_used: true,
        ml_used: true,
    },
];

const CATEGORIES = ["All", "Core Loop", "Intelligence", "UI/UX", "Analytics"];
const PRIORITIES = { 
    P0: { label: "P0 · Critical", color: "text-red-600", bg: "bg-red-50" }, 
    P1: { label: "P1 · High", color: "text-orange-600", bg: "bg-orange-50" }, 
    P2: { label: "P2 · Medium", color: "text-blue-600", bg: "bg-blue-50" } 
};
const STATUSES = { 
    "build-first": { label: "Build First", color: "text-emerald-600", bg: "bg-emerald-100" }, 
    "phase-1": { label: "Phase 1", color: "text-blue-600", bg: "bg-blue-100" }, 
    "phase-2": { label: "Phase 2", color: "text-violet-600", bg: "bg-violet-100" } 
};

function FeatureCard({ f, onClick, active }) {
    return (
        <motion.div 
            layoutId={f.id}
            onClick={onClick}
            whileHover={{ y: -4 }}
            className={`group p-6 rounded-[2rem] border transition-all cursor-pointer ${active ? 'bg-slate-900 border-slate-900 shadow-2xl' : 'bg-white border-slate-100 hover:shadow-xl hover:shadow-primary-600/5'}`}
        >
            <div className={`w-12 h-12 rounded-2xl ${active ? 'bg-white/10 text-white' : `${f.bg} ${f.color}`} flex items-center justify-center mb-6 transition-colors shadow-sm`}>
                {f.icon}
            </div>
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-black uppercase tracking-[2px] ${active ? 'text-white/40' : 'text-slate-400'}`}>#{f.id}</span>
                <span className={`${active ? 'bg-white/10 text-white' : `${PRIORITIES[f.priority].bg} ${PRIORITIES[f.priority].color}`} px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest`}>
                    {PRIORITIES[f.priority].label.split('·')[1]}
                </span>
            </div>
            <h3 className={`text-lg font-black tracking-tight mb-2 italic uppercase ${active ? 'text-white' : 'text-slate-900'}`}>{f.title}</h3>
            <p className={`text-xs font-bold leading-relaxed mb-4 ${active ? 'text-white/60' : 'text-slate-500'}`}>{f.description}</p>
            
            <div className="flex justify-between items-center mt-auto">
                <span className={`${active ? 'bg-white/20 text-white' : `${STATUSES[f.status].bg} ${STATUSES[f.status].color}`} px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest`}>
                    {STATUSES[f.status].label}
                </span>
                <ChevronRight size={16} className={`${active ? 'text-white' : 'text-slate-300'}`} />
            </div>
        </motion.div>
    );
}

export default function Features() {
    const [activeTab, setActiveTab] = useState("All");
    const [selectedId, setSelectedId] = useState(null);
    const selectedFeature = FEATURES.find(f => f.id === selectedId);

    const filtered = activeTab === "All" ? FEATURES : FEATURES.filter(f => f.category === activeTab);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            {/* Nav Header */}
            <header className="sticky top-0 z-[100] px-6 md:px-12 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter uppercase italic">Phase Specification</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alpha 1.0 Engineering Manifest</p>
                    </div>
                </div>
                <div className="hidden md:flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setActiveTab(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === cat ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(f => (
                        <FeatureCard key={f.id} f={f} active={selectedId === f.id} onClick={() => setSelectedId(f.id === selectedId ? null : f.id)} />
                    ))}
                </div>
            </main>

            {/* Modal/Panel for Details */}
            <AnimatePresence>
                {selectedId && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                            onClick={() => setSelectedId(null)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
                        
                        <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row">
                            
                            {/* Left Panel: Info */}
                            <div className="md:w-5/12 p-8 md:p-12 bg-slate-50 border-r border-slate-100 overflow-y-auto">
                                <div className={`w-16 h-16 rounded-2xl ${selectedFeature.bg} ${selectedFeature.color} flex items-center justify-center mb-8 shadow-sm`}>
                                    {selectedFeature.icon}
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-[2px]">#{selectedFeature.id}</span>
                                    <span className="text-xs font-black text-primary-600 uppercase tracking-widest">{selectedFeature.category}</span>
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4 uppercase italic leading-tight">{selectedFeature.title}</h2>
                                <p className="text-base text-slate-600 font-bold italic leading-relaxed mb-8">{selectedFeature.description}</p>
                                
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 rounded-2xl bg-white border border-slate-100">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Effort</div>
                                        <div className="text-sm font-black text-slate-900 uppercase">{selectedFeature.effort}</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white border border-slate-100">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                                        <div className="text-sm font-black text-slate-900 uppercase">{selectedFeature.status}</div>
                                    </div>
                                </div>

                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4">ML Signals Observed</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedFeature.signals.map((s, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-white border border-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Right Panel: Prompt/Code */}
                            <div className="flex-1 p-8 md:p-12 bg-white overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-black tracking-tight uppercase italic text-slate-900">Engineering Logic</h3>
                                    <div className="flex gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${selectedFeature.llm_used ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-400'}`}>LLM</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${selectedFeature.ml_used ? 'bg-violet-50 text-violet-600' : 'bg-slate-50 text-slate-400'}`}>ML</span>
                                    </div>
                                </div>
                                <div className="bg-slate-950 rounded-2xl p-6 text-emerald-400 font-mono text-xs leading-relaxed overflow-x-auto">
                                    <pre className="whitespace-pre-wrap">{selectedFeature.prompt}</pre>
                                </div>
                                <div className="mt-8 p-6 rounded-2xl bg-primary-50 border border-primary-100">
                                    <p className="text-xs font-bold text-primary-800 leading-relaxed italic">
                                        "This module ensures Arviona transitions from a static quiz app to a truly adaptive intelligence engine."
                                    </p>
                                </div>
                                <button onClick={() => setSelectedId(null)} className="mt-8 w-full py-4 rounded-2xl bg-slate-950 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 transition-all">
                                    Dismiss <LogOut size={16} />
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
