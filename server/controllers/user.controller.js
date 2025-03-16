import { decode } from "punycode";
import { createHashPassword, validatePassword } from "../middleware/hash.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Test from "../models/Test.js";
const createUser = async (req, res) => {
  let { email, password, username } = req.body;
  if (!email || !password || !username) {
    res.status(401).send("invalid form submission");
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

  if (!result) {
    throw new Error("Error when saving user to database");
  }
  let _id = newUser._id;

  const { accessToken, refreshToken } = await createToken(_id, req);

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None", // production = "None", development = "Lax"
    secure: true, //  production = true, development = false
    maxAge: 24 * 60 * 60 * 1000,
  });
  console.log("access token created", accessToken);
  console.log("refresh token created", refreshToken);
  return res.status(201).json({
    accessToken,
    session: {
      _id,
    },
  });
};
const login = async (req, res) => {
  console.log("login");
  console.log(req.body.password);
  console.log(req.body.email);

  if (!req.body.password || !req.body.email) {
    return res.status(401).json({ error: "Please fill in all fields" });
  }

  const userExist = await User.findOne({ email: req.body.email });

  if (!userExist) {
    return res.status(401).json({ error: "Incorrect email/password" });
  }

  if (!validatePassword(req.body.password, userExist.password)) {
    return res.status(401).json({ error: "Incorrect email/password" });
  }

  const { _id } = userExist;

  // validate password

  const accessToken = jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });

  const refreshToken = jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None", // production = "None", development = "Lax"
    secure: true, //  production = true, development = false
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.status(201).json({
    accessToken,
    session: {
      _id,
    },
  });
};

const createToken = async (_id, res) => {
  console.log("creating token....");
  const accessToken = jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });

  const refreshToken = jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return { accessToken, refreshToken };
};

const refresh = (req, res) => {
  try {
    const refreshToken = req.cookies?.jwt;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "No refresh token available, user must login." });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid refresh token." });
        }
        const accessToken = jwt.sign(
          { decoded },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "10m" }
        );

        return res.json({
          accessToken,
          session: {
            _id: decoded._id,
          },
        });
      }
    );
  } catch (err) {
    console.error("Unexpected error in retrieving refresh token:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None", // Should match your initial cookie settings
      secure: true, // Change to true in production
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    if (err instanceof TypeError) {
      console.error("Logout failed", err.message);
      return res.status(500).json({ message: "Logout failed" });
    }
  }
};

const getUserStats = async (req, res) => {
  try {
    const tests = await Test.find({ user: req.params.username });

    if (!tests) {
      res.status(401).json({ message: "Failed to get user's tests" });
    }

    return res.status(201).json({ tests });
  } catch (err) {
    if (err instanceof TypeError) {
      console.log("Failed to get user stats:", err.message);
    }
    return res.status(500).json({ message: "Failed to get user stats" });
  }
};

const getUserById = async (req, res) => {
  try {
    const result = await User.findById(req.params.id);

    if (!result) {
      res.json(401).json({ error: "Could not find user" });
    }

    const { email, username, _id, createdAt } = result;

    res.status(201).json({ session: { email, username, _id, createdAt } });
  } catch (err) {
    if (err instanceof TypeError) {
      console.error("Failed to get user by id: ", err.message);
    }
    res.status(500).json({ message: "Failed to get user", error: err.message });
  }
};

const getUserByEmail = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  return res.json({ user });
};

export {
  createUser,
  login,
  refresh,
  getUserById,
  logout,
  getUserByEmail,
  getUserStats,
};
