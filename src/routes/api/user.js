import Router from "express";
import { register , login , allUsers, getUserPlaylists, getUserProfile, likedSongs, likeSong} from "../../controllers/userController.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/all', allUsers);
router.get('/playlists', getUserPlaylists);
router.get('/me', getUserProfile);
router.get('/liked-songs', likedSongs);
router.post('/like-song/:songId', likeSong);
export default router;