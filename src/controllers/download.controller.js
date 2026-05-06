import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import cloudinary from "cloudinary"

const downloadVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "VideoId not found")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "Video Not found")
    }

    let downloadUrl;

    if (video.public_id) {
        downloadUrl = cloudinary.v2.url(video.public_id, {
            resource_type: "video",
            format: "mp4",
            flags: "attachment"
        });
    } else {
        // Fallback for older videos that don't have public_id yet
        downloadUrl = video.videoFile.replace('/upload/', '/upload/fl_attachment/');
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                { downloadUrl },
                "Video Download URL Generated!"
            )
        )
})

export {
    downloadVideo
}