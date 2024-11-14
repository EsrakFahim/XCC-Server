import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { TeamMember } from "../../models/TeamMember/TeamMember.model.js";

const getSingleTeamMember = asyncHandler(async (req, res) => {
      const { id } = req.params;

      if (!id) {
            throw new apiErrorHandler(res, 400, "Team member ID is required");
      }

      try {
            const teamMember = await TeamMember.findById(id);

            if (!teamMember) {
                  throw new apiErrorHandler(res, 404, "Team member not found");
            }

            return res
                  .status(200)
                  .json(
                        new apiResponse(
                              true,
                              teamMember,
                              "Team member retrieved successfully"
                        )
                  );
      } catch (error) {
            throw new apiErrorHandler(res, 500, error.message);
      }
});

export { getSingleTeamMember };
