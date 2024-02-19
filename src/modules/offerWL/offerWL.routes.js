import express from "express"
import { allowedTo, protectRoutes } from "../auth/authControllers.js";
import { validation } from "../../middlewares/validation.js";
import { addwishListVal, removeFromWishListVal } from "../../utils/WL.validators.js";
import { addToOfferWishList, getLoggedUserOfferWishList, removeFromOfferWishList } from "./offerWL.Controller.js";


const offerWishListRouter = express.Router();

offerWishListRouter
.route("/addToWishList")
.patch(protectRoutes,allowedTo("user"),validation(addwishListVal),addToOfferWishList);
offerWishListRouter
.route("/removeFromWishList/:id")
.delete(protectRoutes,allowedTo("user"),validation(removeFromWishListVal),removeFromOfferWishList);
offerWishListRouter
.route("/getLoggedUserWishList")
.get(protectRoutes,allowedTo("user"),getLoggedUserOfferWishList);

export default offerWishListRouter