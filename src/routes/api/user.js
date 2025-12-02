import Router from "express";
import { register , login , allUsers, getUserPlaylists, validateEmail} from "../../controllers/userController.js";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/all', allUsers);
router.get('/playlists', getUserPlaylists);
router.post('/verifmail',validateEmail)

export default router;