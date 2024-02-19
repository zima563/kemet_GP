import { userModel } from "../../../databases/models/user.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";

const addToLegendWishList =  catchError(async (req, res, next) => {
    let wishList = await userModel
      .findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishListLegend : req.body.document } },
        { new: true }
      )
      .populate("wishListLegend");
      console.log(wishList);
    !wishList && next(new apiError({ msq: "not document found" }, 404));
    wishList && res.json({ msg: "success", wishList: wishList.wishListLegend });
  });
const removeFromLegendWishList =  catchError(async (req, res, next) => {
    let wishList = await userModel
      .findByIdAndUpdate(
        req.user._id,
        { $pull: { wishListLegend: req.params.id } },
        { new: true }
      )
      .populate("wishListLegend");
    !wishList && next(new apiError({ msq: "not document found" }, 404));
    wishList && res.json({ msg: "success", wishList: wishList.wishListLegend });
  });


const getLoggedUserLegendWishList = catchError(async (req, res, next) => {
    let { wishListLegend } = await userModel
      .findById(req.user._id)
      .populate("wishListLegend");
    !wishListLegend && next(new apiError({ msq: "not document found" }, 404));
    wishListLegend && res.json({ msg: "success", wishListLegend });
  });

export { addToLegendWishList,removeFromLegendWishList,getLoggedUserLegendWishList};
