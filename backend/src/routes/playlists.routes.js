import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  createPlaylist, listPlaylists, getPlaylist, updatePlaylist, deletePlaylist,
  addSongToPlaylist, removeSongFromPlaylist
} from "../controllers/playlists.controller.js";

const router = Router();

router.use(auth);
router.post("/", createPlaylist);
router.get("/", listPlaylists);
router.get("/:id", getPlaylist);
router.put("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);

router.post("/:id/songs", addSongToPlaylist);
router.delete("/:id/songs/:songId", removeSongFromPlaylist);

export default router;
