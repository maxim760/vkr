"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressRepo = void 0;
var data_source_1 = require("../core/connection/data-source");
var address_entity_1 = require("./address.entity");
exports.addressRepo = data_source_1.AppDataSource.getRepository(address_entity_1.Address);
