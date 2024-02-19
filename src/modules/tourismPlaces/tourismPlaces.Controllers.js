import { tourismPlaceModel } from "../../../databases/models/tourismPlaces.model.js";
import {
  addOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlers/handler.js";

const addtourismPlace = addOne(tourismPlaceModel);
const getSingletourismPlace = getOne(tourismPlaceModel);
const getAlltourismPlaces = getAll(tourismPlaceModel);
const updatetourismPlace = updateOne(tourismPlaceModel);
const deletetourismPlace = deleteOne(tourismPlaceModel);

export {
  addtourismPlace,
  getAlltourismPlaces,
  getSingletourismPlace,
  updatetourismPlace,
  deletetourismPlace,
};
