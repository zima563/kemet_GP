import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose.connect(process.env.DB_URL).then(() => {
    console.log("dataBase connected successfully");
  })
  .catch((err)=>{
    console.log(err);
  });
};
