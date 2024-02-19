import express from "express"
import { allowedTo, protectRoutes } from "../auth/authControllers.js";
import { validation } from "../../middlewares/validation.js";   
import { addwishListVal, removeFromWishListVal } from "../../utils/WL.validators.js";
import { addToWishList, getLoggedUserWishList, removeFromWishList } from "./governrateWL.Controller.js";


const governrateWishListRouter = express.Router();

governrateWishListRouter.route("/addToWishList").patch(protectRoutes,allowedTo("user"),validation(addwishListVal),addToWishList);
governrateWishListRouter.route("/removeFromWishList/:id").delete(protectRoutes,allowedTo("user"),validation(removeFromWishListVal),removeFromWishList);
governrateWishListRouter.route("/getLoggedUserWishList").get(protectRoutes,allowedTo("user"),getLoggedUserWishList);

export default governrateWishListRouter