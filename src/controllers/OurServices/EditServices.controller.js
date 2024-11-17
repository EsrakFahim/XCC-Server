import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { uploadFileCloudinary } from "../../FileHandler/Upload.js";
import { OurServices } from "../../models/OurServices/OurServices.model.js";
import generateSlug from "../../utils/generateSlug.js";


const EditServices = asyncHandler(async (req, res) => {
      // Extract data from the request body
      const {
            title,
            planningHeading,
            planningDescription,
            capabilitiesDescription,
            approachHeading,
            approachPoints,
            workProcessStep,
            workProcessDescription,
            relatedServices,
            metaTitle,
            metaDescription,
            keywords,
            isActive,
      } = req.body;

      const { coverImage, icon } = req.files;

      try {
            // Find the service by its ID
            const serviceId = req.params.id;
            const service = await OurServices.findById(serviceId);

            if (!service) {
                  throw new apiErrorHandler(404, "Service not found");
            }

            // Check if the title is being changed and if the new title already exists
            if (title && service.title !== title) {
                  const existingService = await OurServices.findOne({ title }).lean();
                  if (existingService) {
                        throw new apiErrorHandler(400, "Service with the new title already exists");
                  }
                  service.title = title;
                  // generate a new slug
                  service.slug = generateSlug(title);
            }



            // Upload new images to Cloudinary if provided
            if (coverImage) {
                  const uploadedCoverImage = await uploadFileCloudinary(coverImage[0].path);
                  if (!uploadedCoverImage) {
                        throw new apiErrorHandler(500, "Error uploading cover image");
                  }
                  service.coverImage = {
                        url: uploadedCoverImage.url,
                        name: uploadedCoverImage.original_filename,
                        altText: uploadedCoverImage.original_filename,
                  };
            }

            if (icon) {
                  const uploadedIcon = await uploadFileCloudinary(icon[0].path);
                  if (!uploadedIcon) {
                        throw new apiErrorHandler(500, "Error uploading icon");
                  }
                  service.icon = {
                        url: uploadedIcon.url,
                        name: uploadedIcon.original_filename,
                        altText: uploadedIcon.original_filename,
                  };
            }

            // Update only the fields that are provided
            if (planningHeading || planningDescription) {
                  service.planning = {
                        heading: planningHeading || service.planning.heading,
                        description: planningDescription || service.planning.description,
                  };
            }

            if (capabilitiesDescription) {
                  service.capabilities = [
                        {
                              icon: service.icon.url, // Use the existing icon URL
                              description: capabilitiesDescription,
                        },
                  ];
            }

            if (approachHeading || approachPoints) {
                  service.approach = {
                        heading: approachHeading || service.approach.heading,
                        points: approachPoints
                              ? approachPoints.split(",").map((point) => point.trim())
                              : service.approach.points,
                  };
            }

            if (workProcessDescription) {
                  service. workProcess = workProcessDescription
                  .split(",")
                  .map((des, index) => {
                        return {
                              step: `Step ${++index}`,
                              description: des.trim(),
                        };
                  });
            }

            if (relatedServices) {
                  service.relatedServices = relatedServices
                        .split(",")
                        .map((serviceId) => serviceId.trim());
            }

            if (metaTitle || metaDescription || keywords) {
                  service.seo = {
                        metaTitle: metaTitle || service.seo.metaTitle,
                        metaDescription: metaDescription || service.seo.metaDescription,
                        keywords: keywords
                              ? keywords.split(",").map((keyword) => keyword.trim())
                              : service.seo.keywords,
                  };
            }

            // Update the `isActive` status if provided, otherwise retain the current status
            if (isActive !== undefined) {
                  service.isActive = isActive;
            }

            

            await service.save(
                  {
                        validateBeforeSave: false
                  }
            );

            console.log("Service: ", service);

            return res.status(200).json(
                  new apiResponse(200, service, "Service updated successfully")
            );
      } catch (error) {
            console.error("EditServices Error: ", error);
            throw new apiErrorHandler(500, "Server error, please try again later");
      }
});

export { EditServices }