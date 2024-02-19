import { tripModel } from "../../../databases/models/trip.model.js";
import {
  addOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlers/handler.js";

const addTrip = addOne(tripModel);

const getTrips = getAll(tripModel, "trip");

const getTrip = getOne(tripModel);

const updateTrip = updateOne(tripModel);

const deleteTrip = deleteOne(tripModel);

export { addTrip, getTrip, getTrips, updateTrip, deleteTrip };
