import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContextObject";
import type { User } from "./AuthContextTypes";

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
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
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