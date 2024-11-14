import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { PricingPlan } from "../../models/Prices/Prices.model.js";

// Controller to edit an existing pricing plan
const editPricingPlan = asyncHandler(async (req, res) => {
      const { _id } = req.params; // Extract the plan ID from the URL params
      const {
            title,
            monthlyPrice,
            yearlyPrice,
            currency,
            published,
            features,
            btnText,
            isActive,
            updatedBy,
      } = req.body;

      // Validate ID existence in the URL
      if (!_id) {
            throw new apiErrorHandler(400, "Plan ID is required.");
      }

      // Validate features array length if provided
      if (features && features.length > 20) {
            throw new apiErrorHandler(
                  400,
                  "Features list should not exceed 20 items."
            );
      }

      try {
            // Find the plan by ID and update it with new data
            const updatedPlan = await PricingPlan.findByIdAndUpdate(
                  _id,
                  {
                        ...(title && { title }),
                        ...(monthlyPrice && { monthlyPrice }),
                        ...(yearlyPrice && { yearlyPrice }),
                        ...(currency && { currency }),
                        ...(published !== undefined && { published }),
                        ...(features && { features }),
                        ...(btnText && { btnText }),
                        ...(isActive !== undefined && { isActive }),
                        updatedBy,
                        lastEditedAt: Date.now(),
                  },
                  {
                        new: true, // Return the updated document
                        runValidators: true, // Validate updates against the schema
                  }
            );

            // Check if the plan exists
            if (!updatedPlan) {
                  throw new apiErrorHandler(404, "Pricing plan not found.");
            }

            // Send success response
            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              updatedPlan,
                              "Pricing plan updated successfully."
                        )
                  );
      } catch (error) {
            // Handle duplicate key errors (e.g., unique title)
            if (error.code === 11000) {
                  throw new apiErrorHandler(
                        409,
                        "A pricing plan with this title or planId already exists."
                  );
            }

            // General error handling
            throw new apiErrorHandler(500, error.message);
      }
});

export { editPricingPlan };
