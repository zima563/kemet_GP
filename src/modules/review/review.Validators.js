import Joi from "joi";

const addReviewVal = Joi.object({

  id: Joi.string().length(24).hex().required(),

  
  text: Joi.string().min(1).max(200).trim().required(),
  rate: Joi.number().min(0).max(5).required().options({ convert: false }),
  
});

const updateReviewVal = Joi.object({
  id: Joi.string().length(24).hex().required(),

  text: Joi.string().min(1).max(200).trim(),
  rate: Joi.number().min(0).max(5),
  trip: Joi.string().length(24).hex(),
});

export { addReviewVal, updateReviewVal };
