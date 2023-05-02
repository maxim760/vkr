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
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../core/types");
var curier_entity_1 = require("./curier.entity");
var curier_repo_1 = require("./curier.repo");
var CurierController = /** @class */ (function () {
    function CurierController() {
    }
    CurierController.prototype.getAll = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                            return [2 /*return*/, res.status(403).json({ data: null, message: "Нет доступа" })];
                        }
                        return [4 /*yield*/, curier_repo_1.curierRepo.find()];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.json(result)];
                    case 2:
                        error_1 = _b.sent();
                        next(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CurierController.prototype.editItem = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, name_1, phone, status_1, curierItemFromDb, result, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, id = _a.id, name_1 = _a.name, phone = _a.phone, status_1 = _a.status;
                        if (!status_1) {
                            return [2 /*return*/, res.status(400).json({ message: "Статус не указан" })];
                        }
                        return [4 /*yield*/, curier_repo_1.curierRepo.findOneByOrFail({ id: id })];
                    case 1:
                        curierItemFromDb = _b.sent();
                        curierItemFromDb.name = name_1;
                        curierItemFromDb.phone = phone;
                        curierItemFromDb.status = status_1;
                        return [4 /*yield*/, curier_repo_1.curierRepo.save(curierItemFromDb)];
                    case 2:
                        result = _b.sent();
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
    CurierController.prototype.create = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name_2, phone, curier, result, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, name_2 = _a.name, phone = _a.phone;
                        curier = new curier_entity_1.Curier();
                        curier.name = name_2;
                        curier.phone = phone;
                        curier.status = types_1.CurierStatus.Free;
                        curier.orders = [];
                        return [4 /*yield*/, curier_repo_1.curierRepo.save(curier)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.json({ data: true })];
                    case 2:
                        error_3 = _b.sent();
                        next(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CurierController.prototype.delete = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var curierId, curier, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        curierId = req.params.curierId;
                        return [4 /*yield*/, curier_repo_1.curierRepo.findOneByOrFail({ id: curierId })];
                    case 1:
                        curier = _a.sent();
                        if (curier.status !== types_1.CurierStatus.Free) {
                            return [2 /*return*/, res.status(409).json({ message: 'Курьер несет заказ, его нельзя удалить' })];
                        }
                        return [4 /*yield*/, curier_repo_1.curierRepo.delete({ id: curierId })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({ data: true })];
                    case 3:
                        error_4 = _a.sent();
                        next(error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return CurierController;
}());
exports.default = new CurierController;
