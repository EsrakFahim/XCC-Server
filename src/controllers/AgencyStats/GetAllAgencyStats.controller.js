import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { AgencyStats } from "../../models/AgencyStats/AgencyStats.model.js";

const getAllAgencyStats = asyncHandler(async (req, res) => {
      try {
            // Fetch all agency stats entries
            const allAgencyStats = await AgencyStats.find();

            // Send a success response
            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              allAgencyStats,
                              "All agency stats entries retrieved successfully."
                        )
                  );
      } catch (error) {
            // General error handling
            throw new apiErrorHandler(500, error.message);
      }
});

export { getAllAgencyStats };
