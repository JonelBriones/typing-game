import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoute from "./routes/testRoute.js";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
dotenv.config();

import connectDB from "./config/database.js";

const app = express();
app.get("/", (req, res) => {
  res.json({ message: "Backend for CloudyType is working" });
});
// const corsOptions = {
//   origin: [
//     "http://localhost:5173",
//     "http://localhost:4173",
//     "https://cloudytype.vercel.app",
//     "https://cloudytype-git-typeboard-validations-jonels-projects-684e0f31.vercel.app",
//   ],
//   credentials: true,
// };
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors(corsOptions));
// connectDB(process.env.MONGODB_URI);

// app.use("/api/user", userRoute);
// app.use("/api/tests", testRoute);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log("Server running on:", PORT));
}
export default app;
