const BASE_URL = "http://localhost:5000/api"; // Ajusta si usas proxy

export async function fetchModulos() {
  const res = await fetch(`${BASE_URL}/modulos`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("No se pudieron cargar los módulos");
  return res.json();
}

export async function updateAccesos(rolId: string, permisos: { permisoId: string; otorgado: boolean }[]) {
  const res = await fetch(`${BASE_URL}/modulos/permisos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ rolId, permisos }),
  });

  if (!res.ok) throw new Error("No se pudieron actualizar los accesos");
  return res.json();
}

export async function cambiarRolUsuario(userId: string, nuevoRolId: string) {
  const res = await fetch(`${BASE_URL}/modulos/cambiar-rol`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ userId, nuevoRolId }),
  });

  if (!res.ok) throw new Error("No se pudo cambiar el rol del usuario");
  return res.json();
}
