import express from "express";
import {
  allowedTo,
  changePassword,
  checkConformingEmail,
  checkpinCode,
  forgettingPassword,
  logout,
  protectRoutes,
  resetPassword,
  setingPassword,
  signin,
  signup,
  updateUserProfie,
  userProfile,
  verifyEmail,
} from "./authControllers.js";

import {
  changePasswordValidator,
  checkConformingEmailValidator,
  checkpinCodeValidator,
  forgettingPasswordValidator,
  resetPasswordValidator,
  setingPasswordValidator,
  signinValidator,
  signupValidator,
  updateUserProfileValidator,
  verifyEmailValidator,

} from "./authValidators.js";

import { validation } from "../../middlewares/validation.js";
import { emailExists } from "../../middlewares/emailExist.js";
import { authConferming } from "../../middlewares/authConferming.js";
import { uploadSingleFile } from "../../services/fileUpload/upload.js";

const authRouter = express.Router();

authRouter
  .route("/verifyEmail")
  .post(validation(verifyEmailValidator),emailExists,verifyEmail);

authRouter
  .route("/checkConformingEmail")
  .post(validation(checkConformingEmailValidator),authConferming,checkConformingEmail);
authRouter
  .route("/setingPassword")
  .post(validation(setingPasswordValidator),authConferming,setingPassword);
authRouter
  .route("/signup")
  .post(uploadSingleFile("profileImg"), validation(signupValidator), authConferming, signup);
authRouter.route("/signin").post(validation(signinValidator), signin);
authRouter
  .route("/forgettingPassword")
  .post(validation(forgettingPasswordValidator), forgettingPassword);
authRouter
  .route("/checkpinCode")
  .post(validation(checkpinCodeValidator), authConferming,checkpinCode);
authRouter
  .route("/resetPassword")
  .post(validation(resetPasswordValidator),authConferming, resetPassword);
authRouter
  .route("/changePassword")
  .patch(
    protectRoutes,
    allowedTo("admin", "user"),
    validation(changePasswordValidator),
    changePassword
  );
authRouter
  .route("/profile")
  .get(
    protectRoutes,
    allowedTo("admin", "user"),
    userProfile
  ),
  authRouter
    .route("/updateProfile")
  .put(
      protectRoutes,
      allowedTo("admin", "user"),
    uploadSingleFile("profileImg"),
      validation(updateUserProfileValidator),
      updateUserProfie,
    )
authRouter
  .route("/logOut")
  .patch(protectRoutes, allowedTo("admin", "user"), logout);

export { authRouter };
