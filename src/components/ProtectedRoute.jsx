import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 font-sans">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 relative">
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="absolute inset-0 border-4 border-primary-600 border-t-transparent rounded-full" />
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Verifying Access...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
