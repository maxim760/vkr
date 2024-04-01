import { NextFunction, Request, Response } from "express";
import authService from "../auth/auth.service";
import { OmitCreateEntity, TypedRequestBody } from "../core/types";
import { UserSpaces } from "../user/user-space.entity";
import { userRepo, userSpacesRepo } from "../user/user.repo";
import { Space } from "./space.entity";
import { spaceRepo } from "./space.repo";
import { Any, ArrayContains } from "typeorm";

class SpaceController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(403).json({data: null, message: "Нет доступа"})
      }
      const result = await spaceRepo.find({ where: { userSpaces: { user: { id: req?.user?.id ?? '' } } }, order: { name: "asc" }, relations: { userSpaces: { user: true } }, });
      const spaceIds = result.map(i => i.id);
      const spaces = await spaceRepo.find({ where: { id: Any(spaceIds) }, order: { name: "asc" }, relations: { userSpaces: { user: true } }, });

      return res.json({spaces: spaces})
    } catch (error) {
      next(error)
    }
  }

  async addUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const userId = req.user?.id;
      if (!userId) {
        return res.status(403).json({ data: null, message: "Нет доступа" });
      }
      const {activeSpace, canEdit, isAdmin} = await authService.findSpaceIdByEmail(req.user?.email);
      if (!activeSpace || !canEdit || !isAdmin) {
        return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
      }

      const user = await authService.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'Пользователь с указанным email не найден' });
      }

      // Проверка, что пользователь уже не добавлен в это пространство
      const existingMembership = await userSpacesRepo.findOne({ where: { user: { id: user.id }, space: {id: activeSpace.id} }, relations: { space: true, user: true } });
      if (existingMembership) {
        return res.status(200).json({ message: 'Пользователь уже добавлен в данное пространство' });
      }

      // Добавление пользователя в пространство
      const userSpace = new UserSpaces();
      userSpace.user = user;
      userSpace.space = activeSpace;
      userSpace.is_admin = false;
      userSpace.is_edit = false;
      userSpace.is_selected = false;

      await userSpacesRepo.save(userSpace);

      return res.json({ message: 'Пользователь успешно добавлен в пространство' });
    } catch (error) {
      next(error);
    }
  }

  async setSelectedSpace(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id; // ID текущего пользователя
      const { spaceId } = req.body; // ID пространства, которое нужно установить как основное

      if (!userId) {
        return res.status(403).json({ data: null, message: "Нет доступа" });
      }

      // Поиск пользователя и пространства
      const user = await authService.findByEmail(req?.user?.email);

      const space = await spaceRepo.findOne({ where: { id: spaceId } });

      const userHasSpace = user?.userSpaces.some(userSpace => userSpace.space.id === space?.id);

      // Проверка, что пользователь и пространство существуют
      if (!user || !space || !userHasSpace) {
        return res.status(404).json({ message: 'Пользователь или пространство не найдены' });
      }

      // Обновление записи UserSpaces для текущего пользователя
      await userSpacesRepo
        .createQueryBuilder()
        .update(UserSpaces)
        .set({ is_selected: false }) // Сначала сбрасываем флаг для всех пространств
        .where({ user })
        .execute();

      await userSpacesRepo
        .createQueryBuilder()
        .update(UserSpaces)
        .set({ is_selected: true }) // Устанавливаем флаг для указанного пространства
        .where({ user, space })
        .execute();

      return res.json({ message: 'Пространство успешно установлено как основное' });
    } catch (error) {
      next(error);
    }
  }

  async updateUserPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id; // ID текущего пользователя
      const { targetUserId, canUserEdit } = req.body; // ID пространства, ID целевого пользователя и флаг прав доступа

      if (!userId) {
        return res.status(403).json({ data: null, message: "Нет доступа" });
      }

      const {activeSpace, canEdit, isAdmin} = await authService.findSpaceIdByEmail(req.user?.email);
      if (!activeSpace || !canEdit || !isAdmin) {
        return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
      }

      const targetUser = await userRepo.findOne({ where: { id: targetUserId }, relations: { userSpaces: { user: true, space: true } } });

      // Проверка, что целевой пользователь существует
      if (!targetUser ) {
        return res.status(404).json({ message: 'Целевой пользователь не найден' });
      }
      const hasSpace = targetUser.userSpaces.some((item => item.space.id === activeSpace.id))
      if (!hasSpace) {
        return res.status(404).json({ message: 'Не найдено пространство' });
      }

      // Обновление записи UserSpaces для целевого пользователя и указанного пространства
      await userSpacesRepo.update({ user: { id: targetUser.id }, space: { id: activeSpace.id } }, { is_edit: canUserEdit });

      return res.json({ message: 'Права пользователя успешно изменены' });
    } catch (error) {
      next(error);
    }
  }
}
export default new SpaceController