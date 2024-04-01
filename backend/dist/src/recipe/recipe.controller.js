"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const auth_service_1 = __importDefault(require("../auth/auth.service"));
const folder_repo_1 = require("../folder/folder.repo");
const parseRussianFoods_1 = require("./helpers/parseRussianFoods");
const recipe_entity_1 = require("./recipe.entity");
const recipe_repo_1 = require("./recipe.repo");
class RecipeController {
    constructor() {
        this.getAllRecipes = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const { activeSpace } = yield auth_service_1.default.findSpaceIdByEmail((_b = req.user) === null || _b === void 0 ? void 0 : _b.email);
                if (!activeSpace) {
                    return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
                }
                console.log("1");
                const foldersWithRecipes = yield this.getFoldersWithRecipes(activeSpace.id);
                console.log("2");
                const allRecipes = yield recipe_repo_1.recipeRepo.find({ where: { space: { id: activeSpace.id } } });
                const allFolder = { id: "-1", name: "Все", recipes: allRecipes };
                const response = [allFolder, ...foldersWithRecipes];
                return res.json({ data: response });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createRecipe(req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description, tags, ingredients, time_recipe, steps } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const { activeSpace, canEdit } = yield auth_service_1.default.findSpaceIdByEmail((_b = req.user) === null || _b === void 0 ? void 0 : _b.email);
                if (!activeSpace || !canEdit) {
                    return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
                }
                const recipe = new recipe_entity_1.Recipe();
                recipe.name = name !== null && name !== void 0 ? name : '';
                recipe.description = description !== null && description !== void 0 ? description : '';
                recipe.tags = tags !== null && tags !== void 0 ? tags : [];
                recipe.ingredients = ingredients !== null && ingredients !== void 0 ? ingredients : [];
                recipe.time_recipe = time_recipe !== null && time_recipe !== void 0 ? time_recipe : '';
                recipe.steps = steps !== null && steps !== void 0 ? steps : [];
                recipe.space = activeSpace;
                if (!((_c = recipe === null || recipe === void 0 ? void 0 : recipe.steps) === null || _c === void 0 ? void 0 : _c.filter((step) => step.name).length) || !name || !ingredients) {
                    return res.status(400).json({ message: "Не заполнены шаги" });
                }
                yield recipe_repo_1.recipeRepo.save(recipe);
                return res.status(201).json({ data: recipe });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createRecipeByLink(req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { link } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                console.log("1");
                if (!userId) {
                    console.log("2");
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const { activeSpace, canEdit } = yield auth_service_1.default.findSpaceIdByEmail((_b = req.user) === null || _b === void 0 ? void 0 : _b.email);
                console.log("3");
                if (!activeSpace || !canEdit) {
                    console.log("4");
                    return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
                }
                console.log("5");
                if (!link.startsWith("https://www.russianfood.com")) {
                    console.log("6");
                    return res.status(400).json({ data: null, message: "Не поддерживаем текущий сайт" });
                }
                const parsedRes = yield (0, parseRussianFoods_1.parseRussianFood)(link);
                if (!parsedRes) {
                    return res.status(400).json({ data: null, message: "Не распознали рецепт" });
                }
                const { description, mainTitle, ingrs, portionCount, steps, time } = parsedRes;
                const recipe = new recipe_entity_1.Recipe();
                recipe.name = mainTitle !== null && mainTitle !== void 0 ? mainTitle : '';
                recipe.description = `${description !== null && description !== void 0 ? description : ''} ${portionCount ? 'Кол-во порций - ' + portionCount : ''}`;
                recipe.tags = ["russianfood"];
                recipe.ingredients = ingrs.map(item => `${item.name} ${item.size}`.trim());
                recipe.time_recipe = time !== null && time !== void 0 ? time : '';
                recipe.steps = steps.map((step) => ({
                    name: step.text,
                    photos: step.images,
                    time_step: '',
                }));
                recipe.space = activeSpace;
                if (!((_c = recipe === null || recipe === void 0 ? void 0 : recipe.steps) === null || _c === void 0 ? void 0 : _c.length)) {
                    return res.status(400).json({ message: "Не заполнены шаги" });
                }
                yield recipe_repo_1.recipeRepo.save(recipe);
                return res.status(201).json({ data: recipe });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getFoldersWithRecipes(spaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const folders = yield folder_repo_1.folderRepo.find({ where: { space: { id: spaceId } } });
                const result = yield Promise.all(folders.map((folder) => __awaiter(this, void 0, void 0, function* () {
                    const recipes = yield recipe_repo_1.recipeRepo.find({ where: { folder: { id: folder.id } } });
                    return { id: folder.id, name: folder.name, recipes };
                })));
                return result;
            }
            catch (_a) {
                return [];
            }
        });
    }
    getRecipeById(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const { activeSpace } = yield auth_service_1.default.findSpaceIdByEmail((_b = req.user) === null || _b === void 0 ? void 0 : _b.email);
                if (!activeSpace) {
                    return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
                }
                const recipe = yield recipe_repo_1.recipeRepo.findOneOrFail({ where: { id }, relations: { space: true, folder: true } });
                if (recipe.space.id !== activeSpace.id) {
                    return res.status(404).json({ data: null, message: "Рецепт в пространстве не найден" });
                }
                return res.status(200).json({ data: recipe });
            }
            catch (error) {
                next(error);
            }
        });
    }
    searchRecipes(req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { keyword } = req.query;
                keyword = (_a = keyword === null || keyword === void 0 ? void 0 : keyword.toString()) !== null && _a !== void 0 ? _a : '';
                const keywords = keyword.split(" ");
                const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                if (!userId) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const { activeSpace } = yield auth_service_1.default.findSpaceIdByEmail((_c = req.user) === null || _c === void 0 ? void 0 : _c.email);
                if (!activeSpace) {
                    return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
                }
                // Ищем рецепты по полям - название, описание, теги (без учета регистра)
                const recipes = yield recipe_repo_1.recipeRepo
                    .createQueryBuilder("recipe")
                    .where("recipe.space = :spaceId", { spaceId: activeSpace.id })
                    .andWhere(new typeorm_1.Brackets(qb => {
                    qb.where("LOWER(recipe.name) LIKE LOWER(:keyword)", { keyword: `%${keyword}%` })
                        .orWhere("LOWER(recipe.description) LIKE LOWER(:keyword)", { keyword: `%${keyword}%` })
                        .orWhere("LOWER(recipe.tags) LIKE LOWER(:keyword)", { keyword: `%${keyword}%` });
                }))
                    .getMany();
                return res.status(200).json({ data: recipes });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateRecipe(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name, description, folderId } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const { activeSpace, canEdit } = yield auth_service_1.default.findSpaceIdByEmail((_b = req.user) === null || _b === void 0 ? void 0 : _b.email);
                if (!activeSpace || !canEdit) {
                    return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
                }
                const recipe = yield recipe_repo_1.recipeRepo.findOneBy({ id });
                if (!recipe) {
                    return res.status(404).json({ message: "Рецепт не найден" });
                }
                // Обновляем информацию о рецепте
                recipe.name = name || recipe.name;
                recipe.description = description || recipe.description;
                // Если указана новая папка, привязываем рецепт к ней
                if (folderId === null) {
                    recipe.folder = null;
                }
                else if (folderId) {
                    const folder = yield folder_repo_1.folderRepo.findOneBy({ id: folderId });
                    if (folder) {
                        recipe.folder = folder;
                    }
                }
                yield recipe_repo_1.recipeRepo.save(recipe);
                return res.status(200).json({ data: recipe });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new RecipeController;
