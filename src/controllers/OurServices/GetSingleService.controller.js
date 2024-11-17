import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { OurServices } from "../../models/OurServices/OurServices.model.js";

const getSingleService = asyncHandler(async (req, res, next) => {
      const { slug } = req.params; // Get service ID from request params

      try {
            const service = await OurServices.findById(slug);

            if (!service) {
                  throw new apiErrorHandler(404, "Service not found");
            }

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              service,
                              "Service fetched successfully"
                        )
                  );
      } catch (error) {
            throw new apiErrorHandler(500, error.message);
      }
});

export { getSingleService };
