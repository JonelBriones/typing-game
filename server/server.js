import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoute from "./routes/testRoute.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import cron from "node-cron";
dotenv.config();
import connectDB from "./config/database.js";
import { refreshLeaderboard } from "./middleware/leaderboardRefresh.js";

const app = express();
app.get("/", (req, res) => {
  res.json({ message: "Backend for CloudyType is working" });
});
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello" });
});
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://cloudytype.vercel.app",
  ],
  credentials: true,
};
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
connectDB();

const cronExpression = "0 0 * * *"; // every 24 hours
// const cronExpression = "*/5 * * * * *"; // every 24 hours
const task = cron.schedule(
  cronExpression,
  () => {
    refreshLeaderboard();
  },
  { scheduled: false }
);

task.start();

app.use("/api/user", userRoute);
app.use("/api/tests", testRoute);

const PORT = 2222;
// const PORT = process.env.PORT || 2222;
app.listen(PORT, () => console.log("Server running on:", PORT));
export default app;
