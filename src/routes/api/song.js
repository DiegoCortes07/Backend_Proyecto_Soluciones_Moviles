import Router from "express";
import { uploadSong } from "../../controllers/songController.js";
import fileUpload from "express-fileupload";

const router = Router();

router.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/src/tmp'
}));

router.post("/upload", uploadSong);

export default router;