import slugify from "slugify";
import { v2 as cloudinary } from "cloudinary"

import { catchError } from "../../middlewares/catchError.js";
import { apiError } from "../../utils/apiError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: "dnrfbxmc3",
  api_key: "518374656112347",
  api_secret: "_zgNFNuYi5CfkrW53NQ059sh-KA",
});

export const deleteOne = (model) => {
  return catchError(async (req, res, next) => {
    let document = await model.findByIdAndDelete(req.params.id);
    !document && next(new apiError("not document found", 404));
    document && res.json({ msg: "success", document });
  });
};

export const updateOne = (model) => {
  return catchError(async (req, res, next) => {
    if (req.body.title) req.body.slug = slugify(req.body.title);
    if (req.body.name) req.body.slug = slugify(req.body.name);
   // Upload single image file to Cloudinary
   if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    req.body.image = result.secure_url; // Save the Cloudinary URL
  }

  // Upload cover image to Cloudinary if provided
  if (req.files?.imgCover) {
    const coverResult = await cloudinary.uploader.upload(req.files.imgCover[0].path);
    req.body.imgCover = coverResult.secure_url; // Save the Cloudinary URL
  }

  // Upload multiple images to Cloudinary if provided
  if (req.files?.images) {
    const imageUploadPromises = req.files.images.map((file) =>
      cloudinary.uploader.upload(file.path)
    );
    const imageResults = await Promise.all(imageUploadPromises);
    req.body.images = imageResults.map((result) => result.secure_url); // Save the Cloudinary URLs
  }


    let document = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    !document && next(new apiError("not document found", 404));
    document && res.json({ msg: "success", document });
  });
};

export const addOne = (model) => {
  return catchError(async (req, res, next) => {
    if (req.body.title) req.body.slug = slugify(req.body.title);
    if (req.body.name) req.body.slug = slugify(req.body.name);
  
    // Upload single image file to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.image = result.secure_url; // Save the Cloudinary URL
    }

    // Upload cover image to Cloudinary if provided
    if (req.files?.imgCover) {
      const coverResult = await cloudinary.uploader.upload(req.files.imgCover[0].path);
      req.body.imgCover = coverResult.secure_url; // Save the Cloudinary URL
    }

    // Upload multiple images to Cloudinary if provided
    if (req.files?.images) {
      const imageUploadPromises = req.files.images.map((file) =>
        cloudinary.uploader.upload(file.path)
      );
      const imageResults = await Promise.all(imageUploadPromises);
      req.body.images = imageResults.map((result) => result.secure_url); // Save the Cloudinary URLs
    }
    let document = new model(req.body);
    await document.save();
    res.json({ msg: "success", document });
  });
};

export const getAll = (model, modelName) => {
  return catchError(async (req, res, next) => {
    let filterObj = {};
    if (req.params.governrate) {
      filterObj.governrate = req.params.governrate;
    }
    let countDocuments = await model.countDocuments();
    let apiFeatures = new ApiFeatures(model.find(filterObj), req.query)
      .paginate(countDocuments)
      .filter()
      .sort()
      .search(modelName)
      .limitedFields();

    const { mongooseQuery, paginationResult } = apiFeatures;
    let document = await mongooseQuery;
    res.json({ msg: "success", paginationResult, document });
  });
};

export const getOne = (model) => {
  return catchError(async (req, res, next) => {
    let document = await model.findById(req.params.id);
    !document && next(new apiError("not document found", 404));
    document && res.json({ msg: "success", document });
  });
};
