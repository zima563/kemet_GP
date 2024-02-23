import { userModel } from "../../databases/models/user.model.js";
import { apiError } from "../utils/apiError.js";

export const emailExists = async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user) return next(new apiError("email already exist", 409));
  next();
};
