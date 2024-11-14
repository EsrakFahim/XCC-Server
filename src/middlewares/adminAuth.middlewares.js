import { apiErrorHandler } from "../utils/apiErrorHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyAdmin = asyncHandler(async (req, res, next) => {
      try {
            // Get the user access token from the cookies
            const userAccessToken = req?.cookies?.accessToken;

            if (!userAccessToken) {
                  throw new apiErrorHandler(res, "Unauthorized", 401);
            }

            // Verify the user access token
            const decodedUser = jwt.verify(
                  userAccessToken,
                  process.env.ACCESS_TOKEN_SECRET
            );

            if (!decodedUser) {
                  throw new apiErrorHandler(res, "Unauthorized", 401);
            }

            const user = await User.findById(decodedUser._id);

            if (user.role !== "admin") {
                  // Check if the user is an admin
                  throw new apiErrorHandler(res, "Forbidden", 403);
            }

            req.user = decodedUser;

            next();
      } catch (error) {
            console.log("Error in verifyAdmin middleware: ", error);
            throw new apiErrorHandler(res, "Forbidden", 403); // Forbidden
      }
});

export { verifyAdmin };
