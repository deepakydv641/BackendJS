import { Router } from "express";
import { loginUser, registerUser, logoutUser } from "../controllers/user.controller.js";
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
router.route("/login").post(loginUser);

console.log("Logout route registered");
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
