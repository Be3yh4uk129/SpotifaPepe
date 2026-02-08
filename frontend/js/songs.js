import { apiRequest, renderNav, requireAuth, esc } from "./common.js";

requireAuth();
renderNav("songs");

const list = document.getElementById("list");
const msg = document.getElementById("msg");

function setMsg(t) { msg.textContent = t || ""; }

function songCard(s) {
  const cover = s.coverUrl || s.albumId?.coverUrl || "";
  const artist = s.artistId?.name || "Unknown artist";
  const album = s.albumId?.title || "—";
  const badge = s.external?.itunesTrackId ? `<span class="badge">iTunes linked</span>` : "";

  return `
    <div class="card item">
      <img class="cover" src="${cover ? esc(cover) : ""}" alt="" onerror="this.style.display='none'"/>
      <div>
        <div class="row" style="justify-content:space-between">
          <div>
            <div class="title">${esc(s.title)}</div>
            <div class="meta">${esc(artist)} • ${esc(album)} ${badge}</div>
          </div>
          <div class="actions">
            <button data-enrich="${esc(s._id)}">Enrich</button>
          </div>
        </div>
        ${s.previewUrl ? `<audio controls src="${esc(s.previewUrl)}"></audio>` : ""}
        ${s.coverUrl ? `<div class="small">coverUrl saved ✅</div>` : `<div class="small">no coverUrl yet</div>`}
      </div>
    </div>
  `;
}

async function loadSongs(search = "") {
  setMsg("Loading...");
  list.innerHTML = "";
  try {
    const data = await apiRequest(`/api/songs?search=${encodeURIComponent(search)}`);
    const items = data.items || [];
    if (!items.length) setMsg("No songs found.");
    else setMsg(`Found: ${items.length}`);
    list.innerHTML = items.map(songCard).join("");

    // enrich handlers
    document.querySelectorAll("button[data-enrich]").forEach(btn => {
      btn.onclick = async () => {
        const id = btn.getAttribute("data-enrich");
        btn.disabled = true;
        btn.textContent = "Enriching...";
        try {
          await apiRequest(`/api/external/songs/${id}/enrich`, { method: "POST" });
          await loadSongs(search);
        } catch (e) {
          setMsg("❌ " + e.message);
        } finally {
          btn.disabled = false;
          btn.textContent = "Enrich";
        }
      };
    });

  } catch (e) {
    setMsg("❌ " + e.message);
  }
}

btnSearch.onclick = () => loadSongs(q.value.trim());
btnAll.onclick = () => loadSongs("");

loadSongs("");
