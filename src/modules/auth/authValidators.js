
import Joi from "joi";

const verifyEmailValidator = Joi.object({
  email: Joi.string().pattern(/[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/).required(),
});

const checkConformingEmailValidator = Joi.object({
  pinCode: Joi.string().trim().pattern(/^[0-9][0-9][0-9][0-9][0-9][0-9]$/).required(),
});

const setingPasswordValidator = Joi.object({
  password: Joi.string().pattern(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  ),
  rePassword: Joi.valid(Joi.ref("password")), 
})

const signupValidator = Joi.object({
  firstName: Joi.string().min(2).max(30).trim().required(),
  lastName: Joi.string().min(2).max(30).trim().required(),
  DOB: Joi.string().pattern(/^\d{4}-\d{1,2}-\d{1,2}$/).trim().required(),
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
  }).required(),
});

const signinValidator = Joi.object({
  email: Joi.string().pattern(/[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/),
  password: Joi.string().pattern(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  ),
});

const forgettingPasswordValidator = Joi.object({
  email: Joi.string().pattern(/^[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/),
});

const checkpinCodeValidator = Joi.object({
  pinCode: Joi.string().pattern(/^[0-9][0-9][0-9][0-9][0-9][0-9]$/),
});

const resetPasswordValidator = Joi.object({
  newPassword: Joi.string().pattern(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  ),
});

const changePasswordValidator = Joi.object({
  currentPassword: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .required(),
  newPassword: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .required(),
  reNewPassword: Joi.valid(Joi.ref("newPassword")).required(),
});

export {
  signinValidator,
  signupValidator,
  forgettingPasswordValidator,
  checkpinCodeValidator,
  resetPasswordValidator,
  changePasswordValidator,
  verifyEmailValidator,
  checkConformingEmailValidator,
  setingPasswordValidator,
};
