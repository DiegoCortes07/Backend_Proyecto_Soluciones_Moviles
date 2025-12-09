import Router from "express";
import { getUserPlaylists, getPlaylistSongs, postSongToPlaylist, createPlaylist, deletePlaylist, deleteSongFromPlaylist} from "../../controllers/playlistController.js";

const router = Router();

router.get("/", getUserPlaylists);
router.get("/:playlistId/songs", getPlaylistSongs);
router.post("/:playlistId/songs", postSongToPlaylist);
router.post("/", createPlaylist);
router.delete("/:playlistId", deletePlaylist);
router.delete("/:playlistId/songs/:songId", deleteSongFromPlaylist);

export default router;