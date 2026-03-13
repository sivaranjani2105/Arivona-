import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, Lock, User, Calendar, GraduationCap, Target, Chrome } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MeshBackground = () => (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <motion.div
            animate={{
                transform: ["translate3d(0,0,0) rotate(0deg)", "translate3d(100px, -50px, 0) rotate(90deg)", "translate3d(0,0,0) rotate(0deg)"]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            style={{
                position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%",
                background: "radial-gradient(circle at 30% 30%, rgba(37, 99, 235, 0.05) 0%, transparent 40%), radial-gradient(circle at 70% 70%, rgba(245, 158, 11, 0.05) 0%, transparent 40%)",
                filter: "blur(60px)",
                willChange: "transform"
            }}
        />
    </div>
);

export default function Login() {
    const navigate = useNavigate();
    const { login, loginWithGoogle, isAuthenticated } = useAuth();
    const [step, setStep] = useState(1);
    const [isConnecting, setIsConnecting] = useState(false);
    const [formData, setFormData] = useState({
        email: "", password: "",
        name: "", age: "",
        grade: "", strongSubject: "",
        weakSubject: "", goal: ""
    });
    const [touched, setTouched] = useState({});

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const nextStep = () => {
        setTouched({});
        setStep(s => Math.min(s + 1, 4));
    };
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
        if (value.length > 2) setTouched(p => ({ ...p, [name]: true }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 4) {
            // Complete profile creation and go to dashboard using AuthContext
            login({ ...formData });
            navigate("/dashboard");
        } else {
            nextStep();
        }
    };

    const handleGoogleLogin = () => {
        setIsConnecting(true);
        // Simulate OAuth hand-off
        setTimeout(() => {
            loginWithGoogle();
            navigate("/dashboard");
        }, 1800);
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    return (
        <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #F8FAFF 0%, #EEF4FF 40%, #FFF8F0 100%)",
            fontFamily: "'DM Sans', sans-serif", padding: 24, position: "relative", overflow: "hidden"
        }}>

            {/* Premium Mesh Background */}
            <MeshBackground />

            <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(37,99,235,0.03)", filter: "blur(60px)" }} />

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{
                background: "#fff", width: "100%", maxWidth: 500, borderRadius: 24,
                boxShadow: "0 12px 40px rgba(0,0,0,0.04)", border: "1px solid #E2E8F0",
                padding: "40px 32px", position: "relative", zIndex: 10
            }}>

                {/* Header & Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <div  style={{
                                width: 48, height: 48, borderRadius: 14,
                                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 22, boxShadow: "0 6px 16px rgba(37,99,235,0.25)"
                            }}>⚡</div>
                        </Link>
                    </div>
                    <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px", marginBottom: 6 }}>
                        {step === 1 ? "Welcome to Arviona" : "Create Your Profile"}
                    </h2>
                    <p style={{ fontSize: 15, color: "#64748B", fontWeight: 500 }}>Step {step} of 4: {["Identify", "About You", "Academics", "Goals"][step-1]}</p>

                    {/* Progress Bar */}
                    <div style={{ height: 6, background: "#F1F5F9", borderRadius: 99, marginTop: 16, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(step / 4) * 100}%`, background: "#2563EB", transition: "width 0.4s ease" }} />
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                <AnimatePresence mode="wait">
                                    {isConnecting ? (
                                        <motion.div key="connecting" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                            style={{ padding: "40px 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
                                            <div style={{ width: 72, height: 72, position: "relative" }}>
                                                <div style={{ position: "absolute", inset: 0, border: "4px solid #F1F5F9", borderRadius: "50%" }} />
                                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                    style={{ position: "absolute", inset: 0, border: "4px solid #4285F4", borderTopColor: "transparent", borderRadius: "50%" }} />
                                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <Chrome size={28} color="#4285F4" />
                                                </div>
                                            </div>
                                            <div style={{ textAlign: "center" }}>
                                                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>Connecting to Google</h3>
                                                <p style={{ fontSize: 14, color: "#64748B", fontWeight: 500 }}>Securing your academic profile...</p>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                            <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGoogleLogin} style={{
                                                width: "100%", padding: "16px", borderRadius: 16, border: "2px solid #E2E8F0", 
                                                background: "#fff", color: "#1E293B", fontWeight: 800, fontSize: 15,
                                                display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.03)", cursor: "pointer", transition: "all 0.2s"
                                            }} onMouseEnter={e => e.currentTarget.style.borderColor = "#4285F4"}>
                                                <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                                Continue with Google
                                            </motion.button>

                                            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
                                                <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
                                                <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "1px" }}>OR EMAIL</span>
                                                <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
                                            </div>

                                            <div style={{ position: "relative" }}>
                                                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 6 }}>Email</label>
                                                <div style={{ position: "relative" }}>
                                                    <Mail size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: formData.email.length > 3 ? "#2563EB" : "#94A3B8" }} />
                                                    <input  required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="student@example.com" style={{
                                                        width: "100%", padding: "14px 16px 14px 44px", borderRadius: 12, border: "1.5px solid #E2E8F0", background: "#F8FAFC", outline: "none", fontSize: 15, transition: "all 0.2s", color: "#1E293B", 
                                                    }} onFocus={(e) => e.target.style.borderColor = "#2563EB"} onBlur={(e) => e.target.style.borderColor = "#E2E8F0"} />
                                                    {formData.email.includes("@") && <CheckCircle2 size={18} color="#10B981" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }} />}
                                                </div>
                                            </div>
                                            <div style={{ position: "relative" }}>
                                                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 6 }}>Password</label>
                                                <div style={{ position: "relative" }}>
                                                    <Lock size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: formData.password.length > 5 ? "#2563EB" : "#94A3B8" }} />
                                                    <input  required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" style={{
                                                        width: "100%", padding: "14px 16px 14px 44px", borderRadius: 12, border: "1.5px solid #E2E8F0", background: "#F8FAFC", outline: "none", fontSize: 15, transition: "all 0.2s", color: "#1E293B", 
                                                    }} onFocus={(e) => e.target.style.borderColor = "#2563EB"} onBlur={(e) => e.target.style.borderColor = "#E2E8F0"} />
                                                    {formData.password.length >= 6 && <CheckCircle2 size={18} color="#10B981" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }} />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}


                        {step === 2 && (
                            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 6 }}>Full Name</label>
                                    <div style={{ position: "relative" }}>
                                        <User size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                                        <input  required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Alex Chen" style={{
                                            width: "100%", padding: "14px 16px 14px 44px", borderRadius: 12, border: "1.5px solid #E2E8F0", background: "#F8FAFC", outline: "none", fontSize: 15
                                        }} onFocus={(e) => e.target.style.borderColor = "#2563EB"} onBlur={(e) => e.target.style.borderColor = "#E2E8F0"} />
                                        {formData.name.length > 3 && <CheckCircle2 size={18} color="#10B981" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }} />}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 6 }}>Age</label>
                                    <div style={{ position: "relative" }}>
                                        <Calendar size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                                        <input  required type="number" name="age" value={formData.age} onChange={handleChange} placeholder="16" min="6" max="99" style={{
                                            width: "100%", padding: "14px 16px 14px 44px", borderRadius: 12, border: "1.5px solid #E2E8F0", background: "#F8FAFC", outline: "none", fontSize: 15
                                        }} onFocus={(e) => e.target.style.borderColor = "#2563EB"} onBlur={(e) => e.target.style.borderColor = "#E2E8F0"} />
                                        {formData.age > 0 && <CheckCircle2 size={18} color="#10B981" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }} />}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                <div>
                                    <label style={{ fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                                        <GraduationCap size={16} color="#2563EB" /> Current Grade / Year
                                    </label>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                                        {["Middle School", "High School", "College"].map(g => (
                                            <div key={g}  onClick={() => setFormData(p => ({ ...p, grade: g }))} style={{
                                                padding: "12px", borderRadius: 12, border: `1.5px solid ${formData.grade === g ? "#2563EB" : "#E2E8F0"}`,
                                                background: formData.grade === g ? "#EFF6FF" : "#fff", textAlign: "center", 
                                                fontSize: 13, fontWeight: 700, color: formData.grade === g ? "#1E40AF" : "#64748B", transition: "all 0.2s"
                                            }}>{g}</div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ height: 1, background: "#F1F5F9" }} />
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Subject Strengths</label>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                        {["Math", "Physics", "Bio", "History", "CS"].map(sub => {
                                            const isSelected = formData.strongSubject === sub;
                                            return (
                                                <div key={sub}  onClick={() => setFormData(p => ({ ...p, strongSubject: sub }))} style={{
                                                    padding: "8px 16px", borderRadius: 99, border: `1.5px solid ${isSelected ? "#2563EB" : "#F1F5F9"}`,
                                                    background: isSelected ? "#2563EB" : "#fff", color: isSelected ? "#fff" : "#64748B",
                                                    fontSize: 12, fontWeight: 700,  transition: "all 0.2s"
                                                }}>{sub}</div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Need Help With</label>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                        {["Math", "Physics", "Bio", "History", "CS"].map(sub => {
                                            const isSelected = formData.weakSubject === sub;
                                            return (
                                                <div key={sub}  onClick={() => setFormData(p => ({ ...p, weakSubject: sub }))} style={{
                                                    padding: "8px 16px", borderRadius: 99, border: `1.5px solid ${isSelected ? "#F59E0B" : "#F1F5F9"}`,
                                                    background: isSelected ? "#F59E0B" : "#fff", color: isSelected ? "#fff" : "#64748B",
                                                    fontSize: 12, fontWeight: 700,  transition: "all 0.2s"
                                                }}>{sub}</div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <label style={{ fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                                    <Target size={16} color="#7C3AED" /> What's your main learning goal?
                                </label>
                                {[
                                    { label: "Ace Exams", desc: "Focus on testing performance", icon: "📈" },
                                    { label: "Master Topics", desc: "In-depth understanding", icon: "🧠" },
                                    { label: "Build Habits", desc: "Daily study consistency", icon: "⏳" },
                                    { label: "General Learning", desc: "Broad knowledge growth", icon: "🌍" }
                                ].map(goal => (
                                    <div  key={goal.label} onClick={() => setFormData(p => ({ ...p, goal: goal.label }))} style={{
                                        padding: "16px", borderRadius: 16, border: `1.5px solid ${formData.goal === goal.label ? "#2563EB" : "#F1F5F9"}`,
                                        background: formData.goal === goal.label ? "#EFF6FF" : "#fff",
                                        display: "flex", alignItems: "center", gap: 16,
                                        transition: "all 0.2s", 
                                        boxShadow: formData.goal === goal.label ? "0 4px 12px rgba(37,99,235,0.05)" : "none"
                                    }}>
                                        <div style={{ fontSize: 24 }}>{goal.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 15, fontWeight: 700, color: formData.goal === goal.label ? "#1E40AF" : "#0F172A" }}>{goal.label}</div>
                                            <div style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>{goal.desc}</div>
                                        </div>
                                        {formData.goal === goal.label && <CheckCircle2 size={18} color="#2563EB" />}
                                    </div>
                                ))}
                            </motion.div>
                        )}

                    </AnimatePresence>

                    <div style={{ display: isConnecting ? "none" : "flex", justifyContent: "space-between", marginTop: 16 }}>
                        {step > 1 ? (
                            <button  type="button" onClick={prevStep} style={{
                                padding: "14px 20px", borderRadius: 12, background: "#F1F5F9", border: "none", color: "#64748B", fontWeight: 600, display: "flex", alignItems: "center", gap: 8
                            }}>
                                <ArrowLeft size={16} /> Back
                            </button>
                        ) : <div />}

                        <button  type="submit" style={{
                            padding: "14px 24px", borderRadius: 12, background: "#0F172A", border: "none", color: "#fff", fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
                            boxShadow: "0 4px 12px rgba(15,23,42,0.15)", transition: "transform 0.2s", marginLeft: "auto"
                        }} onMouseEnter={e => e.target.style.transform = "translateY(-2px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
                            {step === 4 ? "Complete Profile" : "Continue"} <ArrowRight size={16} />
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
