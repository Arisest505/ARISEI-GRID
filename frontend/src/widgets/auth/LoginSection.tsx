// src/widgets/auth/LoginSection.tsx
import { useState } from "react";

export default function LoginSection({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de autenticación futura
    console.log("Login con:", email, password);
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="submit"
          className="w-full bg-cyan-700 text-white py-2 rounded-lg hover:bg-cyan-800 transition"
        >
          Ingresar
        </button>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
        ¿No tienes cuenta?{' '}
        <button onClick={onSwitch} className="text-cyan-600 hover:underline">
          Regístrate aquí
        </button>
      </p>
    </div>
  );
}