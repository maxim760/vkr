import { DataSource } from "typeorm";
import dotenv from "dotenv"
dotenv.config()
// todo при хостинге уже надо иметь готовую базу со всеми таблицами
// typeorm создвать не будет, так как synchronize false
// для хостинга просто вытащить все таблицы, которые уже созданы
export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE,
  // port: +process.env.DB_PORT,
  // host: process.env.DB_HOST,
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  url: "mysql://root:00000000@localhost:3306/pizza_rksp",
  // url: "mysql://<username>:<password>@<host>:<port>/<db_name>"
  // url: "mysql://pizza_user:8j8Y8y6XTNpxqm@85.10.205.173:3306/pizza_rksp6",
  synchronize: false,
  logging: false,
  entities: ["./src/**/*.entity.ts"],
  subscribers: [],
  // extra: {
  //   ssl: {
  //     "rejectUnauthorized": false
  //   },
  // }
})