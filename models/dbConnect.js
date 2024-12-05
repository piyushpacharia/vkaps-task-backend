import mongoose from "mongoose";

const DBConnection = async () => {
  mongoose.connect(process.env.DB_URL);
  const db = mongoose.connection;
  try {
    db.once("open", () => {
      console.log("DB Connected Successfully...");
    });
  } catch (err) {
    db.on("error", () => {
      console.log("Error while connecting DB!");
    });
  }
};

export default { DBConnection }
