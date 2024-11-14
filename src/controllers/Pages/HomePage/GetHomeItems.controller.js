import { asyncHandler } from "../../../utils/asyncHandler.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { apiErrorHandler } from "../../../utils/apiErrorHandler.js";
import { HomePage } from "../../../models/Pages/Homepage.model.js";

// Controller to get all home page entries
const getHomeItems = asyncHandler(async (req, res) => {
      try {
            const homeItems = await HomePage.find();

            if (!homeItems) {
                  throw new apiErrorHandler(404, "No home page entries found.");
            }

            // Send success response
            return res
                  .status(200)
                  .json(new apiResponse(200, homeItems, "Success"));
      } catch (error) {
            throw new apiErrorHandler(500, error.message);
      }
});

export { getHomeItems };
