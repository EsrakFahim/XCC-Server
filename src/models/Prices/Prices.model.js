import mongoose, { Schema } from "mongoose";

const pricingPlanSchema = new Schema(
      {
            planId: {
                  type: String,
                  unique: true,
                  required: true,
                  default: () => `plan_${new Date().getTime()}`,
            },
            title: {
                  type: String,
                  required: [true, "Title is required"],
                  trim: true,
                  maxlength: 100,
                  index: true, // Indexed for faster searches
            },
            monthlyPrice: {
                  type: Number,
                  required: true,
                  min: 0,
            },
            yearlyPrice: {
                  type: Number,
                  required: true,
                  min: 0,
            },
            currency: {
                  type: String,
                  required: true,
                  default: "$",
                  maxlength: 3,
            },
            published: {
                  type: Boolean,
                  required: true,
                  default: false,
                  index: true, // Indexed for active filtering
            },
            features: {
                  type: [String],
                  required: true,
                  validate: {
                        validator: (arr) => arr.length <= 20,
                        message: "Features list should not exceed 20 items",
                  },
            },
            btnText: {
                  type: String,
                  required: false,
                  default: "Contact Now",
            },
            isActive: {
                  type: Boolean,
                  default: true,
                  index: true, // Active plans filter
            },
            // createdBy: {
            //       type: Schema.Types.ObjectId,
            //       ref: "User",
            //       required: true,
            // },
            // updatedBy: {
            //       type: Schema.Types.ObjectId,
            //       ref: "User",
            //       required: false,
            // },
            lastEditedAt: {
                  type: Date,
                  default: Date.now,
            },
      },
      {
            timestamps: true,
      }
);

// Virtual field to calculate the total discount from monthly to yearly price
pricingPlanSchema.virtual("discount").get(function () {
      if (this.monthlyPrice && this.yearlyPrice) {
            return (
                  ((this.monthlyPrice * 12 - this.yearlyPrice) /
                        (this.monthlyPrice * 12)) *
                  100
            ).toFixed(2);
      }
      return null;
});

const PricingPlan = mongoose.model("PricingPlan", pricingPlanSchema);

export { PricingPlan };
