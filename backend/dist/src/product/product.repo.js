"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRepo = void 0;
var data_source_1 = require("../core/connection/data-source");
var product_entity_1 = require("./product.entity");
exports.productRepo = data_source_1.AppDataSource.getRepository(product_entity_1.Product);
