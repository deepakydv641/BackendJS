import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({                                     //  Configration for Cloudinary gives the permission to upload and delete images
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary=async (localfilepath)=>{       // file flow: user->upload->localserver->cloudinary
    try {
        if(!localfilepath) return null
        const response=await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto"
        })
        console.log("File is uploaded on cloudinary", response.url)
        return response
    } catch (error) {
        fs.unlinkSync(localfilepath)  // user upload but failed to upload on cloudinary so delete the local file because it causes memory issues
        return null
    }
}

export {uploadOnCloudinary}