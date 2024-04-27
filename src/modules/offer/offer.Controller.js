import { tripModel } from "../../../databases/models/trip.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";

const addOffer = catchError(async (req, res, next) => {
  let trip = await tripModel.findByIdAndUpdate(req.body.trip,{isOffered:true},{new:true});
  if (!trip) return next(new apiError("not trip found", 404));

  let priceAfterDiscount = trip.price - (trip.price * req.body.discount) / 100;
  let offer = await tripModel.findByIdAndUpdate(req.body.trip,{priceAfterDiscount},{new:true});
  res.json({ msg: "sucess", offer });
});

const getOffers = catchError(async (req, res, next) => {
  let offers = await tripModel.find({isOffered:true})
  res.json({ msg: "sucess", offers });
});

const getOffer = catchError(async (req, res, next) => {
  let offer = await tripModel.findOne({_id:req.params.id,isOffered:true});
  if (!offer) return next(new apiError("not offer found", 404));
  res.json({ msg: "sucess", offer });
});;

const updateOffer = catchError(async (req, res, next) => {
  let trip = await tripModel.findOne({_id:req.params.id,isOffered:true});
  if (!trip) return next(new apiError("not offer found"));

  let priceAfterDiscount =
    trip.price - (trip.price * req.body.discount) / 100;

  let offer = await tripModel.findOneAndUpdate({_id:req.params.id,isOffered: true},{priceAfterDiscount},{new:true});
  res.json({ msg: "success", offer });
});

const deleteOffer = catchError(async (req, res, next) => {
  let offer = await tripModel.findByIdAndUpdate(req.param.id,{isOffered:false,priceAfterDiscount:undefined},{new:true})
  if (!offer) return next(new apiError("not offer found"));
  res.json({ msg: "success", offer });
});

export { addOffer,getOffer,getOffers,updateOffer,deleteOffer };
