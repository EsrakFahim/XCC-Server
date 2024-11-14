import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { PricingPlan } from "../../models/Prices/Prices.model.js";

const getAllPricePlans = asyncHandler(async (req, res) => {
      try {
            // Fetch all pricing plans
            const pricePlans = await PricingPlan.find();

            // Return the pricing plans
            return res
                  .status(200)
                  .json(new apiResponse(200, pricePlans, "Success"));
      } catch (error) {
            throw new apiErrorHandler(400, error.message);
      }
});

export { getAllPricePlans };
