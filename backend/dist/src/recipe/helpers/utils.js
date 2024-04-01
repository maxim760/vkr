"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHtml = void 0;
const axios_1 = __importDefault(require("axios"));
const node_html_parser_1 = require("node-html-parser");
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const fetchHtml = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(url, {
            responseType: 'arraybuffer',
            responseEncoding: 'binary'
        });
        const responseData = response.data;
        const data = iconv_lite_1.default.decode(responseData, "win1251"); // Декодируем данные с учетом кодировки
        if (typeof data !== "string") {
            throw new Error("not string");
        }
        return (0, node_html_parser_1.parse)(data);
    }
    catch (error) {
        console.error(`Не удалось получить HTML`);
        return null;
    }
});
exports.fetchHtml = fetchHtml;
