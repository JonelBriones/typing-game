import express from "express";
import Test from "../models/Test.js";

const router = express.Router();

router.post("/save", async (req, res) => {
  console.log("saving...");
  try {
    const { user, seconds, words, wpm, raw, language } = req.body;
    const newTest = new Test({
      user,
      seconds,
      words,
      wpm,
      raw,
      language,
    });

    await newTest.save();

    res.status(201).json({ message: "Test saved successfully", test: newTest });
  } catch (error) {
    res.status(500).json({ message: "Test saved unsuccessfully", error });
  }
});
export default router;
