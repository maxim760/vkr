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
const user_space_entity_1 = require("../user/user-space.entity");
const user_repo_1 = require("../user/user.repo");
const space_repo_1 = require("./space.repo");
const typeorm_1 = require("typeorm");
class SpaceController {
    getAll(req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const result = yield space_repo_1.spaceRepo.find({ where: { userSpaces: { user: { id: (_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : '' } } }, order: { name: "asc" }, relations: { userSpaces: { user: true } }, });
                const spaceIds = result.map(i => i.id);
                const spaces = yield space_repo_1.spaceRepo.find({ where: { id: (0, typeorm_1.Any)(spaceIds) }, order: { name: "asc" }, relations: { userSpaces: { user: true } }, });
                return res.json({ spaces: spaces });
            }
            catch (error) {
                next(error);
            }
        });
    }
    addUserByEmail(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const { activeSpace, canEdit, isAdmin } = yield auth_service_1.default.findSpaceIdByEmail((_b = req.user) === null || _b === void 0 ? void 0 : _b.email);
                if (!activeSpace || !canEdit || !isAdmin) {
                    return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
                }
                const user = yield auth_service_1.default.findByEmail(email);
                if (!user) {
                    return res.status(404).json({ message: 'Пользователь с указанным email не найден' });
                }
                // Проверка, что пользователь уже не добавлен в это пространство
                const existingMembership = yield user_repo_1.userSpacesRepo.findOne({ where: { user: { id: user.id }, space: { id: activeSpace.id } }, relations: { space: true, user: true } });
                if (existingMembership) {
                    return res.status(200).json({ message: 'Пользователь уже добавлен в данное пространство' });
                }
                // Добавление пользователя в пространство
                const userSpace = new user_space_entity_1.UserSpaces();
                userSpace.user = user;
                userSpace.space = activeSpace;
                userSpace.is_admin = false;
                userSpace.is_edit = false;
                userSpace.is_selected = false;
                yield user_repo_1.userSpacesRepo.save(userSpace);
                return res.json({ message: 'Пользователь успешно добавлен в пространство' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    setSelectedSpace(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // ID текущего пользователя
                const { spaceId } = req.body; // ID пространства, которое нужно установить как основное
                if (!userId) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                // Поиск пользователя и пространства
                const user = yield auth_service_1.default.findByEmail((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.email);
                const space = yield space_repo_1.spaceRepo.findOne({ where: { id: spaceId } });
                const userHasSpace = user === null || user === void 0 ? void 0 : user.userSpaces.some(userSpace => userSpace.space.id === (space === null || space === void 0 ? void 0 : space.id));
                // Проверка, что пользователь и пространство существуют
                if (!user || !space || !userHasSpace) {
                    return res.status(404).json({ message: 'Пользователь или пространство не найдены' });
                }
                // Обновление записи UserSpaces для текущего пользователя
                yield user_repo_1.userSpacesRepo
                    .createQueryBuilder()
                    .update(user_space_entity_1.UserSpaces)
                    .set({ is_selected: false }) // Сначала сбрасываем флаг для всех пространств
                    .where({ user })
                    .execute();
                yield user_repo_1.userSpacesRepo
                    .createQueryBuilder()
                    .update(user_space_entity_1.UserSpaces)
                    .set({ is_selected: true }) // Устанавливаем флаг для указанного пространства
                    .where({ user, space })
                    .execute();
                return res.json({ message: 'Пространство успешно установлено как основное' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateUserPermissions(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // ID текущего пользователя
                const { targetUserId, canUserEdit } = req.body; // ID пространства, ID целевого пользователя и флаг прав доступа
                if (!userId) {
                    return res.status(403).json({ data: null, message: "Нет доступа" });
                }
                const { activeSpace, canEdit, isAdmin } = yield auth_service_1.default.findSpaceIdByEmail((_b = req.user) === null || _b === void 0 ? void 0 : _b.email);
                if (!activeSpace || !canEdit || !isAdmin) {
                    return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
                }
                const targetUser = yield user_repo_1.userRepo.findOne({ where: { id: targetUserId }, relations: { userSpaces: { user: true, space: true } } });
                // Проверка, что целевой пользователь существует
                if (!targetUser) {
                    return res.status(404).json({ message: 'Целевой пользователь не найден' });
                }
                const hasSpace = targetUser.userSpaces.some((item => item.space.id === activeSpace.id));
                if (!hasSpace) {
                    return res.status(404).json({ message: 'Не найдено пространство' });
                }
                // Обновление записи UserSpaces для целевого пользователя и указанного пространства
                yield user_repo_1.userSpacesRepo.update({ user: { id: targetUser.id }, space: { id: activeSpace.id } }, { is_edit: canUserEdit });
                return res.json({ message: 'Права пользователя успешно изменены' });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new SpaceController;
