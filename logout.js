// logout.js - replaces Firebase signOut
import { clearToken } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearToken();
    window.location.replace("login.html");
  });
});
