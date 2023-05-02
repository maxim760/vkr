"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderGoods = void 0;
var typeorm_1 = require("typeorm");
var goods_entity_1 = require("../goods/goods.entity");
var order_entity_1 = require("./order.entity");
var OrderGoods = /** @class */ (function () {
    function OrderGoods() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { primaryKeyConstraintName: "pk" }),
        __metadata("design:type", String)
    ], OrderGoods.prototype, "orderToGoodsId", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "order_id" }),
        __metadata("design:type", String)
    ], OrderGoods.prototype, "order_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "goods_id" }),
        __metadata("design:type", String)
    ], OrderGoods.prototype, "goods_id", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return order_entity_1.Order; }, function (order) { return order.orderToGoods; }),
        __metadata("design:type", order_entity_1.Order)
    ], OrderGoods.prototype, "order", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return goods_entity_1.Goods; }, function (goods) { return goods.ordersToGoods; }),
        __metadata("design:type", goods_entity_1.Goods)
    ], OrderGoods.prototype, "goods", void 0);
    OrderGoods = __decorate([
        (0, typeorm_1.Entity)({ name: 'order_goods', })
    ], OrderGoods);
    return OrderGoods;
}());
exports.OrderGoods = OrderGoods;
