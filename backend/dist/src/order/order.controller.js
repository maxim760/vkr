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
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("../core/types");
var user_repo_1 = require("../user/user.repo");
var typeorm_1 = require("typeorm");
var order_repo_1 = require("./order.repo");
var curier_repo_1 = require("../curier/curier.repo");
var order_entity_1 = require("./order.entity");
var goods_repo_1 = require("../goods/goods.repo");
var order_goods_entity_1 = require("./order-goods.entity");
var OrderController = /** @class */ (function () {
    function OrderController() {
    }
    OrderController.prototype.getAll = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, id, roles, isAdmin, orders, totalCost, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        _b = req.user || {}, id = _b.id, roles = _b.roles;
                        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                            return [2 /*return*/, res.status(403).json({ data: null, message: "Нет доступа" })];
                        }
                        isAdmin = (roles || []).includes(types_1.UserRole.Admin);
                        return [4 /*yield*/, order_repo_1.orderRepo.find(__assign(__assign({}, (isAdmin ? {} : { where: { user: { id: id } } })), { relations: { curier: true, user: true, goods: true, orderToGoods: { goods: true } }, select: { user: { firstName: true, lastName: true, id: true, phone: true, email: true } }, order: { "created_at": "desc" }, relationLoadStrategy: "query" }))];
                    case 1:
                        orders = _c.sent();
                        return [4 /*yield*/, order_repo_1.orderRepo.sum("price", isAdmin ? undefined : { user: { id: id } })];
                    case 2:
                        totalCost = _c.sent();
                        return [2 /*return*/, res.json({
                                orders: orders,
                                totalCost: totalCost
                            })];
                    case 3:
                        error_1 = _c.sent();
                        next(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.create = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var currentUser, _b, goods_1, userId, withDelivery, deliveryCost, goodsFromDbUniq, goodsFromDb, productsMap, totalPrice, item, curiers, count, randomIdx, curier, orderToGoods, _i, goodsFromDb_1, goods_2, orderGoods, result, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, user_repo_1.userRepo.findOneByOrFail({ id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })];
                    case 1:
                        currentUser = _c.sent();
                        _b = req.body, goods_1 = _b.goods, userId = _b.userId, withDelivery = _b.withDelivery, deliveryCost = _b.deliveryCost;
                        if (!goods_1.length) {
                            return [2 /*return*/, res.status(400).json({ message: 'Блюд не выбрано' })];
                        }
                        return [4 /*yield*/, goods_repo_1.goodsRepo.find({ where: { id: (0, typeorm_1.In)(goods_1) }, relations: { products: true } })];
                    case 2:
                        goodsFromDbUniq = _c.sent();
                        goodsFromDb = goodsFromDbUniq.flatMap(function (item) { return new Array(goods_1.filter(function (id) { return id === item.id; }).length).fill("").flatMap(function () { return item; }); });
                        productsMap = goodsFromDb
                            .flatMap(function (item) { return item.products; })
                            .map(function (_a) {
                            var count = _a.count, id = _a.id;
                            return ({ id: id, count: count, totalCount: count });
                        })
                            .reduce(function (acc, item) {
                            var _a;
                            return __assign(__assign({}, acc), (_a = {}, _a[item.id] = (acc[item.id] === undefined ? item.totalCount : acc[item.id]) - 1, _a));
                        }, {});
                        if (Object.values(productsMap).some(function (item) { return item < 0; })) {
                            return [2 /*return*/, res.status(400).json({ message: 'Недостаточно ингредиентов на складе' })];
                        }
                        totalPrice = goodsFromDb.reduce(function (acc, item) { return acc + item.currentPrice; }, 0);
                        if (totalPrice === null) {
                            return [2 /*return*/, res.status(400).json({ message: 'Ошибка при вычислении стоимости' })];
                        }
                        item = new order_entity_1.Order();
                        item.done = !withDelivery;
                        item.withDelivery = withDelivery;
                        item.goods = [];
                        item.user = { id: userId };
                        if (!withDelivery) return [3 /*break*/, 5];
                        totalPrice += deliveryCost;
                        return [4 /*yield*/, curier_repo_1.curierRepo.find({ where: { status: types_1.CurierStatus.Free }, relations: { orders: true } })];
                    case 3:
                        curiers = _c.sent();
                        if (!curiers.length) {
                            return [2 /*return*/, res.status(400).json({ message: "Нет свободных курьеров" })];
                        }
                        count = curiers.length;
                        randomIdx = Math.floor(Math.random() * count);
                        curier = curiers[randomIdx];
                        curier.status = types_1.CurierStatus.Busy;
                        curier.orders || (curier.orders = []);
                        curier.orders.push(item);
                        item.curier = curier;
                        return [4 /*yield*/, curier_repo_1.curierRepo.save(curier)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        if (totalPrice > currentUser.cash) {
                            return [2 /*return*/, res.status(400).json({ message: "Недостаточно денег на балансе" })];
                        }
                        item.price = totalPrice;
                        return [4 /*yield*/, order_repo_1.orderRepo.save(item)];
                    case 6:
                        _c.sent();
                        orderToGoods = [];
                        for (_i = 0, goodsFromDb_1 = goodsFromDb; _i < goodsFromDb_1.length; _i++) {
                            goods_2 = goodsFromDb_1[_i];
                            orderGoods = new order_goods_entity_1.OrderGoods();
                            orderGoods.goods = { id: goods_2.id };
                            orderGoods.goods_id = goods_2.id;
                            orderGoods.order = item;
                            orderGoods.order_id = item.id;
                            orderToGoods.push(orderGoods);
                        }
                        return [4 /*yield*/, order_repo_1.orderGoodsRepo.save(orderToGoods)];
                    case 7:
                        _c.sent();
                        item.orderToGoods = orderToGoods;
                        console.log(orderToGoods.map(function (item) { return item.orderToGoodsId; }));
                        currentUser.cash -= totalPrice;
                        item.goods = goodsFromDb;
                        return [4 /*yield*/, user_repo_1.userRepo.save(currentUser)];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, order_repo_1.orderRepo.save(item)];
                    case 9:
                        result = _c.sent();
                        return [2 /*return*/, res.json({ data: true })];
                    case 10:
                        error_2 = _c.sent();
                        next(error_2);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    OrderController.prototype.confirmOrder = function (req, res, next) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var id, userId, isAdmin, itemFromDb, curier, error_3;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, , 6]);
                        id = req.body.id;
                        userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || "";
                        isAdmin = (((_b = req.user) === null || _b === void 0 ? void 0 : _b.roles) || []).includes(types_1.UserRole.Admin);
                        return [4 /*yield*/, order_repo_1.orderRepo.findOneOrFail({ where: { id: id }, relations: { user: true, curier: true }, select: { user: { id: true } } })];
                    case 1:
                        itemFromDb = _d.sent();
                        if (((_c = itemFromDb === null || itemFromDb === void 0 ? void 0 : itemFromDb.user) === null || _c === void 0 ? void 0 : _c.id) !== userId && !isAdmin) {
                            return [2 /*return*/, res.status(403).json({ message: "Нет доступа к этой функции" })];
                        }
                        itemFromDb.done = true;
                        curier = itemFromDb.curier;
                        if (!(curier != null)) return [3 /*break*/, 3];
                        curier.status = types_1.CurierStatus.Free;
                        console.log("curier", curier);
                        return [4 /*yield*/, curier_repo_1.curierRepo.save(curier)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3: return [4 /*yield*/, order_repo_1.orderRepo.save(itemFromDb)];
                    case 4:
                        _d.sent();
                        console.log(itemFromDb);
                        return [2 /*return*/, res.json({ data: true })];
                    case 5:
                        error_3 = _d.sent();
                        next(error_3);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return OrderController;
}());
exports.default = new OrderController;
