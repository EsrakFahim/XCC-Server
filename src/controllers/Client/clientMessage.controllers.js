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
      const { firstName, lastName, email, message, clientIP, service } = req.body;

      console.log(process.env.DB_CONNECTION_URI);
      console.log("Request Body:", req.body);

      if (!firstName || !lastName || !email) {
            return next(new apiErrorHandler(400, "All fields are required"));
      }

      try {
            // Create and save client message in the database
            const newMessage = await ClientMessage.create({
                  firstName,
                  lastName,
                  email,
                  message,
                  service: service || "Not specified",
                  clientIP: clientIP || "Not specified",
            });
            console.log("New Message:", newMessage);

            if (!newMessage) {
                  throw new apiErrorHandler(500, "Error saving message");
            }

            // Send acknowledgment email to the client
            const clientMailOption = messageReceivedConfig({
                  clientName: firstName + " " + lastName,
                  clientEmail: email,
            });
            await transporter.sendMail(clientMailOption);

            // Define orgName and send a notification email to the admin
            const orgName = "Your Organization Name"; // Replace with actual organization name
            const adminMailOption = notifyAdminConfig({
                  clientName: firstName + " " + lastName,
                  clientEmail: email,
                  message,
                  service,
                  clientIP,
            });
            await transporter.sendMail(adminMailOption);

            // Respond with success
            return res.status(200).json(
                  new apiResponse(200, newMessage, "Message sent successfully and emails delivered")
            );
      } catch (error) {
            console.error("Error sending email:", error);
            throw new apiErrorHandler(500, "Message saved but failed to send email");
      }
});

export { clientMessage };
