import Router from "express";
import { createAlbumForArtist, getAllAlbums, getAlbumById, getSongsForAlbum} from "../../controllers/albumController.js";

const router = Router();

router.post("/:artistId", createAlbumForArtist);
router.get("/", getAllAlbums);
router.get("/:albumId", getAlbumById);
router.get("/:albumId/songs", getSongsForAlbum);
export default router;