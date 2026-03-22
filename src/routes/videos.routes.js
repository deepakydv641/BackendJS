import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadVideo, getAllVideos, updateVideoDetails, getYourVideos } from "../controllers/video.controller.js";

const router1 = Router();

console.log("Registering videos routes");

router1.route("/upload-video").post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    uploadVideo
);

// Support both kebab-case and camelCase to prevent 404 errors for clients
router1.route("/uploadVideo").post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    uploadVideo
);

router1.route("/all-videos").get(
    verifyJWT,
    getAllVideos
);

router1.route("/update-video/:videoId").patch(
    verifyJWT,
    upload.single("thumbnail"),
    updateVideoDetails
);

router1.route("/your-videos").get(
    verifyJWT,
    getYourVideos
)

export default router1;