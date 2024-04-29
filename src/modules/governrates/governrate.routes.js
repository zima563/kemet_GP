import express from "express";
import { allowedTo, protectRoutes } from "../auth/authControllers.js";

import {
  addGovernrateVal,
  updateGovernrateVal,
} from "./governrate.validators.js";
import {
  addGovernrate,
  deleteGovernrate,
  getAllGovernrates,
  getSingleGovernrate,
  updateGovernrate,
} from "./governrate.Controllers.js";
import { paramsIdVal } from "../../utils/idValidator.js";
import { tourismPlacesRouter } from "../tourismPlaces/tourismPlaces.routes.js";
import { validation } from "../../middlewares/validation.js";
import { uploadSingleFile } from "../../services/fileUpload/upload.js";

const governrateRouter = express.Router();
governrateRouter.use("/:governrate/tourismPlaces", tourismPlacesRouter);
governrateRouter
  .route("/")
  .post(
    protectRoutes,
    allowedTo("admin"),
    uploadSingleFile("img"),
    validation(addGovernrateVal),
    addGovernrate
  )
  .get(protectRoutes,allowedTo("user"),getAllGovernrates);

governrateRouter
  .route("/:id")
  .get(protectRoutes,allowedTo("user"),validation(paramsIdVal), getSingleGovernrate)
  .put(
    protectRoutes,
    allowedTo("admin"),
    uploadSingleFile("img"),
    validation(updateGovernrateVal),
    updateGovernrate
  )
  .delete(
    protectRoutes,
    allowedTo("admin"),
    validation(paramsIdVal),
    deleteGovernrate
  );

export { governrateRouter };
