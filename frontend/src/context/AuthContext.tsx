import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Tipos
interface PermisoModulo {
  permiso: string;
  modulo: string;
  path: string;
  icono: string;
}

interface PlanActivo {
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
}

interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  codigo_usuario: string;
  permisos: PermisoModulo[];
  plan_activo: PlanActivo | null;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
  reloadUser: () => void;
}

// Crear contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor
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
    // Ya no usamos window.location.href
  };

  const reloadUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        if (user !== null) setUser(null);
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
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
