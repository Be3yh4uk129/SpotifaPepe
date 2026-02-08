import { apiRequest, renderNav, requireAuth, esc } from "./common.js";

requireAuth();
renderNav("playlists");

const msg = document.getElementById("msg");
const pls = document.getElementById("pls");
const openView = document.getElementById("openView");

function setMsg(t){ msg.textContent = t || ""; }

function plCard(p){
  return `
    <div class="card">
      <div class="row" style="justify-content:space-between">
        <div>
          <div class="title">${esc(p.title)}</div>
          <div class="small">id: ${esc(p._id)}</div>
        </div>
        <div class="actions">
          <button data-open="${esc(p._id)}">Open</button>
          <button class="danger" data-del="${esc(p._id)}">Delete</button>
        </div>
      </div>
      <hr/>
      <div class="row">
        <input data-rename-input="${esc(p._id)}" placeholder="new title..." />
        <button data-rename="${esc(p._id)}">Rename</button>
      </div>
    </div>
  `;
}

async function loadPlaylists(){
  setMsg("Loading...");
  pls.innerHTML = "";
  try{
    const data = await apiRequest("/api/playlists", { auth:true });
    const items = data.items || [];
    setMsg(items.length ? `Your playlists: ${items.length}` : "No playlists yet.");
    pls.innerHTML = items.map(plCard).join("");

    document.querySelectorAll("button[data-open]").forEach(b=>{
      b.onclick = () => { openId.value = b.getAttribute("data-open"); openPlaylist(openId.value); };
    });

    document.querySelectorAll("button[data-del]").forEach(b=>{
      b.onclick = async () => {
        const id = b.getAttribute("data-del");
        if (!confirm("Delete playlist?")) return;
        try{
          await apiRequest(`/api/playlists/${id}`, { method:"DELETE", auth:true });
          await loadPlaylists();
          openView.innerHTML = "";
        }catch(e){ setMsg("❌ " + e.message); }
      };
    });

    document.querySelectorAll("button[data-rename]").forEach(b=>{
      b.onclick = async () => {
        const id = b.getAttribute("data-rename");
        const input = document.querySelector(`input[data-rename-input="${CSS.escape(id)}"]`);
        const title = (input?.value || "").trim();
        if (!title) return setMsg("Enter new title");
        try{
          await apiRequest(`/api/playlists/${id}`, { method:"PUT", auth:true, body:{ title } });
          await loadPlaylists();
        }catch(e){ setMsg("❌ " + e.message); }
      };
    });

  }catch(e){
    setMsg("❌ " + e.message);
  }
}

function renderOpen(p){
  const songs = p.songIds || [];
  const songsHtml = songs.length ? songs.map(s => `
    <div class="card item" style="margin-top:10px;">
      <img class="cover" src="${esc(s.coverUrl || s.albumId?.coverUrl || "")}" onerror="this.style.display='none'" />
      <div>
        <div class="title">${esc(s.title)}</div>
        <div class="meta">${esc(s.artistId?.name || "")}</div>
        ${s.previewUrl ? `<audio controls src="${esc(s.previewUrl)}"></audio>` : ""}
        <div class="actions">
          <button class="danger" data-rm="${esc(p._id)}:${esc(s._id)}">Remove</button>
        </div>
      </div>
    </div>
  `).join("") : `<div class="small">No songs in playlist yet.</div>`;

  openView.innerHTML = `
    <hr/>
    <div class="title">${esc(p.title)}</div>
    <div class="small">playlistId: ${esc(p._id)}</div>
    <hr/>
    <div class="row">
      <input id="addSongId" placeholder="songId to add" />
      <button id="btnAdd">Add song</button>
    </div>
    ${songsHtml}
  `;

  document.getElementById("btnAdd").onclick = async () => {
    const songId = (document.getElementById("addSongId").value || "").trim();
    if (!songId) return setMsg("Enter songId");
    try{
      await apiRequest(`/api/playlists/${p._id}/songs`, { method:"POST", auth:true, body:{ songId }});
      await openPlaylist(p._id);
    }catch(e){ setMsg("❌ " + e.message); }
  };

  document.querySelectorAll("button[data-rm]").forEach(b=>{
    b.onclick = async () => {
      const [plId, songId] = b.getAttribute("data-rm").split(":");
      try{
        await apiRequest(`/api/playlists/${plId}/songs/${songId}`, { method:"DELETE", auth:true });
        await openPlaylist(plId);
      }catch(e){ setMsg("❌ " + e.message); }
    };
  });
}

async function openPlaylist(id){
  if (!id) return;
  setMsg("Opening...");
  try{
    const data = await apiRequest(`/api/playlists/${id}`, { auth:true });
    renderOpen(data.item);
    setMsg("Opened ✅");
  }catch(e){
    setMsg("❌ " + e.message);
  }
}

btnCreate.onclick = async () => {
  const title = (plTitle.value || "").trim();
  if (!title) return setMsg("Enter title");
  try{
    await apiRequest("/api/playlists", { method:"POST", auth:true, body:{ title }});
    plTitle.value = "";
    await loadPlaylists();
    setMsg("Created ✅");
  }catch(e){ setMsg("❌ " + e.message); }
};

btnRefresh.onclick = loadPlaylists;
btnOpen.onclick = () => openPlaylist(openId.value.trim());

loadPlaylists();
