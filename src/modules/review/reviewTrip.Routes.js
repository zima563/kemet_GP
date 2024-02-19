import express from "express";
import { allowedTo, protectRoutes } from "../auth/authControllers.js";

import { paramsIdVal } from "../../utils/idValidator.js";
import { isReviewExist } from "../../middlewares/reviewTripExist.js";
import { validation } from "../../middlewares/validation.js";
import { addReviewVal, updateReviewVal } from "./reviewTrip.Validators.js";
import {
  addReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from "./reviewTrip.Controller.js";

const reviewRouter = express.Router();

reviewRouter
  .route("/")
  .post(
    protectRoutes,
    allowedTo("user"),
    isReviewExist,
    validation(addReviewVal),
    addReview
  )
  .get(getReviews);

reviewRouter
  .route("/:id")
  .get(validation(paramsIdVal), getReview)
  .put(
    protectRoutes,
    allowedTo("user"),
    validation(updateReviewVal),
    updateReview
  )
  .delete(
    protectRoutes,
    allowedTo("user", "admin"),
    validation(paramsIdVal),
    deleteReview
  );

export { reviewRouter };
