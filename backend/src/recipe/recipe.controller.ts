import { NextFunction, Request, Response } from "express";
import { Brackets } from "typeorm";
import { inflate } from "zlib";
import authService from "../auth/auth.service";
import { OmitCreateEntity, TypedRequestBody } from "../core/types";
import { folderRepo } from "../folder/folder.repo";
import { spaceRepo } from "../space/space.repo";
import { parseRussianFood } from "./helpers/parseRussianFoods";
import { Recipe } from "./recipe.entity";
import { recipeRepo } from "./recipe.repo";

class RecipeController {
  async createRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, tags, ingredients, time_recipe, steps } = req.body;

      const userId = req.user?.id;
      if (!userId) {
        return res.status(403).json({ data: null, message: "Нет доступа" });
      }
      const {activeSpace, canEdit} = await authService.findSpaceIdByEmail(req.user?.email);
      if (!activeSpace || !canEdit) {
        return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
      }
  
      const recipe = new Recipe();
      recipe.name = name ?? '';
      recipe.description = description ?? '';
      recipe.tags = tags ?? [];
      recipe.ingredients = ingredients ?? [];
      recipe.time_recipe = time_recipe ?? '';
      recipe.steps = steps ?? [];
      recipe.space = activeSpace;

      if (!recipe?.steps?.filter((step) => step.name).length || !name || !ingredients) {
        return res.status(400).json({ message: "Не заполнены шаги" });
      }
  
      await recipeRepo.save(recipe);
  
      return res.status(201).json({ data: recipe });
    } catch (error) {
      next(error);
    }
  }
  async createRecipeByLink(req: Request, res: Response, next: NextFunction) {
    try {
      const { link } = req.body;

      const userId = req.user?.id;
      console.log("1")
      if (!userId) {
        console.log("2")
        return res.status(403).json({ data: null, message: "Нет доступа" });
      }
      const {activeSpace, canEdit} = await authService.findSpaceIdByEmail(req.user?.email);
      console.log("3")
      if (!activeSpace || !canEdit) {
        console.log("4")
        return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
      }
      console.log("5")
      
      if (!link.startsWith("https://www.russianfood.com")) {
        console.log("6")
        return res.status(400).json({ data: null, message: "Не поддерживаем текущий сайт" });
      }

      const parsedRes = await parseRussianFood(link);

      if (!parsedRes) {
        return res.status(400).json({ data: null, message: "Не распознали рецепт" });
      }
      
      const { description, mainTitle, ingrs, portionCount, steps, time } = parsedRes
  
      const recipe = new Recipe();
      recipe.name = mainTitle ?? '';
      recipe.description = `${description ?? ''} ${portionCount ? 'Кол-во порций - ' + portionCount : ''}`;
      recipe.tags = ["russianfood"];
      recipe.ingredients = ingrs.map(item => `${item.name} ${item.size}`.trim());
      recipe.time_recipe = time ?? '';
      recipe.steps = steps.map((step) => ({
        name: step.text,
        photos: step.images,
        time_step: '',
      }));
      recipe.space = activeSpace;

      if (!recipe?.steps?.length) {
        return res.status(400).json({ message: "Не заполнены шаги" });
      }
  
      await recipeRepo.save(recipe);
  
      return res.status(201).json({ data: recipe });
    } catch (error) {
      next(error);
    }
  }

  private async getFoldersWithRecipes(spaceId: string): Promise<any[]> {
    try {
      const folders = await folderRepo.find({ where: { space: { id: spaceId } } });
      const result = await Promise.all(folders.map(async folder => {
        const recipes = await recipeRepo.find({ where: { folder: { id: folder.id } } });
        return { id: folder.id, name: folder.name, recipes };
      }));
      return result;
    } catch {
      return [];
    }
  }

  getAllRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(403).json({ data: null, message: "Нет доступа" });
      }
      const {activeSpace} = await authService.findSpaceIdByEmail(req.user?.email);
      if (!activeSpace) {
        return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
      }
      console.log("1")
      const foldersWithRecipes = await this.getFoldersWithRecipes(activeSpace.id);
      console.log("2")

      const allRecipes = await recipeRepo.find({ where: { space: { id: activeSpace.id } } });
      const allFolder = { id: "-1", name: "Все", recipes: allRecipes };

      const response = [allFolder, ...foldersWithRecipes];

      return res.json({ data: response });
    } catch (error) {
      next(error);
    }
  }

  async getRecipeById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(403).json({ data: null, message: "Нет доступа" });
      }
      const {activeSpace} = await authService.findSpaceIdByEmail(req.user?.email);
      if (!activeSpace) {
        return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
      }
      
      const recipe = await recipeRepo.findOneOrFail({ where: { id }, relations: { space: true, folder: true } });
      
      if (recipe.space.id !== activeSpace.id) {
        return res.status(404).json({ data: null, message: "Рецепт в пространстве не найден" });
      }
  
      return res.status(200).json({ data: recipe });
    } catch (error) {
      next(error);
    }
  }

  async searchRecipes(req: Request, res: Response, next: NextFunction) {
    try {
      let { keyword } = req.query;
      keyword = keyword?.toString() ?? '';
      const keywords = keyword.split(" ");

      const userId = req.user?.id;
      if (!userId) {
        return res.status(403).json({ data: null, message: "Нет доступа" });
      }
      const {activeSpace} = await authService.findSpaceIdByEmail(req.user?.email);
      if (!activeSpace) {
        return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
      }
  
      // Ищем рецепты по полям - название, описание, теги (без учета регистра)
      const recipes = await recipeRepo
        .createQueryBuilder("recipe")
        .where("recipe.space = :spaceId", { spaceId: activeSpace.id })
        .andWhere(new Brackets(qb => {
          qb.where("LOWER(recipe.name) LIKE LOWER(:keyword)", { keyword: `%${keyword}%` })
            .orWhere("LOWER(recipe.description) LIKE LOWER(:keyword)", { keyword: `%${keyword}%` })
            .orWhere("LOWER(recipe.tags) LIKE LOWER(:keyword)", { keyword: `%${keyword}%` });
        }))
        .getMany();
  
      return res.status(200).json({ data: recipes });
    } catch (error) {
      next(error);
    }
  }

  async updateRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, description, folderId } = req.body;

      const userId = req.user?.id;
      if (!userId) {
        return res.status(403).json({ data: null, message: "Нет доступа" });
      }
      const {activeSpace, canEdit} = await authService.findSpaceIdByEmail(req.user?.email);
      if (!activeSpace || !canEdit) {
        return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
      }

      const recipe = await recipeRepo.findOneBy({id});
  
      if (!recipe) {
        return res.status(404).json({ message: "Рецепт не найден" });
      }
  
      // Обновляем информацию о рецепте
      recipe.name = name || recipe.name;
      recipe.description = description || recipe.description;
  
      // Если указана новая папка, привязываем рецепт к ней
      if (folderId === null) {
        recipe.folder = null;
      } else if (folderId) {
        const folder = await folderRepo.findOneBy({ id: folderId });
        if (folder) {
          recipe.folder = folder;
        }
      }
  
      await recipeRepo.save(recipe);
  
      return res.status(200).json({ data: recipe });
    } catch (error) {
      next(error);
    }
  }
  
}
export default new RecipeController