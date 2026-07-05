import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";



// Helper function to generate access and refresh tokens and save refresh token to DB
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // Save the refresh token in the database
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    // Step 1) Check that data is fetched from frontend
    const { email, username, fullName, password } = req.body;

    // Step 2) Check that all fields are filled
    if (!email || !username || !fullName || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // Step 3) Check if user with username or email already exists
    const userExist = await User.findOne({  // this takes time to search in database
        $or: [{ username }, { email }]
    })

    if (userExist) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // Step 4) Check for images, check if avatar image exists
    const avatarPath = req.files?.avatar?.[0]?.path;
    const coverImagePath = req.files?.coverImage?.[0]?.path;

    console.log("Avatar path:", avatarPath);
    console.log("Cover image path:", coverImagePath);

    if (!avatarPath) {
        throw new ApiError(400, "Avatar is required")
    }

    // Step 5) Upload images to Cloudinary, then check that images are uploaded
    const avatar = await uploadOnCloudinary(avatarPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)

    console.log("Cloudinary avatar response:", avatar)

    if (!avatar) {
        throw new ApiError(400, "Avatar upload to Cloudinary failed")
    }

    // Step 6) Create user in database
    const createdUser = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // Step 7) Remove password and refresh token from response
    const newUser = await User.findById(createdUser._id).select(
        "-password -refreshToken"
    )

    // Step 8) Check if user was created
    if (!newUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(201, newUser, "User registered successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // Step 1) Get the data from req.body
    console.log("loginUser function called")
    const { email, username, password } = req.body

    // Step 2) Check if either username or email is provided
    if (!username && !email) {
        throw new ApiError(400, "Username or email is required")
    }

    // Step 3) Check if user exists in database
    const userExist = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!userExist) {
        throw new ApiError(404, "User does not exist")
    }

    // Step 4) Check if the entered password is correct
    const isPasswordValid = await userExist.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    // Step 5) Generate access token and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userExist._id)

    // Do not return password and refreshToken in response
    const loggedInUser = await User.findById(userExist._id).select("-password -refreshToken")

    // Set cookies — httpOnly prevents XSS attacks, cookies can only be managed from server
    // req.secure correctly detects HTTPS even through nginx (because trust proxy is set)
    const options = {
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: 'lax'
    }
    console.log("AccessToken:", accessToken);
    console.log("RefreshToken:", refreshToken);

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1  // removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: 'lax'
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        )
})

const getRefreshedAccessToken = asyncHandler(async (req, res) => {
    // this is called when the access token is expired

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken  // req.body.refreshtoken is for mobiles
    console.log("Incoming refresh token:", incomingRefreshToken)
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        if (!decodedToken) {
            throw new ApiError(401, "Invalid refresh token")
        }

        const DB_User = await User.findById(decodedToken?._id)

        if (!DB_User) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (DB_User.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Invalid refresh token")
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(DB_User._id)

        const options = {
            httpOnly: true,
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
            sameSite: 'lax'
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken, refreshToken: newRefreshToken
                    }
                    ,
                    "Tokens are refreshed successfully!!"
                )
            )
    }
)

const changeCurrentPassword = asyncHandler(async (req, res) => {

    // taking inputs from the req.body to change the password
    const { oldPassword, newPassword } = req.body

    // both oldpassword and new password are required to change the current password
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "oldPassword and newPassword are required")
    }

    // i can change the password only when i am logged in so i would have done verifyJWT middleware before this controller
    // so i can access the req.user

    // req.user will give me the current user
    // now i can find the id of the user form req.user._id  then i can find the user from database with this id

    const DB_user = await User.findById(req.user?._id)

    if (!DB_user) {
        throw new ApiError(400, "Invalid user")
    }

    // now i will have to check the old password should match with password saved in the database 
    const isPasswordValid = await DB_user.isPasswordCorrect(oldPassword)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Old Password")
    }

    // now old password matches with the passowrd in Databse so i can change the password

    DB_user.password = newPassword
    await DB_user.save({ validateBeforeSave: true })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password Changed Successfully!!"
            )
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    // assuming you have called jwtVerify middleware and now you have the access of req.user
    // in jwtVerify we check that if the user is logged in or not 

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    User: req.user
                }, // here u have get the current user from jwtVerify middleware
                "Current user fetched successfully!!"
            )
        )

})

const updateAccountDetails = asyncHandler(async (req, res) => {

    const { username, email } = req.body

    if (!username || !email) {
        throw new ApiError(400, "username and email are required")
    }

    // assuming u have called auth middleware now u have acces of req.user._id

    const DB_user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username: username,
                email: email
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, DB_user, "Account details updated successfully"))
});

const updateAvatar = asyncHandler(async (req, res) => {

    // Taking the Input from the user taking the path of the file from the req.files
    const { avatarLocalPath } = req.files?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is required")
    }

    // for updating the avatar image obviously u will have delete the already uploaded image previously

    const newAvatar = await uploadOnCloudinary(avatarLocalPath)

    if (!newAvatar.url) {
        throw new ApiError(400, "Error, while uploading , avatar is not uploaded")
    }

    const DB_user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: newAvatar.url
            }
        },
        {
            new: true
        }
    )

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                DB_user,
                "Avatar updated successfully"
            )
        )
})


const updateCoverImage = asyncHandler(async (req, res) => {

    // Taking the Input from the user taking the path of the file from the req.files
    const { CoverImageLocalPath } = req.files?.path

    if (!CoverImageLocalPath) {
        throw new ApiError(400, "CoverImage is required")
    }

    // for updating the CoverImage image obviously u will have delete the already uploaded image previously

    const newCoverImage = await uploadOnCloudinary(CoverImageLocalPath)

    if (!newCoverImage.url) {
        throw new ApiError(400, "Error, while uploading , CoverImage is not uploaded")
    }

    const DB_user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                CoverImage: newCoverImage.url
            }
        },
        {
            new: true
        }
    )

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                DB_user,
                "CoverImage updated successfully"
            )
        )
})

const getChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params

    if (!username.trim()) {
        throw new ApiError(400, "Username is required")
    }

    const Channel = await User.aggregate([
        {
            $match: {
                username: username.trim()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo",
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                subscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$subscribers.subscriber"]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                avatar: 1,
                coverImage: 1,
                subscribersCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1,
                email: 1
            }
        }
    ]
    )
    if (!Channel?.length) {
        throw new ApiError(404, "Channel not found")
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                Channel[0],
                "Channel profile fetched successfully"
            )
        )

})

const getWatchHistory = asyncHandler(async (req, res) => {
    const UserId = req.user?._id

    if (!UserId) {
        throw new ApiError(400, "User not found")
    }

    const list = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(UserId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "WatchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        avatar: 1,
                                        fullName: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ]
    )

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                list,
                "History Fetched Successfully"
            )
        )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getRefreshedAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateCoverImage,
    updateAvatar,
    getChannelProfile,
    getWatchHistory
}