"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importStar(require("express"));
var passport_1 = __importDefault(require("passport"));
var dotenv_1 = __importDefault(require("dotenv"));
var express_session_1 = __importDefault(require("express-session"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var passport_2 = require("./src/core/passport");
var data_source_1 = require("./src/core/connection/data-source");
var auth_router_1 = require("./src/auth/auth.router");
var order_router_1 = require("./src/order/order.router");
var certificate_router_1 = require("./src/certificate/certificate.router");
var goods_router_1 = require("./src/goods/goods.router");
var curier_router_1 = require("./src/curier/curier.router");
var product_router_1 = require("./src/product/product.router");
process.env.TZ = "UTC";
data_source_1.AppDataSource
    .initialize()
    .then(function (connection) { return __awaiter(void 0, void 0, void 0, function () {
    var queryRunner;
    return __generator(this, function (_a) {
        queryRunner = connection.createQueryRunner();
        // await queryRunner.query(`
        //   CREATE TRIGGER IF NOT EXISTS order_goods_AFTER_INSERT
        //   AFTER INSERT
        //   ON order_goods
        //   FOR EACH ROW
        //   BEGIN
        //       UPDATE products
        //           INNER JOIN product_goods
        //       ON products.id = product_goods.product_id
        //           INNER JOIN goods
        //           ON goods.id = product_goods.goods_id
        //       SET count = count - 1
        //       WHERE goods.id = new.goods_id;
        //   END;
        // `);
        // await queryRunner.query(`
        //   CREATE TRIGGER IF NOT EXISTS users_AFTER_DELETE
        //   AFTER DELETE
        //   ON users FOR EACH ROW
        //   BEGIN
        //     delete from addresses where userId = old.id;
        //       delete from users_roles_roles where users_roles_roles.usersId = old.id;
        //       delete from orders where orders.userId = old.id;
        //       delete order_goods from order_goods
        //       left join orders
        //       on order_goods.order_id = orders.id
        //       where orders.userId = old.id;
        //   END;
        // `);
        console.log("Data Source has been initialized!");
        return [2 /*return*/];
    });
}); })
    .catch(function (err) {
    console.error("Error during Data Source initialization:", err);
});
(0, passport_2.applyStrategies)(passport_1.default);
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true, credentials: true, }));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
var ErrorHandler = function (err, req, res, next) {
    console.log("Middleware Error Hadnling");
    var _a = err || {}, _b = _a.message, message = _b === void 0 ? "Неизвестная ошибка" : _b, _c = _a.statusCode, statusCode = _c === void 0 ? 500 : _c;
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message
    });
};
var rootRouter = (0, express_1.Router)();
rootRouter.use("/auth", auth_router_1.authRouter);
rootRouter.use("/order", order_router_1.orderRouter);
rootRouter.use("/certificate", certificate_router_1.certificateRouter);
rootRouter.use("/goods", goods_router_1.goodsRouter);
rootRouter.use("/curier", curier_router_1.curierRouter);
rootRouter.use("/product", product_router_1.productRouter);
app.use("/api", rootRouter);
app.use(ErrorHandler);
app.listen(process.env.PORT, function () {
    console.log('Сервер запущен на порту ' + process.env.PORT);
});
