import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Like } from "../models/like.model.js"
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import client from "../db/redis.js";
import { sendMail } from "./mailer.controller.js";

console.log("Registering forgot password controller");

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const forgotPassword = asyncHandler(async (req, res) => {
    const { emailId } = req.body

    if (!emailId) {
        throw new ApiError(400, "You missed email")
    }

    const userExist = await User.findOne({ email: emailId })

    if (!userExist) {
        throw new ApiError(400, "User not found")
    }

    const otp = generateOtp();
    console.log(`\n🔑 [DEV ONLY] Generated OTP for ${emailId}: ${otp}\n`);

    await client.set(`otp:${emailId}`, otp, { EX: 300 })

    try {
        await sendMail(
            userExist.email,
            "Your OTP Code",
            `Your OTP is: ${otp}. It expires in 5 minutes.`
        );

        return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "OTP sent Successfully!"
                )
            )
    } catch (error) {
        console.error("Mail error:", error);
        return res.status(500)
            .json(
                new ApiResponse(
                    500,
                    { reason: error.message },   // expose real error for debugging
                    "Failed to send OTP: " + error.message
                )
            )
    }


})

const otpValidation = asyncHandler(async (req, res) => {
    const { OTP, emailId } = req.body

    if (!OTP || !emailId) {
        throw new ApiError(400, "Missing OTP or email")
    }

    const otpFromRedis = await client.get(`otp:${emailId}`)

    if (!otpFromRedis) {
        throw new ApiError(400, "Something Went Wrong")
    }

    if (otpFromRedis !== OTP) {
        throw new ApiError(401, "Otp Not matched")
    }

    return res.status(200).
        json(
            new ApiResponse(
                200,
                {},
                "OTP validated successfully"
            )
        )
})

const resetPassword = asyncHandler(
    async (req, res) => {
        const { emailId, newpassword } = req.body

        if (!emailId || !newpassword) {
            throw new ApiError(400, "please enter all details")
        }

        const UserExists = await User.findOne({email:emailId});

        if(!UserExists){
            throw new ApiError(400, "email is not correct")
        }

        UserExists.password=newpassword;
        await UserExists.save({ validateBeforeSave: true })

        return res.status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password Change Successfully!"
            )
        )
    }
)

export {
    forgotPassword,
    otpValidation,
    resetPassword
}