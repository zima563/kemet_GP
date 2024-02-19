import { userModel } from "../../../databases/models/user.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";

const addToWishList =  catchError(async (req, res, next) => {
    let wishList = await userModel
      .findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishListGovernrate : req.body.document } },
        { new: true }
      )
      .populate("wishListGovernrate");
    !wishList && next(new apiError({ msq: "not document found" }, 404));
    wishList && res.json({ msg: "success", wishList: wishList.wishListGovernrate });
  });
const removeFromWishList =  catchError(async (req, res, next) => {
    let wishList = await userModel
      .findByIdAndUpdate(
        req.user._id,
        { $pull: { wishListGovernrate: req.params.id } },
        { new: true }
      )
      .populate("wishListGovernrate");
    !wishList && next(new apiError({ msq: "not document found" }, 404));
    wishList && res.json({ msg: "success", wishList: wishList.wishListGovernrate });
  });


const getLoggedUserWishList = catchError(async (req, res, next) => {
    let { wishListGovernrate } = await userModel
      .findById(req.user._id)
      .populate("wishListGovernrate");
    !wishListGovernrate && next(new apiError({ msq: "not document found" }, 404));
    wishListGovernrate && res.json({ msg: "success", wishListGovernrate });
  });

export { addToWishList, removeFromWishList, getLoggedUserWishList };
