import Test from "../models/Test.js";

const saveTest = async (req, res) => {
  console.log("SAVING");
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

export { saveTest, getTests };
