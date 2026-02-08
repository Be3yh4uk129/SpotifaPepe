import { apiRequest, renderNav, setToken, getToken } from "./common.js";

renderNav("login");

const out = document.getElementById("out");
const json = document.getElementById("json");

function show(msg, data) {
  out.textContent = msg || "";
  if (data) {
    json.style.display = "block";
    json.textContent = JSON.stringify(data, null, 2);
  } else {
    json.style.display = "none";
    json.textContent = "";
  }
}

btnRegister.onclick = async () => {
  try {
    const data = await apiRequest("/api/auth/register", {
      method: "POST",
      body: { name: regName.value, email: regEmail.value, password: regPass.value }
    });
    setToken(data.token);
    show("✅ Registered. Redirecting to Songs...", data);
    setTimeout(() => window.location.href = "songs.html", 600);
  } catch (e) {
    show("❌ " + e.message);
  }
};

btnLogin.onclick = async () => {
  try {
    const data = await apiRequest("/api/auth/login", {
      method: "POST",
      body: { email: logEmail.value, password: logPass.value }
    });
    setToken(data.token);
    show("✅ Logged in. Redirecting to Songs...", data);
    setTimeout(() => window.location.href = "songs.html", 600);
  } catch (e) {
    show("❌ " + e.message);
  }
};

btnMe.onclick = async () => {
  try {
    const data = await apiRequest("/api/me", { auth: true });
    show(getToken() ? "✅ Token OK" : "⚠️ No token", data);
  } catch (e) {
    show("❌ " + e.message);
  }
};
