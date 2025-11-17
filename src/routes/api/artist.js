import Router from "express";
import { createArtist, getArtists, getArtistById, getSongsByArtist, getAlbumsByArtist} from "../../controllers/artistController.js";
const router = Router();

router.post("/", createArtist);
router.get("/", getArtists);
router.get("/:artistId", getArtistById);
router.get("/:artistId/songs", getSongsByArtist);
router.get("/:artistId/albums", getAlbumsByArtist);

export default router;