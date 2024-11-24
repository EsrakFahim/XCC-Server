import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { TeamMember } from "../../models/TeamMember/TeamMember.model.js";
import { uploadFileCloudinary } from "../../FileHandler/Upload.js";

// Controller to add a new team member
const addTeamMember = asyncHandler(async (req, res) => {
      const {
            name,
            position,
            experience,
            address,
            phone,
            email,
            personalExperience,
            languages,
      } = req.body;

      // parse education field
      const education = req.body.education ? JSON.parse(req.body.education) : null;
      // parse statistics field
      const statistics = req.body.statistics ? JSON.parse(req.body.statistics) : null;
      
      const { avatar } = req.files;

      console.log("Request body:", req.body);

      // Validate mandatory fields
      if (!name || !position || !experience || !email || !avatar) {
            return res.status(400).json(new apiResponse(400, null, "All fields are required."));
      }


      try {
            // Optimize image upload (upload only if profileImage exists)
            const uploadedProfileImage = await uploadFileCloudinary(avatar[0]?.path);
            if (!uploadedProfileImage) {
                  throw new apiErrorHandler(400, "Failed to upload profile image");
            }

            // Create a new member document
            const newMember = await TeamMember.create({
                  name,
                  position,
                  experience,
                  address,
                  phone,
                  email,
                  profileImage: {
                        imageUrl: uploadedProfileImage.secure_url,
                        altText: name,
                  },
                  personalExperience,
                  statistics: {
                        clientSatisfaction: statistics?.clientSatisfaction || 0,
                        happyClients: statistics?.happyClients || 0,
                        projectsDone: statistics?.projectsDone || 0,
                        successRate: statistics?.successRate || 0,
                  },
                  education: education || [],
                  languages: languages || [],
            });

            console.log("New member added:", newMember);

            return res.status(201).json(new apiResponse(201, newMember, "Member added successfully."));
      } catch (error) {
            console.error("Error adding member:", error.message);
            return res.status(500).json(new apiResponse(500, null, "Server error"));
      }
});

export { addTeamMember };
