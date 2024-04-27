import { populate } from "dotenv";
import { reviewModel } from "../../../databases/models/review.model.js";
import { tripModel } from "../../../databases/models/trip.model.js";
import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";


const addReview = catchError(async(req,res,next)=>{
  let trip = await tripModel.findById(req.params.id);
  if(!trip) return next(new apiError("not trip found",404));
  
  let review = new reviewModel(req.body);
  review.user = req.user._id;
  review.trip = req.params.id;
  await review.save();
  
  let ratingQuantity = trip.ratingQuantity++
  let ratingAverage =(trip.ratingAverage+review.rate)/trip.ratingQuantity
  
  await tripModel.findByIdAndUpdate(req.params.id,{ratingAverage,ratingQuantity})
  res.status(200).json({msg:"success",review});
})

const getReviews = catchError(async(req,res,next)=>{
  let reviews = await reviewModel.find();
  res.status(200).json({msg:"success",reviews});
});

const getReview = catchError(async(req,res,next)=>{
  let review = await reviewModel.findById(req.params.id);
  !review && next(new apiError("not review found", 404));
  review && res.json({ msg: "success", review });
})

const updateReview = catchError(async(req,res,next)=>{
  
  let review = await reviewModel.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body,
        {
          new: true,
        }
      );
    !review && next(new apiError("not review found", 404));
  let trip = await tripModel.findById(review.trip)
  if(req.body.rate){
    trip.ratingAverage=trip.ratingAverage-(trip.ratingAverage/1)
    trip.ratingAverage=(trip.ratingAverage+review.rate)/trip.ratingQuantity
    let ratingAve = trip.ratingAverage
  }
    await tripModel.findByIdAndUpdate(review.trip,{ratingAverage:ratingAve})
      review && res.json({ msg: "success", review });
})

const deleteReview = catchError(async(req,res,next)=>{
    let review = await reviewModel.findByIdAndDelete(req.params.id);
    !review && next(new apiError("not review found", 404));
    
    let trip = await tripModel.findById(review.trip);
    let ratingAverage=trip.ratingAverage-(trip.ratingAverage/1)
    let ratingQuantity = trip.ratingQuantity--
    await tripModel.findByIdAndUpdate(review.trip,{ratingAverage,ratingQuantity})
    review && res.json({ msg: "success", review });
})

export { addReview , getReviews , getReview, updateReview , deleteReview};
