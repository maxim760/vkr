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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRussianFood = void 0;
const utils_1 = require("./utils");
const parseRussianFood = (url) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const html = yield (0, utils_1.fetchHtml)(url);
        if (!html) {
            return null;
        }
        let mainTitle = ((_a = html.querySelector(".recipe_new h1.title")) === null || _a === void 0 ? void 0 : _a.textContent) || "";
        if (mainTitle) {
            mainTitle += " russianfood.com";
        }
        console.log('mainTitle', mainTitle);
        let ingrs = [...html.querySelectorAll("table.ingr [class^=\"ingr_tr\"] span")].map(item => (item === null || item === void 0 ? void 0 : item.textContent) || "").map(str => {
            const splitted = str.split("-");
            const [name, size] = [
                splitted.slice(0, splitted.length - 1).join("-").trim(),
                (splitted[splitted.length - 1] || "").trim()
            ];
            return { name, size };
        });
        console.log('ingrs', ingrs);
        const description = ((_b = html.querySelector(".recipe_new > tr:nth-child(2) > td > div:last-child")) === null || _b === void 0 ? void 0 : _b.textContent) || "";
        console.log('description', description);
        const subInfo = html.querySelector(".sub_info");
        console.log('subInfo', subInfo);
        const portionCount = +((_d = (_c = subInfo === null || subInfo === void 0 ? void 0 : subInfo.querySelector("div.el:first-of-type .hl b")) === null || _c === void 0 ? void 0 : _c.textContent) !== null && _d !== void 0 ? _d : 1);
        console.log('portionCount', portionCount);
        const time = ((_e = subInfo === null || subInfo === void 0 ? void 0 : subInfo.querySelector("div.el:nth-of-type(2)")) === null || _e === void 0 ? void 0 : _e.textContent.trim()) || "";
        console.log('time', time);
        let steps = [...html.querySelectorAll(".step_images_n > .step_n")].map(item => {
            var _a, _b, _c, _d, _e, _f;
            let img = ((_b = (_a = item.querySelector(".img_c a")) === null || _a === void 0 ? void 0 : _a.getAttribute("href")) !== null && _b !== void 0 ? _b : '').trim() || "";
            if (img.startsWith("//")) {
                img = "https:" + img;
            }
            const text = (_f = (_e = (_d = (_c = item.querySelector("> p")) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim) === null || _e === void 0 ? void 0 : _e.call(_d)) !== null && _f !== void 0 ? _f : '';
            return {
                images: [img], text
            };
        });
        if (!steps.length) {
            steps = [...(_h = (_g = (_f = html.querySelector("#how")) === null || _f === void 0 ? void 0 : _f.querySelectorAll) === null || _g === void 0 ? void 0 : _g.call(_f, "> p")) !== null && _h !== void 0 ? _h : []]
                .map(item => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.textContent) === null || _a === void 0 ? void 0 : _a.trim(); })
                .filter(Boolean)
                .map(text => ({ images: [], text }));
        }
        console.log('steps', steps);
        if (!mainTitle || !steps.length) {
            throw new Error("mainTitle and steps required");
        }
        return {
            mainTitle,
            ingrs,
            description,
            portionCount,
            time,
            steps
        };
    }
    catch (e) {
        console.log("error");
        console.log(e);
        return null;
    }
});
exports.parseRussianFood = parseRussianFood;
module.exports = { parseRussianFood: exports.parseRussianFood };
