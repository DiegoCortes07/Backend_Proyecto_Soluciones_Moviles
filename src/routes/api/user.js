import Router from "express";
import { register , login , allUsers, getUserProfile, likedSongs, likeSong, changeConfig} from "../../controllers/userController.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/all', allUsers);
router.get('/me', getUserProfile);
router.get('/liked-songs', likedSongs);
router.post('/like-song/:songId', likeSong);
router.put('/change-config', changeConfig);
export default router;