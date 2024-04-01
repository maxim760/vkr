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
const auth_service_1 = __importDefault(require("../auth/auth.service"));
const recipe_repo_1 = require("../recipe/recipe.repo");
const folder_entity_1 = require("./folder.entity");
const folder_repo_1 = require("./folder.repo");
class FolderController {
    createFolder(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const { activeSpace, canEdit } = yield auth_service_1.default.findSpaceIdByEmail((_b = req.user) === null || _b === void 0 ? void 0 : _b.email);
                if (!activeSpace || !canEdit) {
                    return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
                }
                // Создаем новую папку
                const folder = new folder_entity_1.Folder();
                folder.name = name;
                folder.space = activeSpace;
                yield folder_repo_1.folderRepo.save(folder);
                return res.status(201).json({ data: folder });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Метод для переименования папки
    renameFolder(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, name } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const { activeSpace, canEdit } = yield auth_service_1.default.findSpaceIdByEmail((_b = req.user) === null || _b === void 0 ? void 0 : _b.email);
                if (!activeSpace || !canEdit) {
                    return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
                }
                const folder = yield folder_repo_1.folderRepo.findOneBy({ id });
                if (!folder) {
                    return res.status(404).json({ message: "Папка не найдена" });
                }
                // Обновляем имя папки
                folder.name = name;
                yield folder_repo_1.folderRepo.save(folder);
                return res.status(200).json({ data: folder });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Метод для удаления папки
    deleteFolder(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const { activeSpace, canEdit } = yield auth_service_1.default.findSpaceIdByEmail((_b = req.user) === null || _b === void 0 ? void 0 : _b.email);
                if (!activeSpace || !canEdit) {
                    return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
                }
                const folder = yield folder_repo_1.folderRepo.findOneBy({ id });
                if (!folder) {
                    return res.status(404).json({ message: "Папка не найдена" });
                }
                yield recipe_repo_1.recipeRepo.update({ folder: { id: folder.id } }, { folder: null });
                yield folder_repo_1.folderRepo.remove(folder);
                return res.status(200).json({ message: "Папка успешно удалена" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new FolderController;
