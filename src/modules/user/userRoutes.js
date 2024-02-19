import express from "express";

import { addUserVal, paramsVal, updateUserVal } from "./userValidators.js";
import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "./userController.js";

import { allowedTo, protectRoutes } from "../auth/authControllers.js";
import { validation } from "../../middlewares/validation.js";
import { emailExists } from "../../middlewares/emailExist.js";
import { uploadSingleFile } from "../../services/fileUpload/upload.js";

const userRouter = express.Router();
userRouter.use(protectRoutes, allowedTo("admin"));
userRouter
  .route("/")
  .post(
    uploadSingleFile("profileImg"),
    validation(addUserVal),
    emailExists,
    addUser
  )
  .get(getUsers);

userRouter
  .route("/:id")
  .get(validation(paramsVal), getUser)
  .put(uploadSingleFile("profileImg"), validation(updateUserVal), updateUser)
  .delete(validation(paramsVal), deleteUser);

export { userRouter };
