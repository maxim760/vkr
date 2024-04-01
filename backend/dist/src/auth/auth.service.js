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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("../core/utils/tokens");
const user_repo_1 = require("../user/user.repo");
class AuthService {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                return null;
            }
            const result = yield user_repo_1.userRepo.findOne({ where: { email }, relations: { userSpaces: { space: true, user: true } } });
            return result;
        });
    }
    findSpaceIdByEmail(email) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                return {
                    activeSpace: null,
                    canEdit: false,
                };
            const user = yield this.findByEmail(email);
            if (!user)
                return {
                    activeSpace: null,
                    canEdit: false,
                };
            const activeSpace = ((_a = user.userSpaces.find(userSpace => userSpace.is_selected)) === null || _a === void 0 ? void 0 : _a.space) || null;
            const spacesCanEdit = user.userSpaces.filter(item => item.is_edit).map(item => item.space.id);
            const spacesAdmin = user.userSpaces.filter(item => item.is_admin).map(item => item.space.id);
            return {
                activeSpace: activeSpace,
                canEdit: activeSpace ? spacesCanEdit.includes(activeSpace === null || activeSpace === void 0 ? void 0 : activeSpace.id) : false,
                isAdmin: activeSpace ? spacesAdmin.includes(activeSpace === null || activeSpace === void 0 ? void 0 : activeSpace.id) : false,
            };
        });
    }
    loginAfterOauth(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.email) {
                return { finded: false, user };
            }
            const candidate = yield this.findByEmail(user.email);
            if (!candidate) {
                return { finded: false, user };
            }
            const newTokens = tokens_1.TokenService.generateTokens({ email: candidate.email, id: candidate.id });
            candidate.refreshToken = newTokens.refreshToken;
            yield user_repo_1.userRepo.save(candidate);
            return {
                finded: true,
                user: candidate,
                tokens: newTokens,
            };
        });
    }
    returnProfileFields(user) {
        const { password, refreshToken } = user, other = __rest(user, ["password", "refreshToken"]);
        return other;
    }
}
exports.default = new AuthService();
