"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepo = void 0;
var data_source_1 = require("../core/connection/data-source");
var user_entity_1 = require("./user.entity");
exports.userRepo = data_source_1.AppDataSource.getRepository(user_entity_1.User);
