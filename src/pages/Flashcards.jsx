import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw, CheckCircle2, XCircle, Brain, Target, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const mockCards = [
    { id: 1, front: "What is the Big-O of access in an Array?", back: "O(1) - Accessing by index is constant time.", subject: "CS", difficulty: "Easy" },
    { id: 2, front: "State Newton's Second Law of Motion.", back: "F = ma (Force equals mass times acceleration).", subject: "Physics", difficulty: "Medium" },
    { id: 3, front: "What is the primary function of Ribosomes?", back: "Protein synthesis (translation).", subject: "Bio", difficulty: "Medium" },
    { id: 4, front: "Who authored 'The Social Contract' in 1762?", back: "Jean-Jacques Rousseau.", subject: "History", difficulty: "Hard" },
    { id: 5, front: "Derivative of e^x?", back: "e^x - it remains unchanged.", subject: "Math", difficulty: "Easy" },
];

export default function Flashcards() {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    
    // Proper Dynamic Logic: Filter or emphasize cards based on user profile
    const filteredCards = user?.weakSubject 
        ? [...mockCards].sort((a) => (a.subject === user.weakSubject ? -1 : 1))
        : mockCards;

    const [cards] = useState(filteredCards);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [masteredCount, setMasteredCount] = useState(0);

    const card = cards[currentIndex];

    const handleFeedback = (knows) => {
        if (knows) setMasteredCount(prev => prev + 1);
        setIsFlipped(false);
        setTimeout(() => {
            if (currentIndex < cards.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                updateUser({ 
                    conceptsLearned: (user?.conceptsLearned || 0) + masteredCount,
                    lastActive: new Date().toISOString()
                });
                setCurrentIndex(0);
                setMasteredCount(0);
            }
        }, 300);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 font-sans text-slate-900 p-6 flex flex-col items-center">
            <header className="w-full max-w-4xl flex justify-between items-center mb-16 relative z-10">
                <button onClick={() => navigate("/dashboard")} 
                    className="p-2.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-500 font-bold flex items-center gap-2 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all">
                    <ArrowLeft size={18} /> Exit Hub
                </button>
                <div className="text-center">
                    <h1 className="text-2xl font-black tracking-tight uppercase italic text-slate-900">Active Recall</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Retaining {cards.length} Core Concepts</p>
                </div>
                <div className="w-[100px] hidden sm:block" />
            </header>

            <main className="w-full max-w-md flex flex-col items-center gap-12 relative z-10">
                <div className="relative w-full perspective-[2000px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50, rotateY: 20 }}
                            animate={{ opacity: 1, x: 0, rotateY: 0 }}
                            exit={{ opacity: 0, x: -50, rotateY: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="relative w-full h-96"
                        >
                            <motion.div
                                onClick={() => setIsFlipped(!isFlipped)}
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                                className="w-full h-full relative preserve-3d cursor-pointer"
                            >
                                {/* Front */}
                                <div className="absolute inset-0 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/40 backface-hidden flex flex-col justify-center items-center text-center">
                                    <div className="absolute top-6 left-6 flex gap-2">
                                        <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest leading-none">{card.subject}</span>
                                        <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">{card.difficulty}</span>
                                    </div>
                                    <div className="mb-8 p-4 rounded-3xl bg-primary-50 text-primary-200">
                                        <Brain size={40} />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight uppercase italic">{card.front}</h2>
                                    <div className="absolute bottom-8 flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest italic animate-pulse">
                                        Tap to Reveal Logic <RefreshCw size={12} />
                                    </div>
                                </div>

                                {/* Back */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2.5rem] p-10 shadow-2xl shadow-primary-600/20 backface-hidden [transform:rotateY(180deg)] flex flex-col justify-center items-center text-center text-white">
                                    <div className="mb-8 p-4 rounded-3xl bg-white/10 text-white/30">
                                        <Sparkles size={40} />
                                    </div>
                                    <h2 className="text-xl font-black leading-relaxed italic uppercase">{card.back}</h2>
                                    <div className="absolute bottom-8 text-[10px] font-black text-white/40 uppercase tracking-widest italic leading-none">
                                        Process Internally then Score
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className={`flex gap-4 w-full transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-4 pointer-events-none'}`}>
                    <button onClick={() => handleFeedback(false)} 
                        className="flex-1 py-5 rounded-2xl bg-white border-2 border-slate-100 text-red-500 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-50 hover:border-red-100 transition-all active:scale-95 shadow-sm">
                        <RefreshCw size={18} /> Re-Phase
                    </button>
                    <button onClick={() => handleFeedback(true)} 
                        className="flex-1 py-5 rounded-2xl bg-slate-950 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-900 transition-all active:scale-95 shadow-2xl shadow-slate-950/20">
                        <CheckCircle2 size={18} /> Mastered
                    </button>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner mt-4">
                    <motion.div animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }} 
                        className="h-full bg-primary-600 shadow-[0_0_8px_rgba(37,99,235,0.4)] transition-all duration-500" />
                </div>
            </main>

            {/* Background Details */}
            <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-orange-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />
        </div>
    );
}
