import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

console.log("Registering video controller");


const uploadVideo = asyncHandler(async (req, res) => {

    // Step 1).  take inputs from user forms
    const { title, description, duration } = req.body

    const owner = await User.findById(req.user._id).select("-password -refreshToken")

    if (!title || !description || !duration) {
        throw new ApiError(400, "All fieds are Required!")
    }

    // Step 2). now take videofile and thumbnail from user

    let videoFilePath;
    if (req.files && Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0) {
        videoFilePath = req.files.videoFile[0].path;
    }

    let thumbnailPath;
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailPath = req.files.thumbnail[0].path;
    }

    if (!videoFilePath) {
        throw new ApiError(400, "Video file is required!");
    }

    if (!thumbnailPath) {
        throw new ApiError(400, "Thumbnail file is required!");
    }

    const cloudinaryVideo = await uploadOnCloudinary(videoFilePath)
    const cloudinaryThumbnail = await uploadOnCloudinary(thumbnailPath)

    if (!cloudinaryThumbnail || !cloudinaryVideo) {
        throw new ApiError(500, "Failed to upload video or thumbnail on cloudinary")
    }

    const createdVideo = await Video.create({
        title,
        description,
        duration,
        videoFile: cloudinaryVideo.url,
        thumbnail: cloudinaryThumbnail.url,
        owner: owner._id
    })

    if (!createdVideo) {
        throw new ApiError(500, "Failed to create video")
    }

    return res.status(201).json(
        new ApiResponse(201, createdVideo, "Video uploaded successfully")
    )

})

const getAllVideos = asyncHandler(async (req, res) => {
    const videoList = await Video.find()
    return res.status(200)
        .json(
            new ApiResponse(200, videoList, "Videos fetched successfully")
        )
})

export {
    uploadVideo,
    getAllVideos
}
