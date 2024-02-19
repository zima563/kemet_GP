import express from "express"
import { addToTPWishList,removeFromTPWishList,getLoggedUserTPWishList} from "./tourismPlaceWL.Controller.js"
import { allowedTo, protectRoutes } from "../auth/authControllers.js";
import { validation } from "../../middlewares/validation.js";
import { addwishListVal, removeFromWishListVal } from "../../utils/WL.validators.js";

const tourismPlaceWishListRouter = express.Router();

tourismPlaceWishListRouter
.route("/addToWishList")
.patch(protectRoutes,allowedTo("user"),validation(addwishListVal),addToTPWishList);
tourismPlaceWishListRouter
.route("/removeFromWishList/:id")
.delete(protectRoutes,allowedTo("user"),validation(removeFromWishListVal),removeFromTPWishList);
tourismPlaceWishListRouter
.route("/getLoggedUserWishList")
.get(protectRoutes,allowedTo("user"),getLoggedUserTPWishList);

export default tourismPlaceWishListRouter