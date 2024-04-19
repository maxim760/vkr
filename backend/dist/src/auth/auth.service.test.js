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
const auth_service_1 = __importDefault(require("./auth.service"));
jest.mock('../user/user.repo', () => {
    return {
        userRepo: {
            findOne: () => ({
                name: 'user',
                email: 'email',
                userSpaces: [{
                        is_selected: true,
                        is_edit: true,
                        is_admin: false,
                        space: { id: '1', value: 'value' }
                    }]
            })
        }
    };
});
describe('Сервис пользователей', () => {
    describe('Поиск пространства по email пользователя', () => {
        test('Если email не передан, возвращается пустое значение', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(yield auth_service_1.default.findSpaceIdByEmail('')).toEqual({
                activeSpace: null,
                canEdit: false,
            });
        }));
        test('Если email передан, возвращаются данные из БД', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(yield auth_service_1.default.findSpaceIdByEmail('email')).toEqual({
                activeSpace: { id: '1', value: 'value' },
                canEdit: true,
                isAdmin: false
            });
        }));
    });
});
