export const API = import.meta.env.VITE_API_URL; // p.ej. https://incidenet.onrender.com/api



export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(init.headers || {});

  // Solo pone Content-Type si no es FormData
  const isFormData = init.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API}${path}`, { ...init, headers });
  return res;
}
