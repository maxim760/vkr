"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.folderRepo = void 0;
const data_source_1 = require("../core/connection/data-source");
const folder_entity_1 = require("./folder.entity");
exports.folderRepo = data_source_1.AppDataSource.getRepository(folder_entity_1.Folder);
