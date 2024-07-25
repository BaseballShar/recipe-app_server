import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/users.js";
import recipeRouter from "./routes/recipes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routers
app.use("/auth", userRouter);
app.use("/recipes", recipeRouter);

const database = "Recipe";
const connectionString = `mongodb+srv://admin:${process.env.MONGODB_PW}@backend.ujrbyvo.mongodb.net/${database}?retryWrites=true&w=majority&appName=Backend`;
mongoose
  .connect(connectionString)
  .then(() => {
    console.log(`Connected to MongoDB database: ${database}`);
    app.listen(3001, () => {
      console.log("Express listening at port 3000");
    });
  })
  .catch((e) => console.error(e));
