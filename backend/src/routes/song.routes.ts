// server/src/routes/song.routes.ts
import { Router } from "express";
import { getSongs, createSong } from "../controllers/song.controller";

const router = Router();

router.get("/", getSongs);
router.post("/", createSong);

export default router;
