import { asyncHandler } from "../../../utils/asyncHandler.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { apiErrorHandler } from "../../../utils/apiErrorHandler.js";
import { HomePage } from "../../../models/Pages/Homepage.model.js";
import { uploadFileCloudinary } from "../../../FileHandler/Upload.js";

// Controller to edit an existing home page entry
const editHomeItems = asyncHandler(async (req, res) => {
      const { title, subTitle, videoText, callToAction, isActive } = req.body;
      const { bannerImage, video } = req.files;

      try {
            // Find the existing home page entry
            const existingHomePage = await HomePage.findOne();
            if (!existingHomePage) {
                  throw new apiErrorHandler(404, "Home page entry not found.");
            }

            // Update fields only if new values are provided
            existingHomePage.title = title || existingHomePage.title;
            existingHomePage.subTitle = subTitle || existingHomePage.subTitle;
            existingHomePage.videoText =
                  videoText || existingHomePage.videoText;
            existingHomePage.callToAction = {
                  text:
                        callToAction?.text ||
                        existingHomePage.callToAction.text,
                  url: callToAction?.url || existingHomePage.callToAction.url,
            };

            // Process and update bannerImage if provided
            if (bannerImage) {
                  const uploadedBannerImage = await uploadFileCloudinary(
                        bannerImage[0].path
                  );
                  if (uploadedBannerImage) {
                        existingHomePage.bannerImageUrl =
                              uploadedBannerImage.secure_url;
                  } else {
                        throw new apiErrorHandler(
                              500,
                              "Error uploading banner image."
                        );
                  }
            }

            // Process and update video if provided
            if (video) {
                  const uploadedVideo = await uploadFileCloudinary(
                        video[0].path
                  );
                  if (uploadedVideo) {
                        existingHomePage.videoUrl = uploadedVideo.secure_url;
                  } else {
                        throw new apiErrorHandler(
                              500,
                              "Error uploading video."
                        );
                  }
            }

            // Update isActive if provided
            existingHomePage.isActive =
                  isActive !== undefined ? isActive : existingHomePage.isActive;

            // Save the updated home page entry
            const updatedHomePage = await existingHomePage.save();

            // Send success response
            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              updatedHomePage,
                              "Home page entry updated successfully."
                        )
                  );
      } catch (error) {
            // Handle any errors during the update process
            throw new apiErrorHandler(500, error.message);
      }
});

export { editHomeItems };
