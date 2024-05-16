import mongoose from "mongoose";

export const dbConnection = async() => {
  await mongoose.connect(process.env.MONGO_URL, {
      dbName: "Kichen_Odering",
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log(`Some error occured while connecing to database: ${err}`);
    });
};
