import { myTicketModel } from "../../../databases/models/myTickets.model.js";
import { orderModel } from "../../../databases/models/orderModel.js";
import { tripModel } from "../../../databases/models/trip.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51OjO5wDJVgPX3w4UtWtwnxGjrFw2XBAByqmMldewZSiYUjLqp5IvjeD06mbPGUA2Ou9xlx0JqdRfzH8qtVrDzuJb00Zazas9tJ"
);

const createCashOrder = catchError(async(req,res,next)=>{
    let myTicket = await myTicketModel.findById(req.params.id);
    if(!myTicket) return next(new apiError("not myTicket found",404));

    let totalOrderPrice = myTicket.totalPrice;

    let order = new orderModel({
        user:req.user._id,
        orderItems: myTicket.myTicketItems,
        totalOrderPrice,
        shippingAddress: req.body.shippingAddress,
    });
    await order.save();
    
    let options = myTicket.myTicketItems.map((trip)=>{
        return {
            updateOne: {
                filter: {_id:trip._id},
                update: { $inc: {sold: trip.quantity,quantity: -trip.quantity}}
            }
        }
    })

    await tripModel.bulkWrite(options);

    await myTicketModel.findByIdAndDelete(req.params.id);

    res.status(200).json({msg: "success", order})
});

const getSpecificOrder = catchError(async (req, res, next) => {
    let order = await orderModel
      .findOne({ user: req.user._id })
      .populate("orderItems.trip");
    !order && next(new apiError("not order found", 404));
    order && res.json({ msg: "success", order });
  });

const getAllOrders = catchError(async (req, res, next) => {
    let orders = await orderModel.find({}).populate("orderItems.trip");
    res.json({ msg: "success", orders });
  });

const createCheckOutSessions = catchError(async (req, res, next) => {
    let myTicket = await myTicketModel.findById(req.params.id);
    if(!myTicket) return next(new apiError("not myTicket found",404));

    let totalOrderPrice = myTicket.totalPrice;
    let session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "egp",
            unit_amount: totalOrderPrice * 100,
            product_data: {
              name: req.user.name,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      cancel_url: "http://localhost:3000/api/v1/order",
      success_url: "http://localhost:3000/api/v1/order",
      customer_email: req.user.email,
      client_reference_id: req.params.id,
      metadata: req.body.shippingAddress,
    });
    res.json({ msg: "success", session });
  });

export{
    createCashOrder,
    getSpecificOrder,   
    getAllOrders,
    createCheckOutSessions
}