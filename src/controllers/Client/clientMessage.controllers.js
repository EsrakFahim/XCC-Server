import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { ClientMessage } from "../../models/clientMessage.model.js";
import {
      messageReceivedConfig,
      notifyAdminConfig,
} from "../../utils/messageReceivedConfig.js";
import { transporter } from "../../Services/mailSender.js";

const clientMessage = asyncHandler(async (req, res, next) => {
      const { fullName, email, message, mobile, clientIP, projectType } = req.body;

      console.log(process.env.DB_CONNECTION_URI);
      console.log("Request Body:", req.body);

      if (!fullName || !email) {
            return next(new apiErrorHandler(res, 400, "All fields are required"));
      }

      try {
            // Create and save client message in the database
            const newMessage = await ClientMessage.create({
                  fullName,
                  email,
                  message,
                  projectType: projectType || "Not specified",
                  mobile: mobile || "Not specified",
                  clientIP: clientIP || "Not specified",
            });
            console.log("New Message:", newMessage);

            if (!newMessage) {
                  throw new apiErrorHandler(res, 500, "Error saving message");
            }

            // Send acknowledgment email to the client
            const clientMailOption = messageReceivedConfig({
                  clientName: fullName,
                  clientEmail: email,
            });
            await transporter.sendMail(clientMailOption);

            // Define orgName and send a notification email to the admin
            const orgName = "Your Organization Name"; // Replace with actual organization name
            const adminMailOption = notifyAdminConfig({
                  clientName: fullName,
                  clientEmail: email,
                  message,
                  clientPhone: mobile,
                  projectType,
                  clientIP,
            });
            await transporter.sendMail(adminMailOption);

            // Respond with success
            return res.status(200).json(
                  new apiResponse(true, newMessage, "Message sent successfully and emails delivered")
            );
      } catch (error) {
            console.error("Error sending email:", error);
            return next(new apiErrorHandler(res, 500, "Message saved but failed to send email"));
      }
});

export { clientMessage };
