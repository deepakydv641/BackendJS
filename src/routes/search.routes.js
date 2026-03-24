import { Router } from "express";
import { getSearchedVideos } from "../controllers/search.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router5 = Router()

router5.route("/:content").get(verifyJWT, getSearchedVideos)

export default router5;