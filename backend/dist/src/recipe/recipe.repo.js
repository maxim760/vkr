"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipeRepo = void 0;
const data_source_1 = require("../core/connection/data-source");
const recipe_entity_1 = require("./recipe.entity");
exports.recipeRepo = data_source_1.AppDataSource.getRepository(recipe_entity_1.Recipe);
