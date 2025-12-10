import Router from "express";
import { register , login , allUsers, validateEmail, updateUser, getUserProfile, likedSongs, likeSong} from "../../controllers/userController.js";
import multer from "multer";

const router = Router();
    
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.post('/register', register);
router.post('/login', login);
router.get('/all', allUsers);
router.post('/verifmail',validateEmail)
router.put("/updateprofile", upload.single("image"), updateUser);
router.get('/me', getUserProfile);
router.get('/liked-songs', likedSongs);
router.post('/like-song/:songId', likeSong);
export default router;