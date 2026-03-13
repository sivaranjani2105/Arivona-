import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #F8FAFF 0%, #EEF4FF 40%, #FFF8F0 100%)",
        fontFamily: "'DM Sans', sans-serif" 
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #E2E8F0", borderTopColor: "#2563EB", animation: "spin 1s linear infinite" }} />
          <span style={{ fontWeight: 600, color: "#64748B" }}>Verifying access...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
