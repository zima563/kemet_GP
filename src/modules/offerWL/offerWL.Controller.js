import { userModel } from "../../../databases/models/user.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";

const addToOfferWishList =  catchError(async (req, res, next) => {
    let wishList = await userModel
      .findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishListOffer : req.body.document } },
        { new: true }
      )
      .populate("wishListOffer");
     
    !wishList && next(new apiError({ msq: "not document found" }, 404));
    wishList && res.json({ msg: "success", wishListOffer: wishList.wishListOffer });
  });
const removeFromOfferWishList =  catchError(async (req, res, next) => {
    let wishList = await userModel
      .findByIdAndUpdate(
        req.user._id,
        { $pull: { wishListOffer: req.params.id } },
        { new: true }
      )
      .populate("wishListOffer");
    !wishList && next(new apiError({ msq: "not document found" }, 404));
    wishList && res.json({ msg: "success", wishListOffer: wishList.wishListOffer });
  });


const getLoggedUserOfferWishList = catchError(async (req, res, next) => {
    let { wishListOffer } = await userModel
      .findById(req.user._id)
      .populate("wishListOffer");
    !wishListOffer && next(new apiError({ msq: "not document found" }, 404));
    wishListOffer && res.json({ msg: "success", wishListOffer });
  });

export { addToOfferWishList,removeFromOfferWishList,getLoggedUserOfferWishList };
