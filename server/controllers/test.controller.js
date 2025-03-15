import Test from "../models/Test.js";
import User from "../models/User.js";
import Leaderboard from "../models/Leaderboard.js";
import { sort } from "./hooks.controller.js";

const saveTest = async (req, res) => {
  try {
    const { user, seconds, words, wpm, raw, language } = req.body;

    if (!user || !seconds || !words || !wpm || !raw || !language) {
      return req.status(401).json(req.message, "Missing required fields");
    }

    const newTest = new Test({
      user,
      seconds,
      words,
      wpm,
      raw,
      language,
    });

    const result = await newTest.save();
    res.status(201).json({ message: "Test saved" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Test failed to save", error: error.message });
  }
};
const getTests = async (req, res) => {
  console.log("getting tests from db");
  try {
    const tests = await Test.find();
    if (!tests) {
      return res.status(400).json(res.message, "Could not retrieve tests");
    }
    console.log(tests);

    res.json(tests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Could not retrieve tests", error: error.message });
  }
};
const getLeaderboard = async (req, res) => {
  console.log("getting leaderboard in controllers");
  try {
    const leaderboard = await Leaderboard.find();

    // sort(tests);
    if (!leaderboard) {
      return res.status(400).json(res.message, "Could not retrieve tests");
    }

    console.log(leaderboard);
    return res
      .status(201)
      .json({ message: "Fetched leaderboard", data: leaderboard });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Could not retrieve tests", error: error.message });
  }
};
const updateLeaderboard = async (req, res) => {
  try {
    const tests = await Test.find();
    const users = await User.find();

    const sortedLeaderboard = sort(users, tests);

    if (!sortedLeaderboard) {
      return res.status(400).json(res.message, "Could not retrieve tests");
    }

    await Leaderboard.deleteMany({});
    await Leaderboard.insertMany(sortedLeaderboard);

    return res.status(201).json({ message: "Updated leaderboard" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Could not retrieve tests", error: error.message });
  }
};

export { saveTest, getTests, getLeaderboard, updateLeaderboard };
