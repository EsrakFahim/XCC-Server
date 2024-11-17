import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { OurServices } from "../../models/OurServices/OurServices.model.js";

const DeleteService = asyncHandler(async (req, res) => {
      const { slug } = req.params;
      console.log("Deleting service with slug:" + slug);

      // Check if slug is provided
      if (!slug) {
            throw new apiErrorHandler(400, "Service slug is required");
      }

      try {
            // Check if the service with the given slug exists
            const existingService = await OurServices.findById(slug);
            console.log("Existing Service:", existingService);

            if (!existingService) {
                  throw new apiErrorHandler(404, "Service not found or already deleted");
            }

            // Delete the service
            await OurServices.findByIdAndDelete(slug);

            return res
                  .status(200)
                  .json(new apiResponse(200, {}, "Service deleted successfully"));
      } catch (error) {
            console.error("DeleteService Error:", error);
            throw new apiErrorHandler(500, "Server error, please try again later");
      }
});

export { DeleteService };
