import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { uploadFileCloudinary } from "../../FileHandler/Upload.js";
import { OurServices } from "../../models/OurServices/OurServices.model.js";

// Utility function for field validation
const validateFields = (fields) => {
      return Object.values(fields).every((field) => field !== undefined && field !== null);
};

export const CreateServices = asyncHandler(async (req, res) => {
      // Extract data from the request
      const {
            title,
            planning,
            capabilities,
            approach,
            workProcess,
            relatedServices,
            seo,
            isActive,
      } = req.body;

      const { coverImage, icon } = req.files;

      // Validate required fields
      const areFieldsValid = validateFields({
            title,
            planning,
            capabilities,
            approach,
            workProcess,
            relatedServices,
            seo,
            coverImage,
            icon,
      });

      if (!areFieldsValid || isActive === undefined) {
            return apiErrorHandler(res, 400, "Please provide all required fields and images");
      }

      try {
            // Check if service with the same title already exists
            const existingService = await OurServices.findOne({ title }).lean();
            if (existingService) {
                  return apiErrorHandler(res, 400, "Service already exists");
            }

            // Use Promise.all for parallel uploads to Cloudinary
            const [uploadedCoverImage, uploadedIcon] = await Promise.all([
                  uploadFileCloudinary(coverImage[0].path),
                  uploadFileCloudinary(icon[0].path),
            ]);

            if (!uploadedCoverImage || !uploadedIcon) {
                  return apiErrorHandler(res, 500, "Error uploading images");
            }

            // Create the new service in the database
            const service = new OurServices({
                  title,
                  planning,
                  capabilities: JSON.parse(capabilities),
                  approach,
                  workProcess: JSON.parse(workProcess),
                  relatedServices: JSON.parse(relatedServices),
                  seo,
                  isActive: isActive || false,
                  coverImage: uploadedCoverImage.url,
                  icon: uploadedIcon.url,
            });

            await service.save();

            return res.status(201).json(
                  new apiResponse(201, "Service created successfully", service)
            );
      } catch (error) {
            console.error("CreateServices Error: ", error);
            return apiErrorHandler(res, 500, "Server error, please try again later");
      }
});
