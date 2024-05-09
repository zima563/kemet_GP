import Joi from "joi";

const addUserVal = Joi.object({
  firstName: Joi.string().min(2).max(30).trim().required(),
  lastName: Joi.string().min(2).max(30).trim().required(),
  email: Joi.string().pattern(/[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/).required(),
  password: Joi.string().pattern(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  ),
  rePassword: Joi.valid(Joi.ref("password")), 
  DOB: Joi.string().pattern(/^\d{4}-\d{1,2}-\d{1,2}$/).trim().required(),
  role: Joi.string().pattern(/^(admin|user)$/),
  city: Joi.string().min(2).max(30).trim().required(),
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

const paramsVal = Joi.object({
  id: Joi.string().length(24).hex(),
});

const updateUserVal = Joi.object({
  id: Joi.string().length(24).hex(),
  firstName: Joi.string().min(2).max(30).trim(),
  lastName: Joi.string().min(2).max(30).trim(),
  email: Joi.string().pattern(/[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/),
  password: Joi.string().pattern(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  ),
  rePassword: Joi.valid(Joi.ref("password")), 
  DOB: Joi.string().pattern(/^\d{4}-\d{1,2}-\d{1,2}$/).trim(),
  role: Joi.string().pattern(/^(admin|user)$/),
  city: Joi.string().min(2).max(30).trim(),
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
