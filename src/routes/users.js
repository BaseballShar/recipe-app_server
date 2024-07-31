import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/Users.js";

// Mounted at /auth
const userRouter = express.Router();

// Endpoint for registering a new user
// Request body: username, password
userRouter.post("/register", async (req, res) => {
  try {
    // Catch for incorrect request body structure
    if (!req.body.username || !req.body.password) {
      return res
        .status(400)
        .send({ message: "Did not provide username or password field" });
    }

    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    // Reject duplicate username
    if (user) {
      return res.status(400).send({ message: "User already exists!" });
    }

    // Create new user account
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword };
    const result = await UserModel.create(newUser);

    res
      .status(201)
      .send({ message: "User created successfully", response: result });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Endpoint for logining in and authenticating user
// Request body: username, password
userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    // Catch non-existant account
    if (!user) {
      return res.status(400).send({ message: "User does not exist" });
    }

    // Check for password correctness
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .send({ message: "Username or password is incorrect!" });
    }

    // Login successful
    // Return jwt token used for authentication
    const token = jwt.sign({ id: user._id }, process.env.SESSION_SECRET);
    res.status(200).send({ token, userID: user._id });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Endpoint for returning all user accounts
userRouter.get("/", async (_, res) => {
  try {
    const data = await UserModel.find();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Middleware for verifying the user identity
export function verifyToken(req, res, next) {
  const token = req.headers.authorisation;
  // Catch for no token
  if (!token) return res.sendStatus(401);

  // Has token
  jwt.verify(token, process.env.SESSION_SECRET, (error) => {
    if (error) return res.sendStatus(403);
    next();
  });
}

export default userRouter;
