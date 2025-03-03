import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoute from "./routes/testRoute.js";
dotenv.config();

import connectDB from "./config/database.js";

const app = express();

app.use(express.json());
app.use(cors());

connectDB(process.env.MONGODB_URI);

app.get("/", (req, res) => {
  res.send("Typing game backend isi running");
});

app.use("/api/tests", testRoute);

const PORT = process.env.PORT || 3000;

// mongoose.connect(process.env.MONGO_URI)

app.listen(PORT, () => console.log("Server running on:", PORT));
export default app;
