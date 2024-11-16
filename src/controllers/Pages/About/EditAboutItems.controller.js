import { asyncHandler } from "../../../utils/asyncHandler.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { apiErrorHandler } from "../../../utils/apiErrorHandler.js";
import { About } from "../../../models/Pages/About/About.model.js";
import { uploadFileCloudinary } from "../../../FileHandler/Upload.js";

// Controller to edit an existing About entry
const editAboutItems = asyncHandler(async (req, res) => {
      const {
            title,
            description,
            whyUsTitle,
            isActive,
      } = req.body;

      const { image } = req.files;

      try {
            // Find the existing About entry
            const existingAbout = await About.findOne();
            if (!existingAbout) {
                  throw new apiErrorHandler(404, "About page entry not found.");
            }

            // Update fields only if new values are provided
            existingAbout.title = title || existingAbout.title;
            existingAbout.description =
                  description || existingAbout.description;
            existingAbout.whyUsTitle = whyUsTitle || existingAbout.whyUsTitle;

            // Process images array only if new images are provided
            if (image && image.length > 0) {
                  const uploadedFiles = [];
                  const uploadedFile = await uploadFileCloudinary(
                        image[0].path
                  );
                  if (uploadedFile) {
                        uploadedFiles.push({
                              imageUrl: uploadedFile.url,
                              altText: image.originalname,
                        });
                  }
                  existingAbout.image =
                        uploadedFiles.length > 0
                              ? uploadedFiles
                              : existingAbout.image;
            }

            // Update isActive field if provided
            existingAbout.isActive =
                  isActive !== undefined ? isActive : existingAbout.isActive;

            // Save the updated About entry
            const updatedAbout = await existingAbout.save(
                  {
                        validateBeforeSave: false,
                  }
            );

            // Send success response
            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              updatedAbout,
                              "About item updated successfully."
                        )
                  );
      } catch (error) {
            // Handle any errors that occur during the process
            throw new apiErrorHandler(500, error.message);
      }
});

export { editAboutItems };
