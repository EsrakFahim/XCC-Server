import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { uploadFileCloudinary } from "../../FileHandler/Upload.js";
import { TeamMember } from "../../models/TeamMember/TeamMember.model.js";

const addTeamMember = asyncHandler(async (req, res) => {
      const { fullName, jobTitle, bio, description, socialLinks, experience } =
            req.body;

      const { avatar } = req.files;

      try {
            if (
                  !(
                        fullName &&
                        jobTitle &&
                        bio &&
                        description &&
                        // socialLinks &&
                        experience &&
                        avatar
                  )
            ) {
                  throw new apiErrorHandler(400, "All fields are required");
            }

            if (!avatar) {
                  throw new apiErrorHandler(400, "Please upload an image file");
            }

            const existingTeamMember = await TeamMember.findOne({ fullName });

            if (existingTeamMember) {
                  throw new apiErrorHandler(400, "Team member already exists");
            }

            console.log(avatar[0].path);

            const avatarUrl = await uploadFileCloudinary(avatar[0].path);

            const newTeamMember = await TeamMember.create({
                  fullName,
                  jobTitle,
                  bio,
                  description,
                  socialLinks,
                  experience,
                  avatar: avatarUrl.url,
            });
            await newTeamMember.save();

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              200,
                              newTeamMember,
                              "Team member added successfully"
                        )
                  );
      } catch (error) {
            throw new apiErrorHandler(500, error.message);
      }
});

export { addTeamMember };
