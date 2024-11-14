import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { Projects } from "../../models/Projects/Projects.model.js";
import mongoose from "mongoose";

const getSingleProject = asyncHandler(async (req, res, next) => {
      const { id } = req.params; // Get project ID from request params
      console.log(id);

      try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return next(new apiErrorHandler(400, "Invalid Project ID"));
            }

            const project = await Projects.findOne({ _id: id });

            if (!project) {
                  throw new apiErrorHandler(404, "Project not found");
            }

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              project,
                              "Project fetched successfully"
                        )
                  );
      } catch (error) {
            throw new apiErrorHandler(500, error.message);
      }
});

export { getSingleProject };
