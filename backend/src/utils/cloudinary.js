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
        
        fs.unlinkSync(localFilePath)
        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.log(error.message);
        return null;
    }
}

const deleteFromCloudinary = async(publicId) => {
    try {
        if(!publicId) return null;
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log("file delete from cloudiary failed::", error);
        return error;
    }

}

export { uploadOnCloudinary, deleteFromCloudinary }