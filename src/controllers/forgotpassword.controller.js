import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Like } from "../models/like.model.js"
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
// import { redisSet, redisGet } from "../db/redis.js";
import { sendMail } from "./mailer.controller.js";
import { redisClient } from "../db/redis.js";


const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const forgotPassword = asyncHandler(async (req, res) => {
    const { emailId } = req.body

    if (!emailId) {
        throw new ApiError(400, "You missed email")
    }

    console.log('🔍 [FORGOT PASSWORD] Looking for user with email:', emailId);
    const userExist = await User.findOne({ email: emailId })

    if (!userExist) {
        console.log('❌ [ERROR] User not found for email:', emailId);
        throw new ApiError(400, "User not found")
    }

    console.log('✅ [FORGOT PASSWORD] User found:', userExist.username || userExist.email);

    const otp = generateOtp();
    console.log(`\n🔑 [DEV ONLY] Generated OTP for ${emailId}: ${otp}\n`);
    try {
        console.log('🔍 [FORGOT PASSWORD] Storing OTP in Redis...');
        redisClient.set(`otp:${emailId}`, otp, 'EX', 300);
        console.log('✅ [FORGOT PASSWORD] OTP stored in Redis successfully');

        console.log('📧 [FORGOT PASSWORD] Attempting to send email to:', userExist.email);
        await sendMail(
            userExist.email,
            "Your OTP Code",
            `Your OTP is: ${otp}. It expires in 5 minutes.`
        );
        console.log('✅ [FORGOT PASSWORD] Email sent successfully!');

        return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "OTP sent Successfully!"
                )
            )
    } catch (error) {
        console.log('❌ [FORGOT PASSWORD] Email sending failed');
        console.log('❌ [ERROR] Details:', error.message);
        console.log('❌ [ERROR] Full error:', error);
        console.log('❌ [ERROR] Stack:', error.stack);

        return res.status(500)
            .json(
                new ApiResponse(
                    500,
                    { reason: error.message },
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

    const otpFromRedis = await redisClient.get(`otp:${emailId}`)

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

        const UserExists = await User.findOne({ email: emailId });

        if (!UserExists) {
            throw new ApiError(400, "email is not correct")
        }

        UserExists.password = newpassword;
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