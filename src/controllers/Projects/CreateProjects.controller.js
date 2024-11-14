// controllers/Projects/CreateProjects.controller.js
import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { uploadFileCloudinary } from "../../FileHandler/Upload.js";
import { Projects } from "../../models/Projects/Projects.model.js";

const CreateProject = asyncHandler(async (req, res) => {
      // Destructure fields from request body
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

      // Validate required fields
      if (!title || !description || !location || !projectType) {
            throw new apiErrorHandler(400, "Please provide all required fields");
      }

      // Check if a project with the same title already exists
      const existingProject = await Projects.findOne({ title });
      if (existingProject) {
            throw new apiErrorHandler(400, "Project already exists");
      }

      // Handle file uploads
      let coverImageUrl = null;
      const showcaseImageUrls = [];
      const additionalImageUrls = [];

      if (req.files) {
            const { coverImage, showcaseImages, additionalImages } = req.files;


            // Upload cover image
            if (coverImage && coverImage[0]) {
                  const uploadedCover = await uploadFileCloudinary(coverImage[0].path);
                  coverImageUrl = uploadedCover?.url || null;
            }

            // Upload showcase images
            if (showcaseImages && showcaseImages.length > 0) {
                  for (const file of showcaseImages) {
                        const uploadedFile = await uploadFileCloudinary(file.path);
                        console.log("uploadedFile", uploadedFile);
                        if (uploadedFile) {
                              showcaseImageUrls.push({
                                    url: uploadedFile.url,
                                    name: file.originalname,
                              });
                        }
                  }
            }

            // Upload additional images
            if (additionalImages && additionalImages.length > 0) {
                  for (const file of additionalImages) {
                        const uploadedFile = await uploadFileCloudinary(file.path);
                        console.log("uploadedFile from additionalImages", uploadedFile);
                        if (uploadedFile) {
                              additionalImageUrls.push({
                                    url: uploadedFile.url,
                                    name: file.originalname,
                              });
                        }
                  }
            }

            console.log("coverImageUrl from in", coverImageUrl);
      }

      console.log("showcaseImageUrls from out", showcaseImageUrls);

      // Create the new project
      const newProject = await Projects.create({
            title,
            description,
            location,
            client: client || "",
            projectType,
            startDate,
            endDate: endDate || null,
            strategies,
            approach,
            results,
            receivedGoals,
            isFeatured,
            isSliderActive,
            testimonial,
            seo,
            coverImage: coverImageUrl,
            showcaseImages: showcaseImageUrls,
            additionalImages: additionalImageUrls,
      });

      if (!newProject) {
            throw new apiErrorHandler(500, "Error creating project");
      }

      // Send a success response
      return res.status(201).json(new apiResponse(201, newProject, "Project created successfully"));
});

export { CreateProject };
