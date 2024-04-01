"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spaceRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const space_controller_1 = __importDefault(require("./space.controller"));
const spaceRouter = (0, express_1.Router)();
exports.spaceRouter = spaceRouter;
spaceRouter.post("/select", passport_1.default.authenticate('jwt', { session: false }), space_controller_1.default.setSelectedSpace);
spaceRouter.post("/add-user", passport_1.default.authenticate('jwt', { session: false }), space_controller_1.default.addUserByEmail);
spaceRouter.get("/all", passport_1.default.authenticate('jwt', { session: false }), space_controller_1.default.getAll);
spaceRouter.put("/permissions", passport_1.default.authenticate('jwt', { session: false }), space_controller_1.default.updateUserPermissions);
