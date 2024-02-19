process.on("uncaughtException", (err) => {
  console.log("error", err);
});
import express from "express";
import dotenv from "dotenv";

dotenv.config();
import { dbConnection } from "./databases/dbConnection.js";
import { bootstrap } from "./src/index.routers.js";
import { apiError } from "./src/utils/apiError.js";



const app = express();
const port = 3000;

dbConnection();
app.use("/", express.static("uploads"));
app.use(express.json());

bootstrap(app);

app.use("*", (req, res, next) => {
  next(new apiError(`not found endPoint : ${req.originalUrl}`, 404));
});
process.on("unhandledRejection", (err) => {
  console.log("error", err);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
