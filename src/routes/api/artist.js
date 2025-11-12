import Router from "express";
import { createArtist, getArtists, getArtistById, getSongsByArtist } from "../../controllers/artistController.js";
const router = Router();

router.post("/", createArtist);
router.get("/", getArtists);
router.get("/:artistId", getArtistById);
router.get("/:artistId/songs", getSongsByArtist);

export default router;