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
import { createOnlineOrder } from "./src/modules/order/order.controller.js";

dbConnection();

const app = express();
const port = 3000;

const job = schedule.scheduleJob("* * * * *", function () {
  console.log("welcome to kemet app!");
});

app.use(cors());
app.options("*", cors());
app.post(
  "/webhooks",
  express.raw({ type: "application/json" }),
  createOnlineOrder
);

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
