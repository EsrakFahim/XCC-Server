import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { PricingPlan } from "../../models/Prices/Prices.model.js";

const getSinglePricePlan = asyncHandler(async (req, res) => {
      const { id } = req.params; // Extract the plan ID from the URL params

      // Validate ID existence in the URL
      if (!id) {
            throw new apiErrorHandler(400, "Plan ID is required.");
      }

      try {
            // Find the plan by ID
            const pricePlan = await PricingPlan.findById(id);

            // Check if the plan exists
            if (!pricePlan) {
                  throw new apiErrorHandler(404, "Pricing plan not found.");
            }

            // Return the pricing plan
            return res
                  .status(200)
                  .json(new apiResponse(200, pricePlan, "Success"));
      } catch (error) {
            throw new apiErrorHandler(400, error.message);
      }
});

export { getSinglePricePlan };
