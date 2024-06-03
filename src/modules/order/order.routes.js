import express from "express"
import { validation } from "../../middlewares/validation.js";
import { createCashOrderVal, createCheckOutSessionsVal } from "./order.validator.js";
import { createCashOrder, createCheckOutSessions, deleteOrder, getAllOrders, getSpecificOrder } from "./order.controller.js";
import { allowedTo, protectRoutes } from "../auth/authControllers.js";

const orderRouter = express.Router();

orderRouter.route("/createCashOrder/:id").post(protectRoutes,allowedTo("user"),validation(createCashOrderVal),createCashOrder);

orderRouter.route("/getSpecificOrder").get(protectRoutes,allowedTo("user"),getSpecificOrder);

orderRouter.route("/getAllOrders").get(protectRoutes,allowedTo("admin"),getAllOrders)

orderRouter.route("/deleteOrder").get(protectRoutes,allowedTo("admin"),deleteOrder);

orderRouter
  .route("/checkOut/:id")
  .post(
    protectRoutes,
    allowedTo("user"),
    validation(createCheckOutSessionsVal),
    createCheckOutSessions
  );

export {
    orderRouter
}