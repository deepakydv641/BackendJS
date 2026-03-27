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

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required!")
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
        duration: Number(duration),
        videoFile: cloudinaryVideo.secure_url || cloudinaryVideo.url,
        thumbnail: cloudinaryThumbnail.secure_url || cloudinaryThumbnail.url,
        owner,
        public_id: cloudinaryVideo.public_id
    })

    if (!createdVideo) {
        throw new ApiError(500, "Failed to create video")
    }

    return res.status(201).json(
        new ApiResponse(201, createdVideo, "Video uploaded successfully")
    )

})

const getAllVideos = asyncHandler(async (req, res) => {
    const videoList = await Video.find().populate("owner", "fullName username avatar createdAt");
    return res.status(200)
        .json(
            new ApiResponse(200, videoList, "Videos fetched successfully")
        )
})

const updateVideoDetails = asyncHandler(async (req, res) => {

    // NOT allow changing the video file itself
    // If you want a new video → you must re-upload

    // you can update these things Title Description Thumbnail

    // Steps:
    // 1. Click on the video you want to edit
    // 2. you can now edit the deatils
    // 3. click update
    // 4. click save

    // we should have that video to update the deatils
    // u have clicked on video means u have the url ,and can get the ID of video from req.params

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video is Required")
    }

    const { title, description } = req.body

    const thumbnailPath = req.file?.path

    if (!title && !description && !thumbnailPath) {
        throw new ApiError(400, "At least one field is required to update")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "Video not FOUND")
    }

    // Check if user is the owner
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to edit this video")
    }

    if (title !== undefined) video.title = title;
    if (description !== undefined) video.description = description;

    if (thumbnailPath) {
        const cloudinaryThumbnail = await uploadOnCloudinary(thumbnailPath)
        if (!cloudinaryThumbnail) {
            throw new ApiError(500, "Failed to upload thumbnail on cloudinary")
        }
        video.thumbnail = cloudinaryThumbnail.secure_url || cloudinaryThumbnail.url
    }

    await video.save({ validateBeforesave: false })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                video,
                "Video updated successfully"
            )
        )

})

const getYourVideos = asyncHandler(async (req, res) => {
    const UserId = req.user._id

    const videoList = await Video.aggregate([
        {
            $match: {
                owner: UserId
            }
        }
    ])

    if (!videoList) {
        throw new ApiError(400, "No video found")
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                videoList,
                "Videos fetched successfully"
            )
        )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params // FIX 1: Destructure videoId from req.params

    if (!videoId) {
        throw new ApiError(400, "VideoId is required")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "Video not found")
    }

    // FIX 2: Security check - ensure only the owner can delete the video
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video")
    }

    // FIX 3: Correctly delete the document using findByIdAndDelete
    await Video.findByIdAndDelete(videoId)

    // TODO: Ideally, you should also delete the video and thumbnail from Cloudinary here
    // using video.videoFile and video.thumbnail URLs to save storage space.

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Video deleted successfully"
            )
        )
})

export {
    uploadVideo,
    getAllVideos,
    updateVideoDetails,
    getYourVideos,
    deleteVideo
}
