import Router from "express";
import { uploadSong , getAllSongs,getSongById,getSongsByArtist} from "../../controllers/songController.js";

const router = Router();

router.post("/upload", uploadSong);
router.get("/",getAllSongs);
router.get("/:id",getSongById);
router.get("/artist/:artistId",getSongsByArtist);   

export default router;