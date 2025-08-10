import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContextObject";
import type { User } from "./AuthContextTypes";
import { apiFetch } from "../lib/api"; // <- usa tu wrapper

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const reloadUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        if (user !== null) setUser(null);
        return;
      }

      const res = await apiFetch("/auth/me"); //  sin localhost

      // intenta parsear con fallback
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (res.ok && data) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } else if (res.status === 401) {
        // token inválido/expirado
        logout();
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error al recargar perfil:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
