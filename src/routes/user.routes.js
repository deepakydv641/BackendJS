import { Router } from "express";
import { loginUser, registerUser, logoutUser, getRefreshedAccessToken, getCurrentUser, changeCurrentPassword, updateAccountDetails, getChannelProfile } from "../controllers/user.controller.js";
import { forgotPassword, otpValidation, resetPassword } from "../controllers/forgotpassword.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

console.log("Registering user routes");

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

console.log("Login route registered");
// Use upload.none() to accept form-data that has no files, only text fields
router.route("/login").post(upload.none(), loginUser);

console.log("Logout route registered");
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-access-token").post(getRefreshedAccessToken)
router.route("/change-password").patch(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/c/:username").get(verifyJWT, getChannelProfile)

// Forgot-password flow (no auth required — user is logged out)
router.route("/forgot-password").post(forgotPassword)
router.route("/verify-otp").post(otpValidation)
router.route("/reset-password").post(resetPassword)

export default router;
