import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Config cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});

/**
 * 
 * @param {*} localFilePath      Local path of the file which needs to be uploaded  
 * @returns                      A resoponse object
 */
const uploadOnCloudinary = async function (localFilePath, originalFileName) {
    try {
        if (!localFilePath || !originalFileName) {
            return null;
        }

        // Extract the name without extension
        const fileNameWithoutExt = originalFileName.split('.').slice(0, -1).join('.');
        
        // Extract the file extension
        const fileExtension = originalFileName.split('.').pop();

        // Upload the file to Cloudinary with the original name
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Automatically detect file type
            public_id: fileNameWithoutExt, // Set the original file name as the public_id
            format: fileExtension // Ensure the correct format is retained
        });

        // Delete the temporary local file
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        // Delete the temporary local file in case of an error
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

export { uploadOnCloudinary };