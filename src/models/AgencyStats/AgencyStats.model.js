import mongoose, { Schema } from "mongoose";

const AgencyStatsSchema = new Schema(
      {
            title: {
                  type: String,
                  required: true,
                  trim: true,
                  maxlength: 100,
                  default: "Our Fun Fact",
            },
            description: {
                  type: String,
                  required: true,
                  maxlength: 500,
                  default: "A description providing context for the fun facts.",
            },
            statistics: [
                  {
                        label: {
                              type: String,
                              required: true,
                              trim: true,
                              maxlength: 50,
                        },
                        value: {
                              type: Number,
                              required: true,
                              min: 0,
                        },
                        suffix: {
                              type: String,
                              required: false,
                              default: "+",
                              maxlength: 5,
                        },
                        icon: {
                              type: String,
                              required: false,
                              default: null,
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

// Sample virtual field to get the total count of all statistics combined
AgencyStatsSchema.virtual("totalStatisticsCount").get(function () {
      return this.statistics.reduce((total, stat) => total + stat.value, 0);
});

const AgencyStats = mongoose.model("AgencySummary", AgencyStatsSchema);

export { AgencyStats };
