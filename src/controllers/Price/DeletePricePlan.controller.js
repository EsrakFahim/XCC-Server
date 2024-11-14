import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { PricingPlan } from "../../models/Prices/Prices.model.js";

const deletePricingPlan = asyncHandler(async (req, res) => {
      const { _id } = req.params; // Extract the plan ID from the URL params

      // Validate ID existence in the URL
      if (!_id) {
            throw new apiErrorHandler(400, "Plan ID is required.");
      }

      try {
            // Find the plan by ID and delete it
            const deletedPlan = await PricingPlan.findByIdAndDelete(_id);

            // Check if the plan exists
            if (!deletedPlan) {
                  throw new apiErrorHandler(404, "Pricing plan not found.");
            }

            // Return success response
            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              res,
                              "Pricing plan deleted successfully."
                        )
                  );
      } catch (error) {
            throw new apiErrorHandler(400, error.message);
      }
});

export { deletePricingPlan };
