import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { AgencyStats } from "../../models/AgencyStats/AgencyStats.model.js";

const getSingleAgencyStats = asyncHandler(async (req, res) => {
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

            // Send success response with the document
            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              existingAgencyStats,
                              "Agency stats entry retrieved successfully."
                        )
                  );
      } catch (error) {
            // General error handling
            throw new apiErrorHandler(500, error.message);
      }
});

export { getSingleAgencyStats };
