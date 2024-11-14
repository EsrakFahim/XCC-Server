import mongoose, { Schema } from "mongoose";

const SocialLinksSchema = new Schema(
      {
            facebook: {
                  type: String,
                  match: [
                        /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9_.-]+$/,
                        "Invalid Facebook URL",
                  ],
                  default: null,
            },
            instagram: {
                  type: String,
                  match: [
                        /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.-]+$/,
                        "Invalid Instagram URL",
                  ],
                  default: null,
            },
            twitter: {
                  type: String,
                  match: [
                        /^https?:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_.-]+$/,
                        "Invalid Twitter URL",
                  ],
                  default: null,
            },
            linkedin: {
                  type: String,
                  match: [
                        /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_.-]+$/,
                        "Invalid LinkedIn URL",
                  ],
                  default: null,
            },
            pinterest: {
                  type: String,
                  match: [
                        /^https?:\/\/(www\.)?pinterest\.com\/[A-Za-z0-9_.-]+$/,
                        "Invalid Pinterest URL",
                  ],
                  default: null,
            },
            upwork: {
                  type: String,
                  match: [
                        /^https?:\/\/(www\.)?upwork\.com\/freelancers\/[A-Za-z0-9_.-]+$/,
                        "Invalid Upwork URL",
                  ],
                  default: null,
            },
            behance: {
                  type: String,
                  match: [
                        /^https?:\/\/(www\.)?behance\.net\/[A-Za-z0-9_.-]+$/,
                        "Invalid Behance URL",
                  ],
                  default: null,
            },
            github: {
                  type: String,
                  match: [
                        /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+$/,
                        "Invalid GitHub URL",
                  ],
                  default: null,
            },
            fiverr: {
                  type: String,
                  match: [
                        /^https?:\/\/(www\.)?fiverr\.com\/[A-Za-z0-9_.-]+$/,
                        "Invalid Fiverr URL",
                  ],
                  default: null,
            },
      },
      { _id: false }
);

const TeamMemberSchema = new Schema(
      {
            fullName: {
                  type: String,
                  required: [true, "Team member name is required"],
                  trim: true,
                  maxlength: 100,
                  index: true, // Indexed for faster search
            },
            jobTitle: {
                  type: String,
                  required: [true, "Job title is required"],
                  trim: true,
                  maxlength: 100,
            },
            bio: {
                  type: String,
                  required: [true, "Bio is required"],
                  maxlength: 500,
            },
            description: {
                  type: String,
                  required: [true, "Description is required"],
                  maxlength: 500,
            },
            avatar: {
                  type: String,
                  required: [true, "Avatar URL is required"],
                  match: [/^https?:\/\/[^\s]+$/, "Invalid avatar URL"],
            },
            socialLinks: {
                  type: SocialLinksSchema,
                  default: () => ({}),
            },
            experience: {
                  type: String,
                  default: "0 years",
            },
      },
      {
            timestamps: { createdAt: true, updatedAt: false },
      }
);

// Ensure a compound index for frequent queries by name and job title
TeamMemberSchema.index({ fullName: 1, jobTitle: 1 });

const TeamMember = mongoose.model("TeamMember", TeamMemberSchema);

export { TeamMember };
