import Router from "express";
import { register , login , allUsers, getUserPlaylists, validateEmail, updateUser, getUser} from "../../controllers/userController.js";
import multer from "multer";

const router = Router();
    
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.post('/register', register);
router.post('/login', login);
router.get('/all', allUsers);
router.get('/playlists', getUserPlaylists);
router.post('/verifmail',validateEmail)
router.get('/getuser', getUser)
router.put("/updateprofile", upload.single("image"), updateUser);
export default router;