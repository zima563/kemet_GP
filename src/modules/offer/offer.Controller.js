import { tripModel } from "../../../databases/models/trip.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";

const addOffer = catchError(async (req, res, next) => {
  let trip = await tripModel.findByIdAndUpdate(req.body.trip,{isOffered:true},{new:true});
  if (!trip) return next(new apiError("not trip found", 404));

  trip.priceAfterDiscount = trip.price - (trip.price * req.body.discount) / 100;
  await trip.save()
  res.json({ msg: "sucess", trip });
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
  let offer = await tripModel.findOne({_id:req.params.id,isOffered:true});
  if (!offer) return next(new apiError("not offer found"));

  offer.priceAfterDiscount =
    offer.price - (offer.price * req.body.discount) / 100;

  await offer.save();
  res.json({ msg: "success", offer });
});

const deleteOffer = catchError(async (req, res, next) => {
  let offer = await tripModel.findByIdAndUpdate(req.param.id,{isOffered:false,priceAfterDiscount:undefined},{new:true})
  if (!offer) return next(new apiError("not offer found"));
  res.json({ msg: "success", offer });
});

export { addOffer,getOffer,getOffers,updateOffer,deleteOffer };
