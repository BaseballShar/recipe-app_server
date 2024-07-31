import express from "express";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const recipeRouter = express.Router();

recipeRouter.get("/", async (req, res) => {
  try {
    const data = await RecipeModel.find();
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Saves a recipe
recipeRouter.post("/", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.create(req.body);
    console.log(recipe);
    res.status(201).send(recipe);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Links a saved recipe to a registered user
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

// Edits a recipe
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

// Deletes a saved recipe to a registered user
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
