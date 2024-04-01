"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spaceRepo = void 0;
const data_source_1 = require("../core/connection/data-source");
const space_entity_1 = require("./space.entity");
exports.spaceRepo = data_source_1.AppDataSource.getRepository(space_entity_1.Space);
