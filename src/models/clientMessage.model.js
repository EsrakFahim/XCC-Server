import mongoose from "mongoose";

const clientMessageSchema = new mongoose.Schema({
      firstName: {
            type: String,
            required: [true, "Client name is required"],
      },
      lastName: {
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
      service: {
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
