import { asyncHandler } from "../../../utils/asyncHandler.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { apiErrorHandler } from "../../../utils/apiErrorHandler.js";
import { HomePage } from "../../../models/Pages/Homepage.model.js";
import { uploadFileCloudinary } from "../../../FileHandler/Upload.js";

// Controller to create a new home page entry
const addHomeItems = asyncHandler(async (req, res) => {
      const { title, subTitle, videoText, callToAction, isActive } = req.body;

      const { bannerImage, video } = req.files;

      // Ensure required fields are provided
      if (!title || !subTitle || !videoText || !video || !bannerImage) {
            throw new apiErrorHandler(
                  400,
                  "Title, SubTitle, Video Text, Video URL, and Banner Image URL are required."
            );
      }

      try {
            // Check if a home page entry already exists (if you want to allow only one entry)
            const existingHomePage = await HomePage.findOne();
            if (existingHomePage) {
                  throw new apiErrorHandler(
                        400,
                        "A home page entry already exists. Please update the existing one."
                  );
            }

            // Process file uploads
            const uploadedBannerImage = await uploadFileCloudinary(
                  bannerImage[0].path
            );
            const uploadedVideo = await uploadFileCloudinary(video[0].path);

            if (!uploadedBannerImage || !uploadedVideo) {
                  throw new apiErrorHandler(500, "Error uploading files.");
            }

            // Create a new home page document
            const homePage = await HomePage.create({
                  title,
                  subTitle,
                  videoText,
                  videoUrl: uploadedVideo.secure_url,
                  bannerImageUrl: uploadedBannerImage.secure_url,
                  callToAction: {
                        text: callToAction?.text || "Get Started",
                        url: callToAction?.url || null,
                  },
                  isActive: isActive !== undefined ? isActive : true,
            });

            // Send success response
            return res
                  .status(201)
                  .json(
                        new apiResponse(
                              201,
                              homePage,
                              "Home page entry created successfully."
                        )
                  );
      } catch (error) {
            // Handle potential duplicate key or validation errors
            throw new apiErrorHandler(500, error.message);
      }
});

export { addHomeItems };
