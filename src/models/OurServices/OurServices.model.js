import mongoose, { Schema } from "mongoose";
import slugify from "slugify"; // Assume slugify for generating SEO-friendly slugs

const ourServicesSchema = new Schema(
      {
            title: {
                  type: String,
                  required: [true, "Service title is required"],
                  trim: true,
                  maxlength: 100,
                  index: true, // Indexed for faster queries
            },
            slug: {
                  type: String,
                  unique: true,
                  required: true,
                  index: true, // SEO-friendly unique identifier
            },
            subTitle: {
                  type: String,
                  required: [true, "Sub-title is required"],
                  trim: true,
                  maxlength: 100,
            },
            description: {
                  type: String,
                  required: [true, "Description is required"],
                  maxlength: 500,
            },
            coverImage: {
                  type: String,
                  required: [true, "Cover image is required"],
                  match: [
                        /^https?:\/\/[^\s]+$/,
                        "Invalid URL format for cover image",
                  ],
            },
            showcaseImages: {
                  type: [String],
                  default: [],
                  validate: {
                        validator: (arr) => arr.length <= 5,
                        message: "Showcase images cannot exceed 5 items",
                  },
            },
            serviceType: {
                  type: String,
                  enum: [
                        "Development",
                        "Design",
                        "Marketing",
                        "Consulting",
                        "Other",
                  ],
                  required: true,
                  index: true, // Index for optimized searches by service type
            },
            status: {
                  type: String,
                  enum: ["Active", "Inactive"],
                  default: "Active",
                  required: true,
            },
            includingServices: {
                  type: [String],
                  default: [],
                  validate: {
                        validator: (arr) => arr.length <= 10,
                        message: "Including services cannot exceed 10 items",
                  },
            },
            isFeatured: {
                  type: Boolean,
                  default: false,
                  index: true, // Featured flag for quick featured queries
            },
            views: {
                  type: Number,
                  default: 0,
                  min: 0,
            },
            publishedAt: {
                  type: Date,
                  default: null,
            },
            lastEditedAt: {
                  type: Date,
                  default: Date.now,
            },
      },
      {
            timestamps: true,
            toJSON: { virtuals: true },
            toObject: { virtuals: true },
      }
);

// Pre-save hook to create slug
ourServicesSchema.pre("save", function (next) {
      if (!this.slug) {
            this.slug = slugify(this.title, { lower: true, strict: true });
      }
      next();
});

const OurServices = mongoose.model("OurServices", ourServicesSchema);

export { OurServices };
