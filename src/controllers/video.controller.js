import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

console.log("Registering video controller");

const uploadVideo = asyncHandler(async(req,res)=>{

    // Step 1).  take inputs from user of thumbnail and videofile
    cons

})