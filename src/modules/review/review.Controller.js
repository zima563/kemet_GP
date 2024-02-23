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
  
  trip.ratingQuantity+=1
  trip.ratingAverage=(trip.ratingAverage+review.rate)/trip.ratingQuantity
  
  await trip.save()
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
  let trip = await tripModel.findById(review.trip)
  if(req.body.rate){
    trip.ratingAverage=trip.ratingAverage-(trip.ratingAverage/1)
    trip.ratingAverage=(trip.ratingAverage+review.rate)/trip.ratingQuantity
  }
    await trip.save()
      !review && next(new apiError("not review found", 404));
      review && res.json({ msg: "success", review });
})

const deleteReview = catchError(async(req,res,next)=>{
    let review = await reviewModel.findByIdAndDelete(req.params.id);
    !review && next(new apiError("not review found", 404));
    
    let trip = await tripModel.findById(review.trip);
    trip.ratingAverage=trip.ratingAverage-(trip.ratingAverage/1)
    trip.ratingQuantity-=1
    await trip.save()
    review && res.json({ msg: "success", review });
})

export { addReview , getReviews , getReview, updateReview , deleteReview};
