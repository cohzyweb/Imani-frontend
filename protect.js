// protect.js - Route guard for admin pages (replaces Firebase onAuthStateChanged)
import { getToken, clearToken } from "./api.js";

const token = getToken();

if (!token) {
  window.location.replace("login.html");
} else {
  // Optionally verify token with server
  fetch("/api/auth/verify", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.valid) {
        clearToken();
        window.location.replace("login.html");
      }
    })
    .catch(() => {
      // If server is unreachable, keep the user in (token still in storage)
    });
}
