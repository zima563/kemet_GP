import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      minlength: [2, "too short governrate name"],
      maxlength: [20, "too long governrate name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    image: String,
  },
  { timestamps: true }
);


export const governrateModel = mongoose.model("governrate", schema);
