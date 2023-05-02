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
var goods_repo_1 = require("./goods.repo");
var typeorm_1 = require("typeorm");
var goods_entity_1 = require("./goods.entity");
var GoodsController = /** @class */ (function () {
    function GoodsController() {
    }
    GoodsController.prototype.getAll = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c, max_1, _d, min, _e, query, data, error_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 2, , 3]);
                        _b = req.query, _c = _b.max, max_1 = _c === void 0 ? 0 : _c, _d = _b.min, min = _d === void 0 ? 0 : _d, _e = _b.query, query = _e === void 0 ? "" : _e;
                        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                            return [2 /*return*/, res.status(403).json({ data: null, message: "Нет доступа" })];
                        }
                        return [4 /*yield*/, goods_repo_1.goodsRepo
                                .createQueryBuilder("goods")
                                .leftJoinAndSelect("goods.products", "products")
                                .leftJoin("product_goods", "pg", "pg.goods_id = goods.id")
                                .leftJoin("products", "product", "product.id = pg.product_id")
                                .where([
                                { name: (0, typeorm_1.ILike)("%".concat(query, "%")) },
                                { description: (0, typeorm_1.ILike)("%".concat(query, "%")) },
                            ])
                                .andWhere("goods.currentPrice >= :min", { min: Math.max(0, min) })
                                .andWhere(new typeorm_1.Brackets(function (qb) {
                                qb.where("goods.currentPrice <= :max", { max: Math.max(0, max_1) })
                                    .orWhere("0 = :max", { max: Math.max(0, max_1) });
                            }))
                                .andWhere("pg.goods_id = goods.id")
                                .addSelect(function (subQuery) {
                                return subQuery.select("MIN(product.count)", "left")
                                    .from("product_goods", "pg")
                                    .leftJoin("products", "product", "product.id = pg.product_id")
                                    .where("pg.goods_id = goods.id");
                            }, "goods_left")
                                // .getRawMany()
                                .getMany()];
                    case 1:
                        data = _f.sent();
                        return [2 /*return*/, res.json(data)];
                    case 2:
                        error_1 = _f.sent();
                        next(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GoodsController.prototype.editItem = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, name_1, description, price, img, goodsType, itemFromDb, result, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, id = _a.id, name_1 = _a.name, description = _a.description, price = _a.price, img = _a.img, goodsType = _a.goodsType;
                        if (price <= 0) {
                            return [2 /*return*/, res.status(400).json({ message: 'Нельзя установить цену меньше или равную 0' })];
                        }
                        return [4 /*yield*/, goods_repo_1.goodsRepo.findOneByOrFail({ id: id })];
                    case 1:
                        itemFromDb = _b.sent();
                        itemFromDb.name = name_1;
                        itemFromDb.description = description;
                        itemFromDb.goodsType = goodsType;
                        itemFromDb.img = img;
                        itemFromDb.price = price;
                        itemFromDb.currentPrice = Math.ceil(price * (100 - itemFromDb.discount) / 100);
                        return [4 /*yield*/, goods_repo_1.goodsRepo.save(itemFromDb)];
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
    GoodsController.prototype.create = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name_2, price, description, img, goodsType, products, item, result, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, name_2 = _a.name, price = _a.price, description = _a.description, img = _a.img, goodsType = _a.goodsType, products = _a.products;
                        if (price <= 0) {
                            return [2 /*return*/, res.status(400).json({ message: 'Нельзя установить кол-во цену меньше или равную 0' })];
                        }
                        item = new goods_entity_1.Goods();
                        item.name = name_2;
                        item.price = price;
                        item.currentPrice = price;
                        item.discount = 0;
                        item.goodsType = goodsType;
                        item.img = img;
                        item.description = description;
                        item.products = products.map(function (item) { return ({ id: item }); });
                        return [4 /*yield*/, goods_repo_1.goodsRepo.save(item)];
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
    GoodsController.prototype.editDiscount = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, discount, id, itemFromDb, result, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, discount = _a.discount, id = _a.id;
                        if (discount < 0 || discount >= 100) {
                            return [2 /*return*/, res.status(400).json({ message: 'Некорректный процент скидки' })];
                        }
                        return [4 /*yield*/, goods_repo_1.goodsRepo.findOneByOrFail({ id: id })];
                    case 1:
                        itemFromDb = _b.sent();
                        itemFromDb.discount = discount;
                        itemFromDb.currentPrice = Math.ceil(itemFromDb.price * (100 - itemFromDb.discount) / 100);
                        ;
                        return [4 /*yield*/, goods_repo_1.goodsRepo.save(itemFromDb)];
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
    GoodsController.prototype.editProducts = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, products, id, itemFromDb, result, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.body, products = _a.products, id = _a.id;
                        if (products.length === 0) {
                            return [2 /*return*/, res.status(400).json({ message: 'Некорректный список ингредиентов' })];
                        }
                        return [4 /*yield*/, goods_repo_1.goodsRepo.findOneByOrFail({ id: id })];
                    case 1:
                        itemFromDb = _b.sent();
                        itemFromDb.products = products.map(function (item) { return ({ id: item }); });
                        return [4 /*yield*/, goods_repo_1.goodsRepo.save(itemFromDb)];
                    case 2:
                        result = _b.sent();
                        return [2 /*return*/, res.json({ data: true })];
                    case 3:
                        error_5 = _b.sent();
                        next(error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return GoodsController;
}());
exports.default = new GoodsController;
