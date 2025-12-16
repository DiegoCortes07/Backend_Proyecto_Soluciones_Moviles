import Router from "express";
import { getAllShows, getAllPodcast, getShowsForPodcastId } from "../../controllers/podcastController.js";
const router = Router();

router.get("/getAllShows", getAllShows);
router.get("/", getAllPodcast);
router.get("/getShowsForPodcastId/:podcastId", getShowsForPodcastId);

export default router;
