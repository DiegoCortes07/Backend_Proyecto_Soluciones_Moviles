import Router from "express";
import userRoutes from "./api/user.js";
import songRoutes from "./api/song.js";
import artistRoutes from "./api/artist.js";
import albumRoutes from "./api/album.js";
import playlistRoutes from "./api/playlist.js";


const router = Router();

router.use('/users', userRoutes);
router.use('/songs', songRoutes);
router.use('/artists', artistRoutes);
router.use('/albums', albumRoutes);
router.use('/playlists', playlistRoutes);

export default router;
