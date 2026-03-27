import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Like } from "../models/like.model.js"
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

console.log("Registering Like controller");

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(400, "Video Id is required")
    }

    const UserId = req.user?._id

    if (!UserId) {
        throw new ApiError(400, "User should be logged In")
    }

    const alreadyLiked = await Like.findOne({
        $and: [
            {
                video: videoId
            },
            {
                likedBy: UserId
            }
        ]
    })
    if (alreadyLiked) {
        await alreadyLiked.deleteOne()
        return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Liked Removed Successfully"
                )
            )
    }

    const createdLike = await Like.create({
        video: videoId,
        likedBy: UserId
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                createdLike,
                "Video Liked Succesfully"
            )
        )
})


const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!commentId) {
        throw new ApiError(400, "Comment Id is required")
    }

    const UserId = req.user?._id

    if (!UserId) {
        throw new ApiError(400, "User should be logged In")
    }
    // .find return an empty array if no match found , so alreadyliked is always true
    // .findOne return null if no match found , so alreadyliked is always false
    const alreadyLiked = await Like.findOne({
        $and: [
            {
                comment: commentId
            },
            {
                likedBy: UserId
            }
        ]
    })
    if (alreadyLiked) {
        await alreadyLiked.deleteOne()
        return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Liked Removed Successfully"
                )
            )
    }

    const createdLike = await Like.create({
        comment: commentId,
        likedBy: UserId
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                createdLike,
                "Comment Liked Succesfully"
            )
        )
})


const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!tweetId) {
        throw new ApiError(400, "Tweet Id is required")
    }

    const UserId = req.user?._id

    if (!UserId) {
        throw new ApiError(400, "User should be logged In")
    }

    const alreadyLiked = await Like.findOne({
        $and: [
            {
                tweet: tweetId
            },
            {
                likedBy: UserId
            }
        ]
    })
    if (alreadyLiked) {
        await alreadyLiked.deleteOne()
        return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Liked Removed Successfully"
                )
            )
    }

    const createdLike = await Like.create({
        tweet: tweetId,
        likedBy: UserId
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                createdLike,
                "Tweet Liked Succesfully"
            )
        )
})


const getLikedVideos = asyncHandler(async (req, res) => {
    const UserId = req.user?._id

    if (!UserId) {
        throw new ApiError(400, "User Should be loggged In")
    }

    const videoList = await Like.find({ 
        likedBy: UserId,
        video: { $exists: true }
    }).populate(
        {
            path: "video",
            select: "title thumbnail description duration views createdAt videoFile owner",
            populate: {
                path: "owner",
                select: "username fullName avatar"
            }
        }
    )

    if (!videoList) {
        throw new ApiError(400, "Failed to fetch videos")
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                videoList,
                "Videos Fetched successfully"
            )
        )
})


export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}