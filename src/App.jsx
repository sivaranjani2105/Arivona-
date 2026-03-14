import { lazy, Suspense } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Features = lazy(() => import("./pages/Features"));
const Estimate = lazy(() => import("./pages/Estimate"));
const Flashcards = lazy(() => import("./pages/Flashcards"));

const PageLoader = () => (
  <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-white font-sans">
    <div className="w-16 h-16 relative mb-8">
      <div className="absolute inset-0 border-4 border-white/10 rounded-2xl" />
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-2xl" />
      <div className="absolute inset-0 flex items-center justify-center text-2xl">⚡</div>
    </div>
    <div className="text-xs font-black uppercase tracking-[0.3em] animate-pulse text-slate-400 italic">Initializing Arviona Hub</div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/quiz" element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            } />
            <Route path="/flashcards" element={
              <ProtectedRoute>
                <Flashcards />
              </ProtectedRoute>
            } />
            <Route path="/features" element={<Features />} />
            <Route path="/estimate" element={<Estimate />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
