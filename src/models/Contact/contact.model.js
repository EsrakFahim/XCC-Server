import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema(
      {
            email: {
                  type: String,
                  // required: true,
                  match: [/.+\@.+\..+/, "Please enter a valid email address"],
                  trim: true,
                  lowercase: true,
                  default: null,
                  index: true, // Index for efficient querying
            },
            phone: {
                  type: String,
                  // required: true,
                  trim: true,
                  default: null,
                  index: true, // Index for efficient querying
            },
            facebook: {
                  type: String,
                  // required: false,
                  trim: true,
                  match: [
                        /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9_.]+$/,
                        "Invalid Facebook URL",
                  ],
                  default: null,
            },
            instagram: {
                  type: String,
                  // required: false,
                  trim: true,
                  match: [
                        /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+$/,
                        "Invalid Instagram URL",
                  ],
                  default: null,
            },
            twitter: {
                  type: String,
                  // required: false,
                  trim: true,
                  match: [
                        /^https?:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_.]+$/,
                        "Invalid Twitter URL",
                  ],
                  default: null,
            },
            linkedin: {
                  type: String,
                  // required: true,
                  trim: true,
                  match: [
                        /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_.]+$/,
                        "Invalid LinkedIn URL",
                  ],
                  default: null,
            },
            pinterest: {
                  type: String,
                  // required: false,
                  trim: true,
                  match: [
                        /^https?:\/\/(www\.)?pinterest\.com\/[A-Za-z0-9_.]+$/,
                        "Invalid Pinterest URL",
                  ],
                  default: null,
            },
            upwork: {
                  type: String,
                  // required: false,
                  trim: true,
                  match: [
                        /^https?:\/\/(www\.)?upwork\.com\/freelancers\/[A-Za-z0-9_.]+$/,
                        "Invalid Upwork URL",
                  ],
                  default: null,
            },
            behance: {
                  type: String,
                  // required: false,
                  trim: true,
                  match: [
                        /^https?:\/\/(www\.)?behance\.net\/[A-Za-z0-9_.]+$/,
                        "Invalid Behance URL",
                  ],
                  default: null,
            },
            github: {
                  type: String,
                  // required: false,
                  trim: true,
                  match: [
                        /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.]+$/,
                        "Invalid GitHub URL",
                  ],
                  default: null,
            },
            fiverr: {
                  type: String,
                  // required: false,
                  trim: true,
                  match: [
                        /^https?:\/\/(www\.)?fiverr\.com\/[A-Za-z0-9_.]+$/,
                        "Invalid Fiverr URL",
                  ],
                  default: null,
            },
            website: {
                  type: String,
                  // required: false,
                  trim: true,
                  match: [
                        /^https?:\/\/(www\.)?[A-Za-z0-9_.-]+\.[A-Za-z]{2,5}$/,
                        "Invalid Website URL",
                  ],
                  default: null,
            },
            address: {
                  type: String,
                  // required: false,
                  trim: true,
                  maxlength: 255,
                  default: null,
            },
      },
      {
            timestamps: true,
      }
);

// Compound index for unique constraint on email and phone if needed
contactSchema.index({ email: 1, phone: 1 }, { unique: true });

const Contact = mongoose.model("Contact", contactSchema);

export { Contact };
