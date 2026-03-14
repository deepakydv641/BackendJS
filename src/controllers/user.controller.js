import asyncHandler from "../utils/asyncHandler.js";

console.log("Registering user controller");
const registerUser = asyncHandler(async (req, res) => {
    console.log("User registered successfully");
    res.status(200).json({
        message: "ok"
    })
})

export {registerUser}