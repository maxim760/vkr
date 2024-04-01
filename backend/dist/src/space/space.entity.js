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
exports.Space = void 0;
const typeorm_1 = require("typeorm");
const user_space_entity_1 = require("../user/user-space.entity");
const recipe_entity_1 = require("../recipe/recipe.entity");
const folder_entity_1 = require("../folder/folder.entity");
let Space = class Space {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Space.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Space.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_space_entity_1.UserSpaces, userSpace => userSpace.space),
    __metadata("design:type", Array)
], Space.prototype, "userSpaces", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => recipe_entity_1.Recipe, recipe => recipe.space),
    __metadata("design:type", Array)
], Space.prototype, "recipes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => folder_entity_1.Folder, folder => folder.space),
    __metadata("design:type", Array)
], Space.prototype, "folders", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Space.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Space.prototype, "updated_at", void 0);
Space = __decorate([
    (0, typeorm_1.Entity)({ name: "spaces" })
], Space);
exports.Space = Space;
