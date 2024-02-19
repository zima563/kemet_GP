import express from "express"
import { allowedTo, protectRoutes } from "../auth/authControllers.js";
import { validation } from "../../middlewares/validation.js";
import { addwishListVal, removeFromWishListVal } from "../../utils/WL.validators.js";
import { addToTripWishList , removeFromTripWishList,getLoggedUserTripWishList} from "./tripWL.Controller.js"


const tripWishListRouter = express.Router();

tripWishListRouter
.route("/addToWishList")
.patch(protectRoutes,allowedTo("user"),validation(addwishListVal),addToTripWishList);
tripWishListRouter
.route("/removeFromWishList/:id")
.delete(protectRoutes,allowedTo("user"),validation(removeFromWishListVal),removeFromTripWishList);
tripWishListRouter
.route("/getLoggedUserWishList")
.get(protectRoutes,allowedTo("user"),getLoggedUserTripWishList);

export default tripWishListRouter