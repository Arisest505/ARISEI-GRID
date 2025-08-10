export const API = import.meta.env.VITE_API_URL; // p.ej. https://incidenet.onrender.com/api

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API}${path}`, {
    ...init,
    headers,
    // credentials: "include", // <-- solo si usas cookies de sesión
  });
  return res;
}
