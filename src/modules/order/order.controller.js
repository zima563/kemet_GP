// import { myTicketModel } from "../../../databases/models/myTickets.model.js";
// import { orderModel } from "../../../databases/models/orderModel.js";
// import { tripModel } from "../../../databases/models/trip.model.js";
// import { userModel } from "../../../databases/models/user.model.js";
// import { catchError } from "../../middlewares/catchError.js";
// import { sendEmailOrderConfirm } from "../../services/email/sendEmailConfirmingOrder.js";
// import { apiError } from "../../utils/apiError.js";

// import paypal from "@paypal/checkout-server-sdk";
// const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_WEBHOOK_ID } = process.env;
// import Stripe from "stripe";
// const stripe = new Stripe(
//   "sk_test_51OjO5wDJVgPX3w4UtWtwnxGjrFw2XBAByqmMldewZSiYUjLqp5IvjeD06mbPGUA2Ou9xlx0JqdRfzH8qtVrDzuJb00Zazas9tJ"
// );

// const createCashOrder = catchError(async(req,res,next)=>{
//     let myTicket = await myTicketModel.findById(req.params.id);
//     if(!myTicket) return next(new apiError("not myTicket found",404));

//     let totalOrderPrice = myTicket.totalPrice;

//     let order = new orderModel({
//         user:req.user._id,
//         orderItems: myTicket.myTicketItems,
//         totalOrderPrice,
//         shippingAddress: req.body.shippingAddress,
//     });
//     order.orderCode=Math.floor(1000 + Math.random() * 9000).toString();
//     await order.save();
    
//     let options = myTicket.myTicketItems.map((prod)=>{
//         return {
//             updateOne: {
//                 filter: {_id: prod.trip},
//                 update: { $inc: {sold: prod.quantity,quantity: -prod.quantity}}
//             }
//         }
//     })

//     await tripModel.bulkWrite(options);
//     await sendEmailOrderConfirm(req.user.email,req.user.firstName+" "+req.user.lastName,order.orderCode)
//     await myTicketModel.findByIdAndDelete(req.params.id);

//     res.status(200).json({msg: "success", order})
// });

// const getSpecificOrder = catchError(async (req, res, next) => {
//     let order = await orderModel
//       .findOne({ user: req.user._id })
//       .populate("orderItems.trip");
//     !order && next(new apiError("not order found", 404));
//     order && res.json({ msg: "success", order });
//   });

// const getAllOrders = catchError(async (req, res, next) => {
//     let orders = await orderModel.find({}).populate("orderItems.trip");
//     res.json({ msg: "success", orders });
//   });

// const deleteOrder = catchError(async(req,res,next)=>{
//     await orderModel.findByIdAndDelete(req.params.id);
//     res.status(200).json({msg: "success"});
// })

// // const createCheckOutSessions = async (req, res, next) => {
// //     let myTicket = await myTicketModel.findById(req.params.id);
// //     if(!myTicket) return next(new apiError("not myTicket found",404));

// //     let totalOrderPrice = myTicket.totalPrice;
// //     let session = await stripe.checkout.sessions.create({
// //       line_items: [
// //         {
// //           price_data: {
// //             currency: "egp",
// //             unit_amount: totalOrderPrice * 100,
// //             product_data: {
// //               name: req.user.firstName + " " + req.user.lastName,
// //             },
// //           },
// //           quantity: 1,
// //         },
// //       ],
// //       mode: "payment",
// //       cancel_url: "https://kemet-gp2024.onrender.com/api/v1/MyTickets",
// //       success_url: "https://kemet-gp2024.onrender.com/",
// //       customer_email: req.user.email,
// //       client_reference_id: req.params.id,
// //       metadata: req.body.shippingAddress,
// //     });
// //     res.json({ msg: "success", session });
// //   };

// // const createOnlineOrder = (request, response) => {
// //     const sig = request.headers['stripe-signature'].toString();
  
// //     let event;
  
// //     try {
// //       event = stripe.webhooks.constructEvent(request.body, sig, "whsec_0KbZ8RoMfWPvWZC2JccFuSXFnqOfyZtB");
// //     } catch (err) {
// //       return response.status(400).send(`Webhook Error: ${err.message}`);
      
// //     }
  
// //     if(event.type=='checkout.session.completed'){
      
// //       card(event.data.object,response)
// //       console.log("create order here.........");
// //     }else{

// //       console.log(`Unhandled event type ${event.type}`);
// //     }
// //   };



// // async function card(e,res){
// //   let myTicket = await myTicketModel.findById(e.client_reference_id);
// //   if (!myTicket) return next(new apiError("not myTicket found", 404));
// //   let user = await userModel.findOne({email: e.customer_email})

// //   let order = new orderModel({
// //     user: user._id,
// //     orderItems: myTicket.myTicketItems,
// //     totalOrderPrice: e.amount_total/100 ,
// //     shippingAddress: e.metadata.shippingAddress,
// //     orderCode: Math.floor(1000 + Math.random() * 9000).toString(),
// //     paymentType: "card",
// //     isPaid: true,
// //     paidAt: Date.now(),


// //   });
// //   await order.save();

// //   let options = myTicket.myTicketItems.map((prod) => {
// //     return {
// //       updateOne: {
// //         filter: { _id: prod.trip },
// //         update: { $inc: { sold: prod.quantity, quantity: -prod.quantity } },
// //       },
// //     };
// //   });

// //   await tripModel.bulkWrite(options);
// //   await sendEmailOrderConfirm(user.email,user.firstName+user.lastName,order.orderCode)
// //   await myTicketModel.findOneAndDelete({user:user._id});

// //   res.json({ msg: "success", order });
// // }


// const Environment = paypal.core.SandboxEnvironment; // or LiveEnvironment for production
// const client = new paypal.core.PayPalHttpClient(new Environment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET));

// const createCheckOutSessions = async (req, res, next) => {
//   try {
//     let myTicket = await myTicketModel.findById(req.params.id);
//     if (!myTicket) return next(new apiError("No ticket found", 404));

//     let totalOrderPrice = myTicket.totalPrice;
//     let request = new paypal.orders.OrdersCreateRequest();
//     request.prefer("return=representation");
//     request.requestBody({
//       intent: 'CAPTURE',
//       purchase_units: [{
//         amount: {
//           currency_code: 'USD',
//           value: totalOrderPrice.toString(),
//         },
//         description: `Order for ${req.user.firstName} ${req.user.lastName}`,
//       }],
//       application_context: {
//         brand_name: 'Your Brand',
//         landing_page: 'BILLING',
//         user_action: 'PAY_NOW',
//         return_url: 'https://yourdomain.com/success',
//         cancel_url: 'https://yourdomain.com/cancel',
//       }
//     });

//     let order = await client.execute(request);
//     res.json({ msg: "success", orderID: order.result.id });
//   } catch (error) {
//     console.error(error);
//     next(new apiError("Payment session creation failed", 500));
//   }
// };

// const createOnlineOrder = async (req, res, next) => {
//   try {
//     const event = req.body;

//     if (event.event_type === 'CHECKOUT.ORDER.APPROVED') {
//       await handleOrder(event.resource);
//       res.status(200).send('Webhook processed');
//     } else {
//       res.status(400).send(`Unhandled event type ${event.event_type}`);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(`Webhook Error: ${error.message}`);
//   }
// };

// async function handleOrder(order) {
//   try {
//     let myTicket = await myTicketModel.findById(order.purchase_units[0].reference_id);
//     if (!myTicket) throw new Error("No ticket found");

//     let user = await userModel.findOne({ email: order.payer.email_address });

//     let newOrder = new orderModel({
//       user: user._id,
//       orderItems: myTicket.myTicketItems,
//       totalOrderPrice: parseFloat(order.purchase_units[0].amount.value),
//       shippingAddress: order.purchase_units[0].shipping.address,
//       orderCode: Math.floor(1000 + Math.random() * 9000).toString(),
//       paymentType: "PayPal",
//       isPaid: true,
//       paidAt: new Date(),
//     });
//     await newOrder.save();

//     let options = myTicket.myTicketItems.map((prod) => {
//       return {
//         updateOne: {
//           filter: { _id: prod.trip },
//           update: { $inc: { sold: prod.quantity, quantity: -prod.quantity } },
//         },
//       };
//     });

//     await tripModel.bulkWrite(options);
//     await sendEmailOrderConfirm(user.email, `${user.firstName} ${user.lastName}`, newOrder.orderCode);
//     await myTicketModel.findOneAndDelete({ user: user._id });

//     console.log('Order successfully created');
//   } catch (error) {
//     console.error('Error handling order:', error);
//   }
// }




// export{
//   createCashOrder,
//   getSpecificOrder,   
//   getAllOrders,
//   deleteOrder,
//   createCheckOutSessions,
//   createOnlineOrder
// }

import { myTicketModel } from "../../../databases/models/myTickets.model.js";
import { orderModel } from "../../../databases/models/orderModel.js";
import { tripModel } from "../../../databases/models/trip.model.js";
import { userModel } from "../../../databases/models/user.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { sendEmailOrderConfirm } from "../../services/email/sendEmailConfirmingOrder.js";
import { apiError } from "../../utils/apiError.js";
import paypal from "@paypal/checkout-server-sdk";

// Setup PayPal environment and client
const Environment = paypal.core.SandboxEnvironment; // Use LiveEnvironment for production
const client = new paypal.core.PayPalHttpClient(new Environment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET));

// Function to create PayPal checkout session
const createCheckOutSessions = async (req, res, next) => {
  try {
    let myTicket = await myTicketModel.findById(req.params.id);
    if (!myTicket) return next(new apiError("No ticket found", 404));

    let totalOrderPrice = myTicket.totalPrice.toFixed(2); // Ensure it's a string
    let request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD', // Use the currency you need
          value: totalOrderPrice,
        },
        description: `Order for ${req.user.firstName} ${req.user.lastName}`,
      }],
      application_context: {
        brand_name: 'Your Brand',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: 'https://kemet-gp2024.onrender.com/', // Replace with your success URL
        cancel_url: 'https://kemet-gp2024.onrender.com/api/v1/MyTickets', // Replace with your cancel URL
      }
    });

    let order = await client.execute(request);
    res.json({ msg: "success", orderID: order.result.id });
  } catch (error) {
    console.error(error);
    next(new apiError("Payment session creation failed", 500));
  }
};

// Function to handle online order completion
const createOnlineOrder = async (req, res, next) => {
  try {
    const event = req.body;

    if (event.event_type === 'CHECKOUT.ORDER.APPROVED') {
      await handleOrder(event.resource);
      res.status(200).send('Webhook processed');
    } else {
      res.status(400).send(`Unhandled event type ${event.event_type}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Webhook Error: ${error.message}`);
  }
};

// Function to process the PayPal order after approval
async function handleOrder(order) {
  try {
    let myTicket = await myTicketModel.findById(order.purchase_units[0].reference_id);
    if (!myTicket) throw new Error("No ticket found");

    let user = await userModel.findOne({ email: order.payer.email_address });

    let newOrder = new orderModel({
      user: user._id,
      orderItems: myTicket.myTicketItems,
      totalOrderPrice: parseFloat(order.purchase_units[0].amount.value),
      shippingAddress: order.purchase_units[0].shipping.address,
      orderCode: Math.floor(1000 + Math.random() * 9000).toString(),
      paymentType: "PayPal",
      isPaid: true,
      paidAt: new Date(),
    });
    await newOrder.save();

    let options = myTicket.myTicketItems.map((prod) => {
      return {
        updateOne: {
          filter: { _id: prod.trip },
          update: { $inc: { sold: prod.quantity, quantity: -prod.quantity } },
        },
      };
    });

    await tripModel.bulkWrite(options);
    await sendEmailOrderConfirm(user.email, `${user.firstName} ${user.lastName}`, newOrder.orderCode);
    await myTicketModel.findOneAndDelete({ user: user._id });

    console.log('Order successfully created');
  } catch (error) {
    console.error('Error handling order:', error);
  }
}

// Export functions for use in routes
export {
  createCheckOutSessions,
  createOnlineOrder
};