import { apiRequest, renderNav, requireAuth } from "./common.js";

requireAuth();
renderNav("admin");

const msg = document.getElementById("msg");
const json = document.getElementById("json");

function show(m, data){
  msg.textContent = m || "";
  json.textContent = data ? JSON.stringify(data, null, 2) : "";
}

btnArtist.onclick = async () => {
  try{
    const data = await apiRequest("/api/artists", {
      method:"POST",
      body:{ name: artistName.value.trim(), genres:[] }
    });
    show("✅ Artist created", data);
  }catch(e){ show("❌ " + e.message); }
};

btnAlbum.onclick = async () => {
  try{
    const data = await apiRequest("/api/albums", {
      method:"POST",
      body:{
        title: albumTitle.value.trim(),
        artistId: albumArtistId.value.trim(),
        year: albumYear.value ? Number(albumYear.value) : undefined
      }
    });
    show("✅ Album created", data);
  }catch(e){ show("❌ " + e.message); }
};

btnSong.onclick = async () => {
  try{
    const data = await apiRequest("/api/songs", {
      method:"POST",
      body:{
        title: songTitle.value.trim(),
        artistId: songArtistId.value.trim(),
        albumId: songAlbumId.value.trim() || null
      }
    });
    show("✅ Song created", data);
  }catch(e){ show("❌ " + e.message); }
};
