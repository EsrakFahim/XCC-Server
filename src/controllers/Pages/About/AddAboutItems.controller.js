import { asyncHandler } from "../../../utils/asyncHandler.js";
import { apiResponse } from "../../../utils/apiResponse.js";
import { apiErrorHandler } from "../../../utils/apiErrorHandler.js";
import { About } from "../../../models/Pages/About/About.model.js";
import { uploadFileCloudinary } from "../../../FileHandler/Upload.js";

// Controller to create a new About entry
const addAboutItems = asyncHandler(async (req, res) => {
      const {
            title,
            description,
            whyWeTitle,
            whyWeDescription,
            benefits,
            isActive,
      } = req.body;

      const { whyWeImage, images } = req.files;

      // Check if a home page entry already exists (if you want to allow only one entry)
      const existingAboutPage = await About.findOne();
      if (existingAboutPage) {
            throw new apiErrorHandler(
                  400,
                  "An About page entry already exists. Please update the existing one."
            );
      }

      // Ensure required fields are provided
      if (
            !title ||
            !description ||
            !images ||
            !whyWeTitle ||
            !whyWeDescription ||
            !whyWeImage
      ) {
            throw new apiErrorHandler(
                  400,
                  "Title, Description, Images, Why We Title, Why We Description, and Why We Image are required."
            );
      }

      // Process file uploads
      let uploadedFiles = [];
      if (images && images.length > 0) {
            for (const image of images) {
                  const uploadedFile = await uploadFileCloudinary(
                        image[0].path
                  );
                  if (uploadedFile) {
                        uploadedFiles.push({
                              imageUrl: uploadedFile.url,
                              altText: image.originalname,
                        });
                  }
            }
      }
      const whyWeImageURL = await uploadFileCloudinary(whyWeImage[0].path);

      try {
            // Create a new About document
            const about = await About.create({
                  title,
                  description,
                  images: uploadedFiles || [],
                  whyWeTitle,
                  whyWeDescription,
                  whyWeImage: whyWeImageURL.secure_url,
                  benefits: benefits || [],
                  isActive: isActive !== undefined ? isActive : true,
            });

            // Send success response
            return res
                  .status(201)
                  .json(
                        new apiResponse(
                              201,
                              about,
                              "About item created successfully."
                        )
                  );
      } catch (error) {
            // Handle any errors that occur during the process
            throw new apiErrorHandler(500, error.message);
      }
});

export { addAboutItems };
