import express from "express"
import { allowedTo, protectRoutes } from "../auth/authControllers.js";
import { validation } from "../../middlewares/validation.js";
import { addToLegendWishList, getLoggedUserLegendWishList, removeFromLegendWishList } from "./legendWL.Controller.js";
import { addwishListVal, removeFromWishListVal } from "../../utils/WL.validators.js";


const legendWishListRouter = express.Router();

legendWishListRouter
.route("/addToWishList")
.patch(protectRoutes,allowedTo("user"),validation(addwishListVal),addToLegendWishList);
legendWishListRouter
.route("/removeFromWishList/:id")
.delete(protectRoutes,allowedTo("user"),validation(removeFromWishListVal),removeFromLegendWishList);
legendWishListRouter
.route("/getLoggedUserWishList")
.get(protectRoutes,allowedTo("user"),getLoggedUserLegendWishList);

export default legendWishListRouter