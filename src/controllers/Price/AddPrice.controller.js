import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { PricingPlan } from "../../models/Prices/Prices.model.js";

// Controller to create a new pricing plan
const createPricingPlan = asyncHandler(async (req, res) => {
      const {
            title,
            monthlyPrice,
            yearlyPrice,
            currency,
            published,
            features = [],
            btnText,
            isActive,
            // createdBy,
            // updatedBy,
      } = req.body;

      // Check if there are already 3 existing plans
      const existingPlanCount = await PricingPlan.countDocuments();
      if (existingPlanCount >= 3) {
            throw new apiErrorHandler(
                  400,
                  "You have reached the maximum limit of 3 pricing plans."
            );
      }

      // Ensure required fields are provided
      if (!title || !monthlyPrice || !yearlyPrice) {
            throw new apiErrorHandler(
                  400,
                  "Title, Monthly Price, Yearly Price, and Created By fields are required."
            );
      }

      // Validate features array length
      if (features.length > 20) {
            throw new apiErrorHandler(
                  400,
                  "Features list should not exceed 20 items."
            );
      }

      try {
            // Create a new pricing plan document
            const pricingPlan = await PricingPlan.create({
                  title,
                  monthlyPrice,
                  yearlyPrice,
                  currency: currency || "$",
                  published: published || false,
                  features,
                  btnText: btnText || "Contact Now",
                  isActive: isActive ?? true,
                  // createdBy,
                  // updatedBy,
            });

            // Send success response
            return res
                  .status(201)
                  .json(
                        new apiResponse(
                              201,
                              pricingPlan,
                              "Pricing plan created successfully"
                        )
                  );
      } catch (error) {
            // Handle potential duplicate key errors (e.g., unique title or planId)
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

export { createPricingPlan };
