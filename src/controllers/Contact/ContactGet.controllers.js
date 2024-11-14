import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { Contact } from "../../models/Contact/contact.model.js";

const getContact = asyncHandler(async (req, res, next) => {
      try {
            const contact = await Contact.findOne();

            // Check if contact data exists
            if (!contact) {
                  throw new apiErrorHandler(res, 404, "Contact not found");
            }

            // Send successful response with contact data
            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              "Contact retrieved successfully",
                              contact
                        )
                  );
      } catch (error) {
            // Handle server error
            throw new apiErrorHandler(res, 500, "Server error");
      }
});

export { getContact };
