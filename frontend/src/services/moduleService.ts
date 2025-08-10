// src/services/modulos.ts
import { apiFetch } from "../lib/api";

export async function fetchModulos() {
  const res = await apiFetch("/modulos");
  if (!res.ok) throw new Error("No se pudieron cargar los módulos");
  return res.json();
}

export async function updateAccesos(
  rolId: string,
  permisos: { permisoId: string; otorgado: boolean }[]
) {
  const res = await apiFetch("/modulos/permisos", {
    method: "POST",
    body: JSON.stringify({ rolId, permisos }),
  });
  if (!res.ok) throw new Error("No se pudieron actualizar los accesos");
  return res.json();
}

export async function cambiarRolUsuario(userId: string, nuevoRolId: string) {
  const res = await apiFetch("/modulos/cambiar-rol", {
    method: "POST",
    body: JSON.stringify({ userId, nuevoRolId }),
  });
  if (!res.ok) throw new Error("No se pudo cambiar el rol del usuario");
  return res.json();
}
