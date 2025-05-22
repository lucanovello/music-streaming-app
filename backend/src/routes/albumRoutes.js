import { Router } from "express";
import { getAllAlbums, getAlbumById } from "../controllers/albumController.js";

const router = Router();

router.get("/", getAllAlbums);
router.get("/:albumId", getAlbumById);

export default router;
