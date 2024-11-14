import mongoose from "mongoose";

const clientMessageSchema = new mongoose.Schema({
      fullName: {
            type: String,
            required: [true, "Client name is required"],
      },
      email: {
            type: String,
            required: [true, "Client email is required"],
            match: [/.+\@.+\..+/, "Please enter a valid email address"],
      },
      message: {
            type: String,
      },
      mobile: {
            type: String,
            default: "Not specified",
      },
      projectType: {
            type: String,
            default: "Not specified",
      },
      clientIP: {
            type: String,
            default: "Not specified",
      },
});

const ClientMessage = mongoose.model("ClientMessage", clientMessageSchema);

export { ClientMessage };
