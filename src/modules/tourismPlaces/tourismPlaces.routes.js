import express from "express";
import { allowedTo, protectRoutes } from "../auth/authControllers.js";
import { validation } from "../../middlewares/validation.js";
import {
  addtourismPlace,
  deletetourismPlace,
  getAlltourismPlaces,
  getSingletourismPlace,
  updatetourismPlace,
} from "./tourismPlaces.Controllers.js";
import {
  addtourismPlacesVal,
  updatetourismPlacesVal,
} from "./tourismPlaces.validators.js";
import { paramsIdVal } from "../../utils/idValidator.js";
import { uploadFieldsOfFiles } from "../../services/fileUpload/upload.js";

const tourismPlacesRouter = express.Router({ mergeParams: true });

tourismPlacesRouter
  .route("/")
  .post(
    protectRoutes,
    allowedTo("admin"),
    uploadFieldsOfFiles([
      { name: "imgCover", maxCounts: 1 },
      { name: "images", maxCounts: 10 },
    ]),
    validation(addtourismPlacesVal),
    addtourismPlace
  )
  .get(getAlltourismPlaces);

tourismPlacesRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingletourismPlace)
  .put(
    protectRoutes,
    allowedTo("admin"),
    uploadFieldsOfFiles([
      { name: "imgCover", maxCounts: 1 },
      { name: "images", maxCounts: 10 },
    ]),
    validation(updatetourismPlacesVal),
    updatetourismPlace
  )
  .delete(
    protectRoutes,
    allowedTo("admin"),
    validation(paramsIdVal),
    deletetourismPlace
  );

export { tourismPlacesRouter };
