import mongoose, { Schema } from "mongoose";

// **Sub-Schema for Testimonial**
const testimonialSchema = new Schema(
      {
            author: {
                  type: String,
                  trim: true,
                  default: "",
            },
            reviewBody: {
                  type: String,
                  maxlength: 500,
                  default: "",
            },
            rating: {
                  type: Number,
                  min: 1,
                  max: 5,
                  default: 5,
            },
      },
      { _id: false }
);

// **Sub-Schema for SEO Metadata**
const seoSchema = new Schema(
      {
            title: {
                  type: String,
                  maxlength: 60,
                  default: "",
            },
            metaDescription: {
                  type: String,
                  maxlength: 160,
                  default: "",
            },
            metaKeywords: {
                  type: [String],
                  default: [],
                  validate: {
                        validator: (v) => v.length <= 20,
                        message: "You can specify up to 20 keywords only",
                  },
            },
            canonicalUrl: {
                  type: String,
                  match: [/^https?:\/\/.+/, "Invalid URL format"],
            },
            ogTitle: {
                  type: String,
                  maxlength: 60,
                  default: "",
            },
            ogDescription: {
                  type: String,
                  maxlength: 160,
                  default: "",
            },
            ogImage: {
                  type: String,
                  match: [/^https?:\/\/.+/, "Invalid URL format"],
            },
      },
      { _id: false }
);


//**Showcase image Schema **
const ShowcaseFileSchema = new Schema(
      {
            url: {
                  type: String,
                  required: [true, "File URL is required"],
                  match: [/^https?:\/\/[^\s]+$/, "Invalid URL format"],
            },
            name: {
                  type: String,
                  required: [true, "File name is required"],
                  trim: true,
                  maxlength: 100,
            },
      },
      {
            _id: false,
      },
      {
            timestamps: true,
      }
);

//**Additional image Schema **
const AdditionalFileSchema = new Schema(
      {
            url: {
                  type: String,
                  required: [true, "File URL is required"],
                  match: [/^https?:\/\/[^\s]+$/, "Invalid URL format"],
            },
            name: {
                  type: String,
                  required: [true, "File name is required"],
                  trim: true,
                  maxlength: 100,
            },
      },
      {
            _id: false,
      },
      {
            timestamps: true,
      }
);


// **Main Project Schema**
const projectSchema = new Schema(
      {
            title: {
                  type: String,
                  required: [true, "Project name is required"],
                  trim: true,
                  unique: true,
                  index: true,
            },
            description: {
                  type: String,
                  required: [true, "Project description is required"],
                  trim: true,
            },
            location: {
                  type: String,
                  required: [true, "Project location is required"],
                  trim: true,
            },
            client: {
                  type: String,
                  required: [true, "Client name is required"],
                  trim: true,
            },
            projectType: {
                  type: String,
                  required: [true, "Project type is required"],
                  enum: ["Residential", "Commercial", "Architectural Business", "E-commerce", "Other"],
            },
            startDate: {
                  type: Date,
                  default: Date.now,
            },
            endDate: {
                  type: Date,
                  validate: {
                        validator: function (value) {
                              return !value || value > this.startDate;
                        },
                        message: "End date must be after start date",
                  },
            },
            coverImage: {
                  type: String,
                  required: true,
                  match: [/^https?:\/\/.+/, "Invalid URL format"],
            },
            showcaseImages: {
                  type: [ShowcaseFileSchema],
                  default: [],
            },
            additionalImages: {
                  type: [AdditionalFileSchema],
                  default: [],
            },
            strategies: {
                  type: [String],
                  default: [],
            },
            approach: {
                  type: [String],
                  default: [],
            },
            results: {
                  type: [String],
                  default: [],
            },
            receivedGoals: {
                  type: [String],
                  default: [],
            },
            testimonial: {
                  type: testimonialSchema,
                  default: {},
            },
            seo: {
                  type: seoSchema,
                  default: {},
            },
            isFeatured: {
                  type: Boolean,
                  default: false,
            },
            isSliderActive: {
                  type: Boolean,
                  default: true,
            },
      },
      {
            timestamps: true,
            toJSON: {
                  virtuals: true,
                  transform: (doc, ret) => {
                        delete ret.__v;
                        return ret;
                  },
            },
      }
);

// **Virtual Property** - Project Duration Calculation
projectSchema.virtual("projectDuration").get(function () {
      if (this.startDate && this.endDate) {
            const duration = Math.round((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
            return `${duration} days`;
      }
      return "Ongoing";
});

// **Instance Method** - Date Formatter
projectSchema.methods.formatDate = function (date) {
      return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
      });
};

// **Pre-save Hook** - Normalize SEO Keywords
projectSchema.pre("save", function (next) {
      if (this.seo.metaKeywords && this.seo.metaKeywords.length > 0) {
            this.seo.metaKeywords = this.seo.metaKeywords.map((keyword) => keyword.toLowerCase());
      }
      next();
});

// **Indexes** - Optimizing Search and Filtering
projectSchema.index({ location: 1, projectType: 1 });
projectSchema.index({ isFeatured: 1, isSliderActive: 1 });

// **Model Export**
const Projects = mongoose.model("Projects", projectSchema);

export { Projects };
