import Joi from "joi";

const addTripVal = Joi.object({
  title: Joi.string().min(2).max(20).required().trim(),
  description: Joi.string().trim().required().min(2).max(50),
  quantity: Joi.number().optional().min(0),
  price: Joi.number().required().min(0),
  priceAfterDiscount: Joi.number().optional(),
  governrate: Joi.string().length(24).hex().required(),
  tourismPlace: Joi.string().length(24).hex().required(),

  imgCover: Joi.array()
    .items(
      Joi.object({
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
      })
    )
    .required(),

  images: Joi.array()
    .items(
      Joi.object({
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
      })
    )
    .required(),
});

const updateTripVal = Joi.object({
  id: Joi.string().length(24).hex().required(),

  title: Joi.string().min(2).max(20).optional().trim(),
  description: Joi.string().trim().optional().min(2).max(50),
  quantity: Joi.number().optional().min(0),
  price: Joi.number().min(0),
  priceAfterDiscount: Joi.number().optional(),
  governrate: Joi.string().length(24).hex(),
  tourismPlace: Joi.string().length(24).hex(),
  imgCover: Joi.array().items(
    Joi.object({
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
    })
  ),

  images: Joi.array().items(
    Joi.object({
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
    })
  ),
});

export { addTripVal, updateTripVal };
