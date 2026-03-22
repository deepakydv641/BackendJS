import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribers, getAllSubscribed, toggleSubscription } from "../controllers/subscription.controller.js";

const router2 = Router();

console.log("Registering videos routes");

router2.route("/get-subscribers/:userId").get(
    verifyJWT,
    getSubscribers
)

router2.route("/get-subscribed/:userId").get(
    verifyJWT,
    getAllSubscribed
)

router2.route("/toggle/:channelId").post(
    verifyJWT,
    toggleSubscription
)

export default router2;