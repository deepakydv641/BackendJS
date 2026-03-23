import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, updateComment, deleteComment, getVideoComments } from "../controllers/comment.controller.js";

const router3 = Router()

router3.route("/v/:videoId").post(verifyJWT, addComment).get(getVideoComments)
router3.route("/c/:commentId").patch(verifyJWT, updateComment).delete(verifyJWT, deleteComment)

export default router3;