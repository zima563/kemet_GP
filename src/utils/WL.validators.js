import Joi from "joi";

const addwishListVal = Joi.object({
  document: Joi.string().length(24).hex().required(),
});

const removeFromWishListVal = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

export { addwishListVal , removeFromWishListVal};
