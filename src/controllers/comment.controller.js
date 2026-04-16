import mongoose, { isValidObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js";
import { Comment } from "../models/comment.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";



// some one can add the comment only if  he is signed in 
// and he will get the videoId from req.params
// and commnet from req.body

const addComment = asyncHandler(async (req, res) => {
    const videoId = req.params?.videoId

    // content toh lena pdega na user se uskae bina thodi na comment hone wala hain

    const { Content } = req.body
    const UserId = req.user?._id

    if (!Content) {
        throw new ApiError(400, "Content is Required")
    }

    if (!UserId || !videoId) {
        throw new ApiError(400, "Both the user and video are neccessary")
    }

    const createdComment = await Comment.create({
        content: Content,
        video: videoId,
        owner: UserId
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                createdComment,
                "Comment added succesfully"
            )

        )
})
const addCommentOnTweet = asyncHandler(async (req, res) => {
    const tweetId = req.params?.tweetId

    // content toh lena pdega na user se uskae bina thodi na comment hone wala hain

    const { Content } = req.body
    const UserId = req.user?._id

    if (!Content) {
        throw new ApiError(400, "Content is Required")
    }

    if (!UserId || !tweetId) {
        throw new ApiError(400, "Both the user and tweet are neccessary")
    }

    const createdComment = await Comment.create({
        content: Content,
        tweet: tweetId,
        owner: UserId
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                createdComment,
                "Comment added succesfully"
            )

        )
})

const updateComment = asyncHandler(async (req, res) => {

    // abhi comment ko update karenge toh comment ka hona toh jaruri hain na 
    // aur comment ka owner bhi the current signed in user se match hona chahiye 
    // joh video comment ke documenbt mein hai uski video id bhi match karwani hai

    const commentId = req.params?.commentId
    const UserId = req.user?._id

    if (!commentId || !UserId) {
        throw new ApiError(400, "All fields are required")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(400, "Comment not Found")
    }

    if (comment.owner.toString() !== UserId.toString()) {
        throw new ApiError(400, "You are not authorised to update this comment")
    }

    const { Content } = req.body

    if (!Content) {
        throw new ApiError(400, "Please change the content of the comment")
    }

    comment.content = Content
    await comment.save({ validateBeforeSave: false })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                comment,
                "Comment updated successfully"
            )
        )

})

const deleteComment = asyncHandler(async (req, res) => {
    const commentId = req.params?.commentId

    if (!commentId) {
        throw new ApiError(400, "Comment is required")
    }

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(400, "Comment Not Found")
    }

    if (comment.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "You are not authorised to delete this comment")
    }

    await comment.deleteOne();

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Comment deleted successfully"
            )
        )
})

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video Is required")
    }

    const comments = await Comment.find({ video: videoId }).populate("owner", "username avatar fullName")

    if (!comments) {
        throw new ApiError(400, "Failed to fetch comments")
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                comments,
                "Comments fetched successfully"
            )
        )
})

const getTweetComments = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!tweetId) {
        throw new ApiError(400, "Tweet Is required")
    }

    const comments = await Comment.find({ tweet: tweetId }).populate("owner", "username avatar fullName")

    if (!comments) {
        throw new ApiError(400, "Failed to fetch comments")
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                comments,
                "Comments fetched successfully"
            )
        )
})



export {
    addComment,
    updateComment,
    deleteComment,
    getVideoComments,
    addCommentOnTweet,
    getTweetComments
}