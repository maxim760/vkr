"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var types_1 = require("../core/types");
var role_repo_1 = require("../role/role.repo");
var user_repo_1 = require("../user/user.repo");
var bcrypt_1 = __importDefault(require("bcrypt"));
var typeorm_1 = require("typeorm");
var address_repo_1 = require("../address/address.repo");
var passport_1 = __importDefault(require("passport"));
var tokens_1 = require("../core/utils/tokens");
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.prototype.registration = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, password, userData, addressBody, userWithEmail, user, roles, userRole, adminRole, salt, hashedPass, address, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 15, , 16]);
                        _a = req.body, _b = _a.user, password = _b.password, userData = __rest(_b, ["password"]), addressBody = _a.address;
                        return [4 /*yield*/, user_repo_1.userRepo.findOneBy({ email: userData.email })];
                    case 1:
                        userWithEmail = _c.sent();
                        if (userWithEmail) {
                            return [2 /*return*/, res.status(500).json({ message: "Пользователь с таким email уже существует" })];
                        }
                        user = user_repo_1.userRepo.create(userData);
                        user.cash = 0;
                        roles = [];
                        return [4 /*yield*/, role_repo_1.roleRepo.findOneBy({ name: types_1.UserRole.User })];
                    case 2:
                        userRole = _c.sent();
                        if (!!userRole) return [3 /*break*/, 4];
                        userRole = role_repo_1.roleRepo.create({ name: types_1.UserRole.User });
                        return [4 /*yield*/, role_repo_1.roleRepo.save(userRole)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        roles.push(userRole);
                        if (!userData.email.includes("@admin")) return [3 /*break*/, 8];
                        return [4 /*yield*/, role_repo_1.roleRepo.findOneBy({ name: types_1.UserRole.Admin })];
                    case 5:
                        adminRole = _c.sent();
                        if (!!adminRole) return [3 /*break*/, 7];
                        adminRole = role_repo_1.roleRepo.create({ name: types_1.UserRole.Admin });
                        return [4 /*yield*/, role_repo_1.roleRepo.save(adminRole)];
                    case 6:
                        _c.sent();
                        _c.label = 7;
                    case 7:
                        roles.push(adminRole);
                        _c.label = 8;
                    case 8:
                        user.roles = roles;
                        if (!!password) return [3 /*break*/, 9];
                        user.password = "";
                        return [3 /*break*/, 12];
                    case 9: return [4 /*yield*/, bcrypt_1.default.genSalt(10)];
                    case 10:
                        salt = _c.sent();
                        return [4 /*yield*/, bcrypt_1.default.hash(password, salt)];
                    case 11:
                        hashedPass = _c.sent();
                        user.password = hashedPass;
                        _c.label = 12;
                    case 12:
                        address = address_repo_1.addressRepo.create(addressBody);
                        return [4 /*yield*/, address_repo_1.addressRepo.save(address)];
                    case 13:
                        _c.sent();
                        user.address = address;
                        return [4 /*yield*/, user_repo_1.userRepo.save(user)];
                    case 14:
                        _c.sent();
                        return [2 /*return*/, res.json({ user: { email: user.email } })];
                    case 15:
                        e_1 = _c.sent();
                        return [2 /*return*/, res.status(500).json({ message: 'Не удалось создать пользователя.' })];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.registrationOauth2 = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, password, userData, addressBody, userWithEmail, user, roles, userRole, adminRole, salt, hashedPass, address, payload, newTokens, e_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 16, , 17]);
                        _a = req.body, _b = _a.user, password = _b.password, userData = __rest(_b, ["password"]), addressBody = _a.address;
                        return [4 /*yield*/, user_repo_1.userRepo.findOneBy({ email: userData.email })];
                    case 1:
                        userWithEmail = _c.sent();
                        if (userWithEmail) {
                            return [2 /*return*/, res.status(500).json({ message: "Пользователь с таким email уже существует" })];
                        }
                        user = user_repo_1.userRepo.create(userData);
                        user.cash = 0;
                        roles = [];
                        return [4 /*yield*/, role_repo_1.roleRepo.findOneBy({ name: types_1.UserRole.User })];
                    case 2:
                        userRole = _c.sent();
                        if (!!userRole) return [3 /*break*/, 4];
                        userRole = role_repo_1.roleRepo.create({ name: types_1.UserRole.User });
                        return [4 /*yield*/, role_repo_1.roleRepo.save(userRole)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        roles.push(userRole);
                        if (!userData.email.includes("@admin")) return [3 /*break*/, 8];
                        return [4 /*yield*/, role_repo_1.roleRepo.findOneBy({ name: types_1.UserRole.Admin })];
                    case 5:
                        adminRole = _c.sent();
                        if (!!adminRole) return [3 /*break*/, 7];
                        adminRole = role_repo_1.roleRepo.create({ name: types_1.UserRole.Admin });
                        return [4 /*yield*/, role_repo_1.roleRepo.save(adminRole)];
                    case 6:
                        _c.sent();
                        _c.label = 7;
                    case 7:
                        roles.push(adminRole);
                        _c.label = 8;
                    case 8:
                        user.roles = roles;
                        if (!!password) return [3 /*break*/, 9];
                        user.password = "";
                        return [3 /*break*/, 12];
                    case 9: return [4 /*yield*/, bcrypt_1.default.genSalt(10)];
                    case 10:
                        salt = _c.sent();
                        return [4 /*yield*/, bcrypt_1.default.hash(password, salt)];
                    case 11:
                        hashedPass = _c.sent();
                        user.password = hashedPass;
                        _c.label = 12;
                    case 12:
                        address = address_repo_1.addressRepo.create(addressBody);
                        return [4 /*yield*/, address_repo_1.addressRepo.save(address)];
                    case 13:
                        _c.sent();
                        user.address = address;
                        return [4 /*yield*/, user_repo_1.userRepo.save(user)];
                    case 14:
                        _c.sent();
                        payload = { id: user.id, email: user.email, roles: user.roles.map(function (item) { return item.name; }) };
                        newTokens = tokens_1.TokenService.generateTokens(payload);
                        user.refreshToken = newTokens.refreshToken;
                        return [4 /*yield*/, user_repo_1.userRepo.save(user)];
                    case 15:
                        _c.sent();
                        res.cookie('refreshToken', newTokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                        return [2 /*return*/, res.json({ user: user.toJSON() })];
                    case 16:
                        e_2 = _c.sent();
                        return [2 /*return*/, res.status(500).json({ message: 'Не удалось создать пользователя.' })];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.login = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    passport_1.default.authenticate('local', function (err, user, info) { return __awaiter(_this, void 0, void 0, function () {
                        var payload, newTokens;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (err || !user) {
                                        return [2 /*return*/, res.status(401).json({ message: 'Неправильные email или пароль.', login: true })];
                                    }
                                    payload = { id: user.id, email: user.email, roles: user.roles.map(function (item) { return item.name; }) };
                                    newTokens = tokens_1.TokenService.generateTokens(payload);
                                    user.refreshToken = newTokens.refreshToken;
                                    return [4 /*yield*/, user_repo_1.userRepo.save(user)];
                                case 1:
                                    _a.sent();
                                    res.cookie('refreshToken', newTokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                                    return [2 /*return*/, res.json({ user: user.toJSON(), accessToken: newTokens.accessToken })];
                            }
                        });
                    }); })(req, res, next);
                }
                catch (e) {
                    return [2 /*return*/, res.status(500).json({ message: "Ошибка авторизации" })];
                }
                return [2 /*return*/];
            });
        });
    };
    AuthController.prototype.logout = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var user, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, user_repo_1.userRepo.findOneBy({ id: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || "" })];
                    case 1:
                        user = _b.sent();
                        if (!user) return [3 /*break*/, 3];
                        user.refreshToken = "";
                        return [4 /*yield*/, user_repo_1.userRepo.save(user)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        res.json({ success: true });
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _b.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.refresh = function (req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_c) {
                try {
                    data = req.user;
                    res.json({ user: (_b = (_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.toJSON) === null || _b === void 0 ? void 0 : _b.call(_a), accessToken: data.tokens.accessToken });
                }
                catch (e) {
                    next(e);
                }
                return [2 /*return*/];
            });
        });
    };
    AuthController.prototype.oauthCallback = function (req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_d) {
                try {
                    console.log("oauth starts");
                    if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.tokens) {
                        res.cookie('refreshToken', req.user.tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
                    }
                    res.send("\n        <script>\n          window.opener.postMessage(".concat(JSON.stringify({ user: __assign(__assign({}, req.user), { accessToken: ((_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.tokens) === null || _c === void 0 ? void 0 : _c.accessToken) || "" }), type: "oauth2" }), ", '*');\n          window.close();\n        </script>\n      "));
                }
                catch (e) {
                    next(e);
                }
                return [2 /*return*/];
            });
        });
    };
    AuthController.prototype.me = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!req.user) {
                            return [2 /*return*/, res.status(401).json({ data: null })];
                        }
                        return [4 /*yield*/, user_repo_1.userRepo.findOne({ where: { email: req.user.email }, relations: { address: true, roles: true } })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(404).json({ data: null, message: "Информация о пользователе не найдена" })];
                        }
                        res.json(user.toJSON());
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        next(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.updateUserCash = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var id, user, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        return [4 /*yield*/, user_repo_1.userRepo.findOneBy({ id: id })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(404).json({ data: null, message: "Информация о пользователе не найдена" })];
                        }
                        return [4 /*yield*/, user_repo_1.userRepo.update({ id: id }, { cash: function () { return "cash + ".concat(req.body.cash); } })];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.json({ data: true })];
                    case 3:
                        error_2 = _b.sent();
                        next(error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.updateUserContact = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var id, user, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        return [4 /*yield*/, user_repo_1.userRepo.findOneBy({ id: id })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            res.status(404).json({ data: null, message: "Информация о пользователе не найдена" });
                        }
                        return [4 /*yield*/, user_repo_1.userRepo.update({ id: id }, req.body)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, res.json({ data: true })];
                    case 3:
                        error_3 = _b.sent();
                        next(error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.updateUserAddress = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var id, user, result, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        return [4 /*yield*/, user_repo_1.userRepo.findOne({ where: { id: id }, relations: { address: true } })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(404).json({ data: null, message: "Информация о пользователе не найдена" })];
                        }
                        return [4 /*yield*/, address_repo_1.addressRepo.update({ id: user.address.id }, __assign(__assign({}, user === null || user === void 0 ? void 0 : user.address), req.body))];
                    case 2:
                        result = _b.sent();
                        return [2 /*return*/, res.json({ data: true })];
                    case 3:
                        error_4 = _b.sent();
                        next(error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.getAllUsers = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, users, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query.query, query = _a === void 0 ? "" : _a;
                        return [4 /*yield*/, user_repo_1.userRepo.find({
                                where: [
                                    { firstName: (0, typeorm_1.ILike)("%".concat(query, "%")) },
                                    { lastName: (0, typeorm_1.ILike)("%".concat(query, "%")) },
                                    { phone: (0, typeorm_1.ILike)("%".concat(query, "%")) },
                                ]
                            })];
                    case 1:
                        users = _b.sent();
                        if (!users) {
                            return [2 /*return*/, res.status(404).json({ data: null, message: "Информация о пользователе не найдена" })];
                        }
                        return [2 /*return*/, res.json(users.map(function (user) { return user.toJSON(); }))];
                    case 2:
                        error_5 = _b.sent();
                        next(error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthController.prototype.deleteUser = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var id, user, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                        return [4 /*yield*/, user_repo_1.userRepo.findOne({ where: { id: id } })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, res.status(404).json({ data: null, message: "Информация о пользователе не найдена" })];
                        }
                        user_repo_1.userRepo.delete([id]);
                        res.json({ data: 1 });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _b.sent();
                        next(error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}());
exports.default = new AuthController;
