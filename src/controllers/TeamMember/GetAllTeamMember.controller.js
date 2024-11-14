import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { TeamMember } from "../../models/TeamMember/TeamMember.model.js";

const getAllTeamMember = asyncHandler(async (req, res) => {
      try {
            const teamMembers = await TeamMember.find();

            if (!teamMembers) {
                  throw new apiErrorHandler(404, "No team members found");
            }

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              true,
                              teamMembers,
                              "Team members retrieved successfully",
                        )
                  );
      } catch (error) {
            throw new apiErrorHandler(res, 500, error.message);
      }
});

export { getAllTeamMember  };
