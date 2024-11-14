import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { OurServices } from "../../models/OurServices/OurServices.model.js";

const GetAllServices = asyncHandler(async (req, res, next) => {
      try {
            // Get all services
            const services = await OurServices.find();

            return res
                  .status(200)
                  .json(new apiResponse(200, services, "All services"));
      } catch (error) {
            throw new apiErrorHandler(res, 500, error.message);
      }
});

export { GetAllServices };