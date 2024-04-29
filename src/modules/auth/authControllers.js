import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";
import { sendEmailPcode } from "../../services/email/sendEmailPinCode.js";
import { userModel } from "../../../databases/models/user.model.js";

const verifyEmail = catchError(async (req, res, next) => {
  let user = new userModel();
  user.email=req.body.email;
  const pinCode = Math.floor(100000 + Math.random() * 900000).toString();
  const pinCodeExpire = new Date();
  pinCodeExpire.setMinutes(pinCodeExpire.getMinutes() + 10);
  user.pinCode = pinCode;
  user.pinCodeExpire = pinCodeExpire;
  user.confirmEmail = false;

  await user.save();
  let token = Jwt.sign(
        { userId:user._id },
        process.env.JWT_KEY
      );
  sendEmailPcode(user.email, user.pinCode);

  res.json({ msg: "send of message successfully",token });
});

const checkConformingEmail = catchError(async (req, res, next) => {
  let user = await userModel.findById(req.user._id)
  if (user.pinCode !== req.body.pinCode || new Date() > user.pinCodeExpire)
        return next(new apiError("Invalid or expired PinCode", 401));

    user.pinCode = undefined;
    user.pinCodeExpire = undefined;
    user.confirmEmail = true;
    await user.save();
    res.json({ msg: "verification of pinCode is successfully" });

});

const setingPassword = catchError(async (req, res, next) => {
  let user = await userModel.findOne({_id:req.user._id,confirmEmail:true});
  if (!user) return next(new apiError("user not found", 404));
  
  user.password = req.body.password;
  user.profileImg = `https://kemet-gp2024.onrender.com/defaultAvatar.png`;
  await user.save();
  let token = Jwt.sign(
    { userId: user._id },
    process.env.JWT_KEY
  );

  res.status(200).json({ msg: "reset password is success ", token });
});

const signup = catchError(async (req, res, next) => {
  if (req.file) req.body.profileImg = req.file.filename;
  let user = await userModel.findOneAndUpdate({_id: req.user._id},{
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    DOB: req.body.DOB,
    city: req.body.city,
    profileImg: `https://kemet-gp2024.onrender.com/${req.body.profileImg}`,
  })
  let token = Jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_KEY
  );
  res.json({ msg: "success", token });
});

const signin = catchError(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    let token = Jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY
    );
    return res.json({ msg: "success", token });
  }
  next(new apiError("email or password incorrect", 401));
});

const forgettingPassword = catchError(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new apiError("not found email", 404));
  const pinCode = Math.floor(100000 + Math.random() * 900000).toString();
  const pinCodeExpire = new Date();
  pinCodeExpire.setMinutes(pinCodeExpire.getMinutes() + 10);
  user.pinCode = pinCode;
  user.pinCodeExpire = pinCodeExpire;
  user.resetVerified = false;

  await user.save();
  let token = Jwt.sign(
    { userId:user._id },
    process.env.JWT_KEY
  );
  sendEmailPcode(user.email, user.pinCode);

  res.json({ msg: "send of message successfully",token });
});

const checkpinCode = catchError(async (req, res, next) => {
  let user = await userModel.findById(req.user._id);
  if (user.pinCode !== req.body.pinCode || new Date() > user.pinCodeExpire)
        return next(new apiError("Invalid or expired PinCode", 401));
    user.pinCode = undefined;
    user.resetVerified = true;
    await user.save();
    res.json({ msg: "verification of pinCode is successfully" });
  
});

const resetPassword = catchError(async (req, res, next) => {
  let user = await userModel.findOne({_id:req.user._id,resetVerified:true});

  user.password = req.body.newPassword;
  await user.save();
  let token = Jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_KEY
  );

  res.status(200).json({ msg: "reset password is success ", token });
});

const userProfile = catchError(async (req, res, next) => {
  let user = req.user;
  res.status(200).json({ msg: "success ", user });
});

const updateUserProfie = catchError(async (req, res, next) => {
  if (req.file) req.body.profileImg = req.file.filename;
  let user = await userModel.findOneAndUpdate({ _id: req.user._id }, req.body, {
    new: true,
  });

  !user && next(new apiError("not user found", 404));
  user && res.json({ msg: "success", user });
});


const changePassword = catchError(async (req, res, next) => {
  let user = await userModel.findById(req.user._id);
  if (user && bcrypt.compareSync(req.body.currentPassword, user.password)) {
    let token = Jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY
    );
    await userModel.findByIdAndUpdate(req.user._id, {
      password: req.body.newPassword,
      passwordChangedAt: Date.now(),
    });
    return res.json({ msg: "your password is changed successfully", token });
  }

  next(new apiError("password incorrect", 401));
});

const logout = catchError(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, {
    logoutAt: Date.now(),
    isActive: false,
  });
  res.status(200).json({ msg: "you logOut successfuly" });
});

const protectRoutes = catchError(async (req, res, next) => {
  let { token } = req.headers;

  if (!token) return next(new apiError("not token provide", 401));

  let decoded = Jwt.verify(token, process.env.JWT_KEY);
  let user = await userModel.findById(decoded.userId);
  if (!user) return next(new apiError("user not found"));

  if (user.passwordChangedAt) {
    let timeOfChangePassword = parseInt(user?.passwordChangedAt / 1000);
    if (timeOfChangePassword > decoded.iat)
      return next(new apiError("invalid token..please login", 401));
  }

  // console.log(decoded.iat + "|" + parseInt(user?.logoutAt / 1000));
  if (user.logoutAt) {
    let timeOflogout = parseInt(user?.logoutAt / 1000);
    if (timeOflogout > decoded.iat)
      return next(new apiError("invalid token..please login", 401));
  }
  req.user = user;
  next();
});

const allowedTo = (...roles) => {
  return catchError(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new apiError("you are not authorized", 401));

    next();
  });
};
export {
  signin,
  signup,
  verifyEmail,
  checkConformingEmail,
  setingPassword,
  forgettingPassword,
  checkpinCode,
  resetPassword,
  protectRoutes,
  changePassword,
  allowedTo,
  userProfile,
  updateUserProfie,
  logout,
};
