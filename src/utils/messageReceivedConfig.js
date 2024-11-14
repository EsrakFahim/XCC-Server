const messageReceivedConfig = ({ clientName, clientEmail }) => {
      const mailOption = {
            from: process.env.EMAIL_USER,
            to: clientEmail,
            subject: "We've Received Your Message",
            html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <div style="text-align: center;">
                              <h2 style="color: #28A745;">Thank You for Reaching Out!</h2>
                        </div>
                        <p style="font-size: 16px; color: #333;">
                              Hello <strong>${clientName}</strong>,
                        </p>
                        <p style="font-size: 16px; color: #333;">
                              We have received your message and will get back to you as soon as possible. Our team is reviewing your inquiry and will respond promptly.
                        </p>
                        <p style="font-size: 16px; color: #333;">
                              If you have any additional questions or need immediate assistance, feel free to reply to this email.
                        </p>
                        <p style="font-size: 16px; color: #333;">
                              Thank you for contacting us, and we look forward to assisting you.
                        </p>
                        <p style="font-size: 16px; color: #333;">
                              Best regards,
                              <br />
                              The Support Team
                        </p>
                        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
                              <p>
                              © 2024 Your Company. All rights reserved.
                              </p>
                        </div>
                  </div>
                  `,
      };

      return mailOption;
};

// For admin notification
const notifyAdminConfig = ({
      clientName,
      clientEmail,
      message,
      clientPhone,
      clientIP,
      projectType
}) => {
      return {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL, // Your admin email
            subject: "New Client Message Received",
            html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                        <p><strong>Client Name:</strong> ${clientName}</p>
                        <p><strong>Email:</strong> ${clientEmail}</p>
                        <p><strong>Phone:</strong> ${clientPhone}</p>
                        <p><strong>Project Type:</strong> ${projectType}</p>
                        <p><strong>IP Address:</strong> ${clientIP}</p>
                        <p><strong>Message:</strong></p>
                        <p>${message}</p>
                        <p>Make sure to respond promptly.</p>
                  </div>
            `,
      };
};

export { messageReceivedConfig, notifyAdminConfig };
