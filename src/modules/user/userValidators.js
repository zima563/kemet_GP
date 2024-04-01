import Joi from "joi";

const addUserVal = Joi.object({
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().trim().email().required(),
  mobilePhone: Joi.string().pattern(/^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/).required(),
  DOB: Joi.string().pattern(/^\d{4}-\d{1,2}-\d{1,2}$/).trim().required(),
  city: Joi.string().min(2).max(30).trim().required(),
  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("password")).required(),
  role: Joi.string().valid("admin", "user"),
  profileImg: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/png", "image/jpg", "image/jpeg")
      .required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().max(5242880).required(),
  }).required(),
});

const paramsVal = Joi.object({
  id: Joi.string().length(24).hex(),
});

const updateUserVal = Joi.object({
  id: Joi.string().length(24).hex(),
  name: Joi.string().trim().min(2),
  email: Joi.string().trim().email(),
  mobilePhone: Joi.string().pattern(/^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/),
  DOB: Joi.string().pattern(/^\d{4}-\d{1,2}-\d{1,2}$/).trim(),
  city: Joi.string().min(2).max(30).trim(),
  password: Joi.string().pattern(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  ),
  role: Joi.string().valid("admin", "user"),
  profileImg: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/png", "image/jpg", "image/jpeg")
      .required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().max(5242880).required(),
  }),
});

export { addUserVal, paramsVal, updateUserVal };
