"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipeRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const recipe_controller_1 = __importDefault(require("./recipe.controller"));
const recipeRouter = (0, express_1.Router)();
exports.recipeRouter = recipeRouter;
recipeRouter.post("/create", passport_1.default.authenticate('jwt', { session: false }), recipe_controller_1.default.createRecipe);
recipeRouter.post("/create-link", passport_1.default.authenticate('jwt', { session: false }), recipe_controller_1.default.createRecipeByLink);
recipeRouter.get("/folders", passport_1.default.authenticate('jwt', { session: false }), recipe_controller_1.default.getAllRecipes);
recipeRouter.get("/one/:id", passport_1.default.authenticate('jwt', { session: false }), recipe_controller_1.default.getRecipeById);
recipeRouter.get("/search", passport_1.default.authenticate('jwt', { session: false }), recipe_controller_1.default.searchRecipes);
recipeRouter.put("/update/:id", passport_1.default.authenticate('jwt', { session: false }), recipe_controller_1.default.updateRecipe);
