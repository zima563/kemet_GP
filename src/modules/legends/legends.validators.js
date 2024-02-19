import Joi from "joi";

const addLegendVal = Joi.object({
  name: Joi.string().min(2).max(100).trim().required(),
  informationAbout: Joi.string().min(10).max(1500).trim().required(),
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

const updateLegendVal = Joi.object({
  id: Joi.string().length(24).hex().required(),

  name: Joi.string().min(2).max(100).trim(),
  informationAbout: Joi.string().min(10).max(1500).trim(),
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

export { addLegendVal, updateLegendVal };
