import { legendModel } from "../../../databases/models/legend.model.js";
import {
  addOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlers/handler.js";

const addLegend = addOne(legendModel);
const getSingleLegend = getOne(legendModel);
const getAllLegends = getAll(legendModel);
const updateLegend = updateOne(legendModel);
const deleteLegend = deleteOne(legendModel);

export {
  addLegend,
  getAllLegends,
  getSingleLegend,
  updateLegend,
  deleteLegend,
};
