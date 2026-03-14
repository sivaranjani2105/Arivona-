import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, TrendingUp, Flame, Target, ChevronRight, Award,
  Terminal, Activity, Book, BarChart3, Settings, 
  Search, Bell, Plus, MoreHorizontal, GraduationCap, 
  Map, Sparkles, Trophy, Zap, LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [focusMode, setFocusMode] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let timer;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setTimeout(() => setIsActive(false), 0);
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const recentActivity = [
        { title: "Advanced Calculus: Integrals", score: 85, time: "2h ago", color: "text-blue-500", bg: "bg-blue-50" },
        { title: "Physics: Thermodynamics", score: 92, time: "1d ago", color: "text-emerald-500", bg: "bg-emerald-50" },
        { title: "Literature: Essay Structure", score: 78, time: "2d ago", color: "text-orange-500", bg: "bg-orange-50" },
    ];

    return (
        <div className={`min-h-screen font-sans transition-all duration-500 pb-16 ${focusMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

            {/* Top Banner (Header) */}
            <header className={`sticky top-0 z-[100] px-6 md:px-12 py-6 flex justify-between items-center backdrop-blur-md transition-all duration-300 border-b ${focusMode ? 'bg-slate-950/80 border-white/10' : 'bg-white/80 border-slate-200'}`}>
                <div onClick={() => navigate("/")} className="flex items-center gap-4 cursor-pointer group">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center text-xl shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform">⚡</div>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight">ARVIONA</h1>
                        <p className={`text-xs font-semibold ${focusMode ? 'text-slate-400' : 'text-slate-500'}`}>Student Dashboard</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {!focusMode && (
                        <button onClick={() => navigate("/features")} className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs transition-colors">
                            <Award size={16} /> Beta Features
                        </button>
                    )}
                    <button onClick={() => setFocusMode(!focusMode)} className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all duration-300 ${focusMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-950 text-white hover:bg-slate-900'}`}>
                        {focusMode ? <LogOut size={16} /> : <Zap size={16} className="fill-current" />}
                        {focusMode ? "End Session" : "Deep Work"}
                    </button>
                    <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-bold">{user?.name || "Student"}</span>
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{user?.goal || "Arviona Explorer"}</span>
                    </div>
                    <button onClick={logout} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs transition-all border ${focusMode ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10' : 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100'}`}>
                        <LogOut size={16} />
                    </button>
                </div>
            </header>

            <main className="max-w-[1100px] mx-auto px-6 py-10">

                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
                            {focusMode ? "Deep Focus Session" : `Welcome back, ${user?.name || "Student"}! 👋`}
                        </h2>
                        <p className="text-base text-slate-500 font-medium">
                            {focusMode ? "Block out distractions. Stay sharp." : `You're in ${user?.grade || "High School"}. Keep up the ${user?.streak || 3}-day streak!`}
                        </p>
                    </div>

                    {focusMode && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="w-full md:w-auto p-5 md:px-10 rounded-3xl bg-primary-600/10 border-2 border-primary-600/20 text-center min-w-[200px] shadow-2xl shadow-primary-600/5">
                            <div className="flex justify-center gap-1 height-4 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div key={i} animate={{ height: isActive ? [4, 16, 4] : 4 }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                                        className="w-0.5 md:w-1 bg-primary-400 rounded-full" />
                                ))}
                                <span className="text-[10px] font-bold text-primary-400 ml-2 uppercase tracking-widest">{isActive ? "Processing Focus" : "Paused"}</span>
                            </div>
                            <div className="text-4xl md:text-5xl font-black font-mono text-primary-400 mb-2">
                                {formatTime(timeLeft)}
                            </div>
                            <button onClick={() => setIsActive(!isActive)} className={`w-full py-2 rounded-xl font-bold text-sm transition-all shadow-lg ${isActive ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-600/20'}`}>
                                {isActive ? "Pause Session" : "Start Focus"}
                            </button>
                        </motion.div>
                    )}

                    {!focusMode && (
                        <button onClick={() => navigate("/quiz")} className="px-6 py-3 rounded-xl bg-slate-950 text-white font-bold flex items-center gap-2 shadow-xl shadow-slate-950/20 hover:-translate-y-0.5 transition-all active:scale-95 whitespace-nowrap">
                            Start Practice <ChevronRight size={18} />
                        </button>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    {[
                        { label: "Mastery Level", value: `${user?.masteryScore || 14}%`, icon: <Award size={22} className="text-violet-500" />, trend: "+2% this week", bg: "bg-violet-50" },
                        { label: "Learning Streak", value: `${user?.streak || 3} Days`, icon: <Flame size={22} className="text-orange-500" />, trend: "Best: 12 days", bg: "bg-orange-50" },
                        { label: "Concepts Learned", value: `${user?.conceptsLearned || 128}`, icon: <BookOpen size={22} className="text-emerald-500" />, trend: "+15 this month", bg: "bg-emerald-50" },
                        { label: "Focus Score", value: "92%", icon: <Target size={22} className="text-blue-500" />, trend: "Top 5% class", bg: "bg-blue-50" },
                    ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            className={`p-6 rounded-3xl border shadow-sm transition-all ${focusMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 hover:shadow-xl hover:shadow-primary-600/5'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</div>
                            <div className="text-3xl font-black mt-1 mb-1">{stat.value}</div>
                            <div className="text-xs font-semibold text-slate-400 leading-relaxed">{stat.trend}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Activity Area */}
                    <div className={`lg:col-span-2 p-8 rounded-[2rem] border transition-all ${focusMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40'}`}>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <h3 className="text-xl font-extrabold tracking-tight italic bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">Recommended Modules</h3>
                            <div className="flex gap-2 flex-wrap justify-end">
                                {["Calculus", "Physics", "Biology", "History", "Comp Sci"].map(t => (
                                    <span key={t} className="px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-tighter shadow-sm">{t}</span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            {[
                                { title: "Global Flashcard Deck", type: "Active Recall", time: "10 min", difficulty: "Varies", accent: "text-violet-600", accentBg: "bg-violet-600/10", subject: "All", grade: "All", isFlash: true },
                                { title: "Derivatives & Rates of Change", type: "Core Concept", time: "25 min", difficulty: "Medium", accent: "text-primary-600", accentBg: "bg-primary-600/10", subject: "Calculus", grade: "College" },
                                { title: "Newton's Laws deeply explained", type: "Visual Model", time: "15 min", difficulty: "Hard", accent: "text-violet-600", accentBg: "bg-violet-600/10", subject: "Physics", grade: "High School" },
                                { title: "Cellular Respiration cycle", type: "Interactive Map", time: "20 min", difficulty: "Medium", accent: "text-emerald-600", accentBg: "bg-emerald-600/10", subject: "Biology", grade: "High School" },
                                { title: "Intro to Fractions & Decimals", type: "Core Concept", time: "20 min", difficulty: "Easy", accent: "text-primary-600", accentBg: "bg-primary-600/10", subject: "Math", grade: "Middle School" },
                                { title: "Causes of World War II", type: "Timeline View", time: "30 min", difficulty: "Easy", accent: "text-orange-600", accentBg: "bg-orange-600/10", subject: "History", grade: "High School" },
                                { title: "Intro to Data Structures", type: "Core Concept", time: "45 min", difficulty: "Hard", accent: "text-sky-600", accentBg: "bg-sky-600/10", subject: "Comp Sci", grade: "College" },
                            ]
                                .filter(mod => !user?.grade || mod.grade.includes(user.grade) || user.grade === "College")
                                .map((mod, i) => (
                                    <div key={i} className={`group flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer ${focusMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-primary-600/5 hover:-translate-y-0.5'}`}
                                         onClick={() => navigate(mod.isFlash ? "/flashcards" : "/quiz")}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl ${mod.accentBg} ${mod.accent} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                                <BookOpen size={20} />
                                            </div>
                                            <div>
                                                <div className="font-extrabold text-base mb-1 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{mod.title}</div>
                                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold text-slate-400 items-center">
                                                    <span className={`${mod.accent} uppercase tracking-widest`}>{mod.subject}</span>
                                                    <span className="bg-white/50 px-1.5 py-0.5 rounded border border-slate-100 text-[10px]">{mod.grade}</span>
                                                    <span className="opacity-25">•</span>
                                                    <span className="flex items-center gap-1">📘 {mod.type}</span>
                                                    <span className="flex items-center gap-1">⏱ {mod.time}</span>
                                                    <span className="flex items-center gap-1">⚡ {mod.difficulty}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Side Panel: Recent Assessment & AI Insights */}
                    <div className="flex flex-col gap-6">
                        {/* AI Insights Panel */}
                        <div className={`p-7 rounded-[2rem] border transition-all relative overflow-hidden ${focusMode ? 'bg-white/5 border-white/10' : 'bg-white border-primary-100 shadow-2xl shadow-primary-600/5'}`}>
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-600/5 rounded-full blur-2xl" />
                            <div className="flex items-center gap-3 mb-5">
                                <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600">
                                    <Sparkles size={18} />
                                </div>
                                <h3 className="text-lg font-black tracking-tighter italic uppercase">AI Insights</h3>
                            </div>
                            <div className={`p-4 rounded-2xl border mb-5 italic ${focusMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                                <p className="text-sm leading-relaxed">
                                    "Based on your recent activity, we recommend double-down on <b>{user?.weakSubject || "Physics"}</b>. Your mastery in {user?.strongSubject || "Math"} is solid."
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Adaptive Path Active</span>
                            </div>
                        </div>

                        <div className={`p-7 rounded-[2rem] border transition-all ${focusMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40'}`}>
                            <h3 className="text-lg font-black tracking-tighter mb-6 uppercase">Recent Activity</h3>
                            <div className="flex flex-col gap-5">
                                {recentActivity.map((act, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-11 h-11 rounded-xl ${act.bg} ${act.color} flex items-center justify-center font-black text-sm shadow-sm`}>
                                            {act.score}%
                                        </div>
                                        <div>
                                            <div className="font-extrabold text-sm mb-0.5 tracking-tight">{act.title}</div>
                                            <div className="text-[11px] font-bold text-slate-400 capitalize">{act.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weekly Goal Card */}
                        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary-950 to-indigo-950 text-white shadow-2xl shadow-primary-950/20 relative overflow-hidden group">
                            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                            <Target size={28} className="text-primary-400 mb-5" />
                            <h3 className="text-xl font-black mb-2 tracking-tight">Weekly Goal</h3>
                            <p className="text-sm text-primary-200/80 mb-6 font-medium leading-relaxed">
                                You're 2 modules away from hitting your target mastery score.
                            </p>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                                <div className="h-full w-[70%] bg-gradient-to-r from-primary-500 to-indigo-400 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black text-primary-300 uppercase tracking-widest">
                                <span>70% Progress</span>
                                <span>14/20 Units</span>
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}
