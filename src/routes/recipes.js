import express from "express";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";

const recipeRouter = express.Router();

recipeRouter.get("/", async (req, res) => {
  try {
    const data = await RecipeModel.find();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Saves a recipes
recipeRouter.post("/", async (req, res) => {
  try {
    const recipe = await RecipeModel.create(req.body);
    console.log(recipe);
    res.status(201).send(recipe);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Links a saved recipe to a registered user
recipeRouter.put("/", async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);
    // user.savedRecipes.push(recipe);
    user.savedRecipes.push(recipe._id);
    await user.save();
    res.status(201).send({ savedRecipes: user.savedRecipes });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Returns all saved recipesID given the userID
recipeRouter.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.status(200).send({ savedRecipes: user?.savedRecipes });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Returns all saved recipes given the userID
recipeRouter.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.status(200).send({ savedRecipes });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

export default recipeRouter;
