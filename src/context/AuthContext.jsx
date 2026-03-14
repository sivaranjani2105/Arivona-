import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("arviona_user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("arviona_user");
      }
    }
    return null;
  });
  const [explanationDepth, setExplanationDepth] = useState(() => {
    return localStorage.getItem("arviona_depth") || "ELI5";
  });
  const [loading] = useState(false);

  const updateDepth = (depth) => {
    setExplanationDepth(depth);
    localStorage.setItem("arviona_depth", depth);
  };

  const login = (userData) => {
    const fullUser = {
      ...userData,
      masteryScore: userData.masteryScore || 0,
      streak: 3,
      conceptsLearned: 128,
      lastActive: new Date().toISOString()
    };
    localStorage.setItem("arviona_user", JSON.stringify(fullUser));
    setUser(fullUser);
  };

  const updateUser = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("arviona_user", JSON.stringify(updated));
      return updated;
    });
  };

  const loginWithGoogle = () => {
    const googleUser = {
      email: "google.student@arviona.edu",
      name: "Google Student",
      masteryScore: 45,
      streak: 5,
      conceptsLearned: 212,
      lastActive: new Date().toISOString(),
      isGoogleUser: true
    };
    localStorage.setItem("arviona_user", JSON.stringify(googleUser));
    setUser(googleUser);
  };

  const logout = () => {
    localStorage.removeItem("arviona_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, updateUser, loginWithGoogle,
      explanationDepth, updateDepth,
      isAuthenticated: !!user, loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
