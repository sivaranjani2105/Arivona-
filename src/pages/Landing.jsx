import { Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Layers } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 font-sans text-slate-900 overflow-hidden relative">
            {/* Decorative blobs */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1],
                    x: [0, 20, 0],
                    y: [0, -20, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full bg-radial-gradient from-primary-600/10 to-transparent pointer-events-none blur-3xl"
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    x: [0, -30, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-48 -left-24 w-[500px] h-[500px] rounded-full bg-radial-gradient from-orange-400/10 to-transparent pointer-events-none blur-3xl"
            />

            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 md:px-12 py-6 relative z-50 glass mb-8">
                <Link to="/" className="no-underline flex items-center gap-3.5 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center text-xl shadow-lg shadow-primary-600/30 group-hover:scale-110 transition-transform duration-300">⚡</div>
                    <span className="text-2xl font-extrabold tracking-tight">ARVIONA</span>
                </Link>
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/estimate" className="no-underline text-slate-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors">Estimate</Link>
                    <Link to="/features" className="no-underline text-slate-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors">Features</Link>
                    <Link to="/login" className="no-underline text-slate-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors">Login</Link>
                    <Link to="/login" className="no-underline text-white bg-primary-600 font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-primary-600/30 flex items-center gap-2 hover:bg-primary-700 hover:-translate-y-0.5 transition-all">
                        Get Started <ArrowRight size={16} />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6 }}
                >
                    <span className="px-4 py-2 rounded-full bg-primary-50 text-primary-600 font-bold text-xs border border-primary-200 mb-6 inline-block uppercase tracking-wider">
                        ✨ Arviona Alpha Release
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-slate-900">
                        Adaptive Learning, <br />
                        <span className="bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent italic">Engineered for You.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                        The personalized learning platform that adapts to your hesitation, confidence, and mastery in real-time.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/login" className="no-underline bg-slate-950 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-slate-950/20 flex items-center justify-center gap-2.5 hover:-translate-y-1 hover:bg-slate-900 transition-all duration-300">
                            Create Student Profile <ArrowRight size={18} />
                        </Link>
                        <Link to="/estimate" className="no-underline bg-white text-slate-900 px-10 py-4 rounded-2xl text-lg font-bold shadow-md border border-slate-200 flex items-center justify-center gap-2.5 hover:-translate-y-1 hover:bg-slate-50 transition-all duration-300">
                            View Build Estimate
                        </Link>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6, delay: 0.2 }} 
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full max-w-5xl text-left"
                >
                    {[
                        { icon: <Sparkles size={24} className="text-orange-500" />, title: "AI Hesitation Detection", desc: "Recognizes when you're struggling before you even answer." },
                        { icon: <BookOpen size={24} className="text-emerald-500" />, title: "Dynamic Mastery Tracking", desc: "Tracks your weak points and intelligently re-assesses gaps." },
                        { icon: <Layers size={24} className="text-indigo-500" />, title: "Interactive Learning Hub", desc: "Bite-sized visual models that replace clunky textbooks." }
                    ].map((feat, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-primary-600/10 transition-all duration-500 group">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {feat.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-sm font-medium">{feat.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </main>
        </div>
    );
}
