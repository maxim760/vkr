"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateRouter = void 0;
var express_1 = require("express");
var passport_1 = __importDefault(require("passport"));
var certificate_controller_1 = __importDefault(require("./certificate.controller"));
var certificateRouter = (0, express_1.Router)();
exports.certificateRouter = certificateRouter;
certificateRouter.post("/add", passport_1.default.authenticate('jwt', { session: false }), certificate_controller_1.default.addCertificate);
certificateRouter.get("/", passport_1.default.authenticate('jwt', { session: false }), certificate_controller_1.default.getCertificates);
