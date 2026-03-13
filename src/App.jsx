import { lazy, Suspense } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Features = lazy(() => import("./pages/Features"));
const Estimate = lazy(() => import("./pages/Estimate"));
const Flashcards = lazy(() => import("./pages/Flashcards"));

// Loading fallback component
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh', 
    background: '#0a0a0b',
    color: '#3b82f6'
  }}>
    <div className="animate-pulse">Loading Arvio...</div>
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
