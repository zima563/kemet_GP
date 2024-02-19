import { governrateModel } from "../../../databases/models/governrate.model.js";
import {
  addOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlers/handler.js";

const addGovernrate = addOne(governrateModel);
const getSingleGovernrate = getOne(governrateModel);
const getAllGovernrates = getAll(governrateModel);
const updateGovernrate = updateOne(governrateModel);
const deleteGovernrate = deleteOne(governrateModel);

export {
  addGovernrate,
  getAllGovernrates,
  getSingleGovernrate,
  updateGovernrate,
  deleteGovernrate,
};
