import { myTicketModel } from "../../../databases/models/myTickets.model.js";
import { orderModel } from "../../../databases/models/orderModel.js";
import { tripModel } from "../../../databases/models/trip.model.js";
import { userModel } from "../../../databases/models/user.model.js";
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
    
    let options = myTicket.myTicketItems.map((prod)=>{
        return {
            updateOne: {
                filter: {_id: prod.trip},
                update: { $inc: {sold: prod.quantity,quantity: -prod.quantity}}
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

const createCheckOutSessions = async (req, res, next) => {
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
              name: req.user.firstName + " " + req.user.lastName,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      cancel_url: "https://kemet-gp2024.onrender.com/api/v1/MyTickets",
      success_url: "https://kemet-gp2024.onrender.com/",
      customer_email: req.user.email,
      client_reference_id: req.params.id,
      metadata: req.body.shippingAddress,
    });
    res.json({ msg: "success", session });
  };

const createOnlineOrder = (request, response) => {
    const sig = request.headers['stripe-signature'].toString();
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, "whsec_0KbZ8RoMfWPvWZC2JccFuSXFnqOfyZtB");
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
      
    }
  
    if(event.type=='checkout.session.completed'){
      
      card(event.data.object,response)
      console.log("create order here.........");
    }else{

      console.log(`Unhandled event type ${event.type}`);
    }
  };

export{
    createCashOrder,
    getSpecificOrder,   
    getAllOrders,
    createCheckOutSessions,
    createOnlineOrder
}

async function card(e,res){
  let myTicket = await myTicketModel.findById(e.client_reference_id);
  if (!myTicket) return next(new apiError("not myTicket found", 404));
  let user = await userModel.findOne({email: e.customer_email})

  let order = new orderModel({
    user: user._id,
    orderItems: myTicket.myTicketItems,
    totalOrderPrice: e.amount_total/100 ,
    shippingAddress: e.metadata.shippingAddress,
    paymentType: "card",
    isPaid: true,
    paidAt: Date.now(),


  });
  await order.save();

  let options = myTicket.myTicketItems.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod.trip },
        update: { $inc: { sold: prod.quantity, quantity: -prod.quantity } },
      },
    };
  });

  await tripModel.bulkWrite(options);

  await myTicketModel.findOneAndDelete({user:user._id});

  res.json({ msg: "success", order });
}