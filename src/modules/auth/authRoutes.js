import express from "express";
import {
  allowedTo,
  changePassword,
  checkpinCode,
  forgettingPassword,
  logout,
  protectRoutes,
  resetPassword,
  signin,
  signup,
} from "./authControllers.js";

import {
  changePasswordValidator,
  checkpinCodeValidator,
  forgettingPasswordValidator,
  resetPasswordValidator,
  signinValidator,
  signupValidator,
} from "./authValidators.js";

import { validation } from "../../middlewares/validation.js";
import { emailExists } from "../../middlewares/emailExist.js";

const authRouter = express.Router();

authRouter
  .route("/signup")
  .post(validation(signupValidator), emailExists, signup);
authRouter.route("/signin").post(validation(signinValidator), signin);
authRouter
  .route("/forgettingPassword")
  .post(validation(forgettingPasswordValidator), forgettingPassword);
authRouter
  .route("/checkpinCode")
  .post(validation(checkpinCodeValidator), checkpinCode);
authRouter
  .route("/resetPassword")
  .post(validation(resetPasswordValidator), resetPassword);
authRouter
  .route("/changePassword")
  .patch(
    protectRoutes,
    allowedTo("admin", "user"),
    validation(changePasswordValidator),
    changePassword
  );
authRouter
  .route("/logOut")
  .patch(protectRoutes, allowedTo("admin", "user"), logout);

export { authRouter };
