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

    // Convert Cloudinary URL to force MP4 delivery (browser-compatible)
    // Cloudinary may return an HLS stream URL by default, which native <video> can't play.
    // By injecting f_mp4,vc_auto into the URL path, we force a direct MP4 delivery URL.
    const makePlayableUrl = (url) => {
        if (!url) return url;
        // Insert Cloudinary transformation before the version/filename segment
        return url.replace('/upload/', '/upload/f_mp4,vc_auto/');
    };

    const createdVideo = await Video.create({
        title,
        description,
        duration: Number(duration),
        videoFile: makePlayableUrl(cloudinaryVideo.secure_url || cloudinaryVideo.url),
        thumbnail: cloudinaryThumbnail.secure_url || cloudinaryThumbnail.url,
        owner
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

    const { thumbnailPath } = req.file?.path

    if (!title && description && !thumbnailPath) {
        throw new ApiError(400, "All fields are required")
    }

    // abb sare variable mil gye hai , bss update krna baaki hai

    const video = Video.findById(videoId)

    if (!video) {
        throw new ApiError(400, "Video not FOUND")
    }

    video.title = title
    video.description = description

    // now i have update the title and description of the video

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

export {
    uploadVideo,
    getAllVideos,
    updateVideoDetails,
    getYourVideos
}
