import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

cloudinary.config({
    cloud_name: "drfbp3hjc",
    api_key: "843982672212197",
    api_secret: "IWXofIaSrkDBmIv0fdqm_Enjmdc",
});

const uploadOnCloudinary = async (localFilePath, publicId) => {
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            public_id: publicId
        })
        // console.log("File is uploaded on cloudinary", response.url);
        
        fs.unlinkSync(localFilePath)
        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log(error.message);
        return null;
    }
}

// to delete file from cloudinary
const deleteFromCloudinary = async(publicId) => {
    try {
        if(!publicId) return null;
        const response = await cloudinary.uploader.destroy(publicId);
        // console.log("file deleted",response);
    } catch (error) {
        console.log("file delete from cloudiary failed::", error);
        return error;
    }

}

export { uploadOnCloudinary, deleteFromCloudinary }