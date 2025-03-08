import { createHashPassword } from "../middleware/hash.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const createUser = async (req, res) => {
  try {
    let { email, password, username } = req.body;
    if (!email || !password || !username) {
      res.status(400).send("invalid form submission");
    }

    let user = {
      email,
      username,
    };

    const newUser = new User({
      ...user,
      password: createHashPassword(password),
    });

    const result = await newUser.save();
    const token = generateToken();
    console.log("result", result);
    if (!result) {
      throw new Error("Error when saving user to database");
    }
    res
      .status(201)
      .json({ message: "User saved successfully", user: { ...user, token } });
  } catch (error) {
    req
      .status(500)
      .json({ message: "User saved unsuccessfully", error: error });
  }
};

const generateToken = (req, res) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  console.log(jwtSecretKey);
  let data = {
    time: Date(),
    userId: 22,
  };
  const token = jwt.sign(data, jwtSecretKey);

  // res.send({ token });
  return token;
};

const validateToken = async (req, res) => {
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  // check if
  try {
    const token = req.header(tokenHeaderKey);

    const verified = jwt.verify(token, jwtSecretKey);

    if (verified) {
      return res.send("Token verified");
    } else {
      return res.status(401).send(error);
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};

export { generateToken, validateToken, createUser };
