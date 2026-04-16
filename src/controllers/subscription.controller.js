import mongoose, { isValidObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendMail } from "./mailer.controller.js";



const getSubscribers = asyncHandler(async (req, res) => {
    const { userId } = req.params

    // req.user se kewal user khud ke subscribers dekh skta hai

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User ID")
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetail",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullName: 1,
                            coverImage: 1
                        }
                    }
                ]
            }
        }
    ])

    if (!subscribers) {
        throw new ApiError(400, "Failed to fetch subscribers")
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                subscribers,
                "Subscribers fetched successfully"
            )
        )


})

const getAllSubscribed = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User ID")
    }

    const subscribed = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "subscribedDetail",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullName: 1,
                            coverImage: 1
                        }
                    }
                ]
            }
        }
    ])

    if (!subscribed) {
        throw new ApiError(400, "Failed to fetch subscribed channels")
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                subscribed,
                "Subscribed fetched successfully"
            )

        )

})

const toggleSubscription = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const { channelId } = req.params

    if (!channelId) {
        throw new ApiError(400, "Channel Id is required")
    }

    const alreadySubscribed = await Subscription.findOne({
        $and: [
            { subscriber: userId },
            { channel: channelId }
        ]
    })
    const user = await User.findById(channelId)
    const subscriber = await User.findById(userId)
    if (!user || !subscriber) {
        throw new ApiError(400, "Failed to fetch the channel")
    }
    if (alreadySubscribed) {
        await sendMail(
            user.email,
            `${subscriber.username} left your channel`,
            `${subscriber.username} is no longer following your content.`
        )
        await Subscription.findByIdAndDelete(alreadySubscribed._id)
        return res.status(200)
            .json(new ApiResponse(
                200,
                {},
                "Unsubscribed successfully"
            ))
    }

    const createdSubscription = await Subscription.create({
        subscriber: userId,
        channel: channelId
    })
    if (!createdSubscription) {
        throw new ApiError(400, "Failed To Subscribe")
    }
    await sendMail(
        user.email,
        `${subscriber.username} subscribes to your channel`,
        `You have a new subscriber: ${subscriber.username}`
    )
    return res.status(200)
        .json(
            new ApiResponse(
                200,
                createdSubscription,
                "Subscribed successfully"
            )
        )

})

export {
    getSubscribers,
    getAllSubscribed,
    toggleSubscription
}