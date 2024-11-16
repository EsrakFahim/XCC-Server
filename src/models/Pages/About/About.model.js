import mongoose, { Schema } from "mongoose";

const aboutSchema = new Schema(
      {
            title: {
                  type: String,
                  required: true,
                  trim: true,
                  maxlength: 120,
                  default: "About Us",
            },
            whyUsTitle: {
                  type: String,
                  required: true,
                  trim: true,
                  maxlength: 120,
                  default: "Why Choose Us",
            },
            description: {
                  type: String,
                  required: true,
                  trim: true,
                  maxlength: 500,
                  default: "We are a creative agency that focuses on design, development, and growing your business.",
            },
            image: {
                  imageUrl: {
                        type: String,
                        required: true,
                        match: [
                              /^https?:\/\/[^\s]+$/,
                              "Invalid URL format for image",
                        ],
                  },
                  altText: {
                        type: String,
                        trim: true,
                        maxlength: 100,
                        default: "",
                  },
            },
            isActive: {
                  type: Boolean,
                  default: true,
                  index: true,
            },
      },
      {
            timestamps: true,
      }
);

const About = mongoose.model("About", aboutSchema);

export { About };
