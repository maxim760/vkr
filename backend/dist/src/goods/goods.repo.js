"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goodsRepo = void 0;
var data_source_1 = require("../core/connection/data-source");
var goods_entity_1 = require("./goods.entity");
exports.goodsRepo = data_source_1.AppDataSource.getRepository(goods_entity_1.Goods);
