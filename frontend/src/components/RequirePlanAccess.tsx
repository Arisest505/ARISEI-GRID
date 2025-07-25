// components/RequirePlanAccess.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RequirePlanAccess({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  const rol = user?.rol;
  const tienePermisos = user?.permisos?.length > 0;

  const accesoPermitido = rol === "Administrador" || rol === "Contador" || (rol === "Usuario-PRO" && tienePermisos);

  if (!accesoPermitido) {
    return <Navigate to="/default" replace />;
  }

  return children;
}
