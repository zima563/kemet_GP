import { reviewOfferModel } from "../../databases/models/reviewOffer.model.js";
import { apiError } from "../utils/apiError.js";

export const isReviewOfferExist = async (req, res, next) => {
  let isReviewOfferExist = await reviewOfferModel.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (isReviewOfferExist)
    return next(new apiError("you created review before", 409));

  next();
};
