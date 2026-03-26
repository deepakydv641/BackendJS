import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos } from "../controllers/like.controller.js"

const router6 = Router()

router6.route("/v/:videoId").post(verifyJWT, toggleVideoLike)
router6.route("/c/:commentId").post(verifyJWT, toggleCommentLike)
router6.route("/t/:tweetId").post(verifyJWT, toggleTweetLike)
router6.route("/liked-videos").get(verifyJWT, getLikedVideos)

export default router6
