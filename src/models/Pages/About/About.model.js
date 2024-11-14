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
            description: {
                  type: String,
                  required: true,
                  trim: true,
                  maxlength: 500,
                  default: "We are a creative agency that focuses on design, development, and growing your business.",
            },
            images: [
                  {
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
            ],
            whyWeTitle: {
                  type: String,
                  required: true,
                  trim: true,
                  maxlength: 200,
                  default: "Why Choose Us?",
            },
            whyWeDescription: {
                  type: String,
                  required: true,
                  trim: true,
                  maxlength: 500,
                  default: "We are a team of professionals who will help you grow your business.",
            },
            whyWeImage: {
                  type: String,
                  required: true,
                  match: [
                        /^https?:\/\/[^\s]+$/,
                        "Invalid URL format for image",
                  ],
            },
            benefits: [
                  {
                        title: {
                              type: String,
                              required: true,
                              trim: true,
                              maxlength: 100,
                        },
                        description: {
                              type: String,
                              required: true,
                              trim: true,
                              maxlength: 300,
                        },
                        iconUrl: {
                              type: String,
                              match: [
                                    /^https?:\/\/[^\s]+$/,
                                    "Invalid URL format for icon",
                              ],
                        },
                  },
            ],
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
