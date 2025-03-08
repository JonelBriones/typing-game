import { decode } from "punycode";
import { createHashPassword, validatePassword } from "../middleware/hash.js";
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

    if (!result) {
      throw new Error("Error when saving user to database");
    }
    res
      .status(201)
      .json({ message: "User saved successfully", user: { ...user, token } });
  } catch (error) {
    req.status(500).json({ message: "User saved unsuccessfully", error });
  }
};
const login = async (req, res) => {
  // verify user is in database
  console.log("login");
  console.log(req.body.password);
  console.log(req.body.email);
  if (!req.body.password || !req.body.email) {
    return res.status(401).json({ error: "Please enter email and password" });
  }

  const userExist = await User.findOne({ email: req.body.email });

  if (!userExist) {
    throw new Error("User does not exist in database");
  }
  const { email, username, _id, password } = userExist;

  // validate password
  if (!validatePassword(req.body.password, password)) {
    return res.status(401).json({ error: "invalid password" });
  }

  const accessToken = jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });

  const refreshToken = jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "Lax", // production = "None", development = "Lax"
    secure: false, //  production = true, development = false
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.status(201).json({
    accessToken,
    session: {
      username,
      email,
      _id,
    },
  });
};

const refresh = (req, res) => {
  console.log("refresh");
  if (req.cookies?.jwt) {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) return;
    const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // console.log("verified", verified);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(406).json({ message: "Unauthorized" });
        } else {
          const accessToken = jwt.sign(
            { decoded },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10m" }
          );
          return res.json({ accessToken, decoded });
        }
      }
    );
  } else {
    return res.status(406).json({ message: "Unauthorized" });
  }
};

const logout = (req, res) => {
  console.log("logout");
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "Lax", // Should match your initial cookie settings
    secure: false, // Change to true in production
  });
  res.status(200).json({ message: "Logout successful" });
};

const getUserById = async (req, res) => {
  console.log("getting user by id", req.params.id);
  const result = await User.findById(req.params.id);
  console.log(result);
  if (!result) {
    res.json(401).json({ message: "Could not find user" });
  }
  const { email, username } = result;

  return res.json({ email, username });
};

export { createUser, login, refresh, getUserById, logout };
