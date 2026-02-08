import { Router } from "express";
import { listArtists, createArtist } from "../controllers/artists.controller.js";

const router = Router();
router.get("/", listArtists);
router.post("/", createArtist); 
export default router;
