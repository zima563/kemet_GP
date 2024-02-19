import { userModel } from "../../../databases/models/user.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";

const addToTripWishList =  catchError(async (req, res, next) => {
    let wishList = await userModel
      .findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishListTrip : req.body.document } },
        { new: true }
      )
      .populate("wishListTrip");
    !wishList && next(new apiError({ msq: "not document found" }, 404));
    wishList && res.json({ msg: "success", wishListTrip: wishList.wishListTrip });
  });
const removeFromTripWishList =  catchError(async (req, res, next) => {
    let wishList = await userModel
      .findByIdAndUpdate(
        req.user._id,
        { $pull: { wishListTrip: req.params.id } },
        { new: true }
      )
      .populate("wishListTrip");
    !wishList && next(new apiError({ msq: "not document found" }, 404));
    wishList && res.json({ msg: "success", wishListTrip: wishList.wishListTrip });
  });


const getLoggedUserTripWishList = catchError(async (req, res, next) => {
    let { wishListTrip } = await userModel
      .findById(req.user._id)
      .populate("wishListTrip");
    !wishListTrip && next(new apiError({ msq: "not document found" }, 404));
    wishListTrip && res.json({ msg: "success", wishListTrip });
  });

export { addToTripWishList,removeFromTripWishList,getLoggedUserTripWishList };
