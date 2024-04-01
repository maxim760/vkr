import { Router } from "express";
import passport from "passport";
import recipeController from "./recipe.controller";

const recipeRouter = Router()

recipeRouter.post("/create", passport.authenticate('jwt', { session: false }), recipeController.createRecipe)
recipeRouter.post("/create-link", passport.authenticate('jwt', { session: false }), recipeController.createRecipeByLink)
recipeRouter.get("/folders", passport.authenticate('jwt', { session: false }), recipeController.getAllRecipes)
recipeRouter.get("/one/:id", passport.authenticate('jwt', { session: false }), recipeController.getRecipeById)
recipeRouter.get("/search", passport.authenticate('jwt', { session: false }), recipeController.searchRecipes)
recipeRouter.put("/update/:id", passport.authenticate('jwt', { session: false }), recipeController.updateRecipe)

export {recipeRouter}
