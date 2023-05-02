"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.curierRepo = void 0;
var data_source_1 = require("../core/connection/data-source");
var curier_entity_1 = require("./curier.entity");
exports.curierRepo = data_source_1.AppDataSource.getRepository(curier_entity_1.Curier);
