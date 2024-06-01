
import { catchError } from "../../middlewares/catchError.js";
import { deleteOne } from "../handlers/handler.js";
import { userModel } from "../../../databases/models/user.model.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";

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
  if(req.file){
    cloudinary.uploader.upload(req.file.path,async(error,result)=>{
    let user = await userModel.findOneAndUpdate({ _id: req.user._id },{
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    DOB: req.body.DOB,
    city: req.body.city,
    profileImg: result.secure_url,
    password: req.body.password,
  }, {
    new: true,
  });

  !user && next(new apiError("not user found", 404));
  user && res.json({ msg: "success", user });
    })
  }else{
  let user = await userModel.findOneAndUpdate({ _id: req.user._id },{
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    DOB: req.body.DOB,
    city: req.body.city,
    password: req.body.password,
  }, {
    new: true,
  });

  !user && next(new apiError("not user found", 404));
  user && res.json({ msg: "success", user });
  }
});

const deleteUser = deleteOne(userModel);

export { addUser, getUser, getUsers, updateUser, deleteUser };
