// Central API helper — uses JWT tokens instead of sessions
const BASE = "https://assignment-tracker-production-b915.up.railway.app/api";

const api = async (path, options = {}) => {
  // Get token from localStorage
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      // Send JWT token in Authorization header
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

// ── Auth ──────────────────────────────────────────
export const authAPI = {
  me: () => api("/auth/me"),

  login: async (body) => {
    const data = await api("/auth/login", { method: "POST", body });
    if (data.token) localStorage.setItem("token", data.token);
    return data;
  },

  register: async (body) => {
    const data = await api("/auth/register", { method: "POST", body });
    if (data.token) localStorage.setItem("token", data.token);
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },
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
