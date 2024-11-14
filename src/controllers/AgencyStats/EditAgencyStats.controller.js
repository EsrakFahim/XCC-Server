import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { AgencyStats } from "../../models/AgencyStats/AgencyStats.model.js";

// Controller to update an existing agency stats entry
const updateAgencyStats = asyncHandler(async (req, res) => {
      const { id } = req.params;

      // Check if an ID is provided
      if (!id) {
            throw new apiErrorHandler(400, "Agency Stats ID is required.");
      }

      try {
            // Find the existing document by ID
            const existingAgencyStats = await AgencyStats.findById(id);
            if (!existingAgencyStats) {
                  throw new apiErrorHandler(
                        404,
                        "Agency Stats entry not found."
                  );
            }

            // Update only the fields provided in req.body
            const allowedFields = [
                  "title",
                  "description",
                  "statistics",
                  "isActive",
            ];
            allowedFields.forEach((field) => {
                  if (req.body[field] !== undefined) {
                        existingAgencyStats[field] = req.body[field];
                  }
            });

            // Save the updated document
            const updatedAgencyStats = await existingAgencyStats.save({
                  validateBeforeSave: false,
            });

            // Send success response with the updated document
            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              updatedAgencyStats,
                              "Agency stats entry updated successfully."
                        )
                  );
      } catch (error) {
            // General error handling
            throw new apiErrorHandler(500, error.message);
      }
});

export { updateAgencyStats };
