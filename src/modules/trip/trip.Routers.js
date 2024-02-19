import express from "express";

import { uploadFieldsOfFiles } from "../../services/fileUpload/upload.js";
import { allowedTo, protectRoutes } from "../auth/authControllers.js";
import { addTripVal, updateTripVal } from "./tripValidators.js";
import {
  addTrip,
  deleteTrip,
  getTrip,
  getTrips,
  updateTrip,
} from "./trip.Controller.js";
import { paramsIdVal } from "../../utils/idValidator.js";
import { validation } from "../../middlewares/validation.js";

const tripRouter = express.Router();

tripRouter
  .route("/")
  .post(
    protectRoutes,
    allowedTo("admin"),
    uploadFieldsOfFiles([
      { name: "imgCover", maxCounts: 1 },
      { name: "images", maxCounts: 10 },
    ]),
    validation(addTripVal),
    addTrip
  )
  .get(getTrips);

tripRouter
  .route("/:id")
  .get(validation(paramsIdVal), getTrip)
  .put(
    protectRoutes,
    allowedTo("admin"),
    uploadFieldsOfFiles([
      { name: "imgCover", maxCounts: 1 },
      { name: "images", maxCounts: 10 },
    ]),
    validation(updateTripVal),
    updateTrip
  )
  .delete(
    protectRoutes,
    allowedTo("admin"),
    validation(paramsIdVal),
    deleteTrip
  );

export { tripRouter };
