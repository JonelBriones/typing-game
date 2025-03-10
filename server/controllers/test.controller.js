import Test from "../models/Test.js";

const saveTest = async (request, response) => {
  try {
    const { user, seconds, words, wpm, raw, language } = request.body;

    if (!user || !seconds || !words || !wpm || !raw || !language) {
      return request
        .status(400)
        .json(request.message, "Missing required fields");
    }

    const newTest = new Test({
      user,
      seconds,
      words,
      wpm,
      raw,
      language,
    });

    await newTest.save();

    response
      .status(201)
      .json({ message: "Test saved successfully", test: newTest });
  } catch (error) {
    request.status(500).json({ message: "Test saved unsuccessfully", error });
  }
};
const getTests = async (request, response) => {
  console.log("getting tests from db");
  try {
    const tests = await Test.find();
    if (!tests) {
      return response
        .status(400)
        .json(response.message, "Could not retrieve tests");
    }
    console.log(tests);

    response.json(tests);
  } catch (error) {
    response.status(500).json({ message: "Could not retrieve tests", error });
  }
};

export { saveTest, getTests };
