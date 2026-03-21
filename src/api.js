// Central API helper — replaces all Firebase calls
const BASE = "assignment-tracker-production-b915.up.railway.app";

const api = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

// ── Auth ──────────────────────────────────────────
export const authAPI = {
  me:       ()      => api("/auth/me"),
  login:    (body)  => api("/auth/login",    { method: "POST", body }),
  register: (body)  => api("/auth/register", { method: "POST", body }),
  logout:   ()      => api("/auth/logout",   { method: "POST" }),
};

// ── Assignments ───────────────────────────────────
export const assignmentAPI = {
  getAll:       ()         => api("/assignments"),
  getByStudent: (uid)      => api(`/assignments/student/${uid}`),
  create:       (body)     => api("/assignments",       { method: "POST",   body }),
  bulkCreate:   (body)     => api("/assignments/bulk",  { method: "POST",   body }),
  update:       (id, body) => api(`/assignments/${id}`, { method: "PATCH",  body }),
  remove:       (id)       => api(`/assignments/${id}`, { method: "DELETE" }),
};

// ── Users (admin) ─────────────────────────────────
export const userAPI = {
  getAll: ()    => api("/users"),
  getOne: (id)  => api(`/users/${id}`),
  remove: (id)  => api(`/users/${id}`, { method: "DELETE" }),
};
