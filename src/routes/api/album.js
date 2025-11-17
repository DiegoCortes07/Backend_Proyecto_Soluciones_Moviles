import Router from "express";
import { createAlbumForArtist, getAllAlbums, getAlbumById } from "../../controllers/albumController.js";

const router = Router();

router.post("/:artistId", createAlbumForArtist);
router.get("/", getAllAlbums);
router.get("/:albumId", getAlbumById);
export default router;