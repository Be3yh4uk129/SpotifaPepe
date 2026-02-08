import { Router } from "express";
import { itunesSearchEndpoint, enrichSong, enrichAlbum } from "../controllers/external.controller.js";

const router = Router();
router.get("/itunes/search", itunesSearchEndpoint);
router.post("/songs/:id/enrich", enrichSong);
router.post("/albums/:id/enrich", enrichAlbum);

export default router;
