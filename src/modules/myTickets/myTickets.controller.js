import { myTicketModel } from "../../../databases/models/myTickets.model.js";
import { tripModel } from "../../../databases/models/trip.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";

const calcTotalPrice = (myTicket) => {
  let totalPrice = 0;
  myTicket.myTicketItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  myTicket.totalPrice = totalPrice;
  if (myTicket.discount) {
    let totalPriceAfterDiscount =
      myTicket.totalPrice - (myTicket.totalPrice * myTicket.discount) / 100;
    myTicket.totalPriceAfterDiscount = totalPriceAfterDiscount;
  }
};

const addToMyTickets = catchError(async (req, res, next) => {
  let trip = await tripModel.findById(req.body.trip);
  if (!trip) return next(new apiError("trip not found", 404));

  if (req.body.quantity > trip.quantity)
    return next(new apiError("sold out", 404));
  if(trip.isOffered){
  req.body.price = trip.priceAfterDiscount;
  }else{
    req.body.price = trip.price;
  }
  let isMyTicketsExist = await myTicketModel.findOne({ user: req.user._id });
  if (!isMyTicketsExist) {
    let myTicket = new myTicketModel({
      user: req.user._id,
      myTicketItems: [req.body],
    });

    calcTotalPrice(myTicket);
    await myTicket.save();

    !myTicket && next(new apiError({ msq: "not myTicket found" }, 404));
    myTicket && res.json({ msg: "success", myTicket });
  } else {
    let item = isMyTicketsExist.myTicketItems.find(
      (item) => item.trip == req.body.trip
    );

    if (item) {
      if (item.quantity >= trip.quantity)
        return next(new apiError("sold out", 404));
      item.quantity += req.body.quantity || 1;
    } else isMyTicketsExist.myTicketItems.push(req.body);
    calcTotalPrice(isMyTicketsExist);

    await isMyTicketsExist.save();
    res.json({ msg: "success", myTicket: isMyTicketsExist });
  }
});

const removeItemFromMyTickets = catchError(async (req, res, next) => {
  let myTicket = await myTicketModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { myTicketItems: { _id: req.params.id } } },
    { new: true }
  );

  calcTotalPrice(myTicket);
  await myTicket.save();

  !myTicket && next(new apiError({ msq: "not myTicket found" }, 404));
  myTicket && res.json({ msg: "success", myTicket });
});

const updateQTY = catchError(async (req, res, next) => {
  let myTicket = await myTicketModel.findOne({ user: req.user._id });

  let item = myTicket.myTicketItems.find((ele) => ele._id == req.params.id);
  if (!item) return next(new apiError("item not found", 404));
  let trip = await tripModel.findById(item.trip)
   
  if(req.body.quantity>trip.quantity) 
       return next(new apiError("sold out", 404));
  
  item.quantity = req.body.quantity;
  
  calcTotalPrice(myTicket);
  await myTicket.save();

  !myTicket && res.status(404).json({ msg: "myTicket not found" });
  myTicket && res.json({ msg: "success", myTicket });
});

const getLoggedUserMyTickets = catchError(async (req, res, next) => {
  let myTicket = await myTicketModel
    .findOne({ user: req.user._id })
    .populate("myTicketItems.trip");

  !myTicket && res.status(200).json({ msg: "myTicket not found" });
  myTicket && res.json({ msg: "success", myTicket });
});

const clearUserMyTickets = catchError(async (req, res, next) => {
  let myTicket = await myTicketModel.findOneAndDelete({ user: req.user._id });
  
  !myTicket && res.status(404).json({ msg: "myTicket not found" });
  myTicket && res.json({ msg: "success", myTicket });
});

export {
  addToMyTickets,
  updateQTY,
  getLoggedUserMyTickets,
  clearUserMyTickets,
  removeItemFromMyTickets,
};
