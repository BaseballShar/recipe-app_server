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
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Endpoint for saving a new recipe
// Request body: The recipe object containing all required fields
recipeRouter.post("/", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.create(req.body);
    console.log(recipe);
    res.status(201).send(recipe);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Endpoint for linking a saved recipe to a user
// Request body: userID, recipeID
recipeRouter.put("/", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userID);
    user.savedRecipes.push(req.body.recipeID);
    await user.save();
    res.status(201).send({ savedRecipes: user.savedRecipes });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Endpoint for editing a recipe
// Request body: The updated recipe object
recipeRouter.put("/edit", verifyToken, async (req, res) => {
  try {
    const recipeID = req.body.recipe._id;
    await RecipeModel.findByIdAndUpdate(recipeID, req.body.recipe);
    const updatedRecipe = await RecipeModel.findById(recipeID);
    res.status(200).send({ updatedRecipe });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Endpoint for unsaving a saved recipe
// Request params: userID, recipeID
recipeRouter.delete(
  "/userID/:userID/recipeID/:recipeID",
  verifyToken,
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.userID);
      user.savedRecipes = user.savedRecipes.filter(
        (id) => id != req.params.recipeID,
      );
      await user.save();
      res.status(200).send({ savedRecipes: user.savedRecipes });
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  },
);

// Endpoint for returning all saved recipesID from a user
// Request params: userID
recipeRouter.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.status(200).send({ savedRecipes: user?.savedRecipes });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Endpoint for returning all saved recipes from a user
// Request params: userID
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
