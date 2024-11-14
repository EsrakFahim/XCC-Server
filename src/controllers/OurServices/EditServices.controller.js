import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { uploadFileCloudinary } from "../../FileHandler/Upload.js";
import { OurServices } from "../../models/OurServices/OurServices.model.js";

const EditServices = asyncHandler(async (req, res, next) => {
      try {
            // Destructure fields from request body
            const {
                  _id,
                  title,
                  subtitle,
                  description,
                  serviceType,
                  status,
                  includingServices,
                  isFeatured,
            } = req.body;

            // Get uploaded files
            const { coverImage, showcaseImages } = req.files;

            // Ensure service ID is provided
            if (!_id) {
                  throw new apiErrorHandler(res, 400, "Service ID is required");
            }

            // Check if the service with the given ID exists
            const existingService = await OurServices.findById(_id);

            if (!existingService) {
                  throw new apiErrorHandler(res, 404, "Service not found");
            }

            // Prepare an object with fields to update
            const updates = {};

            // Conditionally add fields to the update object if provided
            if (title) updates.title = title;
            if (subtitle) updates.subtitle = subtitle;
            if (description) updates.description = description;
            if (serviceType) updates.serviceType = serviceType;
            if (status) updates.status = status;
            if (includingServices)
                  updates.includingServices = includingServices;
            if (isFeatured !== undefined) updates.isFeatured = isFeatured; // Check specifically for undefined

            // Process image uploads if provided
            if (coverImage) {
                  const coverImagePath = coverImage[0].path;
                  const uploadedCoverImage =
                        await uploadFileCloudinary(coverImagePath);
                  if (uploadedCoverImage) {
                        updates.coverImage = uploadedCoverImage.url;
                  }
            }

            if (showcaseImages) {
                  const showcaseImagesPath = showcaseImages[0].path;
                  const uploadedShowcaseImages =
                        await uploadFileCloudinary(showcaseImagesPath);
                  if (uploadedShowcaseImages) {
                        updates.showcaseImages = uploadedShowcaseImages.url;
                  }
            }

            // Update the service in the database
            const updatedService = await OurServices.findByIdAndUpdate(
                  _id,
                  { $set: updates },
                  { new: true, useFindAndModify: false } // Return the updated document
            );

            // Send the updated service as a response
            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              updatedService,
                              "Service updated successfully"
                        )
                  );
      } catch (error) {
            throw new apiErrorHandler(res, 500, "Internal Server Error");
      }
});

export { EditServices };
