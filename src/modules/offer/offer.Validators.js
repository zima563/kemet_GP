import Joi from "joi";

const addOfferVal = Joi.object({
  trip: Joi.string().length(24).hex().required(),
  discount: Joi.number().options({ convert: false }).required(),
});

const updateOfferVal = Joi.object({
  id: Joi.string().length(24).hex().required(),

  trip: Joi.string().length(24).hex(),
  discount: Joi.number().options({ convert: false }),
});

export { addOfferVal, updateOfferVal };
