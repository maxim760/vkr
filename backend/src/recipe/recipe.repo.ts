import { AppDataSource } from "../core/connection/data-source";
import { Recipe } from "./recipe.entity";

export const recipeRepo = AppDataSource.getRepository(Recipe)

