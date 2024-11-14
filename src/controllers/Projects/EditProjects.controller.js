// controllers/Projects/EditProjects.controller.js
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { uploadFileCloudinary } from "../../FileHandler/Upload.js";
import { Projects } from "../../models/Projects/Projects.model.js";

const EditProject = asyncHandler(async (req, res) => {
      const { projectId } = req.params;
      const {
            title,
            description,
            location,
            client,
            projectType,
            startDate,
            endDate,
            strategies,
            approach,
            results,
            receivedGoals,
            isFeatured,
            isSliderActive,
            testimonial,
            seo,
      } = req.body;

      // Find the project by ID
      const existingProject = await Projects.findById(projectId);
      if (!existingProject) {
            throw new apiErrorHandler(404, "Project not found");
      }

      // Handle file uploads
      const showcaseImageUrls = existingProject.showcaseImages || [];
      const additionalImageUrls = existingProject.additionalImages || [];
      let coverImageUrl = existingProject.coverImage;

      if (req.files) {
            const { coverImage, showcaseImages, additionalImages } = req.files;

            // Upload new cover image if provided
            if (coverImage && coverImage[0]) {
                  const uploadedCover = await uploadFileCloudinary(coverImage[0].path);
                  coverImageUrl = uploadedCover?.url || coverImageUrl;
            }

            // Upload and update showcase images
            if (showcaseImages && showcaseImages.length > 0) {
                  for (const file of showcaseImages) {
                        const uploadedFile = await uploadFileCloudinary(file.path);
                        if (uploadedFile) {
                              showcaseImageUrls.push({
                                    url: uploadedFile.url,
                                    name: file.originalname,
                              });
                        }
                  }
            }

            // Upload and update additional images
            if (additionalImages && additionalImages.length > 0) {
                  for (const file of additionalImages) {
                        const uploadedFile = await uploadFileCloudinary(file.path);
                        if (uploadedFile) {
                              additionalImageUrls.push({
                                    url: uploadedFile.url,
                                    name: file.originalname,
                              });
                        }
                  }
            }
      }

      // Update project fields if provided, else keep existing values
      existingProject.title = title || existingProject.title;
      existingProject.description = description || existingProject.description;
      existingProject.location = location || existingProject.location;
      existingProject.client = client || existingProject.client;
      existingProject.projectType = projectType || existingProject.projectType;
      existingProject.startDate = startDate || existingProject.startDate;
      existingProject.endDate = endDate || existingProject.endDate;
      existingProject.strategies = strategies || existingProject.strategies;
      existingProject.approach = approach || existingProject.approach;
      existingProject.results = results || existingProject.results;
      existingProject.receivedGoals = receivedGoals || existingProject.receivedGoals;
      existingProject.isFeatured = isFeatured ?? existingProject.isFeatured;
      existingProject.isSliderActive = isSliderActive ?? existingProject.isSliderActive;
      existingProject.testimonial = testimonial || existingProject.testimonial;
      existingProject.seo = seo || existingProject.seo;
      existingProject.coverImage = coverImageUrl;
      existingProject.showcaseImages = showcaseImageUrls.length > 0 ? showcaseImageUrls : existingProject.showcaseImages;
      existingProject.additionalImages = additionalImageUrls.length > 0 ? additionalImageUrls : existingProject.additionalImages;

      // Save the updated project
      const updatedProject = await existingProject.save({
            validateBeforeSave: false,
      });

      if (!updatedProject) {
            throw new apiErrorHandler(500, "Error updating project");
      }

      // Send a success response
      return res.status(200).json(new apiResponse(200, updatedProject, "Project updated successfully"));
});

export { EditProject };
