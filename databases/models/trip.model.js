import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "name is required"],
      minlength: [2, "Too short name"],
      maxlength: [50, "Too long name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "name is required"],
      minlength: [2, "Too short name"],
      maxlength: [50, "Too long name"],
    },
    sold: Number,
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      max: [10000000, "too much price"],
    },
    priceAfterDiscount:Number,
    imgCover: String,
    images: [
      {
        type: String,
      },
    ],
    governrate: {
      type: mongoose.Types.ObjectId,
      ref: "governrate",
    },
    tourismPlace: {
      type: mongoose.Types.ObjectId,
      ref: "tourismPlace",
    },
    ratingAverage: {
      type: Number,
      min: 0,
      max: 5,
      default:0
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    isOffered:{
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

schema.post("init", (doc) => {
  if (doc.imgCover || doc.images) {
    doc.imgCover = process.env.BASE_URL + doc.imgCover;
    doc.images = doc.images?.map((val) => process.env.BASE_URL + val);
  }
});

schema.virtual("myReviews", {
  ref: "review",
  localField: "_id",
  foreignField: "trip",
});

schema.pre("findOne", function () {
  this.populate("myReviews");
});

export const tripModel = mongoose.model("trip", schema);
