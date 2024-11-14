import mongoose, { Schema } from "mongoose";

const homePageSchema = new Schema(
      {
            title: {
                  type: String,
                  required: true,
                  trim: true,
                  maxlength: 120,
                  default: "Welcome to Our Website",
            },
            subTitle: {
                  type: String,
                  required: true,
                  trim: true,
                  maxlength: 200,
                  default: "We are a creative agency that focuses on design, development, and growing your business.",
            },
            videoText: {
                  type: String,
                  required: true,
                  trim: true,
                  maxlength: 200,
                  default: "Watch Our Video",
            },
            video: {
                  type: String,
                  required: true,
                  match: [
                        /^https?:\/\/[^\s]+$/,
                        "Invalid URL format for video",
                  ],
                  default: "https://www.youtube.com/embed/dQw4w9WgXcQ?si=t4TS7K2_vFnkHO8a",
            },
            bannerImage: {
                  type: String,
                  required: true,
                  match: [
                        /^https?:\/\/[^\s]+$/,
                        "Invalid URL format for banner image",
                  ],
                  default: null,
            },
            callToAction: {
                  text: {
                        type: String,
                        required: false,
                        trim: true,
                        maxlength: 50,
                        default: "Get Started",
                  },
                  url: {
                        type: String,
                        match: [
                              /^https?:\/\/[^\s]+$/,
                              "Invalid URL format for call-to-action",
                        ],
                        default: null,
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

// Virtual field to get the total number of highlights
homePageSchema.virtual("totalHighlights").get(function () {
      return this.highlights ? this.highlights.length : 0;
});

const HomePage = mongoose.model("HomePage", homePageSchema);

export { HomePage };
