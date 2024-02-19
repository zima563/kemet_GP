import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "user" },
    myTicketItems: [
      {
        trip: { type: mongoose.Types.ObjectId, ref: "trip" },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    discount: Number,
  },
  { timestamps: true }
);

export const myTicketModel = mongoose.model("myTicket", schema);
