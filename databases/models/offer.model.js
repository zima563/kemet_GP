import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Types.ObjectId,
      ref: "trip",
    },
    discount: Number,
    priceAfterDiscount: Number,
  },

  { timestamps: true, toJSON: { virtuals: true } }
);

schema.virtual("myReviews", {
  ref: "review",
  localField: "trip",
  foreignField: "trip",
});

schema.pre("findOne", function () {
  this.populate("myReviews");
});

schema.pre(/^find/, function () {
  this.populate("trip");
});
export const offerModel = mongoose.model("offer", schema);
