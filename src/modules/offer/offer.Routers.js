import express from "express";

import { allowedTo, protectRoutes } from "../auth/authControllers.js";
import { validation } from "../../middlewares/validation.js";
import { addOfferVal, updateOfferVal } from "./offer.Validators.js";

import { paramsIdVal } from "../../utils/idValidator.js";
import {
  addOffer,
  deleteOffer,
  getOffer,
  getOffers,
  updateOffer,
} from "./offer.Controller.js";

const offerRouter = express.Router();

offerRouter
  .route("/")
  .post(protectRoutes, allowedTo("admin"), validation(addOfferVal), addOffer)
  .get(protectRoutes, allowedTo("admin", "user"),getOffers);

offerRouter
  .route("/:id")
  .get(protectRoutes, allowedTo("admin", "user"),validation(paramsIdVal), getOffer)
  .put(
    protectRoutes,
    allowedTo("admin"),
    validation(updateOfferVal),
    updateOffer
  )
  .delete(
    protectRoutes,
    allowedTo("admin"),
    validation(paramsIdVal),
    deleteOffer
  );

export { offerRouter };
