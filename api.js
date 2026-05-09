const API_BASE = "/api";

export function getToken() {
  return localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
}

export function setToken(token, remember = false) {
  if (remember) {
    localStorage.setItem("adminToken", token);
  } else {
    sessionStorage.setItem("adminToken", token);
  }
}

export function clearToken() {
  localStorage.removeItem("adminToken");
  sessionStorage.removeItem("adminToken");
}

export function isLoggedIn() {
  return !!getToken();
}

export async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (res.status === 401) {
    clearToken();
    window.location.replace("login.html");
    return;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export function pollData(fetchFn, callback, interval = 5000) {
  let active = true;

  async function run() {
    try {
      const data = await fetchFn();
      if (active && data) callback(data);
    } catch (e) {
      console.error("Polling error:", e.message);
    }
    if (active) setTimeout(run, interval);
  }

  run();

  return () => { active = false; };
}