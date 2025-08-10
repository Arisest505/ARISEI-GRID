// components/RequirePlanAccess.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Asegúrate de tener @types/react instalado para que JSX.Element sea reconocido
import React from "react";

export default function RequirePlanAccess({ children }: { children: React.ReactNode }) {
 const { user, loading } = useAuth();

if (loading) return <p>Cargando...</p>;

 const rol = user?.rol;

 // Solución del error 18048: Validar que user?.permisos existe antes de usar .length
 const tienePermisos = user?.permisos && user.permisos.length > 0;

 const isUsuarioPRO = rol?.startsWith("Usuario-PRO");

const accesoPermitido =
 rol === "Administrador" ||
rol === "Contador" ||
(isUsuarioPRO && tienePermisos);

 if (!accesoPermitido) {
return <Navigate to="/default" replace />;
 }

 return children;
}