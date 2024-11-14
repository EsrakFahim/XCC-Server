import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { TeamMember } from "../../models/TeamMember/TeamMember.model.js";
import { uploadFileCloudinary } from "../../FileHandler/Upload.js";

const editMemberProfile = asyncHandler(async (req, res) => {
      const { _id } = req.params;
      const { fullName, jobTitle, bio, description, socialLinks, experience } =
            req.body;
      const { avatar } = req.files;

      try {
            if (!_id) {
                  throw new apiErrorHandler(
                        res,
                        400,
                        "Team member ID is required"
                  );
            }

            const existingTeamMember = await TeamMember.findById(_id);

            if (!existingTeamMember) {
                  throw new apiErrorHandler(res, 404, "Team member not found");
            }

            const updates = {};

            if (fullName) updates.fullName = fullName;
            if (jobTitle) updates.jobTitle = jobTitle;
            if (bio) updates.bio = bio;
            if (description) updates.description = description;
            if (socialLinks) updates.socialLinks = socialLinks;
            if (experience) updates.experience = experience;

            if (avatar) {
                  const avatarUrl = await uploadFileCloudinary(avatar[0].path);
                  if (avatarUrl) {
                        updates.avatar = avatarUrl.url;
                  }
            }

            const updatedTeamMember = await TeamMember.findByIdAndUpdate(
                  _id,
                  {
                        $set: updates,
                  },
                  {
                        new: true,
                        validateBeforeSave: true,
                  }
            );

            // Check if the team member was updated successfully
            if (!updatedTeamMember)
                  throw new apiErrorHandler(
                        500,
                        "Failed to update team member"
                  );

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              updatedTeamMember,
                              "Team member updated successfully"
                        )
                  );
      } catch (error) {
            throw new apiErrorHandler(500, error.message);
      }
});

export { editMemberProfile };
