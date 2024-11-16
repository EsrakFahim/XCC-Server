import { asyncHandler } from "../../../utils/asyncHandler.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { apiErrorHandler } from "../../../utils/apiErrorHandler.js";
import { About } from "../../../models/Pages/About/About.model.js";
import { uploadFileCloudinary } from "../../../FileHandler/Upload.js";

// Controller to create a new About entry
const addAboutItems = asyncHandler(async (req, res) => {
      const { title, description, whyUsTitle, isActive } = req.body;
      const { image } = req.files;

      // Validate request data
      if (!title || !description || !whyUsTitle || !image) {
            return res.status(400).json(new apiResponse(400, null, "All fields are required."));
      }

      try {
            // Optimize Cloudinary upload
            const uploadedFile = await uploadFileCloudinary(image[0].path);

            // Check if the image was uploaded successfully
            if (!uploadedFile) {
                  throw new Error("Failed to upload image to Cloudinary");
            }

            // Create a new About document in MongoDB
            const about = await About.create({
                  title,
                  description,
                  whyUsTitle,
                  image: {
                        imageUrl: uploadedFile.secure_url,
                        altText: title,
                  },
                  isActive: isActive !== undefined ? isActive : true,
            });

            // Send a success response
            return res.status(201).json(new apiResponse(201, about, "About item created successfully."));
      } catch (error) {
            console.error("Error in addAboutItems controller:", error.message);
            return res.status(500).json(new apiResponse(500, null, "Server error: " + error.message));
      }
});

export { addAboutItems };
