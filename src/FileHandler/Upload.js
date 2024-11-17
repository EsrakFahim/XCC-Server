import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises"; // Use the promise-based version of fs

// Configuring Cloudinary
cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file to Cloudinary
const uploadFileCloudinary = async (file) => {
      console.log("Uploading file to Cloudinary:", file);
      try {
            if (!file) return null;

            // Uploading to Cloudinary
            const res = await cloudinary.uploader.upload(file, {
                  resource_type: "image", // Specify image type if mostly images
                  folder: "about_images", // Optional: Specify a folder for organization
                  use_filename: true,
                  unique_filename: false, // Keep original filename
                  overwrite: true, // Overwrite if file already exists with same name
            });

            // Asynchronously delete the file after upload
            await fs.unlink(file);

            return res;
      } catch (error) {
            console.log("Error uploading file to Cloudinary:", error);

            // Ensure the temp file is deleted even if upload fails
            try {
                  await fs.unlink(file);
            } catch (unlinkError) {
                  console.log("Error deleting local file:", unlinkError);
            }
            return null;
      }
};

// Delete file from Cloudinary
const deleteFileCloudinary = async (publicID, resourceType = "image") => {
      try {
            if (!publicID) return null;

            const res = await cloudinary.uploader.destroy(publicID, {
                  resource_type: resourceType,
            });

            return res;
      } catch (error) {
            console.log("Error deleting file from Cloudinary:", error);
            return null;
      }
};

export { uploadFileCloudinary, deleteFileCloudinary };
