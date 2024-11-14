import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { uploadFileCloudinary } from "../../FileHandler/Upload.js";
import { Projects } from "../../models/Projects/Projects.model.js";

const EditProject = asyncHandler(async (req, res, next) => {
      try {
            const { _id } = req.params; // Get project ID from request params

            const {
                  name,
                  description,
                  client,
                  projectType,
                  status,
                  startDate,
                  endDate,
                  projectManager,
                  team,
                  budget,
                  spent,
                  tech,
                  notes,
                  livePreview,
                  sourceFile,
                  isActive,
            } = req.body;

            // Destructure files from request (if any)
            const { files } = req.files;

            // Check if a project with the same _id exists
            const existingProject = await Projects.findOne({ _id });

            if (!existingProject) {
                  throw new apiErrorHandler(404, res, "Project not found");
            }

            // Update fields only if they are different from existing values
            const updatedFields = {};

            if (name && name !== existingProject.name)
                  updatedFields.name = name;
            if (description && description !== existingProject.description)
                  updatedFields.description = description;
            if (client && client !== existingProject.client)
                  updatedFields.client = client;
            if (projectType && projectType !== existingProject.projectType)
                  updatedFields.projectType = projectType;
            if (status && status !== existingProject.status)
                  updatedFields.status = status;
            if (startDate && startDate !== existingProject.startDate)
                  updatedFields.startDate = startDate;
            if (endDate && endDate !== existingProject.endDate)
                  updatedFields.endDate = endDate;
            if (
                  projectManager &&
                  projectManager !== existingProject.projectManager
            )
                  updatedFields.projectManager = projectManager;
            if (
                  team &&
                  JSON.stringify(team) !== JSON.stringify(existingProject.team)
            )
                  updatedFields.team = team;
            if (budget !== undefined && budget !== existingProject.budget)
                  updatedFields.budget = budget;
            if (spent !== undefined && spent !== existingProject.spent)
                  updatedFields.spent = spent;
            if (
                  tech &&
                  JSON.stringify(tech) !== JSON.stringify(existingProject.tech)
            )
                  updatedFields.tech = tech;
            if (notes && notes !== existingProject.notes)
                  updatedFields.notes = notes;
            if (livePreview && livePreview !== existingProject.livePreview)
                  updatedFields.livePreview = livePreview;
            if (sourceFile && sourceFile !== existingProject.sourceFile)
                  updatedFields.sourceFile = sourceFile;
            if (isActive !== undefined && isActive !== existingProject.isActive)
                  updatedFields.isActive = isActive;

            // Handle file uploads if provided
            let uploadedFiles = [];
            if (files && files.length > 0) {
                  for (const file of files) {
                        const uploadedFile = await uploadFileCloudinary(
                              file[0].path
                        );
                        if (uploadedFile) {
                              uploadedFiles.push({
                                    url: uploadedFile.url,
                                    name: file.originalname,
                              });
                        }
                  }
            }

            // If there are no changes, return the existing project data
            if (Object.keys(updatedFields).length === 0) {
                  return res
                        .status(200)
                        .json(
                              new apiResponse(
                                    200,
                                    "No changes detected",
                                    existingProject
                              )
                        );
            }

            // Update the project with the new changes
            const updatedProject = await Projects.findByIdAndUpdate(
                  _id,
                  updatedFields,
                  {
                        new: true,
                  }
            );

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              "Project updated successfully",
                              updatedProject
                        )
                  );
      } catch (error) {
            throw new apiErrorHandler(500, res, error.message);
      }
});

export { EditProject };
