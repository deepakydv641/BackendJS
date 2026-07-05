import mongoose, { isValidObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Tweet } from "../models/tweet.model.js";



// steps:
// 1). get the content from the user from req.body 
// 2). get the image from the user from req.files
// 3). the current user can only tweet if he is signed in 
// 4). the poster we will be a image then we will uplaod that to the cloudinary 
// 5). create the tweet then we will save the tweet to our database and then return the response

const createTweet = asyncHandler(async (req, res) => {
    const { Content } = req.body
    const poster = req.file
    const UserId = req.user?._id

    if (!UserId || !Content || !poster) {
        throw new ApiError(400, "All fields are required")
    }

    // now i will have to upload the image on the cloudinary the we will get the url from the cloudinary

    const posterLocalFilePath = req.file?.path

    if (!posterLocalFilePath) {
        throw new ApiError(400, "Poster ")
    }

    const posterUrl = await uploadOnCloudinary(posterLocalFilePath)

    if (!posterUrl) {
        throw new ApiError(400, "poster is not not uploaded on cloudinary")
    }

    const createdTweet = await Tweet.create({
        content: Content,
        poster: posterUrl.secure_url,   // extract URL string from Cloudinary response object
        owner: UserId
    })

    if (!createdTweet) {
        throw new ApiError(400, "Something went wrong while creating the tweet")
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                createdTweet,
                "Tweet created successfully"
            )
        )

})

// setps:
// 1). you want to delete a tweet for that obviously u need that tweet and tweet id
// 2). obviously we are not gonna take input from user 

// 3). click on tweet than from req.params we will get the tweeet id
// 4). only the logged in user and should be the owner of the tweet can delete the tweet 

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    const UserId = req.user?._id

    if (!tweetId || !UserId) {
        throw new ApiError(400, "both tweet and user should be loggedin")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(400, "Tweet not found")
    }

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Sorry!, You are not authorized to delete this tweet")
    }

    await tweet.deleteOne()

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Tweet deleted Succesfully!"
            )
        )
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    const UserId = req.user?._id

    if (!tweetId || !UserId) {
        throw new ApiError(400, "both tweet and user should be loggedin")
    }

    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(400, "Tweet not found")
    }

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Sorry!, You are not authorized to update this tweet")
    }

    const { Content } = req.body

    if (!Content) {
        throw new ApiError(400, "You will have to enter the content to update the tweet")
    }

    tweet.content = Content;

    await tweet.save({ validateBeforeSave: false })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                tweet,
                "Tweet updated Successfully"
            )
        )

})

const getTweetsOfUser = asyncHandler(async (req, res) => {
    const { UserId } = req.params

    if (!UserId) {
        throw new ApiError(400, "User Id is required")
    }


    const tweets = await Tweet.find({ owner: UserId })
        .populate("owner", "username avatar fullName")
        .sort({ createdAt: -1 })


    return res.status(200)
        .json(
            new ApiResponse(
                200,
                tweets,
                "Tweets fetched Successfully")
        )

})

const getAllTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find()
            .populate("owner", "username avatar fullName")
            .sort({ createdAt: -1 });
        console.log(tweets);
        return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    tweets,
                    "All tweets fetched successfully")
            )
    } catch (error) {
        console.error('Error fetching all tweets:', error);
        return res.status(500)
            .json(
                new ApiResponse(
                    500,
                    [],
                    "Error fetching tweets")
            )
    }

}
export {
    createTweet,
    deleteTweet,
    updateTweet,
    getTweetsOfUser,
    getAllTweets
}