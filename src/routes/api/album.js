import Router from "express";
import { createAlbumForArtist, getAlbumsByArtist } from "../../controllers/albumController.js";

const router = Router();

router.post("/:artistId", createAlbumForArtist);
router.get("/:artistId", getAlbumsByArtist);

export default router;