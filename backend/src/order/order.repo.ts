import { AppDataSource } from "../core/connection/data-source";
import { Order } from "./order.entity";

export const orderRepo = AppDataSource.getRepository(Order)

