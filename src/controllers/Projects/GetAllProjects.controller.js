import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { Projects } from "../../models/Projects/Projects.model.js";

const getAllProjects = asyncHandler(async (req, res, next) => {
      const { page = 1, limit = 10 } = req.query;

      // Convert page and limit to integers
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      try {
            // Fetch projects with pagination
            const projects = await Projects.find({})
                  .skip((pageNumber - 1) * limitNumber)
                  .limit(limitNumber);

            // Get the total count of projects
            const totalProjects = await Projects.countDocuments();

            return res.status(200).json(
                  new apiResponse(
                        200,
                        {
                              projects,
                              total: totalProjects,
                              currentPage: pageNumber,
                              totalPages: Math.ceil(
                                    totalProjects / limitNumber
                              ),
                        },
                        "Projects fetched successfully"
                  )
            );
      } catch (error) {
            throw new apiErrorHandler(500, error.message);
      }
});

// Controller to get the list of project types
const getProjectTypes = asyncHandler(async (req, res, next) => {
      try {
            // Extracting the enum values for projectType from the schema
            const projectTypes = Projects.schema.path("projectType").enumValues;

            // Return the project types array as a JSON response
            res.status(200).json({
                  success: true,
                  data: projectTypes,
            });
      } catch (error) {
            next(new apiErrorHandler(500, error.message));
      }
});

export { getAllProjects, getProjectTypes };
