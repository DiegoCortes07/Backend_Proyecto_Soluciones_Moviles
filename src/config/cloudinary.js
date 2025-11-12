import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
import Randomstring from "randomstring";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure : false
})

export default async function uploadFile(file)  {
    return await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "music-api",
        public_id: Randomstring.generate(12),
        resource_type: "auto"
    });
}

export async function deleteFile(publicId) {
    return await cloudinary.v2.uploader.destroy(publicId, {
        resource_type: "auto"
    });
}
