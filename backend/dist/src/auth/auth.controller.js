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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repo_1 = require("../user/user.repo");
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const tokens_1 = require("../core/utils/tokens");
const cookie_1 = __importDefault(require("cookie"));
const space_entity_1 = require("../space/space.entity");
const auth_service_1 = __importDefault(require("./auth.service"));
const space_repo_1 = require("../space/space.repo");
const user_space_entity_1 = require("../user/user-space.entity");
class AuthController {
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body.user, { password } = _a, userData = __rest(_a, ["password"]);
                const userWithEmail = yield user_repo_1.userRepo.findOneBy({ email: userData.email });
                if (userWithEmail) {
                    return res.status(500).json({ message: "Пользователь с таким email уже существует" });
                }
                const user = user_repo_1.userRepo.create(userData);
                if (!password) {
                    user.password = "";
                }
                else {
                    const salt = yield bcrypt_1.default.genSalt(10);
                    const hashedPass = yield bcrypt_1.default.hash(password, salt);
                    user.password = hashedPass;
                }
                yield user_repo_1.userRepo.save(user);
                const space = new space_entity_1.Space();
                space.name = `${userData.displayName} Пространство`;
                yield space_repo_1.spaceRepo.save(space);
                const userSpace = new user_space_entity_1.UserSpaces();
                userSpace.user = user;
                userSpace.space = space;
                userSpace.is_edit = true; // Пользователь по умолчанию имеет права на редактирование
                userSpace.is_admin = true; // Пользователь по умолчанию является администратором
                userSpace.is_selected = true; // Пространство становится основным для пользователя
                yield user_repo_1.userSpacesRepo.save(userSpace);
                return res.json({ user: { email: user.email } });
            }
            catch (e) {
                return res.status(500).json({ message: 'Не удалось создать пользователя.' });
            }
        });
    }
    registrationOauth2(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("reg start");
                const _a = req.body.user, { password } = _a, userData = __rest(_a, ["password"]);
                const userWithEmail = yield user_repo_1.userRepo.findOneBy({ email: userData.email });
                if (userWithEmail) {
                    return res.status(500).json({ message: "Пользователь с таким email уже существует" });
                }
                console.log("reg start 2");
                const user = user_repo_1.userRepo.create(userData);
                if (!password) {
                    user.password = "";
                }
                else {
                    const salt = yield bcrypt_1.default.genSalt(10);
                    const hashedPass = yield bcrypt_1.default.hash(password, salt);
                    user.password = hashedPass;
                }
                yield user_repo_1.userRepo.save(user);
                const payload = { id: user.id, email: user.email };
                const newTokens = tokens_1.TokenService.generateTokens(payload);
                user.refreshToken = newTokens.refreshToken;
                yield user_repo_1.userRepo.save(user);
                const space = new space_entity_1.Space();
                space.name = `${userData.displayName} Пространство`;
                yield space_repo_1.spaceRepo.save(space);
                const userSpace = new user_space_entity_1.UserSpaces();
                userSpace.user = user;
                userSpace.space = space;
                userSpace.is_edit = true; // Пользователь по умолчанию имеет права на редактирование
                userSpace.is_admin = true; // Пользователь по умолчанию является администратором
                userSpace.is_selected = true; // Пространство становится основным для пользователя
                yield user_repo_1.userSpacesRepo.save(userSpace);
                console.log("set new cookie", newTokens.refreshToken);
                res.setHeader("Set-Cookie", cookie_1.default.serialize("refreshToken", newTokens.refreshToken, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    path: '/'
                }));
                return res.json({ user: user.toJSON() });
            }
            catch (e) {
                return res.status(500).json({ message: 'Не удалось создать пользователя.' });
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                passport_1.default.authenticate('local', (err, user, info) => __awaiter(this, void 0, void 0, function* () {
                    console.log();
                    if (err || !user) {
                        return res.status(401).json({ message: 'Неправильные email или пароль.', login: true });
                    }
                    const payload = { id: user.id, email: user.email };
                    const newTokens = tokens_1.TokenService.generateTokens(payload);
                    user.refreshToken = newTokens.refreshToken;
                    yield user_repo_1.userRepo.save(user);
                    console.log("set new cookie login", newTokens.refreshToken);
                    res.setHeader("Set-Cookie", cookie_1.default.serialize("refreshToken", newTokens.refreshToken, {
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true,
                        maxAge: 30 * 24 * 60 * 60 * 1000,
                        path: '/'
                    }));
                    return res.json({ user: user.toJSON(), accessToken: newTokens.accessToken });
                }))(req, res, next);
            }
            catch (e) {
                console.log("catch login");
                return res.status(500).json({ message: "Ошибка авторизации" });
            }
        });
    }
    logout(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie("refreshToken", {
                    sameSite: 'none',
                    secure: true,
                });
                console.log((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id);
                const user = yield user_repo_1.userRepo.findOneBy({ id: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || "" });
                if (user) {
                    user.refreshToken = "";
                    yield user_repo_1.userRepo.save(user);
                }
                res.json({ success: true });
            }
            catch (e) {
                next(e);
            }
        });
    }
    refresh(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.user;
                if (!data)
                    throw new Error('refresh error');
                res.json({ user: (_b = (_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.toJSON) === null || _b === void 0 ? void 0 : _b.call(_a), accessToken: data.tokens.accessToken });
            }
            catch (e) {
                next(e);
            }
        });
    }
    oauthCallback(req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.tokens) {
                    console.log("set cookies");
                    console.log("set new cookie", req.user.tokens.refreshToken);
                    res.setHeader("Set-Cookie", cookie_1.default.serialize("refreshToken", req.user.tokens.refreshToken, {
                        httpOnly: true,
                        sameSite: 'none',
                        secure: true,
                        maxAge: 30 * 24 * 60 * 60 * 1000,
                        path: '/'
                    }));
                }
                res.send(`
        <script>
          window.opener.postMessage(${JSON.stringify({ user: Object.assign(Object.assign({}, req.user), { accessToken: ((_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.tokens) === null || _c === void 0 ? void 0 : _c.accessToken) || "", tokens: null }), type: "oauth2" })}, '*');
          window.close();
        </script>
      `);
            }
            catch (e) {
                next(e);
            }
        });
    }
    me(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    return res.status(401).json({ data: null });
                }
                const user = yield user_repo_1.userRepo.findOne({ where: { email: req.user.email }, relations: { userSpaces: { space: true } } });
                if (!user) {
                    return res.status(404).json({ data: null, message: "Информация о пользователе не найдена" });
                }
                res.json(user.toJSON());
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateUserContact(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const user = yield user_repo_1.userRepo.findOne({ where: { id } });
                if (!user) {
                    res.status(404).json({ data: null, message: "Информация о пользователе не найдена" });
                }
                const { activeSpace, canEdit, isAdmin } = yield auth_service_1.default.findSpaceIdByEmail((_b = req.user) === null || _b === void 0 ? void 0 : _b.email);
                if (!activeSpace || !canEdit || !isAdmin) {
                    return res.status(404).json({ data: null, message: "Активное пространство не найдено" });
                }
                yield user_repo_1.userRepo.update({ id }, req.body);
                activeSpace.name = `${req.body.displayName} Пространство`;
                yield space_repo_1.spaceRepo.save(activeSpace);
                return res.json({ data: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new AuthController;
