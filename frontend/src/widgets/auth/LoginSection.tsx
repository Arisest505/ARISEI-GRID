import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";
import { apiFetch } from "../../lib/api";
export default function LoginSection({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const navigate = useNavigate();
  const { login, reloadUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
     const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "🎉 Inicio de sesión exitoso 🎉" });

        localStorage.setItem("token", data.token);
        login(data.user);      // Actualiza el contexto
        reloadUser();          // Asegura sincronización completa

        setTimeout(() => {
        const rol = data.user.rol;
        const tienePlan = Array.isArray(data.user.permisos) && data.user.permisos.length > 0;

        if (rol?.startsWith("Usuario") && !tienePlan) {
          console.log("Usuario logueado:", data.user);
          navigate("/default");
        } else {
          navigate("/foro");
        }

        }, 1000);
      } else {
        setMessage({ type: "error", text: data.error || "Credenciales incorrectas" });
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setMessage({ type: "error", text: "Error de servidor. Intenta más tarde." });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
      <h2 className="mb-4 text-2xl font-bold text-center text-black">Iniciar sesión</h2>

      {message && (
        <div
          className={`p-3 text-sm text-center rounded-lg mb-4 ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 pr-10 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 focus:outline-none"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 text-black transition rounded-lg hover:text-white bg-cyan-400 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-60 hover:shadow-lg hover:shadow-cyan-300 hover:-translate-y-0.5 hover:scale-105 shadow-sm"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>

      <p className="mt-4 text-sm text-center text-gray-600">
        ¿No tienes cuenta?{" "}
        <button onClick={onSwitch} className="text-cyan-600 hover:underline">
          Regístrate aquí
        </button>
      </p>
    </div>
  );


}
