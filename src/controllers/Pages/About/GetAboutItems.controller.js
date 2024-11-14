import { asyncHandler } from "../../../utils/asyncHandler.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { apiErrorHandler } from "../../../utils/apiErrorHandler.js";
import { About } from "../../../models/Pages/About/About.model.js";

// Controller to get all About page entries
const getAboutItems = asyncHandler(async (req, res) => {
      try {
            const aboutItems = await About.find();

            if (!aboutItems) {
                  throw new apiErrorHandler(
                        404,
                        "No About page entries found."
                  );
            }

            // Send success response
            return res
                  .status(200)
                  .json(new apiResponse(200, aboutItems, "Success"));
      } catch (error) {
            throw new apiErrorHandler(500, error.message);
      }
});

export { getAboutItems };
