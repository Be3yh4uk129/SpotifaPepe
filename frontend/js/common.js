// === CONFIG ===
export const API = "http://localhost:5000";

// === TOKEN ===
export function getToken() {
  return localStorage.getItem("token") || "";
}
export function setToken(t) {
  localStorage.setItem("token", t);
}
export function clearToken() {
  localStorage.removeItem("token");
}
export function logout() {
  clearToken();
  window.location.href = "login.html";
}

// === HELPERS ===
export function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function requireAuth() {
  const t = getToken();
  if (!t) window.location.href = "login.html";
}

export async function apiRequest(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

// === NAV ===
export function renderNav(active) {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const isAuthed = !!getToken();

  nav.innerHTML = `
    <div class="brand">🎵 Spotifa Pepe</div>
    <div class="row" style="margin:0">
      <a href="songs.html" ${active==="songs" ? 'style="background:rgba(110,168,254,.12)"' : ""}>Songs</a>
      <a href="playlists.html" ${active==="playlists" ? 'style="background:rgba(110,168,254,.12)"' : ""}>Playlists</a>
      <a href="admin.html" ${active==="admin" ? 'style="background:rgba(110,168,254,.12)"' : ""}>Admin</a>
      ${isAuthed ? `<a href="#" id="logoutLink">Logout</a>` : `<a href="login.html">Login</a>`}
    </div>
  `;

  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) logoutLink.onclick = (e) => { e.preventDefault(); logout(); };
}
