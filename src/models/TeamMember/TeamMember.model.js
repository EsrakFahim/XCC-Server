import mongoose, { Schema } from "mongoose";

const memberSchema = new Schema(
      {
            // Profile Information
            name: {
                  type: String,
                  required: [true, "Name is required"],
                  trim: true,
                  maxlength: 100,
            },
            position: {
                  type: String,
                  required: [true, "Position is required"],
                  trim: true,
            },
            experience: {
                  type: Number,
                  required: [true, "Experience is required"],
                  min: 0,
            },
            address: {
                  type: String,
                  trim: true,
                  default: "",
            },
            phone: {
                  type: String,
                  match: [/^\+?[1-9]\d{1,14}$/, "Invalid phone number"], // E.164 format
                  default: "",
            },
            email: {
                  type: String,
                  required: [true, "Email is required"],
                  match: [/.+\@.+\..+/, "Invalid email format"],
            },

            // Image Handling
            profileImage: {
                  imageUrl: {
                        type: String,
                        required: true,
                        match: [/^https?:\/\/[^\s]+$/, "Invalid URL format"],
                  },
                  altText: {
                        type: String,
                        default: "",
                  },
            },

            // Personal Experience
            personalExperience: {
                  type: String,
                  trim: true,
                  maxlength: 2000,
            },

            // Statistics (Skills or Achievements)
            statistics: {
                  clientSatisfaction: { type: Number, default: 0, min: 0, max: 100 },
                  happyClients: { type: Number, default: 0, min: 0 },
                  projectsDone: { type: Number, default: 0, min: 0 },
                  successRate: { type: Number, default: 0, min: 0, max: 100 },
            },

            // Education Array
            education: [
                  {
                        degree: { type: String, trim: true },
                        institution: { type: String, trim: true },
                        year: { type: Number },
                  },
            ],

            // Languages Known
            languages: {
                  type: [String], // Array of languages
                  default: [],
            },

            isActive: {
                  type: Boolean,
                  default: true,
            },
      },
      {
            timestamps: true,
      }
);

const TeamMember = mongoose.model("Member", memberSchema);
export { TeamMember };
