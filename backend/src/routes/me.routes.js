import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { getMe, updateMe } from "../controllers/me.controller.js";

const router = Router();
router.get("/", auth, getMe);
router.put("/", auth, updateMe);
export default router;
