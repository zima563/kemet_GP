import { v2 as cloudinary } from "cloudinary"
import { catchError } from "../../middlewares/catchError.js";
import { deleteOne } from "../handlers/handler.js";
import { userModel } from "../../../databases/models/user.model.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { apiError } from "../../utils/apiError.js";

cloudinary.config({
  cloud_name: "dnrfbxmc3",
  api_key: "518374656112347",
  api_secret: "_zgNFNuYi5CfkrW53NQ059sh-KA",
});

const addUser = catchError(async (req, res, next) => {
  
  let filePath;
  if(req.file){
    filePath=req.file.path;
  }else{
    filePath="https://kemet-gp2024.onrender.com/defaultAvatar.png";
  }

  cloudinary.uploader.upload(filePath, async(error,result)=>{
    let user = new userModel();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.DOB = req.body.DOB;
    user.city = req.body.city;
    user.profileImg = result.secure_url;
    user.password = req.body.password;
    await user.save();
    res.json({ msg: "success" });
  })
});

const getUsers = catchError(async (req, res, next) => {
  let countDocuments = await userModel.countDocuments();
  let apiFeatures = new ApiFeatures(userModel.find(), req.query)
    .paginate(countDocuments)
    .filter()
    .sort()
    .search()
    .limitedFields();

  const { mongooseQuery, paginationResult } = apiFeatures;
  let users = await mongooseQuery;
  res.json({ msg: "success", paginationResult, users });
});

const getUser = catchError(async (req, res, next) => {
  let user = await userModel.findById(req.params.id);
  !user && next(new apiError("not user found", 404));
  user && res.json({ msg: "success", user });
});

const updateUser = catchError(async (req, res, next) => {
  let user = await userModel.findByIdAndUpdate(req.params.id,{
    role: req.body.role,
    isBlocked: req.body.isBlocked,
  })
  !user && next(new apiError("not user found", 404));
  user && res.json({ msg: "success" });
  }
);

const deleteUser = deleteOne(userModel);

export { addUser, getUser, getUsers, updateUser, deleteUser };
