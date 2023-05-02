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
exports.User = void 0;
var typeorm_1 = require("typeorm");
var address_entity_1 = require("../address/address.entity");
var certificate_entity_1 = require("../certificate/certificate.entity");
var order_entity_1 = require("../order/order.entity");
var role_entity_1 = require("../role/role.entity");
var User = /** @class */ (function () {
    function User() {
    }
    User.prototype.toJSON = function () {
        var _a = this, refreshToken = _a.refreshToken, password = _a.password, props = __rest(_a, ["refreshToken", "password"]);
        return props;
    };
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], User.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "first_name", default: "" }),
        __metadata("design:type", String)
    ], User.prototype, "firstName", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "last_name", default: "" }),
        __metadata("design:type", String)
    ], User.prototype, "lastName", void 0);
    __decorate([
        (0, typeorm_1.Column)({ unique: true, nullable: false }),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: "" }),
        __metadata("design:type", String)
    ], User.prototype, "phone", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: 0 }),
        __metadata("design:type", Number)
    ], User.prototype, "cash", void 0);
    __decorate([
        (0, typeorm_1.Column)({ default: "" }),
        __metadata("design:type", String)
    ], User.prototype, "refreshToken", void 0);
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return role_entity_1.Role; }, {}),
        (0, typeorm_1.JoinTable)(),
        __metadata("design:type", Array)
    ], User.prototype, "roles", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return certificate_entity_1.Certificate; }, function (certificate) { return certificate.fromUser; }),
        __metadata("design:type", Array)
    ], User.prototype, "receivedCertificates", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return certificate_entity_1.Certificate; }, function (certificate) { return certificate.toUser; }),
        __metadata("design:type", Array)
    ], User.prototype, "donatedCertificates", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return order_entity_1.Order; }, function (order) { return order.user; }),
        __metadata("design:type", Array)
    ], User.prototype, "orders", void 0);
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return address_entity_1.Address; }, function (address) { return address.user; }),
        __metadata("design:type", address_entity_1.Address)
    ], User.prototype, "address", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], User.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)(),
        __metadata("design:type", Date)
    ], User.prototype, "updated_at", void 0);
    User = __decorate([
        (0, typeorm_1.Entity)({ name: "users" })
    ], User);
    return User;
}());
exports.User = User;
