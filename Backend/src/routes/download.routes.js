import { Router } from "express";
import { downloadVideo } from "../controllers/download.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:videoId").get(verifyJWT, downloadVideo);

export default router;