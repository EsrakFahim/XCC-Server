import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { TeamMember } from "../../models/TeamMember/TeamMember.model.js";
import { uploadFileCloudinary } from "../../FileHandler/Upload.js";

// Controller to edit an existing team member
const editTeamMember = asyncHandler(async (req, res) => {
      const { memberId } = req.params;

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

      // parse education and statistics fields
      const education = req.body.education
            ? JSON.parse(req.body.education)
            : null;
      const statistics = req.body.statistics
            ? JSON.parse(req.body.statistics)
            : null;

      const { avatar } = req.files;

      console.log("Request body:", req.body);

      try {
            // Find the team member by ID
            const existingMember = await TeamMember.findById(memberId);
            if (!existingMember) {
                  return res
                        .status(404)
                        .json(new apiResponse(404, null, "Member not found."));
            }

            // Optimize image upload (upload only if avatar exists)
            let updatedProfileImage = existingMember.profileImage;
            if (avatar) {
                  const uploadedProfileImage = await uploadFileCloudinary(
                        avatar[0]?.path
                  );
                  if (!uploadedProfileImage) {
                        throw new apiErrorHandler(
                              400,
                              "Failed to upload profile image"
                        );
                  }
                  updatedProfileImage = {
                        imageUrl: uploadedProfileImage.secure_url,
                        altText: name || existingMember.name,
                  };
            }

            // Update the member document
            const updatedMember = await TeamMember.findByIdAndUpdate(
                  memberId,
                  {
                        name: name || existingMember.name,
                        position: position || existingMember.position,
                        experience: experience || existingMember.experience,
                        address: address || existingMember.address,
                        phone: phone || existingMember.phone,
                        email: email || existingMember.email,
                        profileImage: updatedProfileImage,
                        personalExperience:
                              personalExperience ||
                              existingMember.personalExperience,
                        statistics: {
                              clientSatisfaction:
                                    statistics?.clientSatisfaction ??
                                    existingMember.statistics
                                          .clientSatisfaction,
                              happyClients:
                                    statistics?.happyClients ??
                                    existingMember.statistics.happyClients,
                              projectsDone:
                                    statistics?.projectsDone ??
                                    existingMember.statistics.projectsDone,
                              successRate:
                                    statistics?.successRate ??
                                    existingMember.statistics.successRate,
                        },
                        education: education || existingMember.education,
                        languages: languages || existingMember.languages,
                  },
                  { new: true } // Return the updated document
            );

            console.log("Member updated:", updatedMember);

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              updatedMember,
                              "Member updated successfully."
                        )
                  );
      } catch (error) {
            console.error("Error updating member:", error.message);
            return res
                  .status(500)
                  .json(new apiResponse(500, null, "Server error"));
      }
});

export { editTeamMember };
