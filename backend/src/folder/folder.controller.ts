import { NextFunction, Request, Response } from "express";
import { Brackets } from "typeorm";
import { inflate } from "zlib";
import authService from "../auth/auth.service";
import { OmitCreateEntity, TypedRequestBody } from "../core/types";
import { recipeRepo } from "../recipe/recipe.repo";
import { Folder } from "./folder.entity";
import { folderRepo } from "./folder.repo";

class FolderController {
  async createFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      const userId = req.user?.id;
      if (!userId) {
        return res.status(403).json({ data: null, message: "Нет доступа" });
      }
      const {activeSpace, canEdit} = await authService.findSpaceIdByEmail(req.user?.email);
      if (!activeSpace || !canEdit) {
        return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
      }

      // Создаем новую папку
      const folder = new Folder();
      folder.name = name;
      folder.space = activeSpace;

      await folderRepo.save(folder);

      return res.status(201).json({ data: folder });
    } catch (error) {
      next(error);
    }
  }

  // Метод для переименования папки
  async renameFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, name } = req.body;

      const userId = req.user?.id;
      if (!userId) {
        return res.status(403).json({ data: null, message: "Нет доступа" });
      }
      const {activeSpace, canEdit} = await authService.findSpaceIdByEmail(req.user?.email);
      if (!activeSpace || !canEdit) {
        return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
      }

      const folder = await folderRepo.findOneBy({id});
      if (!folder) {
        return res.status(404).json({ message: "Папка не найдена" });
      }

      // Обновляем имя папки
      folder.name = name;
      await folderRepo.save(folder);

      return res.status(200).json({ data: folder });
    } catch (error) {
      next(error);
    }
  }

  // Метод для удаления папки
  async deleteFolder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;


      const userId = req.user?.id;
      if (!userId) {
        return res.status(403).json({ data: null, message: "Нет доступа" });
      }
      const {activeSpace, canEdit} = await authService.findSpaceIdByEmail(req.user?.email);
      if (!activeSpace || !canEdit) {
        return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
      }

      const folder = await folderRepo.findOneBy({id});
      if (!folder) {
        return res.status(404).json({ message: "Папка не найдена" });
      }

      await recipeRepo.update({ folder: { id: folder.id } }, { folder: null });
      await folderRepo.remove(folder);

      return res.status(200).json({ message: "Папка успешно удалена" });
    } catch (error) {
      next(error);
    }
  }

}

export default new FolderController