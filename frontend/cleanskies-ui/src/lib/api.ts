const API_BASE = import.meta.env.VITE_API_URL ?? "";

export const api = {
  // Register
  register: (body: { username: string; email: string; password: string }) =>
    fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => res.json()),

  // Login - returns access token
  login: async (username: string, password: string) => {
    const form = new URLSearchParams();
    form.set("username", username);
    form.set("password", password);

    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Login failed");
    }

    return res.json(); // { access_token, token_type }
  },

  // Get current user info
  me: async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_BASE}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return res.json(); // Should return User object
  },

  // Update current user info
  updateMe: (body: Record<string, unknown>) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    return fetch(`${API_BASE}/me`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },

  // Trends data (protected)
  trends: (zipcode: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    return fetch(`${API_BASE}/api/data/trends/${zipcode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch trends");
      return res.json();
    });
  },

  // Chat endpoint (public)
  chat: (payload: {
    question: string;
    zip_code?: string;
    health_issue?: string;
    activity?: string;
  }) =>
    fetch(`${API_BASE}/chat/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(
      (res) => res.json() as Promise<{ answer: string; active_zip: string }>
    ),
};
