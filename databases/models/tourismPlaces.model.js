import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      minlength: [2, "too short governrate name"],
      maxlength: [300, "too long governrate name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    informationAbout: {
      type: String,
      trim: true,
      require: true,
    },
    governrate: {
      type: mongoose.Types.ObjectId,
      ref: "governrate",
    },
    imgCover: String,
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);


schema.pre(/^find/, function () {
  this.populate("governrate");
});
export const tourismPlaceModel = mongoose.model("tourismPlace", schema);
