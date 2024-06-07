import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";
import { sendEmailPcode } from "../../services/email/sendEmailPinCode.js";
import { userModel } from "../../../databases/models/user.model.js";

cloudinary.config({
  cloud_name: "dnrfbxmc3",
  api_key: "518374656112347",
  api_secret: "_zgNFNuYi5CfkrW53NQ059sh-KA",
});

const verifyEmail = catchError(async (req, res, next) => {
  let user = new userModel();
  user.email = req.body.email;
  let pinCodeExpire = new Date();
  pinCodeExpire.setMinutes(pinCodeExpire.getMinutes() + 10);
  user.pinCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.pinCodeExpire = pinCodeExpire;
  user.confirmEmail = false;

  await user.save();
  let token = Jwt.sign({ userId: user._id }, process.env.JWT_KEY);
  let subjectOfEmail = "Confirming Email";
  let userPinCode = user.pinCode;
  console.log(userPinCode);
  await sendEmailPcode(user.email, userPinCode, subjectOfEmail);

  res.json({ msg: "send of message successfully", token });
});

const checkConformingEmail = catchError(async (req, res, next) => {
  let user = await userModel.findById(req.user._id);
  if (user.pinCode !== req.body.pinCode || new Date() > user.pinCodeExpire)
    return next(new apiError("Invalid or expired PinCode", 401));

  user.pinCode = undefined;
  user.pinCodeExpire = undefined;
  user.confirmEmail = true;
  await user.save();
  res.json({ msg: "verification of pinCode is successfully" });
});

const setingPassword = catchError(async (req, res, next) => {
  let user = await userModel.findOne({ _id: req.user._id, confirmEmail: true });
  if (!user) return next(new apiError("user not found", 404));

  user.password = req.body.password;

  user.profileImg = `https://kemet-gp2024.onrender.com/${user.profileImg}`;
  await user.save();
  let token = Jwt.sign({ userId: user._id }, process.env.JWT_KEY);

  res.status(200).json({ msg: "reset password is success ", token });
});

const signup = catchError(async (req, res, next) => {
  let filePath;
  if (req.file) {
    filePath = req.file.path;
  } else {
    filePath = "https://kemet-gp2024.onrender.com/defaultAvatar.png";
  }

  cloudinary.uploader.upload(filePath, async (error, result) => {
    let user = await userModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        DOB: req.body.DOB,
        city: req.body.city,
        profileImg: result.secure_url,
      },
      { new: true }
    );
    let token = Jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY
    );
    res.json({ msg: "success", token, user });
  });
});

const signin = catchError(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user.isBlocked) {
      return next(new apiError("you account is blocked", 403));
  } else if (user && bcrypt.compareSync(req.body.password, user.password)) {
    let token = Jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY
    );

    return res.json({
      msg: "success",
      token,
      role: user.role,
      userName: user.firstName + user.lastName,
      userProfile: user.profileImg,
    });
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
  let token = Jwt.sign({ userId: user._id }, process.env.JWT_KEY);
  let subjectOfEmail = "Forgetting Password";
  sendEmailPcode(user.email, user.pinCode, subjectOfEmail);

  res.json({ msg: "send of message successfully", token });
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
  let user = await userModel.findOne({
    _id: req.user._id,
    resetVerified: true,
  });

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
  if (req.file) {
    cloudinary.uploader.upload(req.file.path, async (error, result) => {
      let user = await userModel.findOneAndUpdate(
        { _id: req.user._id },
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          DOB: req.body.DOB,
          city: req.body.city,
          profileImg: result.secure_url,
        },
        {
          new: true,
        }
      );

      !user && next(new apiError("not user found", 404));
      user && res.json({ msg: "success", user });
    });
  } else {
    let user = await userModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        DOB: req.body.DOB,
        city: req.body.city,
      },
      {
        new: true,
      }
    );

    !user && next(new apiError("not user found", 404));
    user && res.json({ msg: "success", user });
  }
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

  if (user.isBlocked) {
    return next(new apiError("you account is blocked", 403));
  }

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
