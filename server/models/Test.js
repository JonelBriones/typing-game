import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({
  user: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "User",
    type: String,
    required: true,
  },
  seconds: { type: Number, required: true }, // Duration of the test
  words: { type: Number, required: true }, // Total words typed
  wpm: { type: Number, required: true }, // Words per minute
  raw: { type: Number, required: true }, // Raw speed (before errors)
  language: { type: String, required: true }, // Test language
  date: { type: Date, default: Date.now }, // Timestamp
});

const Test = mongoose.model("Test", TestSchema);
export default Test;
