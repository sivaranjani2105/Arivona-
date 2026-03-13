import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Layers } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #F8FAFF 0%, #EEF4FF 40%, #FFF8F0 100%)",
            fontFamily: "'DM Sans', sans-serif",
            color: "#0F172A",
            overflow: "hidden",
            position: "relative"
        }}>
            {/* Decorative blobs */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1],
                    x: [0, 20, 0],
                    y: [0, -20, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", top: -100, right: -100, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)", pointerEvents: "none", willChange: "transform" }} 
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    x: [0, -30, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", bottom: -200, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)", pointerEvents: "none", willChange: "transform" }} 
            />

            {/* Navbar */}
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 48px", position: "relative", zIndex: 10 }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                        width: 42, height: 42, borderRadius: 12,
                        background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 20, boxShadow: "0 8px 24px rgba(37,99,235,0.3)"
                    }}>⚡</div>
                    <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }}>ARVIONA</span>
                </Link>
                <div style={{ display: "flex", gap: 16 }}>
                    <Link  to="/estimate" style={{
                        textDecoration: "none", color: "#1E293B", fontWeight: 600, padding: "10px 20px", borderRadius: 12, transition: "background 0.2s"
                    }} onMouseEnter={(e) => e.target.style.background = "#F1F5F9"} onMouseLeave={(e) => e.target.style.background = "transparent"}>Estimate</Link>
                    <Link  to="/features" style={{
                        textDecoration: "none", color: "#1E293B", fontWeight: 600, padding: "10px 20px", borderRadius: 12, transition: "background 0.2s"
                    }} onMouseEnter={(e) => e.target.style.background = "#F1F5F9"} onMouseLeave={(e) => e.target.style.background = "transparent"}>Feature Library</Link>
                    <Link  to="/login" style={{
                        textDecoration: "none", color: "#1E293B", fontWeight: 600, padding: "10px 20px", borderRadius: 12, transition: "background 0.2s"
                    }} onMouseEnter={(e) => e.target.style.background = "#F1F5F9"} onMouseLeave={(e) => e.target.style.background = "transparent"}>Login</Link>
                    <Link  to="/login" style={{
                        textDecoration: "none", color: "#fff", background: "#2563EB", fontWeight: 600, padding: "10px 24px", borderRadius: 12,
                        boxShadow: "0 4px 14px rgba(37,99,235,0.3)", display: "flex", alignItems: "center", gap: 8
                    }}>Get Started <ArrowRight size={16} /></Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", zIndex: 10 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <span style={{ padding: "8px 16px", borderRadius: 20, background: "#EFF6FF", color: "#2563EB", fontWeight: 700, fontSize: 13, border: "1px solid #BFDBFE", marginBottom: 24, display: "inline-block" }}>
                        ✨ Arviona Alpha Release is Here
                    </span>
                    <h1 style={{ fontSize: 72, fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.1, marginBottom: 24, color: "#0F172A" }}>
                        Adaptive Learning, <br />
                        <span style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Engineered for You.</span>
                    </h1>
                    <p style={{ fontSize: 20, color: "#64748B", maxWidth: 600, margin: "0 auto 48px", lineHeight: 1.6 }}>
                        The personalized learning platform that adapts to your hesitation, confidence, and mastery in real-time.
                    </p>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                        <Link  to="/login" style={{
                            textDecoration: "none", background: "#0F172A", color: "#fff", padding: "16px 32px", borderRadius: 16, fontSize: 16, fontWeight: 700,
                            boxShadow: "0 8px 24px rgba(15,23,42,0.2)", display: "flex", alignItems: "center", gap: 10, transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0) scale(1)"}>
                            Create Student Profile <ArrowRight size={18} />
                        </Link>
                        <Link  to="/estimate" style={{
                            textDecoration: "none", background: "#fff", color: "#0F172A", padding: "16px 32px", borderRadius: 16, fontSize: 16, fontWeight: 700,
                            boxShadow: "0 4px 14px rgba(0,0,0,0.05)", border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", gap: 10, transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                        }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0) scale(1)"}>
                            View Build Estimate
                        </Link>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 80, width: "100%", maxWidth: 1000, textAlign: "left" }}>
                    {[
                        { icon: <Sparkles size={24} color="#F59E0B" />, title: "AI-Powered Hesitation Detection", desc: "Recognizes when you're struggling before you even answer." },
                        { icon: <BookOpen size={24} color="#10B981" />, title: "Dynamic Conceptual Mastery", desc: "Tracks your weak points and intelligently re-assesses gaps." },
                        { icon: <Layers size={24} color="#6366F1" />, title: "Interactive Learning Hub", desc: "Bite-sized visual models that replace clunky textbooks." }
                    ].map((feat, i) => (
                        <div  key={i} style={{ background: "#fff", padding: 32, borderRadius: 24, border: "1px solid #E2E8F0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#F8FAFC", border: "1px solid #EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                                {feat.icon}
                            </div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{feat.title}</h3>
                            <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>{feat.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </main>
        </div>
    );
}
