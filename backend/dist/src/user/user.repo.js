"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSpacesRepo = exports.userRepo = void 0;
const data_source_1 = require("../core/connection/data-source");
const user_space_entity_1 = require("./user-space.entity");
const user_entity_1 = require("./user.entity");
exports.userRepo = data_source_1.AppDataSource.getRepository(user_entity_1.User);
exports.userSpacesRepo = data_source_1.AppDataSource.getRepository(user_space_entity_1.UserSpaces);
