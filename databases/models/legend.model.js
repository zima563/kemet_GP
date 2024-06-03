import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      minlength: [2, "too short legend name"],
      maxlength: [20, "too long legend name"],
    },
    informationAbout: {
      type: String,
      trim: true,
      required: true,
      minlength: [10, "too short legend informationAbout"],
      maxlength: [1500, "too long legend informationAbout"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
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


export const legendModel = mongoose.model("legend", schema);
