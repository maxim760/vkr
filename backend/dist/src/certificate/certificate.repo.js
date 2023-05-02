"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateRepo = void 0;
var data_source_1 = require("../core/connection/data-source");
var certificate_entity_1 = require("./certificate.entity");
exports.certificateRepo = data_source_1.AppDataSource.getRepository(certificate_entity_1.Certificate);
