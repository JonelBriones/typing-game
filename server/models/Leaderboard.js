import mongoose from "mongoose";

const LeaderboardSchema = new mongoose.Schema({
  user: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "User",
    type: String,
    required: true,
  },
  seconds: { type: Number, required: true },
  words: { type: Number, required: true },
  wpm: { type: Number, required: true },
  raw: { type: Number, required: true },
  language: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
export default Leaderboard;
