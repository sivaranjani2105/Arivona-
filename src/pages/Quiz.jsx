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

export default function Quiz() {
    const navigate = useNavigate();
    const { user, updateUser, explanationDepth, updateDepth } = useAuth();
    const [mockQuiz, setMockQuiz] = useState([]);
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
    const [previousMastery, setPreviousMastery] = useState(user?.masteryScore || 45);
    const [masteryDelta, setMasteryDelta] = useState(0);
    const [showDelta, setShowDelta] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("arviona_user");
        let grade = "High School";
        if (stored) {
            const profile = JSON.parse(stored);
            if (profile.grade) grade = profile.grade;
        }

        // Filter questions by grade, or include some backups if none match
        const filtered = allQuestions.filter(q => q.grade === grade || grade === "College");
        setMockQuiz(filtered.length > 0 ? filtered : allQuestions);
    }, []);

    const question = mockQuiz[currentQuestion];

    // Timer and Hesitation logic
    useEffect(() => {
        if (showResults || isSubmitted || !question) return;

        const interval = setInterval(() => {
            setTimeElapsed(t => {
                const newTime = t + 1;
                const expected = question?.expected_time || 60;
                
                // Hesitation levels
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
        
        // Learner State Modeler Logic (simplified)
        let delta = 0;
        const expected = question.expected_time || 60;
        
        if (correct) {
            setScore(s => s + 1);
            if (timeElapsed < expected * 0.7) delta = 10;
            else if (timeElapsed > expected * 1.3) delta = 4;
            else delta = 7;
        } else {
            if (timeElapsed < 5) delta = -8; // Guessing signal
            else delta = -4;
        }

        // Adjust by confidence (Weighted AI Logic)
        const confidenceMultiplier = (confidence - 1) / 4; // 0 to 1
        if (correct) {
            delta = Math.ceil(delta * (0.8 + (confidenceMultiplier * 0.4))); // Reward high confidence correct answers
        } else {
            delta = Math.floor(delta * (1.2 - (confidenceMultiplier * 0.4))); // Penalize high confidence wrong answers
        }

        setPreviousMastery(masteryScore);
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
            // Push final mastery level to global auth state
            const finalScore = score;
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

    // Mastery Meter Component
    const MasteryMeter = ({ score, delta, showDelta }) => {
        const radius = 35;
        const circ = 2 * Math.PI * radius;
        const offset = circ - (score / 100) * circ;
        
        let color = "#2563EB";
        let label = "Building foundation";
        if (score >= 95) { color = "#D97706"; label = "Mastered ✦"; }
        else if (score >= 80) { color = "#14B8A6"; label = "Strong"; }
        else if (score >= 60) { color = "#2563EB"; label = "Good grasp"; }
        else if (score >= 40) { color = "#F59E0B"; label = "Getting there"; }
        else { color = "#EF4444"; label = "Building foundation"; }

        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative" }}>
                <div style={{ position: "relative", width: 80, height: 80 }}>
                    <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="40" cy="40" r={radius} fill="transparent" stroke="#E2E8F0" strokeWidth="6" />
                        <circle cx="40" cy="40" r={radius} fill="transparent" stroke={color} strokeWidth="6"
                            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 1.2s ease-out, stroke 0.3s" }} />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#0F172A" }}>
                        {score}%
                    </div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                
                <AnimatePresence>
                    {showDelta && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: -20 }} exit={{ opacity: 0 }}
                            style={{ position: "absolute", top: 0, right: -20, fontWeight: 800, color: delta > 0 ? "#10B981" : "#EF4444", fontSize: 14 }}>
                            {delta > 0 ? `+${delta}` : delta}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div style={{
            minHeight: "100vh", background: "linear-gradient(135deg, #F8FAFF 0%, #EEF4FF 40%, #FFF8F0 100%)",
            fontFamily: "'DM Sans', sans-serif", color: "#0F172A", padding: 24, display: "flex", flexDirection: "column",
            alignItems: "center", position: "relative", overflow: "hidden"
        }}>
            {/* Decorative */}
            <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)" }} />
            <div style={{ position: "absolute", bottom: -150, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)" }} />

            {/* Header */}
            <header style={{ width: "100%", maxWidth: 1000, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, position: "relative", zIndex: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <button  onClick={() => navigate("/dashboard")} style={{
                        padding: "10px 16px", borderRadius: 12, background: "#fff", border: "1px solid #E2E8F0",
                        color: "#475569", fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.02)", 
                    }}>
                        <ArrowLeft size={18} /> Exit
                    </button>
                    <MasteryMeter score={masteryScore} delta={masteryDelta} showDelta={showDelta} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ background: "#EEF2FF", padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#2563EB" }}>
                            {question.grade} Level
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#64748B" }}>
                            {showResults ? mockQuiz.length : currentQuestion + 1} / {mockQuiz.length}
                        </div>
                    </div>
                    <div style={{ width: 160, height: 8, background: "#E2E8F0", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${progressPct}%`, background: "#2563EB", transition: "width 0.4s ease" }} />
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {!showResults ? (
                    <motion.main key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                        style={{ width: "100%", maxWidth: 680, position: "relative", zIndex: 10, willChange: "transform, opacity" }}>

                        <div style={{ background: "#fff", borderRadius: 24, padding: "40px", border: "1px solid #E2E8F0", boxShadow: "0 12px 40px rgba(0,0,0,0.04)", marginBottom: 24 }}>
                            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 32, lineHeight: 1.4, color: "#0F172A" }}>
                                {question.question}
                            </h2>

                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {question.options.map((opt, i) => {
                                    const isSelected = selectedOption === i;
                                    const isCorrect = isSubmitted && i === question.correct;
                                    const isWrong = isSubmitted && isSelected && i !== question.correct;

                                    let bgColor = "#FAFBFF";
                                    let borderColor = "#EEF2FF";
                                    let textColor = "#1E293B";
                                    let icon = null;

                                    if (isSubmitted) {
                                        if (isCorrect) {
                                            bgColor = "#ECFDF5"; borderColor = "#10B981"; textColor = "#065F46";
                                            icon = <CheckCircle2 size={20} color="#10B981" />;
                                        } else if (isWrong) {
                                            bgColor = "#FEF2F2"; borderColor = "#EF4444"; textColor = "#991B1B";
                                            icon = <XCircle size={20} color="#EF4444" />;
                                        } else {
                                            bgColor = "#F8FAFC"; borderColor = "#E2E8F0"; textColor = "#94A3B8";
                                        }
                                    } else if (isSelected) {
                                        bgColor = "#EFF6FF"; borderColor = "#2563EB"; textColor = "#1E40AF";
                                    }

                                    return (
                                        <motion.div  key={i} whileHover={{ scale: isSubmitted ? 1 : 1.01 }} whileTap={{ scale: isSubmitted ? 1 : 0.99 }}
                                            onClick={() => handleSelect(i)}
                                            style={{
                                                padding: "16px 20px", borderRadius: 16, background: bgColor, border: `2px solid ${borderColor}`,
                                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                                cursor: isSubmitted ? "default" : "none", transition: "all 0.2s",
                                                boxShadow: isSelected && !isSubmitted ? "0 4px 15px rgba(37,99,235,0.1)" : "none",
                                                animation: hesitationLevel === 1 && !isSubmitted ? "pulseBorder 2s infinite" : "none"
                                            }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: 10, background: isSelected || isCorrect || isWrong ? "#fff" : "#F1F5F9",
                                                    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14,
                                                    color: isSubmitted ? textColor : (isSelected ? "#2563EB" : "#64748B"),
                                                    border: `1px solid ${isSelected || isCorrect || isWrong ? borderColor : "transparent"}`
                                                }}>
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                                <span style={{ fontSize: 16, fontWeight: 600, color: textColor }}>{opt}</span>
                                            </div>
                                            {icon}
                                        </motion.div>
                                    )
                                })}
                            </div>

                            {/* Confidence Slider */}
                            {!isSubmitted && (
                                <div style={{ marginTop: 32, padding: "20px", borderRadius: 20, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: "#64748B" }}>Confidence Level</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: "#2563EB" }}>
                                            {["Guessing", "Unsure", "Think so", "Fairly sure", "Certain"][confidence - 1]}
                                        </span>
                                    </div>
                                    <input type="range" min="1" max="5" value={confidence} onChange={(e) => setConfidence(parseInt(e.target.value))}
                                        style={{ width: "100%", height: 6, borderRadius: 5, background: "#E2E8F0", outline: "none",  }} />
                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: "#94A3B8", fontWeight: 700 }}>
                                        <span>LOW</span>
                                        <span>HIGH</span>
                                    </div>
                                </div>
                            )}

                            {/* Hints Section */}
                            {!isSubmitted && (
                                <div style={{ marginTop: 24 }}>
                                    {hintsShown < 3 ? (
                                        <button  onClick={() => setHintsShown(h => h + 1)} style={{
                                            padding: "8px 16px", borderRadius: 10, background: "#fff", border: "1.5px solid #BBF7D0",
                                            color: "#059669", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8,
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.02)", 
                                        }}>
                                            <Sparkles size={16} /> Need a Hint? ({3 - hintsShown} left)
                                        </button>
                                    ) : null}

                                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
                                        {Array.from({ length: hintsShown }).map((_, idx) => (
                                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={idx}
                                                style={{ padding: "12px 16px", borderRadius: 14, background: "#F0FDF4", border: "1px solid #BBF7D0", fontSize: 14, color: "#166534", fontWeight: 500 }}>
                                                <strong style={{ opacity: 0.7 }}>Hint {idx + 1}:</strong> {question.hints[idx]}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Hesitation Banner */}
                        <AnimatePresence>
                            {hesitationLevel === 2 && !isSubmitted && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                    style={{ background: "#FFFBEB", borderRadius: 16, padding: "12px 20px", border: "1px solid #FDE68A", marginBottom: 24, display: "flex", alignItems: "center", gap: 12, color: "#92400E" }}>
                                    <AlertCircle size={20} />
                                    <span style={{ fontSize: 14, fontWeight: 600 }}>Take your time — or try a hint?</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {isSubmitted && (
                                <motion.div initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: 10, height: 0 }}
                                    style={{ background: "#F0FDF4", borderRadius: 20, padding: 24, border: "1px solid #BBF7D0", marginBottom: 24, color: "#166534" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <Sparkles size={18} color="#059669" />
                                            <h4 style={{ fontSize: 16, fontWeight: 800 }}>AI Explanation</h4>
                                        </div>
                                        <div style={{ display: "flex", background: "#fff", padding: "4px", borderRadius: 10, border: "1px solid #BBF7D0" }}>
                                            {["ELI5", "Deep Dive"].map(d => (
                                                <button key={d} onClick={() => updateDepth(d)} style={{
                                                    padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: "none",
                                                    background: explanationDepth === d ? "#059669" : "transparent",
                                                    color: explanationDepth === d ? "#fff" : "#64748B",
                                                    transition: "all 0.2s"
                                                }}>{d}</button>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                        <AlertCircle size={24} style={{ marginTop: 2, flexShrink: 0 }} />
                                        <div>
                                            <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.9 }}>
                                                {explanationDepth === "ELI5" 
                                                    ? `Imagine like this: ${question.explanation.split('.')[0]}. Basically, it's the simplest way to think about it!`
                                                    : question.explanation
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            {!isSubmitted ? (
                                <button  onClick={handleSubmit} disabled={selectedOption === null} style={{
                                    padding: "14px 32px", borderRadius: 14, background: selectedOption !== null ? "#0F172A" : "#CBD5E1",
                                    color: "#fff", border: "none", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 8,
                                    boxShadow: selectedOption !== null ? "0 8px 20px rgba(15,23,42,0.15)" : "none",
                                    transition: "all 0.2s", opacity: selectedOption !== null ? 1 : 0.7, 
                                }} onMouseEnter={e => selectedOption !== null && (e.currentTarget.style.transform = "translateY(-2px)")} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                                    Check Answer
                                </button>
                            ) : (
                                <button  onClick={handleNext} style={{
                                    padding: "14px 32px", borderRadius: 14, background: "#2563EB", color: "#fff", border: "none",
                                    fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 8,
                                    boxShadow: "0 8px 20px rgba(37,99,235,0.25)", transition: "all 0.2s", 
                                }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                                    {currentQuestion < mockQuiz.length - 1 ? "Next Question" : "View Results"} <ChevronRight size={20} />
                                </button>
                            )}
                        </div>
                    </motion.main>
                ) : (
                    <motion.main key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ width: "100%", maxWidth: 680, position: "relative", zIndex: 10, textAlign: "center" }}>

                        <div style={{ background: "#fff", borderRadius: 32, padding: "56px 40px", border: "1px solid #E2E8F0", boxShadow: "0 12px 40px rgba(0,0,0,0.04)" }}>
                            <div style={{ width: 96, height: 96, borderRadius: "50%", background: score === mockQuiz.length ? "#ECFDF5" : "#EFF6FF", margin: "0 auto 24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontSize: 40 }}>{score === mockQuiz.length ? "🎓" : "🔥"}</span>
                            </div>
                            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>
                                {score === mockQuiz.length ? "Perfect Score!" : "Great Effort!"}
                            </h2>
                            <p style={{ fontSize: 18, color: "#64748B", marginBottom: 32 }}>
                                You scored <strong style={{ color: "#0F172A" }}>{score}</strong> out of <strong style={{ color: "#0F172A" }}>{mockQuiz.length}</strong> questions correctly.
                            </p>

                            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                                <button  onClick={handleRestart} style={{
                                    padding: "16px 24px", borderRadius: 16, background: "#F1F5F9", color: "#475569", border: "none",
                                    fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s"
                                }} onMouseEnter={e => e.currentTarget.style.background = "#E2E8F0"} onMouseLeave={e => e.currentTarget.style.background = "#F1F5F9"}>
                                    <RefreshCw size={18} /> Retry Quiz
                                </button>
                                <button  onClick={() => navigate("/dashboard")} style={{
                                    padding: "16px 32px", borderRadius: 16, background: "#0F172A", color: "#fff", border: "none",
                                    fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 8,
                                    boxShadow: "0 8px 24px rgba(15,23,42,0.2)", transition: "transform 0.2s"
                                }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                                    Back to Dashboard <ArrowLeft size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.main>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes pulseBorder {
                    0% { border-color: #EEF2FF; }
                    50% { border-color: #2563EB; box-shadow: 0 0 15px rgba(37,99,235,0.2); }
                    100% { border-color: #EEF2FF; }
                }
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 18px;
                    width: 18px;
                    border-radius: 50%;
                    background: #2563EB;
                    box-shadow: 0 2px 10px rgba(37,99,235,0.3);
                    
                    margin-top: -6px;
                }
                input[type=range]::-moz-range-thumb {
                    height: 18px;
                    width: 18px;
                    border-radius: 50%;
                    background: #2563EB;
                    border: none;
                }
                input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 6px;
                    background: #E2E8F0;
                    border-radius: 5px;
                }
            `}</style>
        </div>
    );
}
