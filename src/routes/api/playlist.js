import Router from "express";
import { getUserPlaylists, getPlaylistSongs, postSongToPlaylist, createPlaylist, deletePlaylist, deleteSongFromPlaylist, uploadPlaylistImage, changePlaylistDetails} from "../../controllers/playlistController.js";
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.get("/", getUserPlaylists);
router.get("/:playlistId/songs", getPlaylistSongs);
router.post("/:playlistId/songs", postSongToPlaylist);
router.post("/", createPlaylist);
router.delete("/:playlistId", deletePlaylist);
router.delete("/:playlistId/songs/:songId", deleteSongFromPlaylist);
router.post("/:playlistId/image",upload.single("image") ,uploadPlaylistImage);
router.put("/:playlistId", changePlaylistDetails);

export default router;