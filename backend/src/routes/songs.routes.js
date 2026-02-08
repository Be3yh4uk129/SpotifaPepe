import { Router } from "express";
import { listSongs, createSong } from "../controllers/songs.controller.js";

const router = Router();
router.get("/", listSongs);
router.post("/", createSong);
export default router;
