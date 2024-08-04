process.on("uncaughtException", (err) => {
  console.log("error", err);
});
import express from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";
import schedule from "node-schedule";

dotenv.config();
import { dbConnection } from "./databases/dbConnection.js";
import { bootstrap } from "./src/index.routers.js";
// import { createOnlineOrder } from "./src/modules/order/order.controller.js";

const paypal = require('@paypal/checkout-server-sdk');

dbConnection();

const app = express();
const port = 3000;

const job = schedule.scheduleJob("* * * * *", function () {
  console.log("welcome to kemet app!");
});

app.use(cors());
app.options("*", cors());
// app.post(
//   "/webhooks",
//   express.raw({ type: "application/json" }),
//   createOnlineOrder
// );
// إعداد PayPal SDK
const environment = new paypal.core.SandboxEnvironment('AQ_N09kxaL3IryDbbvWTYaRcYjShpn2_HBsv2WZkEhzU0mNzLlUq4abv4mMq3N8mTCQtK_YT7p5IlPXv', 'EJEEkJqkiq56eqxeavnDA1PR10qlWilrvLsAn68tK9ZIU5QJ0CwJPkJpDhkL-tzkIZy5FXNpU4bC3Xhk');
const client = new paypal.core.PayPalHttpClient(environment);

// إنشاء طلب دفع
app.post('/create-order', async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
          amount: {
              currency_code: 'USD',
              value: '100.00'
          }
      }]
  });

  try {
      const order = await client.execute(request);
      res.json({ id: order.result.id });
  } catch (err) {
      console.error(err);
      res.status(500).send('Something went wrong');
  }
});

// التقاط الدفع عند اكتمال عملية الدفع
app.post('/capture-order', async (req, res) => {
  const orderId = req.body.orderId;

  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
      const capture = await client.execute(request);
      res.json(capture.result);
  } catch (err) {
      console.error(err);
      res.status(500).send('Something went wrong');
  }
});
// Endpoint to handle webhook events
app.post('/webhook', (req, res) => {
  const event = req.body;

  switch (event.event_type) {
      case 'CHECKOUT.ORDER.APPROVED':
          // Handle the checkout session completed event
          console.log('Checkout session completed:', event);
          // Add your business logic here
          break;
      // Add more cases to handle other event types if needed
      default:
          console.log(`Unhandled event type ${event.event_type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.status(200).send('Event received');
});

app.use("/", express.static("uploads"));
app.use(express.json());

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "too many accounts created from this IP , please try again an hour",
// })

// app.use(limiter);

//middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: ["price", "sold", "quantity", "ratingQuantity", "ratingAverage"],
  })
);

app.get("/", (req, res, next) => {
  res.json({ msg: "hello world" });
});

bootstrap(app);

process.on("unhandledRejection", (err) => {
  console.log("error", err);
});
app.listen(process.env.PORT || port, () =>
  console.log(`Example app listening on port ${port}!`)
);
