import { IUser } from "src/api/types/models/User"
import { ICurier } from "../curier/response"
import { IGoods } from "../goods/response"

export type IOrderUser = Pick<IUser, "firstName" | "lastName" | "id" | "phone" | "email">

export type IOrderItem = {
  id: string,
  user: IOrderUser,
  goods: Omit<IGoods, "products">[],
  withDelivery: boolean,
  price: number,
  done: boolean,
  curier: ICurier | null,
  created_at: string;
}


export type IOrderData = {
  orders: IOrderItem[],
  totalCost: number,
}