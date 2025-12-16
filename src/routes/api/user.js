import Router from "express";
import { register, login, allUsers, getUserProfile, likedSongs, likeSong, changeConfig, changePassword, changeUserData, changeProfilePhoto } from "../../controllers/userController.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/all', allUsers);
router.get('/me', getUserProfile);
router.get('/liked-songs', likedSongs);
router.post('/like-song/:songId', likeSong);
router.put('/change-config', changeConfig);
router.put('/change-password', changePassword);
router.put('/change-userdata', changeUserData);
router.put('/change-image', changeProfilePhoto);
export default router;