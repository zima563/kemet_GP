import { offerModel } from "../../../databases/models/offer.model.js";
import { tripModel } from "../../../databases/models/trip.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";
import { deleteOne, getAll, getOne, updateOne } from "../handlers/handler.js";

const addOffer = catchError(async (req, res, next) => {
  let trip = await tripModel.findById(req.body.trip);
  if (!trip) return next(new apiError("not trip found", 404));

  let offer = new offerModel(req.body);
  offer.priceAfterDiscount = trip.price - (trip.price * offer.discount) / 100;
  await offer.save();
  res.json({ msg: "sucess", offer });
});

const getOffers = getAll(offerModel, "offer");

const getOffer = getOne(offerModel);

const updateOffer = catchError(async (req, res, next) => {
  let offer = await offerModel.findById(req.params.id);
  if (!offer) return next(new apiError("not offer found"));
  offer.discount = req.body.discount;
  offer.priceAfterDiscount =
    offer.trip.price - (offer.trip.price * offer.discount) / 100;

  await offer.save();
  res.json({ msg: "success", offer });
});

const deleteOffer = deleteOne(offerModel);

export { addOffer, getOffers, getOffer, updateOffer, deleteOffer };
