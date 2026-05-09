// auth.js - Admin authentication (replaces Firebase auth)
import { apiRequest, setToken, clearToken } from "./api.js";

// ============================================
// SIGNUP
// ============================================
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const data = await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      setToken(data.token, true);
      alert("Admin account created!");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// ============================================
// PASSWORD STRENGTH
// ============================================
const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

if (passwordInput && strengthBar && strengthText) {
  passwordInput.addEventListener("input", () => {
    const value = passwordInput.value;
    let strength = 0;

    if (value.length >= 6) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;

    switch (strength) {
      case 0:
      case 1:
        strengthBar.style.width = "25%";
        strengthBar.style.background = "#dc2626";
        strengthText.textContent = "Weak password";
        strengthText.style.color = "#dc2626";
        break;
      case 2:
        strengthBar.style.width = "50%";
        strengthBar.style.background = "#f59e0b";
        strengthText.textContent = "Moderate password";
        strengthText.style.color = "#f59e0b";
        break;
      case 3:
        strengthBar.style.width = "75%";
        strengthBar.style.background = "#2563eb";
        strengthText.textContent = "Strong password";
        strengthText.style.color = "#2563eb";
        break;
      case 4:
        strengthBar.style.width = "100%";
        strengthBar.style.background = "#16a34a";
        strengthText.textContent = "Very strong password";
        strengthText.style.color = "#16a34a";
        break;
    }
  });
}

// ============================================
// SHOW/HIDE PASSWORD
// ============================================
function setupToggle(inputId, toggleId) {
  const input = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);
  if (!input || !toggle) return;

  toggle.addEventListener("click", () => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    const icon = toggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-eye");
      icon.classList.toggle("fa-eye-slash");
    }
  });
}

setupToggle("password", "togglePassword");
setupToggle("confirmPassword", "toggleConfirmPassword");

// ============================================
// LOGIN
// ============================================
const loginForm = document.getElementById("loginForm");
const errorBox = document.getElementById("errorBox");
const rememberMe = document.getElementById("rememberMe");
const forgotPassword = document.getElementById("forgotPassword");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (errorBox) errorBox.style.display = "none";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const remember = rememberMe && rememberMe.checked;

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, rememberMe: remember })
      });

      setToken(data.token, remember);
      window.location.href = "dashboard.html";
    } catch (error) {
      if (errorBox) {
        errorBox.innerText = error.message;
        errorBox.style.display = "block";
      } else {
        alert(error.message);
      }
    }
  });
}

// ============================================
// FORGOT PASSWORD
// ============================================
if (forgotPassword) {
  forgotPassword.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email")?.value;
    if (!email) {
      if (errorBox) {
        errorBox.innerText = "Please enter your email first.";
        errorBox.style.display = "block";
      }
      return;
    }

    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });

      if (errorBox) {
        errorBox.style.color = "green";
        errorBox.innerText = "Password reset email sent successfully.";
        errorBox.style.display = "block";
      }
    } catch (error) {
      if (errorBox) {
        errorBox.innerText = error.message;
        errorBox.style.display = "block";
      }
    }
  });
}
