import express from "express";
import { allowedTo, protectRoutes } from "../auth/authControllers.js";

import { paramsIdVal } from "../../utils/idValidator.js";
import { isReviewExist } from "../../middlewares/reviewTripExist.js";
import { validation } from "../../middlewares/validation.js";
import { addReviewVal, updateReviewVal } from "./review.Validators.js";
import {
  addReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from "./review.Controller.js";

const reviewRouter = express.Router();

reviewRouter
  .route("/")
  .get(getReviews);

reviewRouter
  .route("/:id")
  .post(
    protectRoutes,
    allowedTo("user"),
    isReviewExist,
    validation(addReviewVal),
    addReview
  )
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
