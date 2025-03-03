import mongoose from "mongoose";

let connected = false;
const connectDB = async (mongodbURI) => {
  mongoose.set("strictQuery", true);
  if (connected) {
    console.log("MONGODB is connected");
    return;
  }
  try {
    console.log(mongodbURI);

    await mongoose.connect(mongodbURI);
    connected = true;
    console.log("MONGODB is connecting");
  } catch (error) {
    console.log("mongodb error", error);
  }
};
export default connectDB;
