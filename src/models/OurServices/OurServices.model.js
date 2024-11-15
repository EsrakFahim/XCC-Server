import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const { Schema, model } = mongoose;

// Image schema to store Cloudinary details
const imageSchema = new Schema(
      {
            url: { type: String, required: true },
            name: { type: String },
            altText: { type: String, maxlength: 150 },
      },
      { _id: false } // Disable _id for sub-documents to reduce document size
);

// Schema for related services
const relatedServiceSchema = new Schema(
      {
            title: { type: String, required: true, index: true },
            description: { type: String, required: true, maxlength: 250 },
            image: imageSchema,
            link: { type: String, match: /^https?:\/\// }, // Ensure valid URLs
      },
      { _id: false }
);

// Main schema for project details
const OurServicesSchema = new Schema(
      {
            title: { type: String, required: true, unique: true, index: true },
            slug: { type: String, unique: true, index: true, default: null }, // Added slug field
            coverImage: imageSchema,
            icon: imageSchema,
            planning: {
                  heading: { type: String, required: true, maxlength: 100 },
                  description: { type: String, required: true, maxlength: 500 },
            },
            capabilities: [
                  {
                        icon: { type: String }, // Consider using enums if icons are limited
                        description: { type: String, required: true, maxlength: 150 },
                  },
            ],
            approach: {
                  heading: { type: String, required: true, maxlength: 100 },
                  points: [{ type: String, maxlength: 150 }], // Limit points length
            },
            workProcess: [
                  {
                        step: { type: String, required: true, maxlength: 100 },
                        description: { type: String, required: true, maxlength: 300 },
                  },
            ],
            relatedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: "OurServices" }],
            seo: {
                  metaTitle: { type: String, required: true, maxlength: 70 },
                  metaDescription: { type: String, required: true, maxlength: 160 },
                  keywords: [{ type: String, index: true }],
            },
            isActive: { type: Boolean, default: true },
      },
      {
            timestamps: true, // Automatically create `createdAt` and `updatedAt` fields
            versionKey: false, // Disable the `__v` field for cleaner documents
      }
);

// Compound Indexes for better search performance
OurServicesSchema.index({ title: "text", "seo.keywords": "text" });
OurServicesSchema.index({ isActive: 1, title: 1 });

// Pre-save hook for slug generation
OurServicesSchema.pre("save", function (next) {
      // Capitalize the first letter of the title
      this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);

      // Generate a slug from the title
      if (!this.slug) {
            this.slug = this.title
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "") || uuidv4(); // Use UUID as a fallback
      }
      next();
});

// Adding TTL (Time-to-Live) index for temporary data (if needed)
// OurServicesSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }); // Auto-delete after 30 days (optional)

const OurServices = model("OurServices", OurServicesSchema);

export { OurServices };
