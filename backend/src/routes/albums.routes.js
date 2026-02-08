import { Router } from "express";
import { listAlbums, createAlbum } from "../controllers/albums.controller.js";

const router = Router();
router.get("/", listAlbums);
router.post("/", createAlbum);
export default router;
