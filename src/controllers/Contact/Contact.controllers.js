import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { Contact } from "../../models/Contact/contact.model.js";

const createContact = asyncHandler(async (req, res, next) => {
      const {
            email,
            phone,
            website,
            linkedin,
            twitter,
            facebook,
            instagram,
            pinterest,
            upwork,
            behance,
            github,
            fiverr,
            address,
      } = req.body;

      // Ensure either email or phone is provided
      if (!email && !phone) {
            throw new apiErrorHandler(400, "Email or Phone is required.");
      }

      try {
            // Create the contact entry with trimmed fields
            const contact = await Contact.create({
                  email: email?.trim(),
                  phone: phone?.trim(),
                  website: website?.trim(),
                  linkedin: linkedin?.trim(),
                  twitter: twitter?.trim(),
                  facebook: facebook?.trim(),
                  instagram: instagram?.trim(),
                  pinterest: pinterest?.trim(),
                  upwork: upwork?.trim(),
                  behance: behance?.trim(),
                  github: github?.trim(),
                  fiverr: fiverr?.trim(),
                  address: address?.trim(),
            });

            if (!contact) {
                  throw new apiErrorHandler(500, "Failed to create contact entry.");
            }

            // Return successful response with contact data
            return res.status(201).json(new apiResponse(201, contact, "Contact created successfully."));
      } catch (error) {
            // Handle duplicate or other database errors
            if (error.code === 11000) {
                  throw new apiErrorHandler(409, "Duplicate contact entry detected.");
            }

            // Catch-all error handling
            throw new apiErrorHandler(500, error.message);
      }
});

export { createContact };
