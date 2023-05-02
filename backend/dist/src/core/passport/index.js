"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyStrategies = void 0;
var user_repo_1 = require("../../user/user.repo");
var github_1 = __importDefault(require("./github"));
var google_1 = __importDefault(require("./google"));
var jwt_1 = __importDefault(require("./jwt"));
var local_1 = __importDefault(require("./local"));
var slack_1 = __importDefault(require("./slack"));
var vk_1 = __importDefault(require("./vk"));
var yandex_1 = __importDefault(require("./yandex"));
var applyStrategies = function (passport) {
    (0, yandex_1.default)(passport);
    (0, slack_1.default)(passport);
    (0, google_1.default)(passport);
    (0, github_1.default)(passport);
    (0, vk_1.default)(passport);
    (0, jwt_1.default)(passport);
    (0, local_1.default)(passport);
    passport.serializeUser(function (user, done) {
        console.log("serialize");
        done(null, { id: user.id });
    });
    passport.deserializeUser(function (id, done) {
        console.log("deserializez", id);
        try {
            var user = user_repo_1.userRepo.findOneOrFail({ where: { id: id }, relations: { roles: true } });
            done(null, user);
        }
        catch (e) {
            console.log(e);
            done(e);
        }
    });
};
exports.applyStrategies = applyStrategies;
