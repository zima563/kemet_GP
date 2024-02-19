import { addUserVal, updateUserVal } from "../modules/user/userValidators.js";
import { apiError } from "../utils/apiError.js";

export const validation = (schema) => {
  return (req, res, next) => {
    let filter = {};
    if (req.file) {
      if (schema == addUserVal || schema == updateUserVal) {
        filter = {
          profileImg: req.file,
          ...req.params,
          ...req.body,
          ...req.query,
        };
      } else {
        filter = {
          image: req.file,
          ...req.params,
          ...req.body,
          ...req.query,
        };
      }
    } else if (req.files) {
      filter = { ...req.files, ...req.params, ...req.body, ...req.query };
    } else {
      filter = { ...req.params, ...req.body, ...req.query };
    }

    const { error } = schema.validate(filter, { abortEarly: false });
    if (!error) {
      next();
    } else {
      let errMsg = [];
      error.details.forEach((val) => {
        errMsg.push(val.message);
      });
      next(new apiError(errMsg, 401));
    }
  };
};
