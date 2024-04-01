import mongoose from "mongoose";
import bcrypt from "bcrypt";
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      min: [2, "too short user name"],
      max: [50, "too long user name"],
    },
    email: {
      type: String,
      trim: true,
      unique: [true, "email is required"],
      required: [true, "eamil is required"],
    },
    mobilePhone:String,
    city: String,
    DOB: {
      type: Date,
      trim: true,
    },
    password: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    confirmEmail:Boolean,
    
    pinCode: String,
    pinCodeExpire: Date,
    resetVerified: Boolean,
    passwordChangedAt: Date,
    logoutAt: Date,
    wishListGovernrate: [
      {
        type: mongoose.Types.ObjectId,
        ref: "governrate",
      },
    ],
    wishListLegend: [
      {
        type: mongoose.Types.ObjectId,
        ref: "legend",
      },
    ],
    wishListTourismPlace: [
      {
        type: mongoose.Types.ObjectId,
        ref: "tourismPlace",
      },
    ],
    wishListTrip: [
      {
        type: mongoose.Types.ObjectId,
        ref: "trip",
      },
    ],
  },
  { timestamps: true }
);

schema.post("init", (doc) => {
  if (doc.profileImg) doc.profileImg = process.env.BASE_URL + doc.profileImg;
});
schema.pre("save", function () {
  if (this.password) this.password = bcrypt.hashSync(this.password, 8);
});

schema.pre("findOneAndUpdate", function () {
  if (this._update.password)
    this._update.password = bcrypt.hashSync(this._update.password, 8);
});

export const userModel = mongoose.model("user", schema);
