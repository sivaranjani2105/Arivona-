import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
        ? mockCards.sort((a, b) => (a.subject === user.weakSubject ? -1 : 1))
        : mockCards;

    const [cards, setCards] = useState(filteredCards);
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
        <div style={{
            minHeight: "100vh", background: "linear-gradient(135deg, #F8FAFF 0%, #EEF4FF 40%, #FFF8F0 100%)",
            fontFamily: "'DM Sans', sans-serif", color: "#0F172A", padding: 24, display: "flex", flexDirection: "column", alignItems: "center"
        }}>
            <header style={{ width: "100%", maxWidth: 1000, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 60 }}>
                <button onClick={() => navigate("/dashboard")} style={{
                    padding: "10px 16px", borderRadius: 12, background: "#fff", border: "1px solid #E2E8F0",
                    color: "#475569", fontWeight: 700, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
                }}>
                    <ArrowLeft size={18} /> Exit
                </button>
                <div style={{ textAlign: "center" }}>
                    <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.5px" }}>Active Recall</h1>
                    <p style={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>Mastering {cards.length} Concepts</p>
                </div>
                <div style={{ width: 100 }} />
            </header>

            <main style={{ width: "100%", maxWidth: 500, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
                <div style={{ position: "relative", width: "100%", perspective: 2000 }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4 }}
                            style={{ position: "relative", width: "100%", height: 320 }}
                        >
                            <motion.div
                                onClick={() => setIsFlipped(!isFlipped)}
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                                style={{
                                    width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", cursor: "pointer"
                                }}
                            >
                                {/* Front */}
                                <div style={{
                                    position: "absolute", inset: 0, background: "#fff", borderRadius: 32, padding: 40,
                                    border: "1px solid #E2E8F0", boxShadow: "0 20px 50px rgba(0,0,0,0.06)", backfaceVisibility: "hidden",
                                    display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center"
                                }}>
                                    <div style={{ position: "absolute", top: 24, left: 24, display: "flex", gap: 8 }}>
                                        <span style={{ padding: "4px 12px", borderRadius: 99, background: "#EFF6FF", color: "#2563EB", fontSize: 11, fontWeight: 700 }}>{card.subject}</span>
                                        <span style={{ padding: "4px 12px", borderRadius: 99, background: "#F1F5F9", color: "#64748B", fontSize: 11, fontWeight: 700 }}>{card.difficulty}</span>
                                    </div>
                                    <Brain size={48} color="#2563EB" style={{ marginBottom: 24, opacity: 0.2 }} />
                                    <h2 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.4 }}>{card.front}</h2>
                                    <p style={{ position: "absolute", bottom: 24, fontSize: 12, color: "#94A3B8", fontWeight: 600 }}>Click to Flip Card</p>
                                </div>

                                {/* Back */}
                                <div style={{
                                    position: "absolute", inset: 0, background: "linear-gradient(135deg, #2563EB, #7C3AED)", borderRadius: 32, padding: 40,
                                    boxShadow: "0 20px 50px rgba(37,99,235,0.2)", backfaceVisibility: "hidden", transform: "rotateY(180deg)",
                                    display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", color: "#fff"
                                }}>
                                    <Sparkles size={48} color="#fff" style={{ marginBottom: 24, opacity: 0.3 }} />
                                    <h2 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.6 }}>{card.back}</h2>
                                    <p style={{ position: "absolute", bottom: 24, fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Tap feedback below</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div style={{ display: "flex", gap: 16, width: "100%", opacity: isFlipped ? 1 : 0.3, transition: "opacity 0.3s", pointerEvents: isFlipped ? "auto" : "none" }}>
                    <button onClick={() => handleFeedback(false)} style={{
                        flex: 1, padding: "16px", borderRadius: 16, background: "#fff", border: "2px solid #FEF2F2",
                        color: "#EF4444", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s"
                    }} onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}>
                        <RefreshCw size={20} /> Still Learning
                    </button>
                    <button onClick={() => handleFeedback(true)} style={{
                        flex: 1, padding: "16px", borderRadius: 16, background: "#0F172A", border: "none",
                        color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s"
                    }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}>
                        <CheckCircle2 size={20} /> I Know It
                    </button>
                </div>

                <div style={{ width: "100%", background: "#E2E8F0", height: 6, borderRadius: 99, overflow: "hidden", marginTop: 20 }}>
                    <motion.div animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }} style={{ height: "100%", background: "#2563EB" }} />
                </div>
            </main>
        </div>
    );
}
