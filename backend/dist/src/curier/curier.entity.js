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
exports.Curier = void 0;
var typeorm_1 = require("typeorm");
var types_1 = require("../core/types");
var order_entity_1 = require("../order/order.entity");
var Curier = /** @class */ (function () {
    function Curier() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], Curier.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return order_entity_1.Order; }, function (order) { return order.curier; }),
        __metadata("design:type", Array)
    ], Curier.prototype, "orders", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Curier.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], Curier.prototype, "phone", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            enum: types_1.CurierStatus,
            default: types_1.CurierStatus.Free
        }),
        __metadata("design:type", String)
    ], Curier.prototype, "status", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], Curier.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)(),
        __metadata("design:type", Date)
    ], Curier.prototype, "updated_at", void 0);
    Curier = __decorate([
        (0, typeorm_1.Entity)({ name: "curiers" })
    ], Curier);
    return Curier;
}());
exports.Curier = Curier;
