import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { user } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

console.log("Registering user controller");
const registerUser = asyncHandler(async (req, res) => {

    // Step 1). check that is data is fetched from frontend 
    const { email, username, fullName, password } = req.body;

    // Step 2). check that all fields are filled
    if (!email || !username || !fullName || !password) {
        throw new ApiError(400, "All fields are Required");
    }

    // Step 3). check if User with username or email already exists
    const userExist = await user.findOne({  // this takes time to search in Database
        $or: [{ username }, { email }]
    })

    if (userExist) {
        throw new ApiError(409, "User with email or username already exists")
    }

    // Step 4). Check for images , check avatar image exists
    const avatarPath = req.files?.avatar?.[0]?.path;
    const coverImagePath = req.files?.coverImage?.[0]?.path;

    console.log("Avatar path:", avatarPath);
    console.log("Cover image path:", coverImagePath);

    if (!avatarPath) {
        throw new ApiError(400, "Avatar is required not available in Local server")  // till now files are uploaded to local server 
    }

    // Steps 5). upload images then check that images are uploaded to cloudinary

    const avatar = await uploadOnCloudinary(avatarPath)  // obiviously it is time consuming so use await
    const coverImage = await uploadOnCloudinary(coverImagePath)

    console.log(avatar)
    if (!avatar) {
        throw new ApiError(400, "Avatar is required in Cloudinary")
    }

    // Step 6). create user in database
    const User = await user.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // Step 7). Remove Password and Refresh Token form Response
    const createdUser = await user.findById(User._id).select(
        "-password -refreshToken"
    )

    // Step 8). Check if user is created
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )


})

export { registerUser }