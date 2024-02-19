import express from "express";
import { addToMyTicketsVal, updateQTYVal } from "./myTickets.validators.js";
import {
  addToMyTickets,
  clearUserMyTickets,
  getLoggedUserMyTickets,
  removeItemFromMyTickets,
  updateQTY,
} from "./myTickets.controller.js";
import { allowedTo, protectRoutes } from "../auth/authControllers.js";
import { paramsIdVal } from "../../utils/idValidator.js";
import { validation } from "../../middlewares/validation.js";

const myTicketRouter = express.Router();

myTicketRouter
  .route("/")
  .post(
    protectRoutes,
    allowedTo("user"),
    validation(addToMyTicketsVal),
    addToMyTickets
  )
  .get(protectRoutes, allowedTo("user"), getLoggedUserMyTickets)
  .delete(protectRoutes, allowedTo("user"), clearUserMyTickets);

myTicketRouter
  .route("/:id")
  .put(protectRoutes, allowedTo("user"), validation(updateQTYVal), updateQTY)
  .delete(
    protectRoutes,
    allowedTo("user", "admin"),
    validation(paramsIdVal),
    removeItemFromMyTickets
  );

export { myTicketRouter };
