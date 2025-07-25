import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { LogOut, ArrowRight } from "lucide-react";

export default function DefaultPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.rol !== "Usuario") {
      navigate("/"); // Redirigir a Home si no es rol "Usuario"
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-center text-cyan-700">
          Bienvenido, {user?.nombre || "Usuario"}
        </h1>

        <p className="mb-6 text-center text-gray-700">
          Actualmente estás registrado con el rol de <strong>Usuario Básico</strong>.
          Para acceder a las funcionalidades premium del sistema, necesitas activar un plan.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/plans")}
            className="flex items-center justify-center gap-2 px-4 py-2 text-white rounded bg-cyan-600 hover:bg-cyan-700"
          >
            Ver Planes Disponibles <ArrowRight size={18} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
          >
            Cerrar sesión <LogOut size={16} />
          </button>
        </div>
      </div>
    </main>
  );
}
