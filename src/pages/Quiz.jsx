import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, ChevronRight, RefreshCw, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const allQuestions = [
    {
        id: 1,
        question: "What is the derivative of x²?",
        options: ["x", "2x", "x³ / 3", "2x²"],
        correct: 1,
        explanation: "The power rule states that the derivative of x^n is n*x^(n-1). So, the derivative of x² is 2*x^(2-1) = 2x.",
        grade: "College",
        expected_time: 45,
        hints: [
            "Remember the Power Rule: d/dx(xⁿ) = n·xⁿ⁻¹",
            "Here n = 2. Bring the exponent down and subtract 1 from it.",
            "So, 2 · x^(2-1) = ?"
        ]
    },
    {
        id: 2,
        question: "Which of Newton's laws is also known as the Law of Inertia?",
        options: ["First Law", "Second Law", "Third Law", "Law of Universal Gravitation"],
        correct: 0,
        explanation: "Newton's First Law states that an object will remain at rest or in uniform motion unless acted upon by an external force. This property is called inertia.",
        grade: "High School",
        expected_time: 30,
        hints: [
            "Think about which law describes objects resisting change in motion.",
            "Inertia is the tendency to do nothing or remain unchanged.",
            "It's the very first law Newton proposed."
        ]
    },
    {
        id: 3,
        question: "In thermodynamics, what does an isothermal process imply?",
        options: ["Constant Pressure", "Constant Volume", "Constant Temperature", "No Heat Exchange"],
        correct: 2,
        explanation: "An isothermal process is a thermodynamic process in which the temperature of the system remains constant (ΔT = 0).",
        grade: "College",
        expected_time: 40,
        hints: [
            "Break down the word: 'Iso' means same, 'Thermal' relates to what?",
            "Think about temperature in physics terms.",
            "It means the temperature doesn't change during the process."
        ]
    },
    {
        id: 4,
        question: "Which organelle is known as the powerhouse of the cell?",
        options: ["Nucleus", "Ribosome", "Mitochondrion", "Chloroplast"],
        correct: 2,
        explanation: "Mitochondria are often referred to as the powerhouses of the cell because they generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy.",
        grade: "Middle School",
        expected_time: 20,
        hints: [
            "This organelle provides energy (ATP) for the cell.",
            "It starts with an 'M'.",
            "Think of the 'powerhouse' analogy often used in biology."
        ]
    },
    {
        id: 5,
        question: "Who was the primary author of the American Declaration of Independence?",
        options: ["George Washington", "Thomas Jefferson", "Benjamin Franklin", "John Adams"],
        correct: 1,
        explanation: "Thomas Jefferson was the principal author of the Declaration of Independence, which was adopted by the Second Continental Congress on July 4, 1776.",
        grade: "Middle School",
        expected_time: 25,
        hints: [
            "He was the 3rd President of the United States.",
            "He was known for his elegant writing and philosophical views.",
            "The author was from Virginia."
        ]
    },
    {
        id: 6,
        question: "What does the 'O' stand for in the BIG-O notation in Computer Science?",
        options: ["Order", "Optimization", "Operation", "On-time"],
        correct: 0,
        explanation: "Big O notation stands for 'Order of' and defines the upper bound of an algorithm's running time, giving the worst-case time complexity.",
        grade: "College",
        expected_time: 30,
        hints: [
            "It's used to describe the efficiency or complexity of an algorithm.",
            "It refers to the 'Order' of growth.",
            "Think about mathematical complexity classes."
        ]
    }
];

const MasteryMeter = ({ score, delta, showDelta }) => {
    const radius = 35;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (score / 100) * circ;
    
    let color = "stroke-primary-600";
    let label = "Building foundation";
    if (score >= 95) { color = "stroke-amber-600"; label = "Mastered ✦"; }
    else if (score >= 80) { color = "stroke-teal-500"; label = "Strong"; }
    else if (score >= 60) { color = "stroke-primary-600"; label = "Good grasp"; }
    else if (score >= 40) { color = "stroke-orange-500"; label = "Getting there"; }
    else { color = "stroke-red-500"; label = "Building foundation"; }

    return (
        <div className="flex flex-col items-center gap-2 relative">
            <div className="relative w-20 h-20 group">
                <svg width="80" height="80" className="-rotate-90">
                    <circle cx="40" cy="40" r={radius} fill="transparent" stroke="currentColor" strokeWidth="6" className="text-slate-200" />
                    <circle cx="40" cy="40" r={radius} fill="transparent" strokeWidth="6"
                        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                        className={`${color} transition-all duration-[1200ms] ease-out`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-base text-slate-900">
                    {score}%
                </div>
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
            
            <AnimatePresence>
                {showDelta && (
                    <div
                        className={`absolute top-0 -right-5 font-black text-sm ${delta > 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {delta > 0 ? `+${delta}` : delta}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function Quiz() {
    const navigate = useNavigate();
    const { user, updateUser, explanationDepth, updateDepth } = useAuth();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    // AI Advanced States
    const [confidence, setConfidence] = useState(3); // 1-5 scale
    const [hintsShown, setHintsShown] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [hesitationLevel, setHesitationLevel] = useState(0); // 0: none, 1: subtle, 2: prompt
    const [masteryScore, setMasteryScore] = useState(user?.masteryScore || 45);
    const [masteryDelta, setMasteryDelta] = useState(0);
    const [showDelta, setShowDelta] = useState(false);

    const [mockQuiz] = useState(() => {
        const stored = localStorage.getItem("arviona_user");
        let grade = "High School";
        if (stored) {
            const profile = JSON.parse(stored);
            if (profile.grade) grade = profile.grade;
        }

        const filtered = allQuestions.filter(q => q.grade === grade || grade === "College");
        return filtered.length > 0 ? filtered : allQuestions;
    });

    const question = mockQuiz[currentQuestion];

    useEffect(() => {
        if (showResults || isSubmitted || !question) return;

        const interval = setInterval(() => {
            setTimeElapsed(t => {
                const newTime = t + 1;
                const expected = question?.expected_time || 60;
                
                if (newTime > expected * 0.9 && hesitationLevel < 2) setHesitationLevel(2);
                else if (newTime > 6 && hesitationLevel < 1) setHesitationLevel(1);
                
                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [showResults, isSubmitted, hesitationLevel, question]);

    const handleSelect = (index) => {
        if (!isSubmitted) setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;

        setIsSubmitted(true);
        const correct = selectedOption === question.correct;
        
        let delta = 0;
        const expected = question.expected_time || 60;
        
        if (correct) {
            setScore(s => s + 1);
            if (timeElapsed < expected * 0.7) delta = 10;
            else if (timeElapsed > expected * 1.3) delta = 4;
            else delta = 7;
        } else {
            if (timeElapsed < 5) delta = -8; 
            else delta = -4;
        }

        const confidenceMultiplier = (confidence - 1) / 4; 
        if (correct) {
            delta = Math.ceil(delta * (0.8 + (confidenceMultiplier * 0.4)));
        } else {
            delta = Math.floor(delta * (1.2 - (confidenceMultiplier * 0.4)));
        }

        setMasteryScore(m => Math.min(100, Math.max(0, m + delta)));
        setMasteryDelta(delta);
        setShowDelta(true);
        setTimeout(() => setShowDelta(false), 2000);
    };

    const handleNext = () => {
        if (currentQuestion < mockQuiz.length - 1) {
            setCurrentQuestion(c => c + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
            setConfidence(3);
            setHintsShown(0);
            setTimeElapsed(0);
            setHesitationLevel(0);
        } else {
            const updatedConcepts = (user?.conceptsLearned || 0) + score;
            updateUser({ 
                masteryScore: masteryScore,
                conceptsLearned: updatedConcepts,
                lastActive: new Date().toISOString()
            });
            setShowResults(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestion(0);
        setSelectedOption(null);
        setIsSubmitted(false);
        setScore(0);
        setShowResults(false);
    };

    const progressPct = ((currentQuestion + (showResults ? 1 : 0)) / mockQuiz.length) * 100;

    if (mockQuiz.length === 0) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 font-sans text-slate-900 p-6 flex flex-col items-center relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-radial-gradient from-primary-600/5 to-transparent blur-3xl" />
            <div className="absolute -bottom-36 -left-24 w-[500px] h-[500px] rounded-full bg-radial-gradient from-emerald-500/5 to-transparent blur-3xl" />

            {/* Header */}
            <header className="w-full max-w-4xl flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-6">
                    <button onClick={() => navigate("/dashboard")} className="p-2.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-500 font-bold flex items-center gap-2 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all">
                        <ArrowLeft size={18} /> Exit
                    </button>
                    <MasteryMeter score={masteryScore} delta={masteryDelta} showDelta={showDelta} />
                </div>

                <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-50 px-3 py-1 rounded-lg text-xs font-black text-primary-600 uppercase tracking-widest">
                            {question.grade} Level
                        </div>
                        <div className="text-sm font-black text-slate-400 italic">
                            {showResults ? mockQuiz.length : currentQuestion + 1} / {mockQuiz.length}
                        </div>
                    </div>
                    <div className="w-40 h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-primary-600 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(37,99,235,0.4)]" style={{ width: `${progressPct}%` }} />
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {!showResults ? (
                    <motion.main key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                        className="w-full max-w-2xl relative z-10">

                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 mb-6">
                            <h2 className="text-2xl md:text-3xl font-black mb-10 leading-snug tracking-tight text-slate-900">
                                {question.question}
                            </h2>

                            <div className="flex flex-col gap-3">
                                {question.options.map((opt, i) => {
                                    const isSelected = selectedOption === i;
                                    const isCorrect = isSubmitted && i === question.correct;
                                    const isWrong = isSubmitted && isSelected && i !== question.correct;

                                    let classes = "p-5 rounded-2xl border-2 flex justify-between items-center transition-all duration-300 ";
                                    let icon = null;

                                    if (isSubmitted) {
                                        if (isCorrect) {
                                            classes += "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-lg shadow-emerald-500/10";
                                            icon = <CheckCircle2 size={22} className="text-emerald-500" />;
                                        } else if (isWrong) {
                                            classes += "bg-red-50 border-red-500 text-red-900 shadow-lg shadow-red-500/10";
                                            icon = <XCircle size={22} className="text-red-500" />;
                                        } else {
                                            classes += "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
                                        }
                                    } else if (isSelected) {
                                        classes += "bg-primary-50 border-primary-600 text-primary-900 shadow-xl shadow-primary-600/10 scale-[1.02]";
                                    } else {
                                        classes += "bg-slate-50 border-slate-100 text-slate-700 hover:bg-white hover:border-primary-200 cursor-pointer";
                                    }

                                    return (
                                        <motion.div key={i} whileHover={{ scale: isSubmitted ? 1 : 1.01 }} whileTap={{ scale: isSubmitted ? 1 : 0.98 }}
                                            onClick={() => handleSelect(i)}
                                            className={`${classes} ${hesitationLevel === 1 && !isSubmitted ? "animate-pulse" : ""}`}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border-2 transition-colors ${isSelected || isCorrect || isWrong ? "bg-white border-current" : "bg-white/50 border-slate-200 text-slate-400 group-hover:text-primary-600"}`}>
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                                <span className="text-base font-extrabold tracking-tight">{opt}</span>
                                            </div>
                                            {icon}
                                        </motion.div>
                                    )
                                })}
                            </div>

                            {/* Confidence Slider */}
                            {!isSubmitted && (
                                <div className="mt-10 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 italic transition-all shadow-inner">
                                    <div className="flex justify-between mb-4">
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Confidence Index</span>
                                        <span className={`text-xs font-black uppercase tracking-widest ${confidence > 3 ? 'text-emerald-500' : 'text-primary-600'}`}>
                                            {["Guessing", "Unsure", "Think so", "Fairly sure", "Certain"][confidence - 1]}
                                        </span>
                                    </div>
                                    <input type="range" min="1" max="5" value={confidence} onChange={(e) => setConfidence(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
                                </div>
                            )}

                            {/* Hints Section */}
                            {!isSubmitted && (
                                <div className="mt-6 flex flex-col gap-3">
                                    {hintsShown < 3 && (
                                        <button onClick={() => setHintsShown(h => h + 1)} className="self-start px-4 py-2 rounded-xl bg-white border-2 border-emerald-100 text-emerald-600 text-xs font-black uppercase tracking-widest shadow-sm hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                                            <Sparkles size={16} /> Unlock Hint ({3 - hintsShown})
                                        </button>
                                    )}

                                    <AnimatePresence>
                                        {Array.from({ length: hintsShown }).map((_, idx) => (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} key={idx}
                                                className="p-4 rounded-xl bg-emerald-50 border-l-4 border-emerald-400 text-xs text-emerald-800 font-bold leading-relaxed shadow-sm italic">
                                                <strong className="opacity-50 mr-2 uppercase tracking-tighter">AI Hint {idx + 1}:</strong> {question.hints[idx]}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Hesitation Banner */}
                        <AnimatePresence>
                            {hesitationLevel === 2 && !isSubmitted && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-orange-50 rounded-2xl p-4 border border-orange-200 mb-6 flex items-center gap-3 text-orange-800 italic shadow-lg shadow-orange-500/5">
                                    <AlertCircle size={20} className="text-orange-500" />
                                    <span className="text-xs font-black uppercase tracking-tight">System detected hesitation. Take your time or try a hint!</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {isSubmitted && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-emerald-50/80 backdrop-blur-sm rounded-[2.5rem] p-8 border border-emerald-200 mb-8 shadow-xl shadow-emerald-500/10">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                                                <Sparkles size={18} />
                                            </div>
                                            <h4 className="text-lg font-black tracking-tighter uppercase italic text-emerald-900">Adaptive Insights</h4>
                                        </div>
                                        <div className="flex bg-white/50 p-1 rounded-xl border border-emerald-100">
                                            {["ELI5", "Deep Dive"].map(d => (
                                                <button key={d} onClick={() => updateDepth(d)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${explanationDepth === d ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "text-emerald-500 hover:bg-emerald-100"}`}>
                                                    {d}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="text-emerald-400 mt-1 flex-shrink-0">
                                            <AlertCircle size={22} />
                                        </div>
                                        <p className="text-sm leading-relaxed text-emerald-900 font-bold italic">
                                            {explanationDepth === "ELI5" 
                                                ? `Simplified logic: ${question.explanation.split('.')[0]}. Basically, it's just like how nature finds the easiest path!`
                                                : question.explanation
                                            }
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex justify-end relative z-20">
                            {!isSubmitted ? (
                                <button onClick={handleSubmit} disabled={selectedOption === null} 
                                    className={`px-10 py-4 rounded-2xl font-black text-base shadow-2xl transition-all flex items-center gap-3 ${selectedOption !== null ? "bg-slate-950 text-white hover:bg-slate-900 shadow-slate-950/20 hover:-translate-y-1 active:scale-95" : "bg-slate-100 text-slate-300 cursor-not-allowed"}`}>
                                    Check Result
                                </button>
                            ) : (
                                <button onClick={handleNext} 
                                    className="px-10 py-4 rounded-2xl bg-primary-600 text-white font-black text-base shadow-2xl shadow-primary-600/20 hover:bg-primary-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 group">
                                    {currentQuestion < mockQuiz.length - 1 ? "Advance Phase" : "Analyze Performance"} 
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>
                    </motion.main>
                ) : (
                    <motion.main key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-2xl relative z-10 text-center">

                        <div className="bg-white rounded-[3rem] p-12 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/40">
                            <div className={`w-24 h-24 rounded-full ${score === mockQuiz.length ? "bg-emerald-50 text-emerald-500 shadow-emerald-500/10" : "bg-primary-50 text-primary-500 shadow-primary-500/10"} mx-auto mb-8 flex items-center justify-center text-5xl shadow-2xl`}>
                                {score === mockQuiz.length ? "🎖️" : "🚀"}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase italic">
                                {score === mockQuiz.length ? "Phase Mastered!" : "Logic Calibrated!"}
                            </h2>
                            <p className="text-lg text-slate-500 mb-10 font-bold italic">
                                Assessment complete. Accuracy: <span className="text-slate-900">{(score / mockQuiz.length * 100).toFixed(0)}%</span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={handleRestart} className="px-8 py-4 rounded-2xl bg-slate-50 text-slate-500 border border-slate-200 font-black text-sm uppercase tracking-widest hover:bg-white hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                    <RefreshCw size={18} /> Recalibrate
                                </button>
                                <button onClick={() => navigate("/dashboard")} className="px-10 py-4 rounded-2xl bg-slate-950 text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-slate-950/20 hover:bg-slate-900 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                                    Return to HQ <ArrowLeft size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.main>
                )}
            </AnimatePresence>
        </div>
    );
}
