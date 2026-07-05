import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, updateTweet, getTweetsOfUser, getAllTweets } from "../controllers/tweet.controller.js";

const router4 = Router()

router4.route("/create-tweet").post(verifyJWT, upload.single("poster"), createTweet)
router4.route("/all").get(getAllTweets)
router4.route("/t/:tweetId").delete(verifyJWT, deleteTweet).patch(verifyJWT, updateTweet)
router4.route("/u/:UserId").get(getTweetsOfUser)

export default router4;