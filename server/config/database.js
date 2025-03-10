import mongoose from "mongoose";

let connected = false;
const connectDB = async () => {
  mongoose.set("strictQuery", true);
  if (connected) {
    console.log("MONGODB is connected");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
    console.log("connected to mongodb");
  } catch (error) {
    console.log("mongodb error", error);
  }
};
export default connectDB;
