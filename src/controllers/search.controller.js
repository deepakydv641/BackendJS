import mongoose, { isValidObjectId } from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



const getSearchedVideos = asyncHandler(async (req, res) => {

    // GET requests send data in the URL path, not the body!
    const { content } = req.params;

    if (!content) {
        throw new ApiError(400, "Search query is required")
    }

    const list = await Video.find({
        $or: [
            { title: { $regex: content, $options: "i" } },
            { description: { $regex: content, $options: "i" } }
        ]
    }).populate("owner", "username avatar fullName")

    if (!list) {
        throw new ApiError(400, "Failed to fetch videos")
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                list,
                "Videos fetched successfully"
            )
        )

})

export {
    getSearchedVideos
}