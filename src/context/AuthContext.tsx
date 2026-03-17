import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { API_BASE } from "@/lib/api";

interface User {
  id: number;
  email: string;
  name: string;
  age?: number | null;
  phone_number?: string | null;
  gender?: string | null;
  experience_status?: string | null;
  years_of_experience?: number | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData?: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          throw new Error("Token expired");
        }
        
        // Fetch fresh user data including new profile fields
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        
        if (!res.ok) throw new Error("Failed to fetch user");
        
        const data = await res.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (token: string, userData?: User) => {
    localStorage.setItem("token", token);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(userData || { id: payload.id, email: payload.email, name: payload.name || "User" });
      setIsAuthenticated(true);
    } catch (e) {
      console.error("Invalid token structure");
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {}
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
