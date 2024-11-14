import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // service name
      auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
      },
});