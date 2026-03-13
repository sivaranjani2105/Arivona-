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
    const { user, updateUser, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [focusMode, setFocusMode] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let timer;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const recentActivity = [
        { title: "Advanced Calculus: Integrals", score: 85, time: "2h ago", color: "#3B82F6", bg: "#EFF6FF" },
        { title: "Physics: Thermodynamics", score: 92, time: "1d ago", color: "#10B981", bg: "#ECFDF5" },
        { title: "Literature: Essay Structure", score: 78, time: "2d ago", color: "#F59E0B", bg: "#FFFBEB" },
    ];

    return (
        <div style={{
            minHeight: "100vh", background: focusMode ? "#0F172A" : "#F8FAFF", 
            fontFamily: "'DM Sans', sans-serif", color: focusMode ? "#fff" : "#0F172A", 
            paddingBottom: 64, transition: "all 0.5s ease"
        }}>

            {/* Top Banner (Header) */}
            <header style={{
                background: focusMode ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.8)", 
                backdropFilter: "blur(12px)",
                borderBottom: `1px solid ${focusMode ? "rgba(255,255,255,0.1)" : "#E2E8F0"}`, 
                padding: "24px 48px",
                display: "flex", justifyContent: "space-between", alignItems: "center", 
                position: "sticky", top: 0, zIndex: 100, transition: "all 0.3s ease"
            }}>
                <div  onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 6px 16px rgba(37,99,235,0.2)"
                    }}>⚡</div>
                    <div>
                        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: focusMode ? "#fff" : "#0F172A" }}>ARVIONA</h1>
                        <p style={{ fontSize: 13, color: focusMode ? "#94A3B8" : "#64748B" }}>Student Dashboard</p>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {!focusMode && (
                        <button  onClick={() => navigate("/features")} style={{
                            padding: "8px 16px", borderRadius: 12, background: "#F1F5F9", 
                            color: "#1E293B", border: "none", fontWeight: 600, fontSize: 13,
                            display: "flex", alignItems: "center", gap: 6, transition: "background 0.2s"
                        }} onMouseEnter={e => e.target.style.background = "#E2E8F0"} onMouseLeave={e => e.target.style.background = "#F1F5F9"}>
                            <Award size={16} /> Beta Features
                        </button>
                    )}
                    <button onClick={() => setFocusMode(!focusMode)} style={{
                        padding: "10px 18px", borderRadius: 12, 
                        background: focusMode ? "rgba(255,255,255,0.1)" : "#0F172A",
                        color: "#fff",
                        border: "none",
                        fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                        transition: "all 0.3s", cursor: "pointer"
                    }}>
                        {focusMode ? <LogOut size={16} /> : <Zap size={16} fill="#fff" />}
                        {focusMode ? "End Session" : "Deep Work"}
                    </button>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: focusMode ? "#fff" : "#0F172A" }}>{user?.name || "Student"}</span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8" }}>{user?.goal || "Arviona Explorer"}</span>
                    </div>
                    <button  onClick={logout} style={{
                        padding: "8px 12px", borderRadius: 10, background: focusMode ? "rgba(255,255,255,0.05)" : "#FEF2F2", 
                        border: `1px solid ${focusMode ? "rgba(255,255,255,0.1)" : "#FEE2E2"}`,
                        color: focusMode ? "#94A3B8" : "#EF4444", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6,
                        cursor: "pointer", transition: "all 0.2s"
                    }} onMouseEnter={e => e.currentTarget.style.background = focusMode ? "rgba(255,255,255,0.1)" : "#FEE2E2"} onMouseLeave={e => e.currentTarget.style.background = focusMode ? "rgba(255,255,255,0.05)" : "#FEF2F2"}>
                        <LogOut size={16} />
                    </button>
                </div>
            </header>

            <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

                {/* Welcome Section */}
                <div style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.5px", color: focusMode ? "#fff" : "#0F172A" }}>
                            {focusMode ? "Deep Focus Session" : `Welcome back, ${user?.name || "Student"}! 👋`}
                        </h2>
                        <p style={{ fontSize: 16, color: "#64748B", fontWeight: 500 }}>
                            {focusMode ? "Block out distractions. Stay sharp." : `You're in ${user?.grade || "High School"}. Keep up the ${user?.streak || 3}-day streak!`}
                        </p>
                    </div>

                    {focusMode && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            style={{ 
                                padding: "20px 40px", borderRadius: 24, background: "rgba(37,99,235,0.1)", 
                                border: "2px solid rgba(37,99,235,0.2)", textAlign: "center", minWidth: 200
                            }}>
                            <div style={{ display: "flex", justifyContent: "center", gap: 3, height: 16, marginBottom: 12 }}>
                                {[...Array(5)].map((_, i) => (
                                    <motion.div key={i} animate={{ height: isActive ? [4, 16, 4] : 4 }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                                        style={{ width: 3, background: "#60A5FA", borderRadius: 99 }} />
                                ))}
                                <span style={{ fontSize: 10, fontWeight: 700, color: "#60A5FA", marginLeft: 8, textTransform: "uppercase" }}>{isActive ? "Ambient Focus Active" : "Silence"}</span>
                            </div>
                            <div style={{ fontSize: 48, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", color: "#60A5FA", marginBottom: 8 }}>
                                {formatTime(timeLeft)}
                            </div>
                            <button onClick={() => setIsActive(!isActive)} style={{
                                width: "100%", padding: "8px", borderRadius: 12, border: "none",
                                background: isActive ? "#EF4444" : "#2563EB", color: "#fff",
                                fontWeight: 700, fontSize: 14, cursor: "pointer"
                            }}>
                                {isActive ? "Pause Session" : "Start Focus"}
                            </button>
                        </motion.div>
                    )}

                    {!focusMode && (
                        <button  onClick={() => navigate("/quiz")} style={{
                            padding: "12px 24px", borderRadius: 12, background: "#0F172A", color: "#fff", border: "none", fontWeight: 600,
                            display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(15,23,42,0.15)", transition: "transform 0.2s",
                            willChange: "transform"
                        }} onMouseEnter={e => e.target.style.transform = "translateY(-2px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
                            Start Quick Practice <ChevronRight size={18} />
                        </button>
                    )}
                </div>

                {/* Stats Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 40 }}>
                    {[
                        { label: "Mastery Level", value: `${user?.masteryScore || 14}%`, icon: <Award size={22} color="#8B5CF6" />, trend: "+2% this week", bg: "#F5F3FF" },
                        { label: "Learning Streak", value: `${user?.streak || 3} Days`, icon: <Flame size={22} color="#F59E0B" />, trend: "Best: 12 days", bg: "#FFFBEB" },
                        { label: "Concepts Learned", value: `${user?.conceptsLearned || 128}`, icon: <BookOpen size={22} color="#10B981" />, trend: "+15 this month", bg: "#ECFDF5" },
                        { label: "Focus Score", value: "92%", icon: <Target size={22} color="#3B82F6" />, trend: "Top 5% class", bg: "#EFF6FF" },
                    ].map((stat, i) => (
                        <motion.div key={i}  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            style={{ 
                                background: "#fff", padding: 24, borderRadius: 20, border: "1px solid #E2E8F0", 
                                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                                willChange: "transform"
                            }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {stat.icon}
                                </div>
                            </div>
                            <div style={{ fontSize: 13, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</div>
                            <div style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", margin: "4px 0" }}>{stat.value}</div>
                            <div style={{ fontSize: 13, color: "#94A3B8" }}>{stat.trend}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Two Column Layout */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>

                    {/* Main Activity Area */}
                    <div style={{ background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #E2E8F0", boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                            <h3 style={{ fontSize: 20, fontWeight: 700 }}>Recommended Modules</h3>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                                {["Calculus", "Physics", "Biology", "History", "Comp Sci"].map(t => (
                                    <span key={t} style={{ padding: "6px 12px", background: "#F1F5F9", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "#475569" }}>{t}</span>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                { title: "Global Flashcard Deck", type: "Active Recall", time: "10 min", difficulty: "Varies", accent: "#7C3AED", subject: "All", grade: "All", isFlash: true },
                                { title: "Derivatives & Rates of Change", type: "Core Concept", time: "25 min", difficulty: "Medium", accent: "#2563EB", subject: "Calculus", grade: "College" },
                                { title: "Newton's Laws deeply explained", type: "Visual Model", time: "15 min", difficulty: "Hard", accent: "#8B5CF6", subject: "Physics", grade: "High School" },
                                { title: "Cellular Respiration cycle", type: "Interactive Map", time: "20 min", difficulty: "Medium", accent: "#10B981", subject: "Biology", grade: "High School" },
                                { title: "Intro to Fractions & Decimals", type: "Core Concept", time: "20 min", difficulty: "Easy", accent: "#2563EB", subject: "Math", grade: "Middle School" },
                                { title: "Causes of World War II", type: "Timeline View", time: "30 min", difficulty: "Easy", accent: "#F59E0B", subject: "History", grade: "High School" },
                                { title: "Intro to Data Structures", type: "Core Concept", time: "45 min", difficulty: "Hard", accent: "#0EA5E9", subject: "Comp Sci", grade: "College" },
                            ]
                                .filter(mod => !user?.grade || mod.grade.includes(user.grade) || user.grade === "College") // Show matching grade, college sees all
                                .map((mod, i) => (
                                    <div  key={i} style={{
                                        display: "flex", alignItems: "center", justifyContent: "space-between", padding: 20,
                                        background: "#FAFBFF", border: "1px solid #EEF2FF", borderRadius: 16, transition: "background 0.2s"
                                    }} onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"} onMouseLeave={e => e.currentTarget.style.background = "#FAFBFF"}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${mod.accent}20`, color: mod.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <BookOpen size={20} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 4 }}>{mod.title}</div>
                                                <div style={{ display: "flex", gap: 12, fontSize: 13, color: "#64748B" }}>
                                                    <span style={{ color: mod.accent, fontWeight: 600 }}>{mod.subject}</span>
                                                    <span style={{ background: "#F1F5F9", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700, color: "#475569" }}>{mod.grade}</span>
                                                    <span>•</span>
                                                    <span>📘 {mod.type}</span>
                                                    <span>⏱ {mod.time}</span>
                                                    <span>⚡ {mod.difficulty}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button  onClick={() => navigate(mod.isFlash ? "/flashcards" : "/quiz")} style={{
                                            width: 40, height: 40, borderRadius: "50%", background: "#fff", border: "1.5px solid #E2E8F0",
                                            display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", transition: "all 0.2s"
                                        }} onMouseEnter={e => { e.currentTarget.style.borderColor = mod.accent; e.currentTarget.style.color = mod.accent }}>
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Side Panel: Recent Assessment & AI Insights */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        {/* AI Insights Panel */}
                        <div style={{
                            background: "#fff", borderRadius: 24, padding: 28, border: "1.5px solid #E2E8F0",
                            boxShadow: "0 10px 30px rgba(37,99,235,0.04)", position: "relative"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                <div style={{ padding: 8, borderRadius: 10, background: "#EFF6FF" }}>
                                    <Sparkles size={18} color="#2563EB" />
                                </div>
                                <h3 style={{ fontSize: 17, fontWeight: 800 }}>AI Insights</h3>
                            </div>
                            <div style={{ background: "#F8FAFC", padding: 16, borderRadius: 16, border: "1px solid #EEF2FF", marginBottom: 16 }}>
                                <p style={{ fontSize: 13, color: "#1E293B", lineHeight: 1.6, fontWeight: 500 }}>
                                    "Based on your recent activity, we recommend double-down on <b>{user?.weakSubject || "Physics"}</b>. Your mastery in {user?.strongSubject || "Math"} is solid."
                                </p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B" }}>Path Optimization Active</span>
                            </div>
                        </div>

                        <div style={{ background: "#fff", borderRadius: 24, padding: 28, border: "1px solid #E2E8F0", boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Recent Activity</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {recentActivity.map((act, i) => (
                                    <div key={i}  style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 10, background: act.bg, color: act.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
                                            {act.score}%
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 14, color: "#1E293B", marginBottom: 2 }}>{act.title}</div>
                                            <div style={{ fontSize: 12, color: "#94A3B8" }}>{act.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Micro-Interaction Card */}
                        <div  style={{
                            background: "linear-gradient(135deg, #1E3A8A, #312E81)", borderRadius: 24, padding: 28,
                            color: "#fff", boxShadow: "0 12px 32px rgba(30,58,138,0.25)", position: "relative", overflow: "hidden"
                        }}>
                            <div style={{ position: "absolute", top: -50, right: -50, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
                            <Target size={28} color="#93C5FD" style={{ marginBottom: 16 }} />
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Weekly Goal</h3>
                            <p style={{ fontSize: 14, color: "#BFDBFE", marginBottom: 20, lineHeight: 1.5 }}>
                                You're 2 modules away from hitting your target.
                            </p>
                            <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 99, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: "70%", background: "#60A5FA" }} />
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}
