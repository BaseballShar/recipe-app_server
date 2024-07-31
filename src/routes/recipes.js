import express from "express";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

// Mounted at /recipes
const recipeRouter = express.Router();

// Endpoint for returning all stored recipes
recipeRouter.get("/", async (_, res) => {
  try {
    const data = await RecipeModel.find();
    res.send(data);
  } catch (e) {
    res.send({ message: e.message });
  }
});

// Endpoint for returning all saved recipesID from a user
// Request params: userID
recipeRouter.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const { userID } = req.params;
    const user = await UserModel.findById(userID);
    res.send({ savedRecipes: user?.savedRecipes });
  } catch (e) {
    res.send({ message: e.message });
  }
});

// Endpoint for returning all saved recipes from a user
// Request params: userID
recipeRouter.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const { userID } = req.params;
    const user = await UserModel.findById(userID);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.send({ savedRecipes });
  } catch (e) {
    res.send({ message: e.message });
  }
});

// Endpoint for saving a new recipe
// Request body: The recipe object containing all required fields
recipeRouter.post("/", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.create(req.body);
    res.status(201).send(recipe);
  } catch (e) {
    res.send({ message: e.message });
  }
});

// Endpoint for linking a saved recipe to a user
// Request body: userID, recipeID
recipeRouter.put("/save", verifyToken, async (req, res) => {
  try {
    const { userID, recipeID } = req.body;
    const user = await UserModel.findById(userID);
    user.savedRecipes.push(recipeID);
    await user.save();
    res.send({ savedRecipes: user.savedRecipes });
  } catch (e) {
    res.send({ message: e.message });
  }
});

// Endpoint for unsaving a saved recipe
// Request params: userID, recipeID
recipeRouter.put("/unsave", verifyToken, async (req, res) => {
  try {
    const { userID, recipeID } = req.body;
    const user = await UserModel.findById(userID);
    user.savedRecipes = user.savedRecipes.filter((id) => id != recipeID);
    await user.save();
    res.send({ savedRecipes: user.savedRecipes });
  } catch (e) {
    res.send({ message: e.message });
  }
});

// Endpoint for editing a recipe
// Request body: The updated recipe object
recipeRouter.put("/edit", verifyToken, async (req, res) => {
  try {
    const { recipeID, recipe } = req.body;
    await RecipeModel.findByIdAndUpdate(recipeID, recipe);
    const updatedRecipe = await RecipeModel.findById(recipeID);
    res.send({ updatedRecipe });
  } catch (e) {
    res.send({ message: e.message });
  }
});

export default recipeRouter;
