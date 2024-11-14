import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { uploadFileCloudinary } from "../../FileHandler/Upload.js";
import { OurServices } from "../../models/OurServices/OurServices.model.js";

const CreateServices = asyncHandler(async (req, res, next) => {
      try {
            // Get all services
            const {
                  title,
                  subtitle,
                  description,
                  serviceType,
                  status,
                  includingServices,
                  isFeatured,
            } = req.body;

            // Get all images
            const { coverImage, showcaseImages } = req.files;

            // Check if required fields are provided
            if (
                  !title ||
                  !subtitle ||
                  !description ||
                  !serviceType ||
                  !status ||
                  !includingServices ||
                  isFeatured === undefined
            ) {
                  throw new apiErrorHandler(
                        res,
                        400,
                        "Please provide all required fields"
                  );
            }

            // Check if required images are provided
            if (!coverImage || !showcaseImages) {
                  throw new apiErrorHandler(
                        res,
                        400,
                        "Please provide all required images"
                  );
            }

            // Check if service with the same title already exists
            const existingService = await OurServices.findOne({ title });
            if (existingService) {
                  throw new apiErrorHandler(res, 400, "Service already exists");
            }

            // Upload images to Cloudinary
            const uploadedCoverImage = await uploadFileCloudinary(
                  coverImage[0].path
            );
            const uploadedShowcaseImages = await uploadFileCloudinary(
                  showcaseImages[0].path
            );

            if (!uploadedCoverImage || !uploadedShowcaseImages) {
                  throw new apiErrorHandler(res, 500, "Error uploading images");
            }

            // Create the new service
            const service = await OurServices.create({
                  title,
                  subtitle,
                  description,
                  coverImage: uploadedCoverImage.url,
                  showcaseImages: uploadedShowcaseImages.url,
                  serviceType,
                  status,
                  includingServices,
                  isFeatured,
            });

            if (!service) {
                  throw new apiErrorHandler(res, 500, "Error creating service");
            }

            return res
                  .status(201)
                  .json(
                        new apiResponse(
                              201,
                              "Service created successfully",
                              service
                        )
                  );
      } catch (error) {
            throw new apiErrorHandler(res, 500, "Server error");
      }
});

export { CreateServices };
