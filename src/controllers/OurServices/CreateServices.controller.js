import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { uploadFileCloudinary } from "../../FileHandler/Upload.js";
import { OurServices } from "../../models/OurServices/OurServices.model.js";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

// Utility function for field validation
const validateFields = (fields) => {
      return Object.values(fields).every((field) => field !== undefined && field !== null);
};

// Utility function to generate a slug from the title
const generateSlug = (title) => {
      return title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || uuidv4(); // Fallback to UUID if title is empty
};

const CreateServices = asyncHandler(async (req, res) => {
      // Extract data from the request body
      const {
            title,
            planningHeading,
            planningDescription,
            capabilitiesDescription,
            approachHeading,
            approachPoints,
            workProcessDescription,
            relatedServices,
            metaTitle,
            metaDescription,
            keywords,
            isActive,
      } = req.body;

      const { coverImage, icon } = req.files;

      // Validate required fields
      const areFieldsValid = validateFields({
            title,
            planningHeading,
            planningDescription,
            capabilitiesDescription,
            approachHeading,
            workProcessDescription,
            coverImage,
            icon,
      });

      if (!areFieldsValid) {
            throw new apiErrorHandler(400, "Please provide all required fields and images");
      }

      try {
            // Check if a service with the same title already exists
            const existingService = await OurServices.findOne({ title }).lean();
            if (existingService) {
                  throw new apiErrorHandler(400, "Service already exists");
            }

            // Generate a slug
            const slug = generateSlug(title);

            // Check if the slug already exists
            const existingSlug = await OurServices.findOne({ slug }).lean();
            if (existingSlug) {
                  throw new apiErrorHandler(400, "Slug already exists, try a different title");
            }

            // Upload images to Cloudinary in parallel
            const [uploadedCoverImage, uploadedIcon] = await Promise.all([
                  uploadFileCloudinary(coverImage[0].path),
                  uploadFileCloudinary(icon[0].path),
            ]);

            if (!uploadedCoverImage || !uploadedIcon) {
                  throw new apiErrorHandler(500, "Error uploading images");
            }

            // Prepare the uploaded images for the database
            const coverImageUploadDB = {
                  url: uploadedCoverImage.url,
                  name: uploadedCoverImage.original_filename,
                  altText: uploadedCoverImage.original_filename,
            };

            const iconUploadDB = {
                  url: uploadedIcon.url,
                  name: uploadedIcon.original_filename,
                  altText: uploadedIcon.original_filename,
            };

            // Prepare embedded documents and arrays for MongoDB
            const planning = {
                  heading: planningHeading,
                  description: planningDescription,
            };

            const capabilities = [
                  {
                        icon: iconUploadDB.url,
                        description: capabilitiesDescription,
                  },
            ];


            const approach = {
                  heading: approachHeading,
                  points: approachPoints ? approachPoints.split(",").map((point) => point.trim()) : [],
            };

            const workProcess = workProcessDescription.split(",").map((des, index) => {
                  return {
                        step: `Step ${++index}`,
                        description: des.trim(),
                  };
            });

            console.log("relatedServices: ", relatedServices);

            const relatedServicesArray = relatedServices
                  ? relatedServices.split(",").map((serviceId) => serviceId.trim())
                  : [];

            console.log("relatedServicesArray: ", relatedServicesArray);

            const seo = {
                  metaTitle,
                  metaDescription,
                  keywords: keywords ? keywords.split(",").map((keyword) => keyword.trim()) : [],
            };

            // Create the new service in the database
            const service = new OurServices({
                  title,
                  slug, // Include the generated slug
                  planning,
                  capabilities,
                  approach,
                  workProcess,
                  seo,
                  relatedServices: relatedServicesArray,
                  isActive: isActive || false,
                  coverImage: coverImageUploadDB,
                  icon: iconUploadDB,
            });

            await service.save();

            return res.status(201).json(
                  new apiResponse(201, service, "Service created successfully")
            );
      } catch (error) {
            console.error("CreateServices Error: ", error);
            throw new apiErrorHandler(500, "Server error, please try again later");
      }
});


export { CreateServices };