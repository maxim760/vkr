"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.TokenService = {
    createAccessToken: function (payload) {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
    },
    createRefreshToken: function (payload) {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
    },
    generateTokens: function (payload) {
        return {
            accessToken: this.createAccessToken(payload),
            refreshToken: this.createRefreshToken(payload),
        };
    }
};
