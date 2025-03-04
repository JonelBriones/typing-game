import mongoose from "mongoose";

let connected = false;
const connectDB = async (mongodbURI) => {
  mongoose.set("strictQuery", true);
  if (connected) {
    console.log("MONGODB is connected");
    return;
  }
  try {
    await mongoose.connect(mongodbURI);
    connected = true;
    console.log("connected to mongodb");
  } catch (error) {
    console.log("mongodb error", error);
  }
};
export default connectDB;
