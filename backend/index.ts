import express, { Router, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import passport from "passport";
import dotenv from "dotenv"
import session from 'express-session';
import cors from "cors"
import cookieParser from "cookie-parser"
import { applyStrategies } from './src/core/passport';
import { AppDataSource } from './src/core/connection/data-source';
import { authRouter } from './src/auth/auth.router';
import { folderRouter } from './src/folder/folder.router';
import { spaceRouter } from './src/space/space.router';
import { recipeRouter } from './src/recipe/recipe.router';
process.env.TZ = "UTC"
AppDataSource
  .initialize()
  .then(async (connection) => {
    console.log("then")
    const queryRunner = connection.createQueryRunner();
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
    console.log("Data Source has been initialized!")
})
  .catch((err) => {
    console.error("Error during Data Source initialization:", err)
  })

applyStrategies(passport)
dotenv.config()
const app = express();
app.use(cors({origin: true, credentials: true, }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json())
app.use(cookieParser())

const ErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  const {message = "Неизвестная ошибка", statusCode = 500} = err as Record<string, any> || {}
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message
  })
}


const rootRouter = Router()
app.get("/", (req, res) => res.json({message: "success"}))
rootRouter.use("/auth", authRouter)
rootRouter.use("/folder", folderRouter)
rootRouter.use("/space", spaceRouter)
rootRouter.use("/recipe", recipeRouter)
app.use("/api", rootRouter)

app.use(ErrorHandler)

app.listen(8000, () => {
    console.log('Сервер запущен на порту ' + 8000);
});
