import express from "express";
import { allowedTo, protectRoutes } from "../auth/authControllers.js";
import { addLegendVal, updateLegendVal } from "./legends.validators.js";
import {
  addLegend,
  deleteLegend,
  getAllLegends,
  getSingleLegend,
  updateLegend,
} from "./legends.Controllers.js";
import { paramsIdVal } from "../../utils/idValidator.js";
import { validation } from "../../middlewares/validation.js";
import { uploadFieldsOfFiles } from "../../services/fileUpload/upload.js";

const legendRouter = express.Router();

legendRouter
  .route("/")
  .post(
    protectRoutes,
    allowedTo("admin"),
    uploadFieldsOfFiles([
      { name: "imgCover", maxCounts: 1 },
      { name: "images", maxCounts: 10 },
    ]),
    validation(addLegendVal),
    addLegend
  )
  .get(protectRoutes, allowedTo("admin", "user"),getAllLegends);

legendRouter
  .route("/:id")
  .get(protectRoutes, allowedTo("admin", "user"),validation(paramsIdVal), getSingleLegend)
  .put(
    protectRoutes,
    allowedTo("admin"),
    uploadFieldsOfFiles([
      { name: "imgCover", maxCounts: 1 },
      { name: "images", maxCounts: 10 },
    ]),
    validation(updateLegendVal),
    updateLegend
  )
  .delete(
    protectRoutes,
    allowedTo("admin"),
    validation(paramsIdVal),
    deleteLegend
  );

export { legendRouter };
