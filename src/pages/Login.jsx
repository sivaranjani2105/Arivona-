import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, Lock, User, Calendar, GraduationCap, Target, Chrome } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MeshBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
            animate={{
                transform: ["translate3d(0,0,0) rotate(0deg)", "translate3d(100px, -50px, 0) rotate(90deg)", "translate3d(0,0,0) rotate(0deg)"]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] blur-[60px] opacity-20"
            style={{
                background: "radial-gradient(circle at 30% 30%, rgba(37, 99, 235, 0.4) 0%, transparent 40%), radial-gradient(circle at 70% 70%, rgba(245, 158, 11, 0.4) 0%, transparent 40%)",
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

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const nextStep = () => {
        setStep(s => Math.min(s + 1, 4));
    };
    const prevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 4) {
            login({ ...formData });
            navigate("/dashboard");
        } else {
            nextStep();
        }
    };

    const handleGoogleLogin = () => {
        setIsConnecting(true);
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 font-sans p-6 relative overflow-hidden">
            <MeshBackground />

            {/* Decorative blob */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-600/5 rounded-full blur-[60px]" />

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-[500px] rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/40 p-10 relative z-10">

                {/* Header & Logo */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <Link to="/" className="no-underline">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center text-2xl shadow-lg shadow-primary-600/20 hover:scale-110 transition-transform">⚡</div>
                        </Link>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 italic uppercase">
                        {step === 1 ? "Initialize Identity" : "Personalize Profile"}
                    </h2>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
                        Phase {step} of 4: <span className="text-primary-600">{["Identify", "About You", "Academics", "Goals"][step-1]}</span>
                    </p>

                    {/* Progress Bar */}
                    <div className="h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden shadow-inner">
                        <div className="h-full bg-primary-600 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(37,99,235,0.3)]" style={{ width: `${(step / 4) * 100}%` }} />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-6">
                                <AnimatePresence mode="wait">
                                    {isConnecting ? (
                                        <motion.div key="connecting" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                            className="py-10 flex flex-col items-center justify-center gap-6">
                                            <div className="w-16 h-16 relative">
                                                <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                    className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Chrome size={24} className="text-primary-500" />
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-lg font-black text-slate-900 mb-1 uppercase tracking-tight italic">Connecting to Google</h3>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Securing your academic profile...</p>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
                                            <motion.button type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={handleGoogleLogin} 
                                                className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white group flex items-center justify-center gap-3 shadow-sm hover:border-primary-600 transition-all font-black text-sm uppercase tracking-widest text-slate-700">
                                                <svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                                Continue with Google
                                            </motion.button>

                                            <div className="flex items-center gap-4 my-2">
                                                <div className="flex-1 h-px bg-slate-100" />
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[2px]">OR SECURE LOGIN</span>
                                                <div className="flex-1 h-px bg-slate-100" />
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <div className="relative group">
                                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 italic">Email Protocol</label>
                                                    <div className="relative">
                                                        <Mail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formData.email.length > 3 ? "text-primary-600" : "text-slate-300"}`} />
                                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="student@arviona.ai" 
                                                            className="w-full py-4 pl-12 pr-12 rounded-2xl border-2 border-slate-50 bg-slate-50/50 outline-none text-sm font-bold transition-all focus:border-primary-600 focus:bg-white focus:shadow-xl focus:shadow-primary-600/5" />
                                                        {formData.email.includes("@") && <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />}
                                                    </div>
                                                </div>
                                                <div className="relative group">
                                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 italic">Access Key</label>
                                                    <div className="relative">
                                                        <Lock size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formData.password.length > 5 ? "text-primary-600" : "text-slate-300"}`} />
                                                        <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" 
                                                            className="w-full py-4 pl-12 pr-12 rounded-2xl border-2 border-slate-50 bg-slate-50/50 outline-none text-sm font-bold transition-all focus:border-primary-600 focus:bg-white focus:shadow-xl focus:shadow-primary-600/5" />
                                                        {formData.password.length >= 6 && <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-6">
                                <div className="group">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 italic">Learner Identity</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                        <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Alex Chen" 
                                            className="w-full py-4 pl-12 pr-12 rounded-2xl border-2 border-slate-100 bg-slate-50/50 outline-none text-sm font-bold tracking-tight focus:border-primary-600 focus:bg-white transition-all" />
                                        {formData.name.length > 3 && <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />}
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 italic">Temporal Age</label>
                                    <div className="relative">
                                        <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                        <input required type="number" name="age" value={formData.age} onChange={handleChange} placeholder="16" min="6" max="99" 
                                            className="w-full py-4 pl-12 pr-12 rounded-2xl border-2 border-slate-100 bg-slate-50/50 outline-none text-sm font-bold tracking-tight focus:border-primary-600 focus:bg-white transition-all" />
                                        {formData.age > 0 && <CheckCircle2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-8">
                                <div>
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2 italic">
                                        <GraduationCap size={16} className="text-primary-600" /> Academic Phase
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {["Middle School", "High School", "College"].map(g => (
                                            <div key={g} onClick={() => setFormData(p => ({ ...p, grade: g }))} 
                                                className={`p-4 rounded-2xl border-2 text-center text-xs font-black uppercase tracking-tighter cursor-pointer transition-all ${formData.grade === g ? "bg-primary-50 border-primary-600 text-primary-900 shadow-lg shadow-primary-600/10" : "bg-white border-slate-100 text-slate-500 hover:border-primary-200"}`}>
                                                {g.split(' ')[0]}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-px bg-slate-100" />
                                <div className="flex flex-col gap-4">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Primary Strengths</label>
                                    <div className="flex flex-wrap gap-2">
                                        {["Math", "Physics", "Bio", "History", "CS"].map(sub => {
                                            const isSelected = formData.strongSubject === sub;
                                            return (
                                                <div key={sub} onClick={() => setFormData(p => ({ ...p, strongSubject: sub }))} 
                                                    className={`px-5 py-2.5 rounded-full border-2 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${isSelected ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-600/20 scale-105" : "bg-white border-slate-100 text-slate-400 hover:border-primary-200"}`}>
                                                    {sub}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Growth Areas</label>
                                    <div className="flex flex-wrap gap-2">
                                        {["Math", "Physics", "Bio", "History", "CS"].map(sub => {
                                            const isSelected = formData.weakSubject === sub;
                                            return (
                                                <div key={sub} onClick={() => setFormData(p => ({ ...p, weakSubject: sub }))} 
                                                    className={`px-5 py-2.5 rounded-full border-2 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${isSelected ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20 scale-105" : "bg-white border-slate-100 text-slate-400 hover:border-orange-200"}`}>
                                                    {sub}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-4">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2 italic">
                                    <Target size={16} className="text-violet-600" /> Primary Objective
                                </label>
                                {[
                                    { label: "Ace Exams", desc: "Test performance metrics", icon: "📈", color: "text-blue-500" },
                                    { label: "Master Topics", desc: "First-principles understanding", icon: "🧠", color: "text-violet-500" },
                                    { label: "Build Habits", desc: "Consistency & discipline", icon: "⏳", color: "text-emerald-500" },
                                    { label: "Broad Expansion", desc: "Lateral knowledge growth", icon: "🌍", color: "text-orange-500" }
                                ].map(goal => (
                                    <div key={goal.label} onClick={() => setFormData(p => ({ ...p, goal: goal.label }))} 
                                        className={`group p-5 rounded-[2rem] border-2 flex items-center gap-5 cursor-pointer transition-all ${formData.goal === goal.label ? "bg-primary-50 border-primary-600 shadow-xl shadow-primary-600/5" : "bg-white border-slate-100 hover:border-primary-200 shadow-sm"}`}>
                                        <div className={`text-3xl transition-transform group-hover:scale-110`}>{goal.icon}</div>
                                        <div className="flex-1">
                                            <div className={`text-base font-black tracking-tight ${formData.goal === goal.label ? "text-primary-900" : "text-slate-900"} uppercase italic`}>{goal.label}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{goal.desc}</div>
                                        </div>
                                        {formData.goal === goal.label && <CheckCircle2 size={24} className="text-primary-600" />}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className={`${isConnecting ? "hidden" : "flex"} justify-between mt-8`}>
                        {step > 1 ? (
                            <button type="button" onClick={prevStep} 
                                className="px-8 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all">
                                <ArrowLeft size={16} /> Previous
                            </button>
                        ) : <div />}

                        <button type="submit" 
                            className="px-8 py-4 rounded-2xl bg-slate-950 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-2xl shadow-slate-950/20 hover:bg-slate-900 hover:-translate-y-1 active:scale-95 transition-all ml-auto">
                            {step === 4 ? "Initialize Hub" : "Proceed"} <ArrowRight size={16} />
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
