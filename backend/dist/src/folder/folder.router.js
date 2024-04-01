"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.folderRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const folder_controller_1 = __importDefault(require("./folder.controller"));
const folderRouter = (0, express_1.Router)();
exports.folderRouter = folderRouter;
folderRouter.post("/create", passport_1.default.authenticate('jwt', { session: false }), folder_controller_1.default.createFolder);
folderRouter.delete("/:id", passport_1.default.authenticate('jwt', { session: false }), folder_controller_1.default.deleteFolder);
folderRouter.put("/rename", passport_1.default.authenticate('jwt', { session: false }), folder_controller_1.default.renameFolder);
