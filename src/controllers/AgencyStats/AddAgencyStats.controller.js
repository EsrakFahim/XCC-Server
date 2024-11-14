import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { AgencyStats } from "../../models/AgencyStats/AgencyStats.model.js";

// Controller to create a new agency stats entry
const addAgencyStats = asyncHandler(async (req, res) => {
      const { title, description, statistics, isActive } = req.body;

      // Validate required fields
      if (
            !title ||
            !description ||
            !Array.isArray(statistics) ||
            statistics.length === 0
      ) {
            throw new apiErrorHandler(
                  400,
                  "Title, Description, and Statistics are required. Ensure statistics is a non-empty array."
            );
      }

      // Validate statistics entries
      for (const stat of statistics) {
            if (!stat.label || typeof stat.value !== "number") {
                  throw new apiErrorHandler(
                        400,
                        "Each statistic must have a label and a numeric value."
                  );
            }
      }

      try {
            // Create a new agency stats document
            const newAgencyStats = await AgencyStats.create({
                  title,
                  description,
                  statistics,
                  isActive,
            });

            // Send a success response
            return res
                  .status(201)
                  .json(
                        new apiResponse(
                              201,
                              newAgencyStats,
                              "Agency stats entry created successfully."
                        )
                  );
      } catch (error) {
            // Handle potential duplicate key errors or validation issues
            if (error.code === 11000) {
                  throw new apiErrorHandler(
                        409,
                        "An agency stats entry with this title already exists."
                  );
            }

            // General error handling
            throw new apiErrorHandler(500, error.message);
      }
});

export { addAgencyStats };
