import { userModel } from "../../../databases/models/user.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";

const addToTPWishList =  catchError(async (req, res, next) => {
    let wishList = await userModel
      .findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishListTourismPlace : req.body.document } },
        { new: true }
      )
      .populate("wishListTourismPlace");
    !wishList && next(new apiError({ msq: "not document found" }, 404));
    wishList && res.json({ msg: "success", wishList: wishList.wishListTourismPlace });
  });
const removeFromTPWishList =  catchError(async (req, res, next) => {
    let wishList = await userModel
      .findByIdAndUpdate(
        req.user._id,
        { $pull: { wishListTourismPlace: req.params.id } },
        { new: true }
      )
      .populate("wishListTourismPlace");
    !wishList && next(new apiError({ msq: "not document found" }, 404));
    wishList && res.json({ msg: "success", wishList: wishList.wishListTourismPlace });
  });


const getLoggedUserTPWishList = catchError(async (req, res, next) => {
    let { wishListTourismPlace } = await userModel
      .findById(req.user._id)
      .populate("wishListTourismPlace");
    !wishListTourismPlace && next(new apiError({ msq: "not document found" }, 404));
    wishListTourismPlace && res.json({ msg: "success", wishListTourismPlace });
  });

export { addToTPWishList,removeFromTPWishList,getLoggedUserTPWishList };
