// Cliente HTTP minimalista con soporte JWT, JSON, querystring y multipart.

const BASE_URL = import.meta?.env?.VITE_API_URL || "http://localhost:4002";
const TOKEN_KEY = "tu_jwt";

export const getToken = () => localStorage.getItem(TOKEN_KEY) || "";
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t || "");
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const toQuery = (obj = {}) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(typeof v === "string" ? v : JSON.stringify(v))}`)
    .join("&");

export async function request(path, { method = "GET", data, query, headers, isForm } = {}) {
  const url = `${BASE_URL}${path}${query ? `?${toQuery(query)}` : ""}`;

  const h = {
    ...(isForm ? {} : { "Content-Type": "application/json" }),
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...headers,
  };

  const body = isForm ? data : data ? JSON.stringify(data) : undefined;

  const res = await fetch(url, { method, headers: h, body });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = json?.message || json?.error || res.statusText;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = json;
    throw err;
  }
  return json;
}
