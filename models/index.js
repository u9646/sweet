import bluebird from "bluebird";
import mongoose from "mongoose";

mongoose.Promise = bluebird;

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    // if connection is open return the instance of the databse for cleaner queries
    return mongoose.connection.db;
  }

  return mongoose.connect(process.env.DB || "");
}

export const dbAdapter = async () => {
  const db = await dbConnect();
  return {
    db: () => db,
  };
};

export default dbConnect;