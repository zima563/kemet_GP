import Joi from "joi";

const addToMyTicketsVal = Joi.object({
  trip: Joi.string().length(24).hex().required(),
  quantity: Joi.number().integer().options({ convert: false }),
});

const updateQTYVal = Joi.object({
  id: Joi.string().length(24).hex().required(),
  quantity: Joi.number().required().integer().options({ convert: false }),
});

export { addToMyTicketsVal, updateQTYVal };
