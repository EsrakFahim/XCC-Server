import mongoose, { Schema } from 'mongoose';

// Sub-Schema for Testimonial
const testimonialSchema = new Schema({
      author: {
            type: String,
            required: [true, 'Author name is required'],
            trim: true
      },
      reviewBody: {
            type: String,
            required: [true, 'Review body is required'],
            maxlength: 500
      },
      rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 5
      }
}, { _id: false });

// Sub-Schema for SEO Metadata
const seoSchema = new Schema({
      title: {
            type: String,
            required: [true, 'SEO title is required'],
            maxlength: 60
      },
      metaDescription: {
            type: String,
            required: [true, 'Meta description is required'],
            maxlength: 160
      },
      metaKeywords: {
            type: [String],
            default: [],
            validate: {
                  validator: (v) => v.length <= 20,
                  message: 'You can only specify up to 20 keywords'
            }
      },
      canonicalUrl: {
            type: String,
            match: [/^https?:\/\/.+/, 'Invalid URL format']
      },
      ogTitle: {
            type: String,
            maxlength: 60
      },
      ogDescription: {
            type: String,
            maxlength: 160
      },
      ogImage: {
            type: String,
            match: [/^https?:\/\/.+/, 'Invalid URL format']
      }
}, { _id: false });

// Main Project Schema
const projectSchema = new Schema(
      {
            // Project Information
            name: {
                  type: String,
                  required: [true, 'Project name is required'],
                  trim: true,
                  index: true
            },
            description: {
                  type: String,
                  required: [true, 'Project description is required'],
                  trim: true
            },
            location: {
                  type: String,
                  required: [true, 'Project location is required'],
                  trim: true,
                  index: true
            },
            client: {
                  type: String,
                  required: [true, 'Client name is required'],
                  trim: true
            },
            projectType: {
                  type: String,
                  required: [true, 'Project type is required'],
                  enum: ['Residential', 'Commercial', 'Architectural Business', 'Other']
            },
            startDate: {
                  type: Date,
                  required: true
            },
            endDate: {
                  type: Date,
                  required: true,
                  validate: {
                        validator: function (value) {
                              return value > this.startDate;
                        },
                        message: 'End date must be after start date'
                  }
            },
            coverImage: {
                  type: String,
                  required: true,
                  match: [/^https?:\/\/.+/, 'Invalid URL format for cover image']
            },
            showcaseImages: {
                  type: [String],
                  required: true,
                  validate: {
                        validator: (v) => v.length > 0,
                        message: 'At least one showcase image is required'
                  }
            },
            additionalImages: {
                  type: [String],
                  default: []
            },

            // Strategies
            strategies: {
                  type: [String],
                  default: []
            },

            // Testimonial
            testimonial: testimonialSchema,

            // Approach
            approach: {
                  type: [String],
                  default: []
            },

            // Results
            results: {
                  type: [String],
                  default: []
            },

            // Received Goals
            receivedGoals: {
                  type: [String],
                  default: []
            },

            // SEO Metadata
            seo: seoSchema,

            isFeatured: { // Featured Projects for Homepage hero section
                  type: Boolean,
                  default: false
            },

            isSliderActive: { // Display project images in a slider
                  type: Boolean,
                  default: true
            }
      },
      {
            timestamps: true,
            toJSON: {
                  virtuals: true,
                  transform: (doc, ret) => {
                        delete ret.__v; // Remove internal mongoose version key
                        return ret;
                  }
            }
      }
);

// Virtual for project duration
projectSchema.virtual('projectDuration').get(function () {
      if (this.startDate && this.endDate) {
            const duration = Math.round((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
            return `${duration} days`;
      }
      return 'N/A';
});

// Instance Method to Format Dates
projectSchema.methods.formatDate = function (date) {
      return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
      });
};

// Pre-save Hook to Normalize Keywords
projectSchema.pre('save', function (next) {
      if (this.seo.metaKeywords && this.seo.metaKeywords.length > 0) {
            this.seo.metaKeywords = this.seo.metaKeywords.map(keyword => keyword.toLowerCase());
      }
      next();
});

const Projects = mongoose.model('Project', projectSchema);

export { Projects };
